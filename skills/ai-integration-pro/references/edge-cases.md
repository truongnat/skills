# AI integration — edge cases

- **Partial tool call in stream:** buffer until arguments complete before `JSON.parse` or execution.

- **Model refuses safe requests:** over-refusal — adjust system prompt and examples; add escalation path.

- **Multilingual mixed in one session:** model may answer in wrong language; pin expected locale in system prompt.

- **Long tool outputs:** exceed next-turn context — summarize tool results before feeding back.

- **Duplicate assistant messages:** some APIs reject; normalize message history.

- **429 / rate limits:** exponential backoff + jitter; respect `retry-after` when present.

- **JSON mode still emits preamble:** strip fenced code blocks before parse; defensive parsing.

- **Hallucinated citations:** RAG must attach real chunks; verify source ids before showing to users.

- **Concurrent user edits to same conversation:** locking or last-write-wins; document behavior.

- **Compliance regions:** data residency may forbid calling certain endpoints — route by region.

Pair with **`security-pro`** for injection and data handling; **`testing-pro`** for eval harnesses.
