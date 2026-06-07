# Agent Skills

AI agent skills for disciplined software development with Antigravity/Claude Code.

## Quick Install (SSH)

### In any new project:

```bash
# Add as git submodule
git submodule add git@github.com:mahakaal2005/agent-skills.git .agent/skills

# Commit the submodule
git add .gitmodules .agent/skills
git commit -m "Add agent skills submodule"
```

### When cloning a project that uses this:

```bash
# Clone with submodules
git clone --recurse-submodules git@github.com:YOUR_USER/your-project.git

# OR if already cloned:
git submodule update --init --recursive
```

### Update skills in a project:

```bash
cd .agent/skills
git pull origin main
cd ../..
git add .agent/skills
git commit -m "Update agent skills"
```

---

## Skills Included

| Skill | Trigger |
|-------|---------|
| `brainstorming` | Creative work, features |
| `writing-plans` | Multi-step tasks |
| `subagent-driven-development` | Execute plans |
| `test-driven-development` | Any feature/bugfix |
| `systematic-debugging` | Bugs, failures |
| `verification-before-completion` | Before claiming done |
| `autonomous-critique` | UI critique |
| `agentation` | Visual feedback |
| `ui-ux-pro-max` | UI/UX design |
| `tailwind-design-system` | Tailwind components |
| `vercel-react-best-practices` | React/Next.js |
| `writing-clearly-and-concisely` | Documentation |
| `using-superpowers` | Auto-discovery |

---

## How It Works

Skills chain automatically:
```
Feature request → brainstorming → writing-plans → subagent-dev → TDD → verification
Bug report → systematic-debugging → TDD → verification
UI critique → autonomous-critique → agentation + ui-ux-pro-max
```
