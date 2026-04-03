# CLI — decision tree

## Output

- **Human + logs** → stderr for diagnostics; stdout for pipeable data.
- **Scripts** → `--json` or dedicated subcommand for machine output.

## Destructive ops

- **TTY** → Confirm or `--force` with warning.
- **CI** → Fail fast; no interactive prompt.

## Framework

- **Python** → Typer/Click/argparse trade-offs.
- **Go/Rust** → Cobra/Clap ecosystems for completions.
