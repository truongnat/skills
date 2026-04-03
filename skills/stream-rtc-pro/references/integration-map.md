# Stream / RTC — integration map

| Skill | Combine when |
|-------|----------------|
| **`websocket-pro`** | Signaling channel reliability, reconnect, backpressure. |
| **`performance-tuning-pro`** | End-to-end latency, CPU/GPU profiling, thread priorities. |
| **`security-pro`** | DTLS/SRTP assumptions, token exposure, recording consent. |
| **`deployment-pro`** | TURN geo, CDN for HLS fallback, autoscaling SFU. |
| **`network-infra-pro`** | UDP blocked environments; corporate firewall playbooks. |

**Boundary:** `stream-rtc-pro` owns media path and session semantics; pure HTTP API design → **`api-design-pro`**.
