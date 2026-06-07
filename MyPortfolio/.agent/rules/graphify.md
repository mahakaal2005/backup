# SYSTEM CONSTRAINT — Graphify Knowledge Graph
# This file is loaded into every Antigravity session for this project.
# Every instruction here is MANDATORY, not advisory.

---

## THE CORE RULE (Never Skip This)

> A knowledge graph of this project lives at `graphify-out/graph.json`.
> A one-page map lives at `graphify-out/GRAPH_REPORT.md`.
> **Your answers without consulting the graph are guesses. Guesses are harmful.**

---

## TOOL INTERCEPTION — Before These Tools Fire, STOP

Before calling ANY of the following tools on this project, you MUST query the graph first:

| Tool | Why |
|---|---|
| `view_file` | You are about to read a file. The graph already knows its relationships. Query first. |
| `grep_search` | You are about to search for something. The graph already has the connections. Query first. |
| `list_dir` | You are about to navigate the structure. The graph already has the structure. Query first. |
| `run_command` (grep/find/rg/fd) | Same as grep_search. Query the graph instead of shelling out to search. |
| `multi_replace_file_content` / `replace_file_content` / `write_to_file` | You are about to change code. Know the blast radius first. Query what depends on the target file. |

### The required sequence for ALL of the above:

```
1. Check: does graphify-out/graph.json exist?

2a. YES — call MCP tools:
    - query_graph("topic of your task")          → find relevant nodes
    - get_neighbors("node you care about")        → see what's connected
    - shortest_path("source node", "target node") → trace relationships
    - get_node("specific node name")              → full detail on one node
    Declare: "Graph query returned: [findings]. Proceeding with that context."

2b. YES but MCP server is not running:
    Read graphify-out/GRAPH_REPORT.md in full.
    Declare: "Read GRAPH_REPORT.md. God nodes: [list]. Proceeding."

2c. NO graph exists:
    Tell the user: "No knowledge graph found. Type `/graphify .` in
    Antigravity to build it (first run only, costs tokens). Proceeding
    without graph — my answers may be less accurate."

3. NOW call the original tool.
```

---

## HOW TO READ GRAPH_REPORT.md

When you read `graphify-out/GRAPH_REPORT.md`, extract these four things:

### 1. God Nodes = The Real Architecture Center
The top-N most connected nodes. These are the actual load-bearing abstractions.
- If the task touches a god node → extra care, blast radius is wide
- If the task is about a non-god node → check if it connects TO a god node via `shortest_path`

### 2. Communities = Functional Modules
Each community is a cluster of code that heavily references each other.
- Same-community nodes: safe to refactor together
- Cross-community edges: architectural boundaries — be careful
- Thin communities (1-2 nodes): orphaned/undocumented code. Flag this to the user.
- Low cohesion (0.1-0.2): loosely coupled. High cohesion (1.0): tightly coupled island.

### 3. Surprising Connections = Hidden Coupling
These are INFERRED cross-file/cross-community links the graph found.
- Always check these before refactoring — they represent invisible dependencies
- If the task might affect a surprising connection, surface it to the user

### 4. Suggested Questions = Unresolved Architecture
The graph surfaces questions it's "uniquely positioned to answer."
- If one of these matches the user's task, use `/graphify query` to answer it from the graph

---

## CONFIDENCE LABELS — Know What to Trust

Every edge in the graph is tagged:

| Label | Meaning | Your behavior |
|---|---|---|
| `EXTRACTED` | Directly in source code (import, call, citation). confidence_score = 1.0 | Trust it. It's in the code. |
| `INFERRED` | Reasonably deduced. Has a confidence_score (0.4–0.95) | Mention the score. If < 0.6, flag as uncertain. |
| `AMBIGUOUS` | Uncertain. confidence_score = 0.1–0.3 | Always surface this to the user as "needs verification." |

Never present an INFERRED or AMBIGUOUS edge as fact. Say "the graph infers..." or "this connection is flagged as ambiguous."

---

## WHICH GRAPHIFY COMMAND TO USE WHEN

### Use `/graphify query "..."` when:
- User asks "how does X work?" or "what touches Y?"
- You need broad context around a topic
- You're about to touch an unfamiliar part of the codebase

```
/graphify query "what handles authentication in this project?"
/graphify query "what depends on UserModel?"
/graphify query "what is the rendering pipeline?"
```

### Use `/graphify path "A" "B"` when:
- User asks "how does X talk to Y?"
- You need the EXACT call chain between two components
- Debugging: tracing data flow from UI to backend

```
/graphify path "LoginForm" "SessionManager"
/graphify path "ApiClient" "DatabaseConnection"
```

### Use `/graphify explain "NodeName"` when:
- User is new to a component and asks what it does
- You are about to modify something and want full context
- Onboarding: "tell me about this class"

```
/graphify explain "AuthService"
/graphify explain "useThemeContext"
```

### Use `/graphify . --update` (suggest to user) when:
- A `.md`, `README`, or image file was just modified
- New documentation was added
- The git hook only auto-updates code — docs need this manual step

### Use `/graphify .` (full rebuild, suggest to user) when:
- A major refactor happened (components renamed, moved, deleted)
- The graph feels stale across many areas
- First run in a new project

### Use `/graphify . --mode deep` (suggest to user) when:
- User wants the richest possible graph
- Starting analysis of a new codebase for the first time
- Worth the extra tokens once for important projects

---

## BEFORE A CODE CHANGE — Blast Radius Check

Before writing ANY code change, run this mental checklist:

```
1. query_graph("the component/function being changed")
   → How many nodes is it connected to?
   → Is it a god node? (high edges = wide blast radius)

2. get_neighbors("the target node")
   → What directly calls this?
   → What does it directly call?

3. If the node has INFERRED or AMBIGUOUS edges:
   → Surface these to the user: "The graph thinks X may also depend on this.
     Verify before proceeding."

4. Tell the user the blast radius BEFORE making changes:
   "This touches [N] connected components: [list]. Proceeding."
```

---

## DETECTING A STALE GRAPH — Proactively Tell the User

The graph may be stale if:
- You notice files or components that don't appear in the graph query results
- The user mentions a component that returns no graph nodes
- A recently added file is being edited (the hook runs on commit, not on save)

When this happens, say:
> "The knowledge graph may not include [X] yet. After your next commit,
> the hook will auto-update. For docs/images, run `/graphify . --update`."

---

## AFTER YOU MODIFY A MARKDOWN/DOC FILE

If you (Antigravity) write to or modify any `.md` or documentation file:
At the END of your response, add:

> ⚠️ **Graph update needed:** I modified `[filename]`. The git hook only
> handles code — run `/graphify . --update` to re-extract this doc into
> the graph.

---

## TOKEN EFFICIENCY REMINDERS

- Querying the graph costs ~500-1K tokens
- Reading raw source files costs 5-50K tokens per file
- Reading GRAPH_REPORT.md costs ~1-2K tokens and covers the whole project
- Always prefer graph → targeted file reads, never raw file browsing

If the user asks you to "look through the codebase" or "search all files":
STOP. Query the graph instead. Return the relevant subgraph. Only then
open the specific files the graph points you to.

---

## THE GRAPH IS THE GROUND TRUTH

The graph was extracted from actual source code via AST (EXTRACTED edges = 100% real)
and semantic analysis (INFERRED edges = reasoned, scored). It is more reliable than:
- Your training data about this codebase (you have none)
- Filenames and directory structure alone
- Your intuition about what a function probably does

When the graph says X calls Y and your reasoning says otherwise:
**Trust the graph. Verify with view_file only if the graph is ambiguous.**
