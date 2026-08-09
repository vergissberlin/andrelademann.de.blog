/**
 * Companion download for src/content/posts/mcp-servers-speed-vs-security-enterprise.md
 *
 * Everything here is drawn from that post — the sheet is the "lightweight,
 * repeatable evaluation process" the article says most enterprises lack, not a
 * new set of claims.
 */
export default {
  slug: "mcp-servers-speed-vs-security-enterprise",
  fileName: "mcp-server-security-review-checklist.pdf",
  title: "MCP Server Security Review",
  subtitle: "Five checks before an MCP server reaches production",
  articleUrl:
    "blog.andrelademann.de/posts/mcp-servers-speed-vs-security-enterprise",
  sources: [
    {
      title: "Model Context Protocol — Security Best Practices",
      url: "https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices",
    },
    {
      title: "Protecting against indirect prompt injection attacks in MCP",
      note: "Microsoft for Developers",
      url: "https://developer.microsoft.com/blog/protecting-against-indirect-injection-attacks-mcp",
    },
    {
      title: "MCP Tool Poisoning",
      note: "OWASP",
      url: "https://owasp.org/www-community/attacks/MCP_Tool_Poisoning",
    },
    {
      title: "The MCP Attack Surface: Top-20 Documented Attacks (2026)",
      url: "https://agyn.io/blog/mcp-attack-surface",
    },
  ],
  pages: [
    {
      blocks: [
        {
          kind: "note",
          text: "Installing an MCP server gives an AI system — and whoever controls it — a tool that can act in your name. This is the middle ground between **ship it** and a full penetration test.",
        },
        {
          kind: "checklist",
          title: "Review checklist",
          items: [
            {
              term: "Network calls",
              detail:
                "Does it phone home? Does anything go to a third-party endpoint? A server that wraps a local CLI and makes zero outbound calls is a far smaller risk than one with its own cloud backend.",
            },
            {
              term: "Credential handling",
              detail:
                "How does it receive and store API keys? Environment variables are fine; config files that can end up in version control are not. Check that nothing is written to logs.",
            },
            {
              term: "Scope of permissions",
              detail:
                "Does the tool set match what you actually need? A Jira server that can also delete projects offers attack surface you never asked for. Prefer least privilege — and if the server does not implement it, fork it and strip it down.",
            },
            {
              term: "Source availability and activity",
              detail:
                "Is the code open? Is it maintained? A single-file project with no issues, no pull requests and a two-year-old last commit is a very different risk from an actively maintained one.",
            },
            {
              term: "Dependencies",
              detail:
                "Run an audit. Not because it catches everything, but because it costs almost nothing and filters out the obvious.",
            },
          ],
        },
        {
          kind: "code",
          code: "cd your-mcp-server && npm audit --audit-level=high",
          caption:
            "Takes 10 seconds, occasionally saves you from yourself.",
        },
        {
          kind: "points",
          title: "Why enterprise changes the calculus",
          items: [
            {
              term: "Compliance",
              detail:
                "GDPR, SOC 2, ISO 27001 and sector-specific frameworks do not bend because a developer found a convenient new tool. A server that logs tool calls — even only for debugging — may be storing data you are not allowed to hand to a third party.",
            },
            {
              term: "Blast radius",
              detail:
                "An enterprise server is usually authenticated against more: the cloud provider, internal APIs, communication tools. A compromise is an incident, not a personal inconvenience.",
            },
            {
              term: "Visibility",
              detail:
                "If nobody can say which MCP servers your team is running, you already have a shadow IT problem. Adoption outpaces the speed at which security teams hear about it.",
            },
          ],
        },
        {
          kind: "note",
          text: "**Prompt injection through tool responses is a real attack vector.** A malicious server can return crafted content that nudges the model into doing something unintended — and if that model also holds a file system or a code executor, the risk compounds.",
        },
        {
          kind: "points",
          title: "Make it a habit, not a gate",
          items: [
            {
              term: "Keep a register",
              detail:
                "One list of the MCP servers in use, who owns each, and when it was last reviewed.",
            },
            {
              term: "Re-review on upgrade",
              detail:
                "A server that passed six months ago is a different piece of software today.",
            },
            {
              term: "Make reporting safe",
              detail:
                "Aim for a culture where “I added a new MCP server” is said out loud, not hidden.",
            },
          ],
        },
      ],
    },
  ],
};
