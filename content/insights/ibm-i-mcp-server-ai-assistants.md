## Why IBM i teams should care

IBM i has never been short on system information. Db2 for i and the QSYS2 services expose an enormous amount of what's happening on a partition — active jobs, memory pools, object metadata, security settings, storage usage — almost all of it queryable with plain SQL. The catch has never really been *availability*. It's been *recall*: knowing which of the dozens of QSYS2 services answers a given question, what the right filter columns are, and how to phrase a query that returns something useful instead of ten thousand rows nobody asked for.

That's the gap the Model Context Protocol (MCP) is aimed at, and it's why the **IBM i MCP Server** — IBM's own open-source implementation — is worth understanding even if you have no immediate plan to deploy one. It doesn't add new information to IBM i. It adds a narrower, more approachable *front door* to information that was already there, one that a natural-language client can walk through without the person asking having to already know the exact SQL service by name.

[[FIGURE:workflow-comparison]]

The shape of that shortcut is easy to state and easy to overstate, so it's worth being precise from the start: an AI assistant using this server is not "understanding" IBM i. It's calling a small set of predefined, human-reviewed tools, and a language model is doing what language models are actually good at — turning a vague question into a specific tool call, and turning a structured result back into a readable sentence. Everything in between stays exactly as constrained, auditable, and IBM-i-authority-governed as it always was.

## What MCP means, in plain terms

Model Context Protocol is an open specification for how an AI client — a chat app, an IDE assistant, a custom agent — discovers and calls external "tools" in a standard way, instead of every integration inventing its own bespoke plumbing. A tool, in MCP terms, is just a named, described operation with a fixed set of inputs. The client asks "what tools do you have?", picks one that matches what the user is asking for, supplies the inputs it's allowed to supply, and gets a structured result back.

Nothing about that description is IBM i-specific, and that's the point: MCP is a client-to-server contract, not an IBM i technology. What makes an implementation useful for a particular platform is what sits behind the tools — and for IBM i MCP Server, what sits behind them is a small, well-defined SQL engine talking to Db2 for i.

It's worth resisting the framing that shows up a lot in AI coverage generally: this isn't the model "understanding" your system. It's a narrow, well-lit hallway between a language model and a handful of operations someone deliberately exposed.

## How IBM i MCP Server works

At a mechanical level, a question travels through four pieces of software between the person asking and the answer — and none of them can skip a step or reach past the one next to it.

[[FIGURE:architecture]]

The AI client — Claude Desktop, a VS Code Copilot session, or a custom agent built on a framework like LangChain or Agno — only ever speaks MCP to the **IBM i MCP Server**, a Node.js process (published as `@ibm/ibmi-mcp-server`) that can run wherever is convenient: a laptop for local development, a container, or a small always-on service. That server holds the catalog of tools an administrator or developer has approved and knows how to reach one thing: **Mapepire**, a lightweight WebSocket-based SQL gateway that runs *on* the IBM i partition itself, listening on port 8076 by default. Mapepire is what actually executes SQL against Db2 for i and returns rows — the MCP server never talks to Db2 for i any other way.

Walking through one realistic question end to end makes the boundaries concrete:

[[FIGURE:request-lifecycle]]

Notice where the language model's judgment is actually load-bearing: step 1 (turning a vague question into an intent) and step 8 (turning rows into a sentence). Steps 2 through 7 are deterministic — a lookup, a parameter check, a predefined query, an authority check the operating system was already going to perform, and a typed result. That middle section is not something the model is improvising.

### How the client and server actually connect

Two connection styles cover most setups, and the difference matters more for governance than for functionality.

**Local (`stdio`)** is the simpler one: the AI client launches the server as a child process on the same machine and talks to it over standard input and output. Nothing listens on a network port, which makes it a natural fit for a single developer experimenting on a laptop.

**Remote (`http`)** runs the server as a long-lived service — by default on port 3010 — that multiple clients can reach. This is the shape you want for a shared, team-wide deployment, and it is also the shape that makes TLS termination, authentication, and request logging your responsibility rather than optional extras. The project's own documentation recommends putting a reverse proxy in front of it in production for exactly that reason.

Either way, the client is configured with a small JSON block naming the server and its tool files. The important governance point is that whoever controls that configuration and the `.env` behind it controls which partition, which profile, and which tools are in play — so it belongs under the same change control as any other connection into IBM i.

### Where the tools themselves come from

Every tool the server exposes is defined in a YAML file, checked into a repository like any other configuration, and reviewed the same way a pull request would be. A tool binds one human-written SQL statement to a name, a description, and a small set of typed, constrained parameters.

[[FIGURE:yaml-tool]]

The description field deserves more attention than it usually gets: it's sent directly to the AI client, and it's the main signal the client uses to decide *when* a given tool is the right one to call for a given question. A vague description ("does stuff with libraries") makes tool selection unreliable in exactly the way a vague function name makes code hard to call correctly. Treat it like an API contract, because that's what it is.

The repository also ships a sibling command-line tool, `ibmi` (the `@ibm/ibmi-cli` package), that runs the same YAML-driven engine without an MCP client in the loop at all — useful for scripting, CI, or a local agent that would rather shell out to a command than hold open an MCP session. The tool definitions are shared between the two, which is a detail worth knowing if a team standardizes on YAML tools for the CLI first and adds MCP access later.

