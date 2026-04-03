# Algorithm — decision tree

## Problem signals → family

- **Optimal substructure + overlapping subproblems** → Dynamic programming (top-down with memo or bottom-up table).
- **Greedy choice + exchange argument** → Greedy after proof sketch.
- **Entities as vertices, constraints as edges** → Graph (BFS/DFS/shortest path/MST/flow).
- **Search space finite but large** → Backtracking with pruning; bitmasks for tiny n.
- **Sorted structure + monotonicity** → Two pointers, binary search on answer.

## When greedy is risky

- If counterexample exists without proof → default to DP or exhaustive on small n first.

## Complexity target

- **n ≤ 20** → Often O(2^n) or bitmask DP feasible.
- **n ≤ 2e5** → Usually O(n) or O(n log n); avoid O(n²) unless constants tiny.

## Escalation

- **Benchmark interpretation** → **`data-analysis-pro`**.
- **Production integration** → stack **`*-pro`** skill.
