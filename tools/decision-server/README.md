# Decision server

Serve a visual decision HTML page, receive browser events, and append user
choices to JSONL logs. Presentation uses **Tailwind CDN** plus one enterprise
theme (`tailwind-theme.js` + `styles.css`). See `docs/DESIGN_SYSTEM.md`.

```bash
# From a project that already installed simple-skills:
python .agents/tools/decision-server/server.py \
  --root .agents/sessions/Task-1-example \
  --file VISUAL_DECISION.html \
  --log-dir .agents/sessions/Task-1-example/decision-logs \
  --port 8765 \
  --open
```

The server serves HTML from `--root` and injects Tailwind CDN + theme config +
`styles.css` + anime.js + `animate.js` + `client.js` when needed. Buttons with
`data-choice` post to `/api/choice`. Theme follows Claude frontend-design +
OpenAI Apps SDK UI (system fonts, minimal cards).

Stdlib only. No pip install required. Binds to `127.0.0.1` by default.
Requires network for Tailwind CDN and anime.js when viewing pages.