## Practical use cases

The realistic value of this pattern shows up in the kind of question that's easy to ask and mildly annoying to answer by hand — the ones where you know IBM i has the answer somewhere in QSYS2, but composing the exact query takes a minute of recall or a trip to documentation.

[[FIGURE:use-cases]]

None of the tools implied above are switched on by default just because this article describes them. The IBM i MCP Server repository ships several ready-made tool collections — performance, security, job management, storage, database discovery — as a starting point, but what actually runs against a given system is whatever a team has reviewed, enabled, and pointed at real credentials. "Possible with this pattern" and "already enabled on your server" are two different claims, and it's worth keeping them separate when evaluating a rollout.

## Why predefined tools are the safer default

The most important design decision in this whole architecture isn't a feature — it's a restraint. The server's tools bind to *specific, predefined* SQL statements with *constrained* parameters, rather than exposing something closer to "let the model write and run arbitrary SQL." That restraint is what keeps the blast radius of a bad tool call, a prompt injection attempt, or an overly confident agent small and predictable.

[[FIGURE:security-boundary]]

It's worth being direct about what this does *not* guarantee. Predefined tools are not automatically secure just because they're predefined. A tool that's too broadly scoped, a connection profile with more authority than the tool actually needs, credentials sitting in the wrong place, or a network path with no TLS can all undermine the model's safety even with every SQL statement fixed in advance. The pattern removes one entire category of risk — open-ended query scope — and leaves the rest to normal, familiar IBM i security discipline: object authorities, profile design, network configuration, and logging.

## Security and governance in practice

A short, concrete list of what "taking this seriously" looks like in practice:

- **Start read-only.** The first tools a team enables should read information, not change it.
- **Treat arbitrary SQL execution as an exception, not a default.** If a use case genuinely needs it, it deserves its own review and its own tightly scoped profile — not blanket access alongside read-only tools.
- **Use least-privilege connection profiles.** The profile Mapepire connects with should be scoped to what the enabled tools actually need, the same discipline you'd apply to any service account.
- **Separate developer and admin toolsets.** A toolset meant for exploring object dependencies doesn't need to sit in the same catalog as one that touches job management.
- **Log and review usage.** Predefined tools are inherently more auditable than free-form SQL — take advantage of that by actually looking at the logs.
- **Don't casually expose production data.** A tool that's fine against a test partition's sample schema is not automatically fine pointed at production.
- **Treat this as a system integration surface, not a chatbot feature.** The same change-control instincts that apply to any new interface into IBM i apply here — because that's what this is.

## A practical adoption path

None of this needs to be an all-at-once decision. The realistic path is incremental, and a team can comfortably stop at an early stage indefinitely if that's all a given system needs.

[[FIGURE:adoption-path]]

Production write operations are deliberately not the starting point in this sequence. By the time a team is ready for Stage 4, they've already built the logging, review habits, and toolset discipline that make expanding scope a reasoned decision instead of a leap of faith.

## Where this leaves IBM i expertise

It's worth ending on the thing this technology doesn't change, because that's the part most likely to get overstated in any AI-adjacent announcement.

MCP does not replace IBM i expertise. It doesn't remove the need to understand SQL, object authorities, or how a subsystem actually behaves under load — if anything, someone still has to have that understanding to write the SQL statement a tool is bound to, and to judge whether the profile connecting to Mapepire has the right scope. Natural language is an interface here, not an authority model; the security decisions still happen at the IBM i layer, exactly where they always have.

An AI-generated summary of a tool's output is a starting point for a decision, not the decision itself — the same way a script's output was never a substitute for the person who wrote and reviewed the script. The strongest starting point for any team evaluating this is read-only, curated, auditable access, expanded deliberately as trust in the pattern — and in a specific team's discipline around it — is earned.

The real, durable opportunity isn't that AI "understands" IBM i. It's that the distance between *having a question about your system* and *getting a trustworthy answer from it* keeps shrinking — and that IBM i, despite its reputation in some circles as a closed platform, already had the SQL-queryable foundation this kind of interface needed. MCP is a front door. The building was already there.

---

### Sources and further reading

The technical claims in this article were verified against IBM's own repository and official documentation, which are the primary sources below. A community overview of the same project is also listed as a secondary reference.

- [IBM/ibmi-mcp-server on GitHub](https://github.com/IBM/ibmi-mcp-server) — the official IBM i MCP Server and `ibmi` CLI source, including the `tools/` directory's ready-made YAML tool collections
- [Mapepire](https://mapepire-ibmi.github.io/) — documentation for the WebSocket SQL gateway the MCP server connects through
- [Model Context Protocol specification](https://modelcontextprotocol.io/) — the open protocol itself, independent of any IBM i implementation
- ["IBM i MCP Server: Talk to IBM i in Plain English"](https://sbm-tech.hashnode.dev/ibm-i-mcp-server) by Sangamesh SBM — a secondary community overview of the same project, consulted alongside the primary sources above

Available features, package names, and configuration details evolve; verify current specifics against the official repository and documentation before implementing.
