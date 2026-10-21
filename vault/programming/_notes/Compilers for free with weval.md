---
source: https://bernsteinbear.com/blog/weval/
fetched: 2026-09-13
published: 2024-05-19
status: fresh
---
Partial evaluation takes a program, fixes some of its inputs as constants, and lets an optimizer specialize the code around those constants — the result is still a program, usually a faster one. weval applies this to WebAssembly: point it at an interpreter plus a fixed program (bytecode), and it turns the pair into a standalone Wasm module with no interpreter loop left, i.e. it compiles for free. Reach for it when you have (or are compiling) an interpreter to Wasm and want near-compiler speed without writing a compiler.

## how
Classic partial-evaluation example: specializing `power(x, y)` at `y = 5` gives a function of `x` alone that an optimizer can unroll into `x*x*x*x*x`. weval does the same thing to whole Wasm modules, typically interpreters (e.g. a Wasm build of SpiderMonkey or CPython running JS/Python bytecode).

Interpreter loop before specialization — a `switch` dispatching on the opcode at `program[pc++]`, reading/writing an accumulator and a `locals` array:
```c
uword Execute(uword *program) {
  while (true) {
    Instruction op = (Instruction)program[pc++];
    switch (op) {
    case LOAD_IMMEDIATE: { /* ... */ }
    case ADD: {
      uword idx1 = program[pc++];
      uword idx2 = program[pc++];
      accumulator = LOCAL_AT(idx1) + LOCAL_AT(idx2);
      break;
    }
    // ...
    }
  }
}
```

Steps to specialize it, done at Wasm module init time (via `wizer` to snapshot state back into the module):
1. Load the bytecode.
2. Create a specialized copy of the interpreter function with the bytecode as a constant argument, via `weval::weval(&ExecuteSpecialized, &Execute<true>, func_id, weval::SpecializeMemory<uword*>(program, sizeof program))`.
3. Run weval's constant propagation and compiler passes on that specialized function.

By default weval only simplifies branches that become constant — it doesn't unroll the interpreter's own loop until told to. Tell it the program counter is the specialization context so it can unroll the loop and turn bytecode control flow into real control flow:
```c
uword Execute(uword *program) {
  while (true) {
    // ...
    switch (op) { /* ... */ }
    weval::update_context(pc);
  }
}
```

The interpreter's `locals` array is still opaque memory to weval at that point. Route local reads/writes through `weval_read_reg`/`weval_write_reg` so weval can treat each local as its own SSA value and compile it down to a real Wasm local instead of a memory access:
```c
#define LOCAL_AT(idx) (IsSpecialized ? weval_read_reg(idx) : locals[idx])
#define LOCAL_AT_PUT(idx, val)                                \
  if (IsSpecialized) { weval_write_reg(idx, val); }           \
  else { locals[idx] = val; }
```

Measured on the post's demo interpreter (bytecode program summing to 100M): native C++ 350ms, the same code compiled to Wasm (wasi-sdk + wasmtime) 530ms, weval-specialized Wasm 40ms — an 8.5x speedup over the plain Wasm build, close to hand-writing a compiler for the bytecode.

## gotchas
- weval isn't a whole-program optimizer: it won't reason about aliasing/escaping memory on its own — the interpreter author has to mark constant data and hint at specialization points (`weval::SpecializeMemory`, the PC as `weval::update_context` context, `weval_read_reg`/`weval_write_reg` for locals) for it to unroll and specialize well.
- The technique is demoed on a tiny toy interpreter; scaling it to something like SpiderMonkey or CPython involves the same principles but far more fiddly detail work (per the author, a dedicated follow-up post was planned for the SpiderMonkey case).
