# /graphify workflow

When the user runs `/graphify`, `/graphify .`, or `/graphify <path>`:

## Step 0: Initialize .graphifyignore (if missing)

Check if `.graphifyignore` exists in the project root.
If it does NOT exist, detect the project type by checking for these files:
- `package.json` + `vite.config.*` → Vite/React
- `package.json` + `next.config.*` → Next.js
- `package.json` (only) → generic Node.js
- `requirements.txt` or `pyproject.toml` → Python
- `build.gradle` or `build.gradle.kts` → Android/Kotlin
- `Cargo.toml` → Rust
- `go.mod` → Go

Create `.graphifyignore` with the appropriate defaults below.
Then tell the user: "Created .graphifyignore for [project type]. Review it and say 'ok proceed' or adjust first."
Wait for confirmation before continuing to Step 1.

### Vite/React defaults
```
node_modules/
dist/
build/
.git/
graphify-out/
.agents/
.agent/
*.lock
*.min.js
*.min.css
coverage/
.cache/
```

### Next.js defaults
```
node_modules/
.next/
out/
dist/
.git/
graphify-out/
.agents/
.agent/
*.lock
*.min.js
*.min.css
coverage/
.cache/
```

### Python defaults
```
__pycache__/
.venv/
venv/
dist/
build/
*.egg-info/
.git/
graphify-out/
.agents/
.agent/
*.pyc
```

### Android/Kotlin defaults
```
.gradle/
build/
.git/
graphify-out/
.agents/
.agent/
*.apk
*.aab
*.class
```

### Generic defaults (when project type unknown)
```
.git/
graphify-out/
.agents/
.agent/
node_modules/
dist/
build/
*.lock
```

## Step 1: Build the graph

Run in a terminal:
```bash
export PATH="$HOME/.pyenv/versions/graphify-env/bin:$PATH"
graphify <path>
```

Wait for it to complete. This may take a few minutes on first run.

## Step 2: Report results

After completion, tell the user:
- The god nodes (highest-degree concepts) from `graphify-out/GRAPH_REPORT.md`
- How many nodes and edges were found
- Remind them to open `graphify-out/graph.html` in a browser for the interactive view
- Ask if they want to run `graphify hook install` if not already done
