# Electron — integration map

| Combined skill | Why | `electron-pro` owns | Other skill owns |
|----------------|-----|----------------------|------------------|
| **`react-pro`** | Renderer UI | IPC contracts, `webPreferences` | Components, hooks |
| **`security-pro`** | Threat model | IPC hardening, sandbox narrative | Org-wide policies |
| **`testing-pro`** | E2E | Playwright Electron harness | Test cases |
| **`deployment-pro`** | Release | Channels, artifacts | Infra outside desktop |
| **`tauri-pro`** | Alternative stack | — | Tauri-only patterns |

**Handoff:** Signing/notarization steps often need **platform** docs + Apple/Microsoft accounts — document owner.
