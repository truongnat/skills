# Caching — decision trees

## Read-heavy vs write-heavy

```
Reads ≫ writes, stale OK for seconds/minutes?
├── Cache-aside or CDN for public GETs
└── Writes must be immediately visible?
    └── Short TTL + tight invalidation or skip cache on those paths
```

## Cache-aside vs read-through vs write-through

```
App controls when to populate cache?
├── Cache-aside — most flexible; app handles miss path
└── Centralized data layer should hide cache?
    └── Read-through / write-through — complexity in one layer
```

## Redis vs in-process vs HTTP cache

```
Single instance app, tiny data?
├── In-memory LRU — fast but no cross-instance consistency
└── Multiple instances or shared data?
    └── Redis/Memcached — watch network latency and failure modes
```

## When to add CDN / edge cache

```
Static or public personalized content with same URL for many users?
├── CDN with cache-control headers
└── Per-user HTML on same URL?
    └── Dangerous to cache at edge — use private cache or no-store
```

## Invalidation trigger

```
Know exact keys when entity updates?
├── Direct invalidation / delete
└── Unknown fan-out?
    └── TTL + versioned keys or tag-based invalidation if store supports
```

See also [pattern-selection.md](pattern-selection.md) and [invalidation-and-consistency.md](invalidation-and-consistency.md).
