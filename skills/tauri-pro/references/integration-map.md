# Tauri — integration map

| Skill | Combine when |
|-------|----------------|
| **`react-pro`** | Webview UI, hooks, a11y, performance. |
| **`electron-pro`** | Only when comparing stacks — not for Tauri implementation. |
| **`security-pro`** | CSP, capability review, path/open-url policies. |
| **`testing-pro`** | Rust unit tests, Playwright against packaged app, CI matrices. |
| **`deployment-pro`** | Installers, updater channels, code signing pipelines. |
| **`rust` ecosystem** | Deep language questions beyond Tauri glue — narrow scope to Tauri APIs here. |

**Boundary:** `tauri-pro` owns Rust commands, Tauri config, capabilities, packaging; SPA internals → front-end skill.
