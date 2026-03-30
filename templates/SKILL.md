---
name: skill-template
description: |
  Template for creating new skills. Use this as starting point.
  
  Replace this description with specific trigger conditions:
  - When should this skill activate?
  - What keywords trigger it?
  - What use cases does it cover?
  
  Example: "Use when user mentions 'analyze data', 'create chart', 
  or uploads CSV/Excel files. Handles data analysis, visualization, 
  and statistical reporting."
compatibility:
  tools: []  # e.g., [bash_tool, create_file, web_search]
  dependencies: []  # e.g., [python>=3.8, pandas, numpy]
---

# Skill Name

Brief one-line description of what this skill does.

## Overview

Explain the skill's purpose and main capabilities. Keep it concise (2-3 paragraphs).

Example:
> This skill helps users analyze datasets and create visualizations. It supports
> CSV, Excel, and JSON formats, and can generate charts, statistical summaries,
> and data quality reports.

## When To Use

List specific scenarios when this skill should activate:

- **Scenario 1**: User uploads a CSV file and asks "what's in this data?"
- **Scenario 2**: User says "create a bar chart showing sales by region"
- **Scenario 3**: User requests "analyze this dataset for trends"

**Trigger Keywords**: `analyze`, `visualize`, `chart`, `data`, `statistics`, `report`

## How It Works

### Step-by-Step Process

1. **Input Analysis**
   - Identify data format (CSV, Excel, JSON)
   - Validate file structure
   - Extract column names and types

2. **Data Processing**
   - Clean and normalize data
   - Handle missing values
   - Compute statistics

3. **Output Generation**
   - Create visualizations
   - Generate summary report
   - Package results

### Workflow Diagram

```
User Input → Validation → Processing → Analysis → Output
     ↓           ↓            ↓           ↓          ↓
   Query    File Check   Data Clean  Statistics  Report
```

## Required Tools

List tools this skill needs:

- `view` - To read uploaded files
- `bash_tool` - To run data processing scripts
- `create_file` - To generate output files
- `web_search` - (Optional) To look up data standards

## Implementation Details

### File Structure

```
skill-name/
├── SKILL.md               # This file
├── scripts/
│   ├── analyze.py        # Main analysis script
│   └── visualize.py      # Chart generation
├── references/
│   └── data-standards.md # Reference documentation
└── assets/
    └── templates/
        └── report.html   # Report template
```

### Core Logic

```python
# scripts/analyze.py
def analyze_data(filepath, options):
    """
    Main analysis function
    
    Args:
        filepath: Path to data file
        options: Analysis options dict
    
    Returns:
        dict: Analysis results
    """
    # 1. Load data
    data = load_file(filepath)
    
    # 2. Validate
    if not validate_data(data):
        raise ValueError("Invalid data format")
    
    # 3. Process
    results = {
        'summary': compute_summary(data),
        'statistics': compute_stats(data),
        'insights': find_insights(data)
    }
    
    return results
```

### Usage Examples

#### Example 1: Basic Data Analysis

**User Input:**
```
Analyze this sales data and show me key metrics
[uploads sales.csv]
```

**Skill Process:**
```bash
# 1. Read file
view /mnt/user-data/uploads/sales.csv

# 2. Run analysis
python scripts/analyze.py /mnt/user-data/uploads/sales.csv \
    --metrics summary,trends \
    --output /home/claude/analysis.json

# 3. Generate report
python scripts/generate_report.py \
    --data /home/claude/analysis.json \
    --template assets/templates/report.html \
    --output /mnt/user-data/outputs/sales_report.html
```

**Output:**
- HTML report with statistics
- Key insights and trends
- Visualization charts

#### Example 2: Custom Analysis

**User Input:**
```
Compare Q1 vs Q2 revenue by product category
```

**Skill Process:**
```python
# Extract relevant columns
quarters = filter_by_quarter(data, ['Q1', 'Q2'])
by_category = group_by(quarters, 'category')

# Compute comparison
comparison = {
    cat: {
        'Q1': sum(q1_data),
        'Q2': sum(q2_data),
        'change': percentage_change(q1_data, q2_data)
    }
    for cat, (q1_data, q2_data) in by_category.items()
}

# Create visualization
create_bar_chart(comparison, 'Revenue by Category')
```

## Best Practices

### Do's ✅

1. **Validate inputs thoroughly**
   ```python
   if not filepath.exists():
       raise FileNotFoundError(f"File not found: {filepath}")
   ```

