/**
 * Companion download for
 * src/content/posts/git-rebase-theirs-probleme-beim-rebase-beheben.md
 *
 * The post asks for "a quick rule of thumb to save somewhere visible". Deliberately
 * short: one table, one rule, two commands. Anything longer stops being a card.
 */
export default {
  slug: "git-rebase-theirs-probleme-beim-rebase-beheben",
  fileName: "git-ours-theirs-cheatsheet.pdf",
  // A5: the content is a card, and a card on A4 is mostly blank paper.
  pageSize: "A5",
  title: "git ours and theirs",
  subtitle: "Which side wins a conflict",
  articleUrl:
    "blog.andrelademann.de/posts/git-rebase-theirs-probleme-beim-rebase-beheben",
  pages: [
    {
      blocks: [
        {
          kind: "note",
          text: "**In a rebase, “theirs” means your own commits.** `-Xours` and `-Xtheirs` point at opposite sides depending on whether you merge or rebase.",
        },
        {
          kind: "table",
          title: "You are on branch-a, the argument is branch-b",
          head: ["Command", "ours is", "theirs is"],
          rows: [
            [
              "git merge -X… branch-b",
              "**branch-a** — the branch you are on",
              "**branch-b** — the one being merged in",
            ],
            [
              "git rebase -X… branch-b",
              "**branch-b** — the branch you replay onto",
              "**branch-a** — your own commits",
            ],
          ],
        },
        {
          kind: "points",
          title: "Why it is inverted",
          items: [
            {
              term: "Rebase replays your commits onto the target",
              detail:
                "The target branch is what already exists — “ours” — and each replayed commit arrives as an incoming change, so it is “theirs”. The naming reflects the mechanics, not whose code it is.",
            },
          ],
        },
        {
          kind: "code",
          title: "The two you actually need",
          code: `# Rebasing your feature branch onto master, your branch wins
git rebase -Xtheirs master

# Merging master into your branch, your branch wins
git merge -Xours origin/master`,
          caption:
            "Both say the same thing in plain language: keep my work on conflicts. Available since Git 1.7.3.",
        },
        {
          kind: "points",
          title: "Before you reach for it",
          items: [
            {
              term: "It only decides conflicting hunks",
              detail:
                "Non-conflicting changes from both sides are still merged. `-X` is a strategy option, not a way to discard the other branch.",
            },
            {
              term: "It resolves silently",
              detail:
                "Use it when you already know one side is correct — not to make a wall of conflicts go away.",
            },
            {
              term: "Check what you got",
              detail:
                "Run `git diff` against the branch you expected to win before you push, and let the tests have the final word.",
            },
          ],
        },
      ],
    },
  ],
};
