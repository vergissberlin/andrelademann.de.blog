# Agent configuration

This directory is the single home for coding-agent configuration in this repository.
Vendor-specific directories in the project root are symlinks pointing here, so every
agent reads and writes the same files instead of each vendor keeping its own copy.

```
.agents/            real directory, tracked in git
├── launch.json     dev-server configurations (Claude Code)
├── rules/          always-applied rules (Cursor, *.mdc)
└── README.md       this file

.claude -> .agents  symlink
.cursor -> .agents  symlink
```

This mirrors the convention already used for instructions at the repository root, where
`CLAUDE.md` is a symlink to the vendor-neutral `AGENTS.md`.

## Why symlinks rather than one merged format

There is no cross-vendor standard for agent *configuration* yet — only for the
instruction file (`AGENTS.md`). Each tool hard-codes the directory it looks in and the
format it expects: Claude Code wants `launch.json`, Cursor wants `rules/*.mdc`. Symlinks
keep every tool working unmodified whilst giving us one directory to review, version and
reason about.

Trade-offs worth knowing:

- **File names must stay unique across vendors.** Because all tools resolve into the same
  directory, two vendors wanting different content under the same file name would clash.
  Nothing collides today; if it ever does, namespace the file (for example
  `launch.claude.json`) or give that vendor a real directory again.
- **Symlinks need platform support.** Git stores them natively, and Linux and macOS
  handle them transparently. On Windows, checkouts require either Developer Mode or
  `git config core.symlinks true`.

## Adding another vendor

Point the vendor's expected directory at this one and add its files here:

```sh
ln -s .agents .windsurf   # or .gemini, .opencode, .codex, …
git add .windsurf
```

Copilot is the exception: it reads `.github/instructions/`, which cannot become a symlink
without moving the rest of `.github`. Add an instructions file there that references
`AGENTS.md` instead.

## Local overrides

Machine-specific files an agent writes at runtime (for example
`.agents/settings.local.json`) are ignored by git. Keep anything shared in a tracked file
so the whole team benefits from it.
