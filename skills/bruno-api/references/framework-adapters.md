# Framework Adapters

This reference defines the `FrameworkAdapter` interface and adapter strategies. Read this during the **Explore** phase to determine which adapter matches the target project and how to extract routes.

The adapter model is framework-agnostic. Framework-specific logic should be isolated to each adapter section instead of leaking into shared phases.

---

## Interface

```typescript
interface FrameworkAdapter {
  /** Returns true if this adapter can handle the project at rootPath */
  detect(rootPath: string): boolean

  /** Extract all API routes from the project */
  extractRoutes(rootPath: string): Route[]

  /** Detect authentication configuration */
  extractAuthConfig(rootPath: string): AuthInfo | null

  /** Get environment variable hints relevant to Bruno */
  getEnvHints(rootPath: string): EnvHint[]
}

interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  path: string                // e.g. /users/:id
  module: string              // e.g. users, auth
  handlerName: string         // e.g. findAll, createUser
  authRequired: boolean       // Does this route require authentication?
  statusCodeHint?: number     // e.g. 201 from @HttpCode / @ResponseStatus
  requestBody?: {             // For POST/PUT/PATCH
    fields: { name: string; type: string; required: boolean }[]
  }
  queryParams?: { name: string; required: boolean }[]
  pathParams?: { name: string }[]
  responseExamples?: {
    status: number
    shape: Record<string, unknown>
  }[]
}

interface AuthInfo {
  type: 'jwt' | 'api-key' | 'basic' | 'session' | 'none'
  loginEndpoint?: string     // e.g. POST /auth/login
  tokenField?: string        // e.g. accessToken, token, access_token
  tokenHeader?: string       // e.g. Authorization
  tokenPrefix?: string       // e.g. Bearer
}

interface EnvHint {
  name: string
  description: string
  defaultValue?: string
  isBrunoSpecific: boolean   // false = likely from .env.example
}
```

---

## Adapters

### NestJS

**Detection:** `package.json` contains `@nestjs/core` as a dependency.

**Route Extraction Strategy:**

