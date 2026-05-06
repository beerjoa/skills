---
name: bruno-api
description: Use when the user explicitly mentions Bruno and asks to create, update, or refresh .bru API collections or Bruno environment files from backend source code for environment-level API validation. Passive trigger — do NOT activate for general API testing, Swagger/Postman tasks, or backend development questions that do not explicitly mention Bruno.
---

## Purpose

Generate structured, environment-aware Bruno collections from backend project source code. The skill explores the project, detects the framework, extracts routes, and produces a Bruno collection optimized for **validating that deployed environments serve working APIs from an external consumer's perspective**.

This is complementary to project-internal e2e tests. Bruno collections validate real environments (local/dev/staging/prod), not the internal test suite.

## Use when

- The user explicitly asks to create or update Bruno collections for their project.
- The user says things like "generate Bruno collection", "create .bru files", "set up Bruno", "API collection for testing".
- The user has a backend project that can be mapped by framework adapters (NestJS, Spring Boot, FastAPI) and wants environment-level API validation.
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
  - `collection.bru` — collection-level settings, shared auth/headers, and docs
  - `environments/<env>.bru` — per-environment variables
  - `api/<module>/<METHOD>.<name>.bru` — one request per endpoint
  - `core/POST.auth-token.bru` — auth token acquisition (if auth detected)
  - `core/GET.health.bru` — health check
  - `smoke/smoke.<flow>.bru` — multi-step flow tests (e.g., signup → login → CRUD)

## Interoperability

- This skill generates files; it does not run Bruno or interact with Bruno CLI.
- If OpenAPI/Swagger files exist, consult them for response schemas but do NOT replace route extraction with them — source code is the ground truth.
- If `bruno/` already exists, operate in **update mode** — preserve untouched files, create new ones, flag stale ones.
- If no framework adapter matches the project, explicitly report that no adapter matched and stop before writing files.
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

2. **Detect framework via adapters.** Evaluate each adapter's `detect()` signal on the project root. Stop on first match. The matched adapter is used for all subsequent route/auth/env extraction.

   Adapter order:
   - NestJS adapter
   - Spring Boot adapter
   - FastAPI adapter

   If none match, report no supported adapter match and stop.

3. **Extract routes.** Run the matched adapter's `extractRoutes()`. This returns an array of `Route` objects with method, path, module, handler name, auth requirement, and parameter info.

4. **Detect auth.** Run `extractAuthConfig()` to determine:
   - Auth type (JWT, API Key, Basic, Session, None)
   - Login/signup endpoint details (for token acquisition)
   - Auth header format (Authorization: Bearer <token>, etc.)

5. **Extract env hints.** Run `getEnvHints()` to identify environment variables relevant to the Bruno collection (base URL patterns, ports, etc.).

6. **Check for existing Bruno.** Look for `bruno/` directory in the project root. If found, read `bruno.json`, `collection.bru`, and existing `.bru` files to understand current state.

7. **Check for OpenAPI docs.** If `openapi.yaml`, `swagger.json`, etc. exist, read them for response structure hints (optional enrichment).

### Phase 2: Infer

Build the full Bruno collection model from exploration results:

1. **Group routes into modules** using the adapter's module assignment. Routes without a clear module go into `api/core/`.
   Reserve top-level `core/` for cross-cutting requests like auth-token and health.

2. **Infer auth flow.** If auth is detected, plan a token acquisition request. Identify the login endpoint and response field containing the token.
   Store the inferred token field name as `token_field` in collection vars so auth scripts can use it dynamically.

3. **Infer smoke flows.** Analyze route relationships to construct meaningful user-journey sequences:
   - signup → login → protected resource
   - login → create → list → get-by-id → delete
   - login → create → update → list
   These are derived from path naming conventions (e.g., `/auth/signup` + `/auth/login` + `/users/:id`).

4. **Build environment configs.** For each requested environment:
   - `local` → base_url derived from framework port convention (3000 for NestJS/Node, 8080 for Spring Boot, 8000 for FastAPI)
   - `dev` / `staging` / `prod` → base_url placeholder with convention-based hint
   - If a global API prefix exists (for example NestJS `app.setGlobalPrefix('api')`), include it in `base_url`

5. **Design response asserts for each endpoint:**
   - Status code priority: explicit source annotation/config (for example `@HttpCode`) → framework default by method
   - Key field existence from controller return types / OpenAPI hints
   - Error status codes for 4xx scenarios (400, 401, 403, 404)

6. **Build stable route identity keys** for update mode:
   - Route key: `<METHOD> <normalized-path>`
   - Normalize path params to `:param` form (for example `/users/{id}` and `/users/:id` map to the same identity)

### Phase 3: Confirm

Present the inferred collection plan to the user before creating any files:

```
Detected: <framework> project at /path/to/project
Framework: <framework-name> (<version-if-known>)
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

2. **`bruno/collection.bru`**

Use this file for collection-level settings that should not be duplicated across every request:
- shared `headers` (for example `Content-Type`)
- collection-level `auth` defaults where inheritance is appropriate
- shared collection docs

Example:
```
auth {
  mode: none
}

headers {
  Content-Type: application/json
}

