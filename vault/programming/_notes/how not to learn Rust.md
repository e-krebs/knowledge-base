---
source: https://dystroy.org/blog/how-not-to-learn-rust/
fetched: 2026-09-13
published: 2021-12-15
status: fresh
---
A cheat sheet of 12 mistakes that make people struggle or give up while learning Rust, from underestimating the learning curve to porting OOP/functional/defensive habits from other languages. Reach for it when starting Rust, or when reviewing early Rust code for anti-patterns.

## how
1. Not prepared for the first high step — don't learn in short scattered sessions; expect a steep step at some point and give it dedicated, focused time.
2. Dive in without the book — skim its table of contents first, so you know where to come back later.
3. Start with a graph-based algorithm — linked lists/graphs fight Rust's ownership model; tackle them only after learning arenas and lifetimes. 2026 addendum from the author: learn sync Rust and be sure you understand the borrow checker before trying async Rust.
4. Don't read compiler errors — read them carefully instead of skimming past; run `cargo check` for the cleanest output.
5. Ignore compiler warnings — most warnings in finished code are really errors (e.g. an unwanted `mut`); clean them up before the next task and run `cargo clippy` too.
6. Apply best practices from other languages — no OOP inheritance hierarchies (they push you toward the shared references ownership fights), no forced functional style (exclusive `&mut` already removes most inconsistency bugs; a `for` loop is fine), no `dyn Trait` for "flexibility" (prefer generics/monomorphization — `dyn` costs an extra reference/box, vtable dispatch, lost optimizations), no immutable structs (withholding `&mut` is enough), no getters "for protection" (model consistency with enums instead), no defensive asserts everywhere (`Option`/`Result` already cover it), no dummy values like `""`/`-1` (return `None`, and prefer a `let`-`if` expression over assigning into a pre-declared `mut`).
7. Build a lifetime-heavy API — prefer owning data in structs over reference-heavy ones; cloning to call an API is cheaper than the pain of keeping referenced data alive.
8. Ignore non-standard libraries — regex, crossbeam, serde, rayon, rand are treated as de facto standard.
9. Use `unsafe`, abuse `unwrap` — handle `Result`/`Option` properly, or use `expect` with a reason while prototyping.
10. Don't look at the sources — follow the "[src]" links in docs; reading idiomatic source is how you learn to write idiomatic Rust.
11. Design everything from the start — the compiler makes refactoring safe, so build incrementally, brick by brick.
12. Learn the wrong Rust — treat `Rc`, `unsafe`, and `Deref` in your own early code as red flags worth a second look.

Dynamic-dispatch signature to avoid, and the generic alternative:
```rust
pub fn fun(my_arg: &dyn TraitA) -> Box<dyn TraitB> {
```
```rust
pub fn fun<A: TraitA>(my_arg: A) -> impl TraitB {
```

Prefer an expression over pre-declaring a mutable binding:
```rust
let a = if some_expr() {
	some_fun()
} else {
	some_other_fun()
};
```
