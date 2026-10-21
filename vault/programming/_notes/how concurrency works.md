---
source: https://wyounas.github.io/concurrency/2024/12/12/how-concurrency-works-a-visual-guide/
fetched: 2026-09-13
published: 2024-12-12
status: fresh
---
Model checking reasons about concurrent programs by exploring their state space rather than mentally tracing every interleaving. Reach for this framing when a concurrent or distributed design needs a way to argue about correctness beyond ad hoc testing, or to understand why a program's outcome varies between runs.

## how
A program's state is the tuple of its variable values plus each process's location counter (the pointer to its next instruction). For a single sequential process with variable `n`, the state is `(n, location counter)`; a computation is the sequence of states from the initial one as instructions execute.

For two concurrent procedures P and Q sharing a global `n`, a state is the triple `(n, P: pc, Q: pc)`. From an initial state, e.g. `(0, P:1, Q:2)`, either procedure can advance next: incrementing P's counter gives `(1, P:end, Q:2)`; incrementing Q's counter instead gives `(2, P:1, Q:end)`. This nondeterministic choice of which process moves next is interleaving, and it means the same program can end with `n` equal to 1 or 2 depending on the order. The state space is the directed graph of all states reachable this way; it grows combinatorially as processes and variables are added, and with enough concurrent processes it becomes too large to even render.

To validate a program, define invariants that must hold across every state in the state space:

- Safety properties: nothing bad happens. Example: `total` must always be 0, 1, or 2 — expressed in Linear Temporal Logic (LTL) as `[] (total == 1 || total == 2 || total == 0)`, where `[]` means "always".
- Liveness properties: something good eventually happens — expressed with the `<>` ("eventually") temporal operator.

Model checkers such as SPIN and TLA+ verify these properties hold across the entire generated state space, not just the paths a test happens to exercise.

## gotchas
- State spaces grow exponentially with more processes and variables; a handful of concurrent processes can already produce a graph too large to visualize meaningfully.
- Unit and integration tests struggle to catch concurrency bugs because timing and interleaving make them hard to reproduce ("heisenbugs") — model checking covers the full state space instead of sampled runs.