docs {
  # <project-name> API

  Generated for environment-level API validation from backend source code.
}
```

If protected endpoints should inherit shared auth configuration, keep request files on `auth: inherit` and define the shared default here. If an endpoint must bypass shared auth (for example login), set `auth: none` explicitly in that request file.

3. **`bruno/environments/<env>.bru`**

Each environment file follows this structure:
```
vars:local {
  base_url: http://localhost:3000/api
  auth_token: ""
  token_field: "accessToken"
  test_user_email: "test@example.com"
  test_user_password: "Test1234!"
}
```

Common values shared across the collection can live in `collection.bru` when that reduces duplication. Keep `bruno.json` focused on collection metadata/configuration.

4. **`bruno/api/<module>/<METHOD>.<name>.bru`**

File naming rule: `<name>` is deterministic kebab-case and framework-agnostic.

Naming algorithm (in order):
1. If adapter provides an operation identifier (`operationId` or equivalent), normalize it to kebab-case and use it.
2. Otherwise derive semantic names from method + normalized path:
   - `GET /resources` -> `list-resources`
   - `GET /resources/:id` -> `resource-by-id`
   - `POST /resources` -> `create-resource`
   - `PUT|PATCH /resources/:id` -> `update-resource`
   - `DELETE /resources/:id` -> `delete-resource`
3. If naming collisions remain within the same module, append a stable suffix from the terminal static path segment.

Each endpoint file contains:
- Request URL and method
- Body (for POST/PUT/PATCH)
- Per-request auth/header overrides only when they should not inherit from `collection.bru`
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

5. **`bruno/core/POST.auth-token.bru`** (if auth detected)

Captures token and sets as collection variable for subsequent requests:
```
script:post-response {
  const tokenField = bru.getVar("token_field");
  bru.setVar("auth_token", res.body[tokenField]);
  expect(res.status).to.equal(200);
  expect(res.body).to.have.property(tokenField);
}
```

6. **`bruno/core/GET.health.bru`**

Simple health check endpoint if detected.

7. **`bruno/smoke/smoke.<flow>.bru`**

Multi-request flow files. Use Bruno's request chaining (Post-Response scripts set variables consumed by the next request):
```
script:post-response {
  // After signup, save user id for next request
  bru.setVar("user_id", res.body.id);
}
```

8. **Validate generated Bruno artifacts.** Run this validation before considering the collection complete:
   - If Bruno publishes an official public schema for `bruno.json`, validate the generated file against it.
   - If no official public `bruno.json` schema is available, do a lightweight consistency check instead:
     - `bruno.json` exists and parses as JSON
     - `bruno.json` contains `name` and `type: "collection"`
     - `collection.bru` exists
     - `collection.bru` contains a non-empty `docs {}` block with no placeholder text like `TODO` or `TBD`
     - at least one environment file exists under `environments/`
     - representative request files contain `meta` plus an HTTP block (`get`, `post`, `put`, `patch`, or `delete`)
     - representative request files include either explicit auth or intentional inheritance plus at least one validation block (`tests` or `script:post-response`)

9. **Update mode.** If `bruno/` already exists:
   - Compare current route map against existing `.bru` files using route identity key (`<METHOD> <normalized-path>`)
   - **New routes** → create new `.bru` files
   - **Removed routes** → **Do NOT delete.** Preserve in place, mark as stale, write a note. Ask user before deleting.
   - **Changed routes** (path/method/signature changed) → see sub-rules below
   - **Route identity normalization:** For identity comparison, all path parameters normalize to `:param`. `GET /users/:userId` and `GET /users/:id` have the same identity `GET /users/:param` because only the parameter *name* differed, not the structural URL.
   - **Which case applies?**
      - **Route identity unchanged, only parameter name/inner variable changed** → Update the existing file in place. Do NOT rename it. Change the URL variable name inside the file (e.g., `{{userId}}` → `{{user_id}}`). Never replace a variable with a hardcoded literal. Update the corresponding environment variable key to match if the variable is needed for the request to function.
      - **Route identity changed** (structural path different) → Generate a new file via the naming algorithm. Mark the old file as stale — preserve it in place, do NOT delete.
   - **Stale-file policy:**
      - Do **not** delete stale `.bru` files unless the user explicitly approves deletion.
      - Write a short stale-note file explaining why each file is stale.
   - **Environment preservation policy:**
      - Do **not** change existing environment files unless a newly required variable is necessary for one of the generated requests to function.
      - If a new variable must be added, change only what is necessary (add or rename the affected key). Preserve all other keys and values.
      - When a changed route renames a parameter, update the environment variable key in place to match.
   - **Unchanged routes** → leave untouched

## Adapter Scope and Behavior

- Adapter architecture is framework-agnostic by design. Do not hardcode NestJS-only assumptions into generic phases.
- Framework-specific extraction rules live in `references/framework-adapters.md` and are applied only after adapter selection.
- When extending support, add a new adapter section and keep Explore/Infer/Confirm/Apply flow unchanged.

## Framework Adapter Specification

The framework adapter interface and available implementations are documented in `references/framework-adapters.md`. Read this file during the **Explore** phase to understand how to extract routes and auth info for the detected framework.

Available adapter specs:
- **NestJS** — concrete extraction strategy documented
- **Spring Boot** — adapter strategy documented for implementation
- **FastAPI** — adapter strategy documented for implementation

## References

- `references/framework-adapters.md` — Adapter interface and implementations
- Bruno file format: each `.bru` file is plain text with sections (`meta`, `get`/`post`/etc., `headers`, `body`, `script:pre-request`, `script:post-response`)
- Bruno environment files: `vars:<env-name>` block with key-value pairs
- Bruno variable interpolation: `{{variableName}}`
- Official public schema guidance is documented for OpenCollection YAML. Do not assume a public `bruno.json` schema exists unless Bruno documentation explicitly provides one.
