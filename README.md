# claude-mods

Claude Code mods.

## Install

```
/plugin marketplace add cosmin220304/claude-mods
/plugin install prompt-info@claude-mods
```

## prompt-info

Adds repo (and worktree, when in one), branch, PR, context and model to the end of the line under the prompt:

```
▸▸ auto mode on (shift+tab to cycle) · new project / SHOP-142 · main (PR #142) · 100k/1000k (opus-5-5)
```

Branch and PR refresh at start, after each turn and every minute. PR needs `gh`.
