---
name: bruno-api
description: Generate and maintain Bruno API collections from backend project source code. Use when the user explicitly mentions Bruno and wants to create, update, or refresh API collections, .bru files, or environment configs. Also when they say "set up Bruno", "generate Bruno collection", or want environment-level API validation for a backend project. Passive trigger — do NOT activate for general API testing, Swagger, Postman, or development questions unrelated to Bruno.
---

## Purpose

Generate structured, environment-aware Bruno collections from backend project source code. The skill explores the project, detects the framework, extracts routes, and produces a Bruno collection optimized for **validating that deployed environments serve working APIs from an external consumer's perspective**.

This is complementary to project-internal e2e tests. Bruno collections validate real environments (local/dev/staging/prod), not the internal test suite.

## Use when

- The user explicitly asks to create or update Bruno collections for their project.
- The user says things like "generate Bruno collection", "create .bru files", "set up Bruno", "API collection for testing".
- The user has a backend project (NestJS, Spring Boot, FastAPI) and wants environment-level API validation.
- The user asks to update an existing Bruno collection after adding/changing endpoints.

## Do not use when

- The user wants to run Bruno tests (that's a CLI/UI action).
- The user is working on a frontend-only project with no API server.
- The user needs to write project-internal e2e tests (use the project's test framework instead).

## Inputs

- **Project path** — the backend project root directory (defaults to current working directory)
- **Framework type** — optionally specified; otherwise auto-detected
- **Environments** — which environments to generate (local, dev, staging, prod; defaults to all detected)
- **Explicit adjustments** — user may override any inferred values during Confirm phase

## Outputs

- A `bruno/` directory under the project root containing:
  - `bruno.json` — collection metadata
  - `environments/<env>.bru` — per-environment variables
  - `api/<module>/<METHOD>.<name>.bru` — one request per endpoint
  - `core/POST.auth-token.bru` — auth token acquisition (if auth detected)
  - `core/GET.health.bru` — health check
  - `smoke/smoke.<flow>.bru` — multi-step flow tests (e.g., signup → login → CRUD)

## Interoperability

- This skill generates files; it does not run Bruno or interact with Bruno CLI.
- If OpenAPI/Swagger files exist, consult them for response schemas but do NOT replace route extraction with them — source code is the ground truth.
- If `bruno/` already exists, operate in **update mode** — preserve untouched files, create new ones, flag stale ones.
- Overlay-only: the host agent retains full control over file operations and user interaction.

## Procedure

The skill follows four phases: **Explore → Infer → Confirm → Apply**

### Phase 1: Explore

Read the project environment to understand what you're working with:

1. **Detect project type.** Check for build files in order:
   - `package.json` → Node.js project
   - `build.gradle` / `build.gradle.kts` → Gradle (Spring Boot)
   - `pom.xml` → Maven (Spring Boot)
   - `requirements.txt` / `pyproject.toml` / `Pipfile` → Python

2. **Detect framework.** Run each available `FrameworkAdapter.detect()` on the project root. Stop on first match. The matched adapter is used for all subsequent route/auth/env extraction.

3. **Extract routes.** Run the matched adapter's `extractRoutes()`. This returns an array of `Route` objects with method, path, module, handler name, auth requirement, and parameter info.

4. **Detect auth.** Run `extractAuthConfig()` to determine:
   - Auth type (JWT, API Key, Basic, Session, None)
   - Login/signup endpoint details (for token acquisition)
   - Auth header format (Authorization: Bearer <token>, etc.)

5. **Extract env hints.** Run `getEnvHints()` to identify environment variables relevant to the Bruno collection (base URL patterns, ports, etc.).

6. **Check for existing Bruno.** Look for `bruno/` directory in the project root. If found, read `bruno.json` and existing `.bru` files to understand current state.

7. **Check for OpenAPI docs.** If `openapi.yaml`, `swagger.json`, etc. exist, read them for response structure hints (optional enrichment).

### Phase 2: Infer

Build the full Bruno collection model from exploration results:

1. **Group routes into modules** using the adapter's module assignment. Routes without a clear module go into `core/`.

2. **Infer auth flow.** If auth is detected, plan a token acquisition request. Identify the login endpoint and response field containing the token.

3. **Infer smoke flows.** Analyze route relationships to construct meaningful user-journey sequences:
   - signup → login → protected resource
   - login → create → list → get-by-id → delete
   - login → create → update → list
   These are derived from path naming conventions (e.g., `/auth/signup` + `/auth/login` + `/users/:id`).

4. **Build environment configs.** For each requested environment:
   - `local` → base_url derived from port convention (3000 for Node, 8080 for Spring, 8000 for FastAPI)
   - `dev` / `staging` / `prod` → base_url placeholder with convention-based hint

5. **Design response asserts for each endpoint:**
   - Status code based on method (GET → 200, POST → 201, DELETE → 204, etc.)
   - Key field existence from controller return types / OpenAPI hints
   - Error status codes for 4xx scenarios (400, 401, 403, 404)

### Phase 3: Confirm

Present the inferred collection plan to the user before creating any files:

```
Detected: NestJS project at /path/to/project
Framework: NestJS (v10.2.0)
Modules found: auth(3), users(5), products(4), orders(6)
Auth: JWT — POST /api/auth/login returns { accessToken }
Environments: local, dev, staging (3 files)
Smoke flows: 2 detected
  - signup → login → GET /users/me
  - login → POST /orders → GET /orders → GET /orders/:id
Existing bruno/: not found

Shall I generate the Bruno collection? [Y/n]
```
Let the user confirm, adjust environments, or exclude specific modules/endpoints. If user makes adjustments, update the model accordingly before proceeding.

### Phase 4: Apply

Generate all Bruno collection files:

1. **`bruno/bruno.json`**

```json
{
  "version": "1.0",
  "name": "<project-name> API",
  "type": "collection",
  "presets": {
    "requestType": "http",
    "requestUrl": "{{base_url}}"
  }
}
```

2. **`bruno/environments/<env>.bru`**

Each environment file follows this structure:
```
vars:local {
  base_url: http://localhost:3000/api
  auth_token: ""
  test_user_email: "test@example.com"
  test_user_password: "Test1234!"
}
```

3. **`bruno/api/<module>/<METHOD>.<name>.bru`**

File naming rule: `<name>` MUST reference source code — use the handler/method name from the controller. If Swagger `operationId` exists (e.g., `@ApiOperation({ operationId: 'listUsers' })`), prefer that. Otherwise use the method name directly (e.g., `findAll`, `create`).

Each endpoint file contains:
- Request URL, method, headers
- Body (for POST/PUT/PATCH)
- Auth header using `{{auth_token}}`
- Script → Assert block with status + structure validation

Example:
```
meta {
  name: GET /users
  type: http
  seq: 1
}

get {
  url: {{base_url}}/users
  body: none
  auth: inherit
}

headers {
  Content-Type: application/json
  Authorization: Bearer {{auth_token}}
}

script:pre-request {
  // Token should already be set from auth flow
}

script:post-response {
  expect(res.status).to.equal(200);
  expect(res.body).to.be.an('array');
  if (res.body.length > 0) {
    expect(res.body[0]).to.have.property('id');
    expect(res.body[0]).to.have.property('createdAt');
  }
}
```

4. **`bruno/core/POST.auth-token.bru`** (if auth detected)

Captures token and sets as collection variable for subsequent requests:
```
script:post-response {
  bru.setVar("auth_token", res.body.accessToken);
  expect(res.status).to.equal(200);
  expect(res.body).to.have.property("accessToken");
}
```

5. **`bruno/core/GET.health.bru`**

Simple health check endpoint if detected.

6. **`bruno/smoke/smoke.<flow>.bru`**

Multi-request flow files. Use Bruno's request chaining (Post-Response scripts set variables consumed by the next request):
```
script:post-response {
  // After signup, save user id for next request
  bru.setVar("user_id", res.body.id);
}
```

7. **Update mode.** If `bruno/` already exists:
   - Compare current route map against existing `.bru` files
   - **New routes** → create new `.bru` files
   - **Removed routes** → list as stale, ask user before deleting
   - **Changed routes** (path/method/signature changed) → update existing `.bru` files
   - **Unchanged routes** → leave untouched

## Framework Adapter Specification

The framework adapter interface and available implementations are documented in `references/framework-adapters.md`. Read this file during the **Explore** phase to understand how to extract routes and auth info for the detected framework.

Currently implemented adapters:
- **NestJS** — detects `@nestjs/core`, extracts from `@Controller()` and HTTP method decorators

## References

- `references/framework-adapters.md` — Adapter interface and implementations
- Bruno file format: each `.bru` file is plain text with sections (`meta`, `get`/`post`/etc., `headers`, `body`, `script:pre-request`, `script:post-response`)
- Bruno environment files: `vars:<env-name>` block with key-value pairs
- Bruno variable interpolation: `{{variableName}}`
