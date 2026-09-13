---
source: https://yorickpeterse.com/articles/how-to-write-a-code-formatter/
fetched: 2026-09-13
published: 2024-04-13
status: fresh
---
A code formatter lowers an AST into an intermediate "formatting tree" of a handful of node types, then renders that tree to a string while tracking the current line width, deciding node-by-node whether a group needs to wrap. This is the technique behind Prettier (via the "A prettier printer" paper) and Inko's own formatter — reach for it whenever you're building a formatter from scratch rather than hand-writing per-construct rendering rules.

## how
### Node types
The tree is a sum type (`enum`) with one case per formatting concern:

- `Text(String)` — an ASCII string (e.g. keywords); width = `str.size`.
- `Unicode(String, Int)` — a string with multi-byte characters, plus a cached grapheme-cluster count (counting is `O(n)`, so it's computed once via `Node.unicode(value)`).
- `SpaceOrLine` — renders to a space when its group doesn't need wrapping, to a newline when it does.
- `Line` — renders to nothing when no wrapping is needed, to a newline when wrapping is needed.
- `Indent(Array[Node])` — renders child nodes, indenting new lines, only when wrapping is needed.
- `Group(Int, Array[Node])` — a set of nodes we try to fit on the current line; each has a unique ID, and wrapping is decided per group, so an outer group wrapping doesn't force inner groups to wrap.
- `Nodes(Array[Node])` — a plain concatenation of nodes with no special handling, mainly for convenience.
- `IfWrap(Int, Node, Node)` — renders node A if the group with the given ID wraps, otherwise node B (e.g. for a trailing comma).

```
class enum Node {
  case Group(Int, Array[Node])
  case Nodes(Array[Node])
  case IfWrap(Int, Node, Node)
  case Text(String)
  case Unicode(String, Int)
  case SpaceOrLine
  case Line
  case Indent(Array[Node])
}
```
An array `[100, 200]` lowers to `Group(0, [Text('['), Line, Indent([Text('100'), Text(','), SpaceOrLine, Text('200')]), Line, Text(']')])` — unwrapped it renders as `[100, 200]`; wrapped, each element goes on its own indented line.
### Computing width
Width can't be cached globally because an `IfWrap` node's width depends on whether its group ends up wrapped, so it's recomputed as needed, passing the set of already-wrapped group IDs:
```
fn width(wrapped: ref Set[Int]) -> Int {
  match self {
    case Nodes(nodes) or Group(_, nodes) or Indent(nodes) -> {
      Int.sum(nodes.iter.map(fn (n) { n.width(wrapped) }))
    }
    case IfWrap(id, node, _) if wrapped.contains?(id) -> node.width(wrapped)
    case IfWrap(_, _, node) -> node.width(wrapped)
    case Text(str) -> str.size
    case Unicode(_, chars) -> chars
    case SpaceOrLine -> 1
    case _ -> 0
  }
}
```

### The Generator: width-tracked rendering
`Generator` walks the tree once, keeping `@size` (chars used on the current line), `@indent` (indent level), `@max` (line limit), and `@wrapped` (group IDs that must wrap). The core dispatch, `Group` deciding wrap-or-not by comparing the summed child width against remaining line space, is the heart of the algorithm:
```
fn mut node(node: Node, wrap: ref Wrap) {
  match node {
    case Nodes(nodes) -> nodes.into_iter.each(fn (n) { node(n, wrap) })
    case Group(id, nodes) -> {
      let width = Int.sum(nodes.iter.map(fn (n) { n.width(@wrapped) }))
      let wrap = if @size + width > @max {
        @wrapped.insert(id)
        Wrap.Enable
      } else {
        Wrap.Detect
      }
      nodes.into_iter.each(fn (n) { node(n, wrap) })
    }
    case IfWrap(id, node, _) if @wrapped.contains?(id) -> {
      node(node, Wrap.Enable)
    }
    case IfWrap(_, _, node) -> node(node, wrap)
    case Text(str) -> text(str, str.size)
    case Unicode(str, width) -> text(str, width)
    case Line if wrap.enable? -> new_line
    case SpaceOrLine if wrap.enable? -> new_line
    case SpaceOrLine -> text(' ', chars: 1)
    case Indent(nodes) if wrap.enable? -> {
      @size += INDENT.size
      @indent += 1
      @buffer.push(INDENT)
      nodes.into_iter.each(fn (n) { node(n, wrap) })
      @indent -= 1
    }
    case Indent(nodes) -> nodes.into_iter.each(fn (n) { node(n, wrap) })
    case _ -> {}
  }
}
```
`Wrap` is `Enable` (must wrap) or `Detect` (the default, decided by width); a `Group` recomputes it locally and passes it down, so nesting doesn't force child groups to wrap. This runs recursively rather than iteratively, for simplicity, since formatting trees aren't usually deeply nested. Reported throughput for Inko's formatter using this exact algorithm: around 240,000 lines/second.

A `Builder` type mirrors this on the way in, lowering AST nodes (function calls, strings, etc.) into `Node` trees — e.g. a function call becomes a `Group` wrapping the name and a nested `Group` for `(`, args joined by `SpaceOrLine`, with a trailing `IfWrap`-gated comma, and `)`. Rendering the same call tree at line limits 40/80/120 characters produces one-per-line, partially-wrapped, or fully-inline output respectively from the identical tree — only `@max` changes.

## gotchas
- Trailing/leading comments aren't handled by the core algorithm; the author's approach is to peek at the next node while iterating, and if it's a same-line comment, render it right after the current node instead of on its own — but comment text itself isn't auto-wrapped, so a long comment can overflow the line limit.
- This setup gets you "about 80%" of a production formatter; the rest is edge cases (escape sequences, language-specific formatting quirks) — the author spent 1-2 weeks on the initial version and 2-3 more on edge cases for Inko's real formatter.