2. **Provide clear error messages**
   ```python
   try:
       data = load_csv(filepath)
   except ValueError as e:
       print(f"❌ CSV parsing error: {e}")
       print("💡 Tip: Check for special characters in column names")
   ```

3. **Show progress for long operations**
   ```python
   with tqdm(total=len(files)) as pbar:
       for file in files:
           process(file)
           pbar.update(1)
   ```

### Don'ts ❌

1. **Don't assume file format**
   - Always detect format programmatically
   - Support multiple formats when possible

2. **Don't ignore edge cases**
   - Handle empty files
   - Handle missing columns
   - Handle special characters

3. **Don't block on errors**
   - Use try-except blocks
   - Provide fallback options
   - Log errors for debugging

## Reference Materials

For detailed documentation, see:

- [Data Standards](references/data-standards.md) - File format specifications
- [API Reference](references/api-reference.md) - Function documentation
- [Examples](references/examples.md) - More code examples

### Quick Reference: Common Tasks

```bash
# Load CSV
python scripts/load.py data.csv --format csv

# Compute statistics
python scripts/stats.py data.csv --metrics all

# Create chart
python scripts/chart.py data.csv --type bar --x category --y revenue

# Generate report
python scripts/report.py results.json --template summary
```

## Troubleshooting

### Common Issues

**Issue 1: "File encoding error"**
```
Solution: Specify encoding explicitly
python scripts/analyze.py data.csv --encoding utf-8
```

**Issue 2: "Memory error with large files"**
```
Solution: Use chunked processing
python scripts/analyze.py data.csv --chunk-size 10000
```

**Issue 3: "Missing dependencies"**
```
Solution: Install requirements
pip install -r requirements.txt
```

### Getting Help

If you encounter issues:
1. Check error messages carefully
2. Review the examples above
3. Consult reference documentation
4. Open an issue on GitHub

## Testing

### Test Cases

```json
{
  "test_cases": [
    {
      "name": "basic_csv_analysis",
      "input": {
        "file": "tests/data/sample.csv",
        "query": "analyze this data"
      },
      "expected_output": {
        "contains": ["summary", "statistics"],
        "file_created": "analysis_report.html"
      }
    },
    {
      "name": "empty_file_handling",
      "input": {
        "file": "tests/data/empty.csv",
        "query": "analyze this"
      },
      "expected_output": {
        "error": true,
        "message": "contains: 'empty file'"
      }
    }
  ]
}
```

### Running Tests

```bash
# Run all tests
python scripts/test.py --skill skill-name

# Run specific test
python scripts/test.py --skill skill-name --test basic_csv_analysis

# Verbose mode
python scripts/test.py --skill skill-name --verbose
```

## Performance Considerations

### Optimization Tips

1. **Cache repeated computations**
   ```python
   from functools import lru_cache
   
   @lru_cache(maxsize=128)
   def expensive_computation(data_hash):
       # ...
   ```

2. **Use vectorized operations**
   ```python
   # ❌ Slow: loop
   result = [x * 2 for x in data]
   
   # ✅ Fast: vectorized
   import numpy as np
   result = np.array(data) * 2
   ```

3. **Process in chunks for large files**
   ```python
   for chunk in pd.read_csv(file, chunksize=10000):
       process_chunk(chunk)
   ```

### Benchmarks

Typical performance on M1 MacBook Pro:

| Operation | 10K rows | 100K rows | 1M rows |
|-----------|----------|-----------|---------|
| Load CSV | 50ms | 200ms | 2s |
| Compute stats | 10ms | 100ms | 1s |
| Generate chart | 100ms | 150ms | 300ms |

## Version History

### v1.0.0 (2024-03-15)
- Initial release
- Basic analysis features
- CSV and Excel support

### v1.1.0 (2024-03-20)
- Added JSON support
- Improved error handling
- Performance optimizations

## Contributing

To improve this skill:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-improvement`
3. Make changes and add tests
4. Run test suite: `python scripts/test.py`
5. Submit pull request

## License

MIT License - see LICENSE file for details

---

## Checklist for New Skills

Before publishing your skill:

- [ ] Description clearly states when to trigger
- [ ] All dependencies listed in compatibility section
- [ ] At least 3 usage examples provided
- [ ] Error handling implemented
- [ ] Test cases written
- [ ] Documentation complete
- [ ] Performance benchmarks run
- [ ] Code reviewed

---

**Need help?** Open an issue or check the [Skill Development Guide](../../../docs/skill-development.md)