1. **Find controller files.** Search for `*.controller.ts` files under `src/` (or the project's source root). Use glob: `src/**/*.controller.ts`.

2. **For each controller file:**
   - Read the file content
   - Identify the `@Controller()` decorator to get the base path:
     - `@Controller('users')` → base path `/users`
     - `@Controller()` or `@Controller('')` → base path `/`
     - `@Controller({path: 'api/v1/users'})` → base path `/api/v1/users`
   - The controller's module is inferred from the file path. E.g. `src/users/users.controller.ts` → module `users`. If path-based detection is ambiguous, look at the file's directory name.

3. **For each method handler** in the controller:
   - Identify HTTP method decorators: `@Get()`, `@Post()`, `@Put()`, `@Patch()`, `@Delete()`, `@Head()`, `@Options()`
   - Extract the sub-path: `@Get(':id')` → sub-path `/:id`. Empty means `/`.
   - Combine with controller base path: `/users` + `/:id` → `/users/:id`
   - Extract method parameter decorators:
     - `@Param('id')` → path param `id`
     - `@Query('page')` → query param `page`
     - `@Body()` → request body exists
   - Determine auth requirement:
     - Check for `@UseGuards()` decorator at method or class level
     - Check for global guards (`APP_GUARD` in module providers)
     - Check for custom auth guards (class extends `AuthGuard` or `AuthGuard('jwt')`)
     - Check for common NestJS auth patterns like `@Public()` decorator (negation of auth)
   - Determine status code hint:
     - Prefer explicit `@HttpCode(<code>)`
     - Else use NestJS defaults (GET/PUT/PATCH 200, POST 201, DELETE 200 unless overridden)
   - The file name priority: Swagger `operationId` (from `@ApiOperation({ operationId: '...' })`) → method name
   - The handler name is the method name (fallback)

4. **Auth detection:**
   - Search for modules related to auth: `auth/`, `authentication/`, `security/`
   - Look for `@nestjs/passport`, `@nestjs/jwt` in `package.json`
   - Find the login/signin endpoint (usually a controller with `@Post('login')` or `@Post('signin')`)
   - Determine the token response field by inspecting the auth service/controller return (common fields: `accessToken`, `access_token`, `token`)
   - Default auth header pattern: `Authorization: Bearer {{auth_token}}`

5. **Env hints from `.env.example` or `.env`:**
   - Read `.env.example` if available
   - Filter out infrastructure variables (DB, REDIS, etc.) — focus on API-related ones
   - Add Bruno-specific hints: `base_url` (default: `http://localhost:3000`), `auth_token`

6. **Response shape hints:**
   - Look at method return types: `Promise<User[]>`, `Observable<CreateUserDto>`
   - Look at DTO/entity files imported in the controller
   - If Swagger/OpenAPI decorators present (`@ApiTags`, `@ApiOperation`, `@ApiResponse`), use response model types
   - Check if `SwaggerModule` is set up and a generated OpenAPI JSON exists

**Determining module:**
- Module = directory name of the controller file
- Special: files in `src/auth/`, `src/authentication/`, `src/security/` → module `auth`
- Routes without a clear module → use `core`

**NestJS CLI project convention:**
- Source root: Check `nest-cli.json` for `sourceRoot` or `entryFile` (default: `src/`)
- Controllers are typically in `src/<module>/<module>.controller.ts`
- Common prefix: Check main.ts for `app.setGlobalPrefix()` to detect global prefix (e.g., `api`, `api/v1`)

### Spring Boot

Adapter strategy:
- Detection:
  - `build.gradle`/`build.gradle.kts` or `pom.xml` exists
  - Dependency includes `spring-boot-starter-web`
- Route extraction:
  - Scan `src/main/java/**/*Controller.java`
  - Read class-level `@RequestMapping` base path
  - Read method-level mappings (`@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping`, `@RequestMapping(method=...)`)
  - Combine class path + method path into normalized route path
  - Derive module from package segment or controller file directory
- Auth detection:
  - Check for Spring Security usage (`SecurityFilterChain`, `WebSecurityConfigurerAdapter`, `@EnableWebSecurity`)
  - Check method/class guards (`@PreAuthorize`, `@Secured`, `@RolesAllowed`)
  - Infer JWT/api-key style from filter/interceptor patterns
- Status code hint:
  - Prefer explicit `@ResponseStatus`
  - Else framework defaults (GET/PUT/PATCH 200, POST 200/201 depending on implementation, DELETE 200/204)
- Environment hints:
  - Read `application.yml`, `application-*.yml`, `application.properties`, `.env*`
  - Detect `server.port` and `server.servlet.context-path` for base URL hints

### FastAPI

Adapter strategy:
- Detection:
  - `requirements.txt`/`pyproject.toml` contains `fastapi`
  - Common app entry files include `main.py`, `app/main.py`, or files importing `FastAPI`
- Route extraction:
  - Scan for `APIRouter()` definitions and `@router.get/post/put/patch/delete(...)`
  - Scan `app = FastAPI(...)` routes and `include_router(..., prefix=...)` wiring
  - Compose normalized paths from router prefix + decorator path
  - Derive module from router variable/file path (`users_router` -> `users`)
- Auth detection:
  - Check `OAuth2PasswordBearer`, `HTTPBearer`, dependency-injected auth guards, JWT utility modules
  - Mark routes protected when auth dependencies appear in route decorator dependencies or endpoint signature
- Status code hint:
  - Prefer explicit `status_code=` in route decorator
  - Else FastAPI defaults (GET/PUT/PATCH 200, POST 200, DELETE 200)
- Environment hints:
  - Read `.env`, `.env.example`, settings modules (`BaseSettings`), and uvicorn run config
  - Detect host/port defaults (typically `127.0.0.1:8000`) and optional root path

## Cross-Adapter Normalization Rules

- Normalize every route to `/<segment>` form and path params to `:param` style.
- Build a stable identity key per route: `<METHOD> <normalized-path>`.
- Use explicit status code hints from source when present; only fall back to framework defaults when absent.
- Keep module mapping deterministic so update mode can preserve unchanged files.

## Cross-Adapter File Naming Rules

- Generate endpoint file names as `<METHOD>.<name>.bru` where `<name>` is deterministic kebab-case.
- Naming priority:
  1. Adapter-provided operation identifier (`operationId` or equivalent)
  2. Semantic derivation from method + normalized path
- Semantic defaults:
  - `GET /resources` -> `list-resources`
  - `GET /resources/:id` -> `resource-by-id`
  - `POST /resources` -> `create-resource`
  - `PUT|PATCH /resources/:id` -> `update-resource`
  - `DELETE /resources/:id` -> `delete-resource`
- If two routes in the same module still collide after normalization, append a stable suffix from the terminal static segment.
