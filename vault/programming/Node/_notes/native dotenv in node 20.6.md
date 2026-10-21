---
source: https://francoisbest.com/posts/2023/dotenv-is-dead
fetched: 2026-09-13
published: 2023-10-02
status: fresh
---
Reading straight from `process.env` gives you no type safety, no validation, and a mutable object. Load `.env` files with Node's native flag instead of the `dotenv` package, then parse `process.env` through a Zod schema so missing or malformed config fails fast with a readable error, and freeze the result.

## how
Load the env file — no dependency needed:
```
node --env-file=.env main.mjs
node --env-file=.env --env-file=.env.local main.mjs   # multiple files, later wins
```
Or load it programmatically instead of via the CLI flag: `process.loadEnvFile('.env')`.

Validate and freeze, in `env.ts`:
```ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  POSTGRESQL_URL: z.url(),
  REDIS_URL: z.url(),
  API_KEY: z.string().regex(/^[\da-f]{64}$/i),
  DEBUG: z.string().transform(v => ['true', 'yes', '1', 'on'].includes(v.toLowerCase())).default('false'),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  console.error(
    `Missing or invalid environment variable${parsed.error.issues.length > 1 ? 's' : ''}:\n${parsed.error.issues
      .map(issue => `  ${issue.path}: ${issue.message}`)
      .join('\n')}`
  )
  process.exit(1)
}

export const env = Object.freeze(parsed.data)
```
Optionally, delete secret keys from `process.env` after parsing so only the frozen `env` object exposes them.

## gotchas
- The article shows the 2023 Node 20.6 experimental `--env-file` flag and Zod v3's `z.string().url()` — this note reflects the 2026 stable APIs: `--env-file` is stable, `process.loadEnvFile()` exists since Node 24, and Zod v4 uses the top-level `z.url()` and `error.issues` (the `.errors` alias was removed, per the Zod 4 changelog).
