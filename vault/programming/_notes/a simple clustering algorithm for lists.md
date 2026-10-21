---
source: https://cassidoo.co/post/clustering-tiles/
fetched: 2026-09-13
published: 2026-05-24
status: fresh
---
A greedy heuristic for grouping a list of repeated values (e.g. `bgogbrbroorrgbgorrbggo`) into contiguous same-value clusters using only sub-list reversals, inspired by sorting Magna-Tiles by hand. It's a novel, self-contained technique the author compares to pancake sort, not a general-purpose production sort — reach for it when you want a physically intuitive, reversal-only clustering rather than an efficient one.

## how
- Take the value at the end of the list.
- Find the next occurrence of that same value moving leftward, then reverse the sub-list between them so all instances of that value become contiguous at the end.
- Once a value's cluster is complete, move to the next incomplete cluster from the right and repeat.
- Continue until every value forms one contiguous block.

```js
function cassidyCluster(input) {
	const list = typeof input === "string" ? input.split("") : [...input];
	const listLength = list.length;
	function reverse(arr, left, right) {
		while (left < right) {
			[arr[left], arr[right]] = [arr[right], arr[left]];
			left++; right--;
		}
	}
	while (true) {
		let right = listLength - 1, clusterStartingIndex, frontOfReversingSection;
		while (right > 0) {
			const target = list[right];
			clusterStartingIndex = right;
			while (clusterStartingIndex > 0 && list[clusterStartingIndex - 1] === target) clusterStartingIndex--;
			frontOfReversingSection = clusterStartingIndex - 1;
			while (frontOfReversingSection >= 0 && list[frontOfReversingSection] !== target) frontOfReversingSection--;
			if (frontOfReversingSection >= 0) break;
			right = clusterStartingIndex - 1;
		}
		if (right <= 0) break;
		if (right < listLength - 1) reverse(list, clusterStartingIndex, listLength - 1);
		else reverse(list, frontOfReversingSection + 1, listLength - 1);
	}
	return list;
}
```

## gotchas
- O(n^2) time complexity, per the author, because the implementation uses nested while loops.
- The author calls it "not the most efficient" — it's greedy, optimizing only the current step each time.
