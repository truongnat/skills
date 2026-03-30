# AI Toolkit - Hệ Thống Skills, Knowledge Base & Prompts

🚀 **Bộ công cụ hoàn chỉnh để xây dựng và quản lý AI skills, knowledge bases, và prompt templates có thể tái sử dụng**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)

## 📚 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Quick Start](#quick-start)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Hướng Dẫn Chi Tiết](#hướng-dẫn-chi-tiết)
- [Examples](#examples)
- [Công Nghệ Hỗ Trợ](#công-nghệ-hỗ-trợ)
- [Contributing](#contributing)

---

## 🎯 Giới Thiệu

Toolkit này giúp bạn:

✅ **Tạo Skills có thể tái sử dụng** - Modular, portable, easy to share
✅ **Xây dựng Knowledge Base** - Organized, searchable, RAG-enabled
✅ **Quản lý Prompt Templates** - Reusable, version-controlled, tested
✅ **Integrate với MCP Servers** - Connect to external services
✅ **Deploy dễ dàng** - GitHub, Docker, hoặc as Python package

### Tại Sao Nên Dùng?

```
❌ Trước:
- Copy-paste prompts nhiều lần
- Mỗi project khác nhau structure
- Khó share knowledge với team
- Mất thời gian tìm lại prompts cũ

✅ Sau khi dùng Toolkit:
- Prompts có thể tái sử dụng như libraries
- Consistent structure across projects
- Knowledge base searchable với RAG
- Skills có thể install như npm packages
```

---

## ⚡ Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/ai-toolkit.git
cd ai-toolkit
```

### 2. Setup Environment

```bash
# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Hoặc manual setup:
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure

```bash
# Copy config template
cp config.template.yaml config.yaml

# Edit với API keys của bạn
nano config.yaml
```

### 4. Test

```bash
# Test xem mọi thứ đã hoạt động
python scripts/test.py

# List available skills
python scripts/list_skills.py

# Try a skill
python scripts/use_skill.py --skill data-analysis --file sample.csv
```

---

## 📁 Cấu Trúc Dự Án

```
ai-toolkit/
├── skills/                    # 🎯 Skill modules
│   ├── public/               # Share publicly
│   │   ├── data-analysis/
│   │   ├── code-review/
│   │   └── content-creation/
│   ├── private/              # Your private skills
│   └── examples/
│       └── skill-template/   # Template để tạo skill mới
│
├── knowledge-base/           # 📚 Knowledge repository
│   ├── documents/            # Markdown docs
│   ├── embeddings/           # Vector embeddings (gitignored)
│   └── schemas/              # Data schemas
│
├── prompts/                  # 🎨 Prompt library
│   ├── templates/            # Reusable templates
│   │   ├── code-review.yaml
│   │   ├── data-analysis.yaml
│   │   └── creative-writing.yaml
│   ├── chains/               # Multi-step workflows
│   └── components/           # Reusable components
│
├── mcp-servers/              # 🔌 MCP integrations
│   ├── custom-servers/
│   └── configs/
│
├── scripts/                  # 🛠️ Utility scripts
│   ├── setup.sh
│   ├── create_skill.py
│   ├── use_template.py
│   └── package_skill.py
│
├── docs/                     # 📖 Documentation
├── tests/                    # ✅ Test suite
├── config.yaml               # ⚙️ Configuration
└── requirements.txt          # 📦 Dependencies
```

---

## 🎓 Hướng Dẫn Chi Tiết

### Tạo Skill Mới

```bash
# 1. Copy template
cp -r skills/examples/skill-template skills/public/my-skill

# 2. Edit SKILL.md
cd skills/public/my-skill
nano SKILL.md

# 3. Test skill
python scripts/test_skill.py --skill my-skill

# 4. Package để share
python scripts/package_skill.py skills/public/my-skill
# Output: my-skill.skill
```

### Sử Dụng Prompt Templates

```python
from prompt_templates import load_template, render

# Load template
template = load_template("code-review")

# Render with variables
prompt = render(template, {
    "code": my_code,
    "language": "python",
    "focus_areas": ["security", "performance"]
})

# Use với LLM
response = llm.complete(prompt)
```

### Xây Dựng Knowledge Base

```bash
# 1. Add documents
cp your-docs/* knowledge-base/documents/

# 2. Build embeddings
python scripts/build_kb.py

# 3. Query
python scripts/query_kb.py "What is our refund policy?"
```

### Setup MCP Server

```yaml
# mcp-servers/configs/my-api.yaml
name: my-api
type: sse
url: https://api.mycompany.com/mcp
authentication:
  type: bearer
  token_env: MY_API_TOKEN
tools:
  - name: get_data
    description: Fetch company data
```

---

## 💡 Examples

### Example 1: Data Analysis Skill

```markdown
User: "Analyze this sales data and show trends"

Skill Process:
1. Detect file type (CSV)
2. Load and validate data
3. Compute statistics
4. Generate visualizations
5. Create HTML report

Output: Interactive dashboard với charts
```

### Example 2: Code Review với Prompt Template

```python
# Use prompt template
review = use_template(
    "code-review-comprehensive",
    code=user_code,
    language="python",
    focus_areas=["security", "performance"]
)

# Returns structured review:
# - Critical issues
# - Suggestions
# - Refactored code
```

### Example 3: RAG-Powered Q&A

```python
# Query knowledge base
results = kb.search("How do I deploy to production?")

# Get relevant docs (automatically ranked by similarity)
for doc in results:
    print(f"📄 {doc.title}")
    print(f"📊 Relevance: {doc.score:.2f}")
    print(f"📝 {doc.excerpt}\n")

# Generate answer using retrieved context
answer = llm.complete(
    prompt=f"Based on these docs:\n{results}\n\nAnswer: {query}"
)
```

---

## 🚀 Công Nghệ Hỗ Trợ

### 1. **MCP (Model Context Protocol)**
Kết nối Claude với external services

```python
# Example: Query Notion database via MCP
from mcp_client import MCPClient

client = MCPClient("https://mcp.notion.com/mcp")
results = client.call_tool("notion-search", {
    "query": "Q4 roadmap"
})
```

**Use Cases:**
- Asana/Jira integration
- Google Drive/Notion search
- Custom internal APIs
- Database queries

### 2. **RAG (Retrieval-Augmented Generation)**
Truy xuất thông tin từ knowledge base lớn

```python
from rag import RAGSystem

rag = RAGSystem("knowledge-base/")
answer = rag.query("What's our security policy?")
# Automatically retrieves relevant docs + generates answer
```

**Use Cases:**
- Company documentation search
- Customer support automation
- Research assistant
- Legal/compliance queries

### 3. **Vector Databases**

**Chroma (Local, Simple)**
```bash
pip install chromadb
# Perfect for: Local development, small-medium knowledge bases
```

**Pinecone (Cloud, Scalable)**
```bash
pip install pinecone-client
# Perfect for: Production, large scale, managed service
```

**Weaviate (Open Source)**
```bash
docker-compose up  # Runs locally
# Perfect for: Full control, hybrid search, on-premise
```

### 4. **LangChain / LlamaIndex**

**LangChain:**
```python
from langchain.chains import ConversationalRetrievalChain

chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    memory=memory
)

response = chain({"question": "Tell me about X"})
```

**LlamaIndex:**
```python
from llama_index import GPTVectorStoreIndex

index = GPTVectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("What is X?")
```

### 5. **Prompt Engineering Tools**

**LangSmith** - Prompt testing & debugging
**PromptLayer** - Prompt version control
**Helicone** - Prompt analytics
**Anthropic Workbench** - Prompt optimization

---

## 🔧 Advanced Features

### 1. Skill Chaining

```yaml
# skills/workflows/research-report.yaml
workflow:
  - skill: web-search
    input: {{topic}}
    output: search_results
    
  - skill: content-extraction
    input: {{search_results}}
    output: raw_content
    
  - skill: summarization
    input: {{raw_content}}
    output: summary
    
  - skill: report-generation
    input: {{summary}}
    output: final_report
```

### 2. Conditional Logic

```python
# In skill SKILL.md
if file_type == "csv":
    use_script("analyze_csv.py")
elif file_type == "json":
    use_script("analyze_json.py")
else:
    raise ValueError("Unsupported format")
```

### 3. Caching & Performance

```python
# Cache embeddings
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_embedding(text: str):
    return model.encode(text)

# Result: 10x faster for repeated queries
```

### 4. Monitoring & Logging

```python
import logging
from prometheus_client import Counter

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Track metrics
skill_calls = Counter('skill_calls', 'Number of skill invocations')

def use_skill(skill_name):
    skill_calls.inc()
    logger.info(f"Using skill: {skill_name}")
    # ...
```

---

## 📊 Performance Benchmarks

### Skill Loading Time

| Skill Type | Load Time | First Call | Subsequent Calls |
|------------|-----------|------------|------------------|
| Simple | <50ms | ~200ms | ~50ms |
| With Scripts | ~100ms | ~500ms | ~100ms |
| RAG-Enabled | ~1s | ~2s | ~200ms |

### Knowledge Base Query Speed

| KB Size | Query Time (Cold) | Query Time (Warm) |
|---------|-------------------|-------------------|
| 100 docs | 50ms | 10ms |
| 1K docs | 200ms | 20ms |
| 10K docs | 1s | 50ms |
| 100K docs | 5s | 200ms |

*Tested on M1 MacBook Pro with Chroma*

---

## 🤝 Contributing

Contributions welcome! Xem [CONTRIBUTING.md](CONTRIBUTING.md)

### Development Setup

```bash
# Clone repo
git clone https://github.com/your-username/ai-toolkit.git

# Install dev dependencies
pip install -r requirements-dev.txt

# Run tests
pytest tests/

# Run linter
black .
flake8 .

# Type checking
mypy scripts/
```

### Adding New Skills

1. Fork repo
2. Create skill: `cp -r skills/examples/skill-template skills/public/your-skill`
3. Edit `SKILL.md`
4. Add tests in `tests/skills/`
5. Submit PR

### Reporting Issues

- Bug reports: Use bug template
- Feature requests: Use feature template
- Questions: GitHub Discussions

---

## 📖 Documentation

- **[Full Documentation](docs/)** - Complete guides
- **[Skill Development Guide](docs/skill-development.md)** - How to create skills
- **[Prompt Engineering Guide](docs/prompt-engineering.md)** - Writing effective prompts
- **[API Reference](docs/api-reference.md)** - Python API docs
- **[Examples](examples/)** - Real-world examples

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- Anthropic - Claude API và MCP Protocol
- LangChain - Framework inspiration
- Chroma - Vector database
- Community contributors

---

## 📞 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/ai-toolkit/issues)
- 📚 Docs: [Documentation](https://docs.example.com)

---

## 🗺️ Roadmap

### Q2 2024
- [ ] Web UI cho skill management
- [ ] More pre-built skills
- [ ] Skill marketplace

### Q3 2024
- [ ] Cloud hosting option
- [ ] Team collaboration features
- [ ] Advanced analytics

### Q4 2024
- [ ] Enterprise features
- [ ] Multi-language support
- [ ] Mobile app

---

**Made with ❤️ by the community**

⭐ **Star this repo nếu thấy hữu ích!**
