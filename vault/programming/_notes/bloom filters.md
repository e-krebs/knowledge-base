---
source: https://www.kirupa.com/data_structures_algorithms/bloom_filter.htm
fetched: 2026-09-13
published: 2025-03-05
status: fresh
---
A Bloom filter is a probabilistic data structure that answers "definitely not in the set" or "probably in the set" for a huge collection, using far less memory than a hashtable. It's the right tool when you need a fast, memory-cheap pre-check in front of a slow lookup (e.g. a database) and can tolerate an occasional false positive but never a false negative.

## how
Setup needs initial data, a bit array (all zeros), and k hash functions, each mapping an element to a bit-array index.

- **Add**: pass the element through each of the k hash functions, and set the bit at each returned index to 1.
- **Check**: pass the element through the same k hash functions. If any indexed bit is 0, the element is definitely not in the set. If all indexed bits are 1, the element is probably in the set (a false positive is possible if other elements happened to set the same bits).

```js
class BloomFilter {
  constructor(size, numHashFunctions) {
    this.size = size;
    this.bitArray = new Array(size).fill(0);
    this.numHashFunctions = numHashFunctions;
  }
  add(element) {
    for (let i = 0; i < this.numHashFunctions; i++) this.bitArray[this.hash(element, i) % this.size] = 1;
  }
  contains(element) {
    for (let i = 0; i < this.numHashFunctions; i++) {
      if (this.bitArray[this.hash(element, i) % this.size] === 0) return false;
    }
    return true;
  }
  hash(element, seed) {
    let hash = 0;
    const str = element + seed;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
```

## gotchas
- Insertion and query run in O(k) (k hash functions, each O(1)) — but a positive answer still needs a slower database lookup to confirm, which dominates real-world cost.
- Three knobs trade off: bit-array size (m), hash-function count (k), and false-positive rate (p), with 0 < p < 1 — typically 0.001 to 0.1, commonly 0.01. Optimal k is usually 3-10; too few or too many hash functions both raise the false-positive rate.
- Worked example: 10M usernames at p = 1% needs m ≈ 95.85M bits (~12MB) and k = 7, versus ~160-240MB for an equivalent hashtable — but every false positive still wastes a full database round-trip.
