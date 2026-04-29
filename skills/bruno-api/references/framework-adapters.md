# Framework Adapters

This reference defines the `FrameworkAdapter` interface and all available implementations. Read this during the **Explore** phase to determine which adapter matches the target project and how to extract routes.

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
     - Check for custom auth guards (class extends `AuthGuard` or `AuthGuard('jwt')`)
     - Check for common NestJS auth patterns like `@Public()` decorator (negation of auth)
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

### Placeholder: Spring Boot

Implementation guide (not yet implemented):
- Detection: `build.gradle`/`pom.xml` with `spring-boot-starter-web`
- Route extraction: scan `@RestController` classes, `@GetMapping`/`@PostMapping`/etc. annotations
- Auth detection: `Spring Security`, `@PreAuthorize`, JWT filter patterns
- Source root: `src/main/java/`

### Placeholder: FastAPI

Implementation guide (not yet implemented):
- Detection: `fastapi` in requirements or pyproject.toml
- Route extraction: scan `APIRouter` instances, `@router.get()`/`@router.post()` decorators
- Auth detection: `OAuth2PasswordBearer`, JWT middleware patterns
- Source root: typically project root or `app/` directory
