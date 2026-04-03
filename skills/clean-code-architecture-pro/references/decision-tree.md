# Decision tree — clean code / architecture

## Where does this logic belong?

```
Pure domain rule (no I/O)?
└── Domain/core module — no framework imports

Touches HTTP, DB, UI?
└── Adapter / infrastructure layer — thin; core stays framework-agnostic

Shared across features?
├── True domain concept → shared domain module
└── Accidental duplication → extract after second use (rule of three)
```

## Refactor now vs later?

```
Tests green and behavior clear?
├── Yes → small steps: extract function → rename → move file
└── No → stabilize tests first (`testing-pro`, `w-refactor`)

Big-bang rewrite?
└── Avoid; prefer strangler / incremental boundary moves
```

## Dependency direction

```
Inner layer importing outer (e.g. domain importing Nest module)?
└── Invert: use interface/port in core; implement in outer shell
```
