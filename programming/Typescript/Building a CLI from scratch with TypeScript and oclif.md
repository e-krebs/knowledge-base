---
source: https://www.joshcanhelp.com/oclif/
fetched: 2026-09-10
published: 2024-04-08
status: fresh
---
A walkthrough for scaffolding an oclif-based TypeScript CLI into an existing project, using `oclif init` instead of the full project generator. Reach for it when you want oclif's command/flag/args conventions without accepting oclif's opinionated starter layout.

## how
```bash
mkdir new-oclif-cli
cd new-oclif-cli
npm init
npm install typescript
```
`tsconfig.json`:
```json
{ "include": ["src/**/*"], "compilerOptions": { "outDir": "./dist", "module": "nodenext" } }
```
Init oclif into the existing project (more control than the full generator):
```bash
npx oclif init
```
A command is a class extending `Command`:
```typescript
import { Command } from "@oclif/core";

export default class Hello extends Command {
  public async run(): Promise<void> {
    this.log("Hello from oclif!");
  }
}
```
Args follow a similar declarative pattern; flags work the same way for booleans/other value types, and oclif's `parse()` validates input before `run()` executes:
```typescript
static override args = {
  arg1: Args.string(),
};
```

Suggested next steps: custom base classes for shared command logic, plugins for extensibility, and oclif's built-in docs generation.
