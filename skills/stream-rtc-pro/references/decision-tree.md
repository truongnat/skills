# Stream / RTC — decision tree

## Topology

- **1:1 or small group, low infra** → Mesh acceptable short-term.
- **Many participants** → SFU; MCU only when compositing required.

## Signaling transport

- **Bidirectional, frequent** → WebSocket with **`websocket-pro`** patterns.
- **REST + long poll** — possible for low-frequency; higher join latency.

## TURN

- **Symmetric NAT / strict corp networks** → TURN required; budget for relay bandwidth.
- **Lab only** → STUN may suffice — do not ship without field testing.

## Codecs

- **Interop first** → Opus + VP8/AV1 policy per browser matrix; hardware encode where stable.
