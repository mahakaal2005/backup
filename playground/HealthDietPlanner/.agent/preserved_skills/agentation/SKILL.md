---
name: agentation
description: Add Agentation visual feedback toolbar to a Next.js project and use its output for precise agent feedback with CSS selectors
---

# Agentation: Visual Feedback for Agents

## Overview

Agentation (agent + annotation) is a dev tool that lets you annotate UI elements and generate structured feedback with **CSS selectors** that agents can grep for directly.

**Key insight:** Agents find and fix code much faster when they know exactly which element you're referring to. Instead of "the blue button in the sidebar", you give `.sidebar > button.primary`.

## Setup

### 1. Check if already installed

```bash
# Look for agentation in package.json
grep agentation package.json
```

If not found:
```bash
npm install agentation -D
```

### 2. Add the component

**Next.js App Router** (`app/layout.tsx`):
```tsx
import { Agentation } from "agentation";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
```

**Next.js Pages Router** (`pages/_app.tsx`):
```tsx
import { Agentation } from "agentation";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}
```

### 3. Verify

Run dev server → look for floating button in bottom-right corner.

---

## Using Agentation Output

### Features

- **Click to annotate** – automatic selector identification
- **Text selection** – annotate specific content
- **Multi-select** – drag to select multiple elements
- **Area selection** – annotate any region, even empty space
- **Animation pause** – freeze CSS animations for specific states
- **Structured output** – markdown with selectors, positions, context

### Output Formats

| Format | Use Case |
|--------|----------|
| **Compact** | Quick fixes, minimal context |
| **Standard** | Most use cases, location + classes |
| **Detailed** | Complex issues, bounding boxes + nearby text |
| **Forensic** | Layout/style debugging, computed styles |

---

## Agent Workflow

### Receiving Agentation Feedback

When user pastes Agentation output:

1. **Parse the selectors** from the markdown
2. **Use `grep_search`** to find files containing those selectors
3. **Locate the component** and understand the feedback
4. **Implement the fix**
5. **Verify visually** with `browser_subagent`

### Example

User pastes:
```markdown
## Annotation 1
**Selector:** `.dashboard > .header > button.primary`
**Feedback:** Make this button larger and change color to blue
```

Agent action:
```bash
# Find the component
grep_search --query ".header" --includes "*.tsx"
grep_search --query "button.primary" --includes "*.tsx"
```

---

## Integration with Subagent-Driven Development

> **REQUIRED SUB-SKILL:** Use `autonomous-critique` for full integration

The workflow:

1. **User annotates** with Agentation → pastes output
2. **Parse selectors** from structured markdown
3. **Dispatch subagent** with grep targets from selectors
4. **Subagent locates code** and implements fix
5. **browser_subagent verifies** visually
6. **Loop if issues remain**

---

## Notes

- Requires React 18+
- Desktop browser only (mobile not supported)
- `NODE_ENV` check ensures it only loads in development
- Works with any agent that can grep a codebase (Claude Code, Cursor, Antigravity, etc.)

## Links

- [Documentation](https://agentation.dev)
- [GitHub](https://github.com/benjitaylor/agentation)
