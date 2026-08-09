/**
 * Companion download for
 * src/content/posts/ai-security-architect-why-this-might-be-the-most-valuable-tech-role-of-2026.md
 *
 * Page one is the capability model to rate yourself against, page two is the
 * communication half of the role — the part the post argues most candidates fail.
 */
export default {
  slug: "ai-security-architect-why-this-might-be-the-most-valuable-tech-role-of-2026",
  fileName: "ai-security-architect-onepager.pdf",
  title: "AI Security Architect",
  subtitle: "Five capability areas, and how to be understood by an executive",
  articleUrl:
    "blog.andrelademann.de/posts/ai-security-architect-why-this-might-be-the-most-valuable-tech-role-of-2026",
  sources: [
    {
      title: "AI Security Architect: The Hottest Tech Career of 2026",
      note: "Mike Gibbs, Go Cloud Architects",
      url: "https://www.youtube.com/watch?v=-IzN_X8DImM",
    },
    {
      title: "The Future of Jobs Report 2025",
      note: "World Economic Forum",
      url: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
    },
    {
      title: "ISC2 Cybersecurity Workforce Study 2025",
      url: "https://www.prnewswire.com/news-releases/isc2-study-finds-cybersecurity-budget-constraints-remain-but-do-not-worsen-while-skill-needs-grow-302632487.html",
    },
    {
      title: "IBM: CIOs and CTOs face a growing AI control gap",
      note: "IBM Institute for Business Value, June 2026",
      url: "https://newsroom.ibm.com/2026-06-08-new-ibm-study-finds-cios-and-ctos-face-growing-ai-control-gap-as-enterprise-deployment-scales",
    },
  ],
  pages: [
    {
      blocks: [
        {
          kind: "note",
          text: "The role sits where two talent shortages collide: people who can design a whole security programme, and people who can design an enterprise AI system that produces business value. **Architecture is a decision-quality job, not a tool-knowledge job.**",
        },
        {
          kind: "checklist",
          title: "The five capability areas — rate yourself",
          scale: true,
          scaleLegend:
            "1 = no real exposure · 3 = I contribute · 5 = I own the decision and can defend it to a board. Your lowest score is your next move, not your strongest one.",
          items: [
            {
              term: "AI architecture",
              detail:
                "Use cases, data models, model selection, agents, model lifecycle, evaluation and monitoring. As a strategist and decision maker, not as a coder.",
            },
            {
              term: "Security architecture",
              detail:
                "Threat modelling, data protection, cloud and application security, zero trust, governance, incident response, risk management. At design level, not tool-operator level.",
            },
            {
              term: "Business acumen",
              detail:
                "Revenue against cost against risk, business operations, customer experience, compliance exposure, executive priorities. This is where most candidates fail.",
            },
            {
              term: "Executive communication",
              detail:
                "Explaining complex AI security risk in plain language. No jargon, no tool dumping — the decision, the risk, the trade-offs, the business impact.",
            },
            {
              term: "Leadership and governance",
              detail:
                "Aligning security, cloud, data, legal, compliance and finance, plus executives and vendors. AI without governance is just risk at computer speed.",
            },
          ],
        },
        {
          kind: "table",
          title: "Engineer or architect?",
          head: ["The engineer asks", "The architect asks"],
          rows: [
            [
              "Which model, which API, which interface?",
              "What data will the system access, and who approves that access?",
            ],
            [
              "Can we build it?",
              "Should we build it — and what could go wrong?",
            ],
            [
              "How do we ship it?",
              "How do we authenticate users, authorise access and log what actually happened?",
            ],
            [
              "Does the output look right?",
              "How do we validate outputs so a hallucination does not become financial advice?",
            ],
            [
              "Is the model fast enough?",
              "Is the data regulated, can the model retain prompts, can it leak?",
            ],
          ],
        },
        {
          kind: "points",
          title: "Why the demand is real",
          items: [
            {
              term: "63%",
              detail:
                "of employers name skill gaps as the main barrier to transformation (World Economic Forum).",
            },
            {
              term: "11%",
              detail:
                "of technology executives feel prepared to deploy AI agents at scale, while 77% say adoption is outpacing their governance (IBM).",
            },
            {
              term: "70%",
              detail:
                "of CIOs found AI running on their systems that nobody had told them about. Shadow AI is real.",
            },
          ],
        },
      ],
    },
    {
      subtitle: "Translate the risk, or the architecture never gets funded",
      blocks: [
        {
          kind: "table",
          title: "Say this, not that",
          head: ["Technical risk", "What the business needs to hear"],
          rows: [
            ["Prompt injection", "Business process compromise"],
            ["Data leakage", "Regulatory and reputational risk"],
            ["Shadow AI", "Uncontrolled enterprise exposure"],
            [
              "Model isolation, prompt filtering, token-level monitoring",
              "Controls that keep confidential customer data out of the wrong hands",
            ],
            [
              "Insufficient audit logging",
              "We cannot prove what happened if a regulator asks",
            ],
          ],
        },
        {
          kind: "compare",
          title: "Same substance, opposite outcome",
          items: [
            {
              tone: "bad",
              label: "Never gets funded",
              text: "“We need to implement better model isolation, prompt filtering, and token-level monitoring.”",
            },
            {
              tone: "good",
              label: "Gets funded",
              text: "“If we deploy this AI system without proper governance, confidential customer data could be exposed, regulators could get involved, and our reputation could be harmed. Here is a safer approach that still lets us move quickly.”",
            },
          ],
        },
        {
          kind: "points",
          title: "Questions to bring to any AI initiative",
          items: [
            {
              term: "Access",
              detail:
                "What data will the system reach, and who signs off on that access?",
            },
            {
              term: "Retention",
              detail:
                "Is the data regulated? Can the model retain previous prompts?",
            },
            {
              term: "Accountability",
              detail:
                "How do we authenticate, authorise and log — well enough to reconstruct an incident?",
            },
            {
              term: "Validation",
              detail:
                "How do we check outputs before they reach a customer or a decision?",
            },
            {
              term: "Justification",
              detail:
                "Should we build this at all — and if so, this way or another way?",
            },
          ],
        },
        {
          kind: "note",
          text: "Certifications alone will not get you there. They prove exposure to a body of knowledge; the role is judged on the quality of the decisions you make and your ability to defend them to people who do not share your vocabulary.",
        },
      ],
    },
  ],
};
