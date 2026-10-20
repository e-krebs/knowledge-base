---
source: https://www.notion.com/blog/how-notion-handles-concurrent-editing-with-crdts
fetched: 2026-10-20
published: 2026-09-18
status: fresh
---
Notion replaced last-write-wins on block records with a sequence CRDT based on Replicated Growable Array (RGA), so concurrent edits to the same block merge instead of one overwriting the other. It also covers rich-text annotations and text moving between blocks on split. Read it for a worked case of taking CRDT research to a block-based document model, deployed in production since July 2025.

## how
- RGA is a tree of every character ever inserted. Each node ("text item") has a stable ID `session@lamport` (for example `A@6`); inserts and deletes reference an ID as their "origin".
- Items sharing an origin sort by most recent Lamport clock first, session ID as tie-breaker.
- A delete marks the item as a tombstone rather than removing it, since in-flight or offline operations may still reference its ID.
- Storage: assign one ID to a contiguous run of characters from the same session and clock, plus a run length.
- Rich text follows the Peritext algorithm: annotation operations with start and end anchors (right before or after an item boundary) are stored on text items and applied when parsing the tree. The anchors set whether an annotation extends: bold extends when typing at its end, a hyperlink does not. An annotation's operation is stored on its first item only.
- Splitting a block (Enter) concurrently with an edit:
  - Text items live in a "text slice"; a split divides the slice and moves the second half into the new block. A block's slices form a "text slice tree".
  - A "text instance" groups slices descended from the same initial slice. Operations reference the text instance ID, not the block ID, and a mapping text instance to blocks says which blocks to fetch.
  - A "search label" per slice (append `L` or `R` on each split) narrows the fetch: operations carry a label and the mapping is queried by label prefix, because the target may have been split again concurrently.

## gotchas
- CRDTs merge without losing changes but do not always preserve intent; two people rewriting the same short phrase gives a merged result neither wanted.
- Without search labels, a block split 99 times means fetching 100 blocks to find one slice, because there is no direct lookup of a block by text slice.
- Labels are not stored as literal `LRL` strings matched with `LIKE`; Notion uses a compact encoding, five times more storage efficient.
- The authors say they have not validated the claim that the split approach would help ProseMirror with Yjs, where a split is a deletion plus an insertion.
