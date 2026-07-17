# Decision server

Serve a visual decision HTML page, receive browser events, and append user
choices to JSONL logs for agents/skills to read.

```bash
# From a project that already installed simple-skills:
python .agents/tools/decision-server/server.py \
  --root .agents/sessions/Task-1-example \
  --file VISUAL_DECISION.html \
  --log-dir .agents/sessions/Task-1-example/decision-logs \
  --port 8765 \
  --open
```

The server serves the HTML from `--root` and injects `client.js` when the page
does not already load it. Buttons with `data-choice` post to `/api/choice`.
The server appends choices to `choices.jsonl`; generic browser events go to
`events.jsonl`.

Stdlib only. No pip install required. Binds to `127.0.0.1` by default.
