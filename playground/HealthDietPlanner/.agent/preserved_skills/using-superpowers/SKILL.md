---
name: using-superpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
---

<EXTREMELY-IMPORTANT>
## MANDATORY: Run This Checklist On EVERY Prompt Before Doing Anything Else

**Step 1 — Triage the prompt.** Read the user's message and match it against the Prompt → Skill table below.

**Step 2 — Identify ALL matching skills.** If even 1% chance a skill applies, it applies.

**Step 3 — Read each matched skill's SKILL.md** using `view_file` on its absolute path before generating any response, writing any code, or asking any question.

**Step 4 — Follow the skill's instructions exactly** for the duration of this task.

YOU DO NOT HAVE A CHOICE. YOU MUST DO THIS. IT IS NOT OPTIONAL.
</EXTREMELY-IMPORTANT>

---

## Prompt → Skill Decision Table

Use this table every prompt to determine which skill(s) to invoke:

| Prompt contains / is about… | Skills to invoke (in order) |
|---|---|
| New feature, component, UI element, or creative idea | `brainstorming` → `writing-plans` → `subagent-driven-development` |
| Multi-step implementation plan or spec | `writing-plans` → `subagent-driven-development` |
| Bug, error, unexpected behavior, test failure | `systematic-debugging` → `test-driven-development` |
| UI/UX design, layout, styling, aesthetics | `brainstorming` → `ui-ux-pro-max` → `tailwind-design-system` |
| Tailwind CSS or component library | `tailwind-design-system` |
| React or Next.js code | `vercel-react-best-practices` |
| Next.js visual feedback / dev toolbar | `agentation` |
| Documentation, commit messages, error messages, UI text | `writing-clearly-and-concisely` |
| "Is this done?", "Does this work?", claiming completion | `verification-before-completion` |
| "Review my UI", "Critique this", post-UI-task review | `autonomous-critique` |
| Any coding task (catch-all) | `test-driven-development` + `verification-before-completion` |

---

## Skill Paths (Absolute)

| Skill | Path |
|-------|------|
| `brainstorming` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/brainstorming/SKILL.md` |
| `writing-plans` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/writing-plans/SKILL.md` |
| `subagent-driven-development` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/subagent-driven-development/SKILL.md` |
| `test-driven-development` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/test-driven-development/SKILL.md` |
| `systematic-debugging` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/systematic-debugging/SKILL.md` |
| `verification-before-completion` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/verification-before-completion/SKILL.md` |
| `autonomous-critique` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/autonomous-critique/SKILL.md` |
| `ui-ux-pro-max` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/ui-ux-pro-max/SKILL.md` |
| `tailwind-design-system` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/tailwind-design-system/SKILL.md` |
| `vercel-react-best-practices` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/vercel-react-best-practices/SKILL.md` |
| `agentation` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/agentation/SKILL.md` |
| `writing-clearly-and-concisely` | `/home/mahakaal/Dev/playground/HealthDietPlanner/.agent/skills/writing-clearly-and-concisely/SKILL.md` |

---

## Skill Priority (When Multiple Match)

1. **Process skills first** (`brainstorming`, `systematic-debugging`) — determine HOW to approach
2. **Implementation skills second** (`ui-ux-pro-max`, `test-driven-development`, `tailwind-design-system`) — guide execution
3. **Verification skills last** (`verification-before-completion`, `autonomous-critique`) — final gate

---

## Examples

| User says… | Skills invoked |
|---|---|
| "Build a diet dashboard" | `brainstorming` → `writing-plans` → `ui-ux-pro-max` → `tailwind-design-system` → `subagent-driven-development` → `verification-before-completion` |
| "Fix the calorie counter bug" | `systematic-debugging` → `test-driven-development` → `verification-before-completion` |
| "Critique my meal planner UI" | `autonomous-critique` (uses `agentation` + `ui-ux-pro-max`) |
| "Write the README" | `writing-clearly-and-concisely` |
| "Optimize the Next.js data fetching" | `vercel-react-best-practices` → `verification-before-completion` |
