---
name: ai-integration-pro
description: |
  Professional AI/LLM integration: Claude API, OpenAI API, prompt engineering, streaming, tool use/function calling, multi-turn conversations, RAG, embeddings, and production AI reliability patterns.

  Use this skill when the user integrates LLMs (Claude, GPT, Gemini, Llama), works with the Anthropic SDK or OpenAI SDK, designs prompts, implements streaming responses, tool use / function calling, multi-turn conversation state, retrieval-augmented generation (RAG), vector embeddings, semantic search, or builds AI-powered applications.

  Triggers: "Claude", "Anthropic", "OpenAI", "GPT", "LLM", "prompt", "system prompt", "prompt injection", "jailbreak", "streaming", "SSE", "tool use", "function calling", "embeddings", "RAG", "retrieval", "vector", "semantic search", "tokens", "context window", "temperature", "top_p", "rate limit", "429", "completion", "chat completion", "anthropic SDK", "openai SDK", "messages API", "Gemini", "multi-turn", "conversation history", "AI agent", "agentic".

metadata:
  short-description: AI/LLM — Claude/OpenAI APIs, prompts, streaming, tool use, RAG
---

# AI Integration (professional)

Use official [Anthropic docs](https://docs.anthropic.com/) and [OpenAI docs](https://platform.openai.com/docs/) for API reference; this skill encodes **prompt engineering discipline**, **production reliability patterns**, and **tool use architecture**. Confirm the **LLM provider and model**, **SDK version**, **context window limits**, and **streaming vs batch** requirements when known.

## Related skills (this repo)

| Skill | When to combine |
|-------|----------------|
| `security-pro` | API key management, prompt injection defense, output validation |
| `caching-pro` | Prompt caching, embedding caches, response memoization |
| `api-design-pro` | Designing AI-powered API endpoints |
| `testing-pro` | Testing prompts, mocking LLM responses, eval pipelines |
| `postgresql-pro` | pgvector for embeddings storage and similarity search |

## When to use

- Integrating Claude, GPT, or other LLMs into an application using official SDKs.
- Designing and iterating on system prompts and few-shot examples.
- Implementing streaming responses, tool use, and multi-turn conversations.
- Building RAG pipelines with embeddings and vector stores.
- Hardening AI features against prompt injection, hallucination, and reliability failures.
- Trigger keywords: `Claude`, `OpenAI`, `LLM`, `streaming`, `tool use`, `RAG`, `embeddings`, `prompt`, …

## Workflow

1. Confirm LLM provider/model, SDK version, context window, and whether streaming or batch is needed.
2. Apply the principles and topic summaries below; open `references/` when you need depth.
3. Respond using **Suggested response format**; call out prompt injection, token cost, and latency risks.

### Operating principles

1. **System prompt is the contract** — define behavior, scope, format, and refusal rules explicitly; treat it as code.
2. **Validate LLM output** — never trust raw LLM output in downstream logic; validate structure (Zod/Pydantic) and content.
3. **Stream by default for UX** — streaming reduces perceived latency; buffer for tools/structured output.
4. **Token budgets matter** — count input + output tokens; cache static context; trim conversation history on long sessions.
5. **Prompt injection is a real threat** — sanitize user content interpolated into prompts; never allow user input to override system instructions.
6. **Fallback and retry** — LLM APIs fail transiently; implement exponential backoff; have graceful degradation.

### Prompt engineering (summary)

- **System prompt structure**: role → task → constraints → output format → examples.
- **Few-shot examples** — 2–5 high-quality examples outperform long instructions for complex tasks.
- **Chain-of-thought** — `"Think step by step"` or explicit reasoning steps improve accuracy on reasoning tasks.
- **Output format** — specify JSON schema, markdown, or structured fields; use `response_format: json_object` (OpenAI) or XML tags (Claude).
- **Temperature** — 0 for deterministic/structured output; 0.3–0.7 for creative; never above 1.0 for production.

Details: [references/prompt-engineering.md](references/prompt-engineering.md)

### Tool use / function calling (summary)

- Define tools with precise `name`, `description`, and JSON `input_schema`.
- Descriptions drive model behavior — be explicit about when and when NOT to use each tool.
- Handle `tool_use` blocks in the response and return `tool_result` correctly in multi-turn.
- Validate tool inputs before executing; never execute arbitrary code from tool parameters.
- Parallel tool calls: Claude can call multiple tools in one turn; handle them all before continuing.

Details: [references/tool-use.md](references/tool-use.md)

### Streaming responses (summary)

- Server-sent events (SSE) for real-time text delivery to clients.
- Anthropic SDK: `stream()` helper returns async iterable of events.
- Buffer tool use blocks — they arrive as streaming events but must be complete before execution.
- Handle `message_stop` or `finish_reason` to detect stream end.
- Propagate stream errors to client with appropriate status codes.

Details: [references/streaming.md](references/streaming.md)

### RAG and embeddings (summary)

- **Chunking** — split documents at semantic boundaries (paragraphs, sections); 256–1024 tokens per chunk typical.
- **Embedding models** — `text-embedding-3-small` (OpenAI), `voyage-3` (Anthropic/Voyage); cosine similarity for retrieval.
- **Vector stores** — pgvector (Postgres), Pinecone, Weaviate, Chroma for local dev.
- **Retrieval** — top-K by cosine similarity; re-rank with cross-encoder for precision.
- **Context stuffing** — inject retrieved chunks into system/user prompt; cite sources.

Details: [references/rag-embeddings.md](references/rag-embeddings.md)

### Decision trees (summary)

- **RAG vs fine-tuning vs prompt-only**, **streaming vs batch**, **tool use vs plain completion**, **caching** — see trees.

Details: [references/decision-tree.md](references/decision-tree.md)

### Anti-patterns (summary)

- Trusting LLM for SQL/shell, prompt injection, no rate limits, logging PII in prompts — see reference.

Details: [references/anti-patterns.md](references/anti-patterns.md)

### Tips and tricks (summary)

- System prompt versioning, few-shot quality, token accounting, idempotency keys for billed APIs.

Details: [references/tips-and-tricks.md](references/tips-and-tricks.md)

### Edge cases (summary)

- Partial tool calls in streams, over-refusal, multilingual drift, 429 handling — see reference.

Details: [references/edge-cases.md](references/edge-cases.md)

### Integration map (summary)

- Ownership with **`security-pro`**, **`testing-pro`**, **`postgresql-pro`** (pgvector), **`api-design-pro`**.

Details: [references/integration-map.md](references/integration-map.md)

### Version notes (summary)

- Pin SDK and model id; read provider changelogs before upgrades.

Details: [references/versions.md](references/versions.md)

### Suggested response format (implement / review)

1. **Issue or goal** — Integration task, prompt problem, or reliability concern.
2. **Recommendation** — API usage pattern, prompt strategy, or architecture approach.
3. **Code** — TypeScript/Python SDK snippet with error handling and streaming.
4. **Residual risks** — Prompt injection, token cost, latency, hallucination, or rate limits.

## Resources in this skill

- `references/` — topic deep-dives; do not paste entire reference docs into SKILL.md.

| Topic | File |
|-------|------|
| **Prompt engineering** | [references/prompt-engineering.md](references/prompt-engineering.md) |
| Tool use / function calling | [references/tool-use.md](references/tool-use.md) |
| Streaming responses | [references/streaming.md](references/streaming.md) |
| RAG and embeddings | [references/rag-embeddings.md](references/rag-embeddings.md) |
| Decision trees | [references/decision-tree.md](references/decision-tree.md) |
| Anti-patterns | [references/anti-patterns.md](references/anti-patterns.md) |
| Tips and tricks | [references/tips-and-tricks.md](references/tips-and-tricks.md) |
| Edge cases | [references/edge-cases.md](references/edge-cases.md) |
| Integration map | [references/integration-map.md](references/integration-map.md) |
| Version notes | [references/versions.md](references/versions.md) |

## Quick example

### 1 — Simple (common)

**Input:** Build a streaming Claude chat endpoint in Express that supports tool use for fetching weather data.  
**Expected output:** Express route with Anthropic SDK `stream()`, weather tool definition, tool result loop, SSE response headers, and error handling; note token costs and prompt injection mitigations.

### 2 — Tricky (edge case)

**Input:** OpenAI JSON mode sometimes returns markdown fences around JSON; parser throws in production.  
**Expected output:** Defensive strip of ``` blocks, `JSON.parse` in try/catch, fallback message; add test vectors in **`testing-pro`** harness.

### 3 — Cross-skill

**Input:** RAG over internal wiki — answers must not leak other teams’ docs to wrong users.  
**Expected output:** **`ai-integration-pro`** retrieval filtered by ACL metadata; **`security-pro`** threat model on injection + data exfil; **`postgresql-pro`** if using pgvector with row security.

## Checklist before calling the skill done

- [ ] API keys stored in environment variables; never hardcoded or logged.
- [ ] LLM output validated (schema + content) before use in business logic.
- [ ] Streaming implemented for user-facing responses; buffered for structured output.
- [ ] Tool descriptions are precise; inputs validated before execution.
- [ ] Exponential backoff for rate limit and transient errors.
- [ ] User-supplied content sanitized before prompt interpolation (prompt injection defense).
- [ ] Token usage logged or estimated; conversation history trimmed for long sessions.
- [ ] Model id and SDK version noted for reproducibility; eval run before model upgrades.
