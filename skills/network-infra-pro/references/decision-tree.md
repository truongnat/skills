# Network infra — decision tree

## Exposure

- **Public API** → LB + WAF + TLS at edge; app private.
- **Internal only** → Private endpoints; no public SG rules.

## Egress

- **SaaS dependencies** → Explicit egress allowlist vs wide `0.0.0.0/0`.

## Mesh vs simple LB

- **Few services** → LB + SG may suffice.
- **Many east-west hops** → Consider mesh — cost/complexity trade-off.
