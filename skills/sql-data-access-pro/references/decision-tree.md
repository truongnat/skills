# SQL data access — decision tree

## SQLite vs PostgreSQL

- **Local file, single-user, scripts, embedded** → SQLite + parameterized queries.
- **Multi-tenant server, RLS, replication, heavy concurrency** → Hand off to **`postgresql-pro`**.

## Read vs write

- **Exploration / reporting only** → `mode=ro` URI or equivalent; avoid accidental writes.
- **ETL / migrations** → Confirm backup; separate from ad-hoc analytics.

## Analysis path

- **Large aggregates / stats** → Export or attach workflow; **`data-analysis-pro`** for pandas/Parquet.

## Safety

- **Any user-influenced fragment in SQL** → Bound parameters only; **`security-pro`** for app-layer injection review.
