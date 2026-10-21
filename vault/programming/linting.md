## eslint
📝 [[Differences between ESLint and TypeScript]]
[eslint v10](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/) — removes the old eslintrc system for good and drops node versions before 20.19
[eslint config inspector](https://github.com/eslint/config-inspector) — local browser ui at localhost:7777 that live-reloads as you edit the config
[You Probably Don't Need eslint-config-prettier or eslint-plugin-prettier](https://www.joshuakgoldberg.com/blog/you-probably-dont-need-eslint-config-prettier-or-eslint-plugin-prettier/) — argues you can drop both prettier eslint packages with a minimal modern config

## plugins
[lint SQL queries](https://github.com/ts-safeql/safeql) — eslint plugin that checks sql against your live postgres schema and infers result types
[baseline js docs](https://baselinejs.vercel.app/) — eslint plugin that flags js apis not yet in the baseline compatibility set

## other linters
[oxlint](https://oxc.rs/docs/guide/usage/linter.html) — rust-based linter that's 50 to 100 times faster than eslint, now also type-aware
