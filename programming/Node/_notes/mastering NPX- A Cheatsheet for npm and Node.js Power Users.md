---
source: https://www.nodejs-security.com/blog/mastering-npx-cheatsheet-npm-nodejs-power-users
fetched: 2026-09-13
published: 2025-09-25
status: fresh
---
`npx` runs an npm package ephemerally without a global install, downloading it, executing it, then clearing it from the cache. Reach for it for one-off commands, testing a package against a specific Node version, or running a script shared as a Gist, instead of polluting the global namespace with `npm install -g`.

## how
```
# run a package without installing it
npx create-react-app my-new-app

# find where npx would run a package from (useful with fnm/nvm)
npx -p <package-name> which <executable-name>
npx -p shellcheck which shellcheck

# run a command under a specific Node.js version
npx -p node@14 <command>

# execute a GitHub Gist
npx gist <gist-id>

# pass env vars to the executed package
MY_VAR=value npx <package-name>
```

## gotchas
- Running a package straight off the registry means executing code that hasn't been vetted by you; only run from trusted sources, and consider `npq` to audit a package before it executes.
- The same applies to Gists — treat code from a Gist ID as untrusted before running it.
