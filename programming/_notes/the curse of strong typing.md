---
source: https://fasterthanli.me/articles/the-curse-of-strong-typing
fetched: 2026-09-13
published: 2022-06-01
status: fresh
---
A conceptual tour of how Rust's type system forces explicit choices that dynamic languages paper over: which numeric type a literal gets, how to convert between types, and how to erase a concrete type behind a trait when you need one function/struct to handle several. Reach for it when you're deciding between a cast and a trait-based conversion, between generics and `dyn Trait`, or how to store a not-statically-sized value in a struct.

## how

### Numeric literals
An unsuffixed integer literal defaults to `i32`, an unsuffixed float defaults to `f64`; the type is otherwise inferred from how the value is used (e.g. passed to a function expecting `u64`). Add a suffix, or `_` plus context, to force a specific width.
```rust
println!("tau = {}", 2_f64 * 3.14159265); // 2 alone is `{integer}`, mismatches f64
```

### `as` casts vs From/Into/TryFrom
`as` compiles between any two numeric types but silently truncates/wraps when the value doesn't fit in the target — no error, no panic. `From`/`.into()` only exist when the conversion is infallible (e.g. `u32` → `u64`); `TryFrom`/`.try_into()` exist when it can fail (e.g. `u64` → `u32`) and return a `Result` you must handle.
```rust
let a = 2930482035982309_u64;
let b = a as u32; // 80117733 — truncated, no warning
let c: u32 = a.try_into().unwrap(); // panics instead of silently truncating
```

### Generics/monomorphization vs `dyn Trait`
A function generic over `T: Trait` gets one compiled copy per concrete type it's called with ("monomorphization") — no indirection, but code size grows and the return type can't vary at runtime. `&dyn Trait`/`Box<dyn Trait>` erase the type behind a fat pointer (data pointer + vtable), so one compiled body handles every implementor, at the cost of a vtable call and losing per-type inlining.
```rust
fn show<T: std::fmt::Display>(a: T) { println!("{a}"); } // one copy per T
fn show(v: &dyn std::fmt::Display) { println!("{v}"); }   // one body, vtable dispatch
```

### `impl Trait`
In argument position it's sugar for a generic trait bound. In return position it must resolve to exactly one concrete type, inferred from the function body — it cannot vary per branch, since there's no vtable involved to pick between them at runtime.
```rust
fn get_display() -> impl Display { 'C' } // ok: single concrete type (char)
// does not compile: arms return `char` and `i32`, impl Trait can't unify them
// fn get_char_or_int(b: bool) -> impl Display { if b { 'C' } else { 64 } }
```
The erasure is only type-checker-side: `std::any::type_name`/`TypeId` still see the real type, and you can't call type-specific methods (e.g. `char::to_ascii_uppercase`) on the opaque return value.

### Dynamically sized types behind Box/Rc/Arc
`str`, `[T]`, and `dyn Trait` don't implement `Sized` — their size isn't known at compile time — so they can only exist behind a pointer. A reference (`&str`, `&dyn Trait`) is a fat pointer: 16 bytes, ptr + (length or vtable). `Box`/`Arc`/`Rc` over a DST are the same 16 bytes, just with ownership (exclusive for `Box`, shared/atomic for `Arc`, shared/non-atomic for `Rc`) instead of a borrow.
```
Text (UTF-8)             Bytes
&str      (borrowed)      &[u8]
String    (owned, grows)  Vec<u8>
Box<str>  (owned, fixed)  Box<[u8]>
Arc<str>  (shared, atomic) Arc<[u8]>
```
Pick owned+growable when you need to mutate the size, `Box<...>` for owned-and-fixed, `Arc<...>` when several owners need to share the same data.

### Trait delegation and the `delegate` crate
Implementing a trait for an enum by hand-matching every variant to its inner type's impl is correct but verbose. The `delegate` crate's `delegate!` macro generates that forwarding method for you, targeting a helper that returns a `&dyn Trait` over the right variant.
```rust
impl Either {
	fn display(&self) -> &dyn Display {
		match self {
			Either::Char(c) => c,
			Either::Int(i) => i,
		}
	}
}

impl Display for Either {
	delegate! {
		to self.display() {
			fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result;
		}
	}
}
```

## gotchas
- `as` between numeric types never errors on overflow — only `try_into`/`TryFrom` catch an out-of-range value; `into`/`From` only exists for conversions that can't fail.
- A `dyn Trait` fat pointer carries exactly one vtable. To make one trait object satisfy several traits at once, define a new supertrait (`trait Super: A + B {}`) with a blanket impl (`impl<T: A + B> Super for T {}`) — you can't just write `dyn A + B` for two non-auto traits.
- `Box<dyn Trait>` has an implicit `'static` bound (it's really `Box<dyn Trait + 'static>`), so you can't box a trait object that borrows from `&self` without adding an explicit shorter lifetime (`Box<dyn Trait + 'a>`).
