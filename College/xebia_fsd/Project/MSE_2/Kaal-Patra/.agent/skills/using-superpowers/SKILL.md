---
name: using-superpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
---

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## Available Skills

### Workflow Skills (Chain Together)
| Skill | Trigger | Next Skill |
|-------|---------|------------|
| `brainstorming` | Creative work, features, components | → `writing-plans` |
| `writing-plans` | Multi-step task with spec | → `subagent-driven-development` |
| `subagent-driven-development` | Execute plan with tasks | uses `test-driven-development` |
| `test-driven-development` | Any feature or bugfix | → `verification-before-completion` |
| `systematic-debugging` | Bug, test failure | → `test-driven-development` |
| `verification-before-completion` | Before claiming "done" | Final gate |
| `autonomous-critique` | After completing UI tasks | uses `agentation` + `ui-ux-pro-max` |

### Domain Skills (Call When Relevant)
| Skill | When to Use |
|-------|-------------|
| `ui-ux-pro-max` | Any UI/UX design work |
| `tailwind-design-system` | Tailwind CSS, component libraries |
| `vercel-react-best-practices` | React/Next.js code |
| `agentation` | Visual feedback in Next.js dev mode |
| `writing-clearly-and-concisely` | Writing docs, messages, UI text |

## The Rule

**Invoke relevant skills BEFORE any response or action.** Even a 1% chance means invoke the skill.

## Skill Priority

When multiple skills could apply:

1. **Process skills first** (brainstorming, debugging) - determine HOW to approach
2. **Implementation skills second** (ui-ux-pro-max, TDD) - guide execution
3. **Verification skills last** (verification-before-completion) - final gate

Examples:
- "Build UI" → `brainstorming` → `ui-ux-pro-max` → `tailwind-design-system`
- "Fix bug" → `systematic-debugging` → `test-driven-development`
- "Critique my site" → `autonomous-critique` (uses `agentation` + `ui-ux-pro-max`)
