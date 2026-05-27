# Zero Agent - FREE AI Router & Token Saver

**Never stop coding. Save 20-40% tokens with RTK + auto-fallback to FREE & cheap AI models.**

**Connect All AI Code Tools (Claude Code, Cursor, Antigravity, Copilot, Codex, Gemini, OpenCode, Cline, OpenClaw...) to 40+ AI Providers & 100+ Models.**

[![npm](https://img.shields.io/npm/v/@zcus/zero-agent.svg)](https://www.npmjs.com/package/@zcus/zero-agent)
[![Downloads](https://img.shields.io/npm/dm/@zcus/zero-agent.svg)](https://www.npmjs.com/package/@zcus/zero-agent)
[![Docker Pulls](https://img.shields.io/docker/pulls/zcus/zero-agent.svg?logo=docker&label=Docker%20pulls)](https://github.com/zcuss/Zero-Agent)
[![GHCR](https://img.shields.io/badge/GHCR-zcuss%2FZero-Agent-blue?logo=github)](https://github.com/zcuss/Zero-Agent/pkgs/container/zero-agent)
[![License](https://img.shields.io/npm/l/@zcus/zero-agent.svg)](https://github.com/zcuss/Zero-Agent/blob/main/LICENSE)

<a href="https://trendshift.io/repositories/22628" target="_blank"><img src="https://trendshift.io/api/badge/repositories/22628" alt="zcuss%2FZero-Agent | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

[🌐 Website](https://github.com/zcuss/Zero-Agent) • [📖 Full Docs](https://github.com/zcuss/Zero-Agent)

---

## 🤔 Why Zero Agent?

**Stop wasting money, tokens and hitting limits:**

- ❌ Subscription quota expires unused every month
- ❌ Rate limits stop you mid-coding
- ❌ Tool outputs (git diff, grep, ls...) burn tokens fast
- ❌ Expensive APIs ($20-50/month per provider)

**Zero Agent solves this:**

- ✅ **RTK Token Saver** - Auto-compress tool_result, save 20-40% tokens
- ✅ **Maximize subscriptions** - Track quota, use every bit before reset
- ✅ **Auto fallback** - Subscription → Cheap → Free, zero downtime
- ✅ **Multi-account** - Round-robin between accounts per provider
- ✅ **Universal** - Works with any OpenAI/Claude-compatible CLI

---

## ⚡ Quick Start

**Option 1 — npm (recommended for desktop):**

```bash
npm install -g @zcus/zero-agent
zero

# Or run directly with npx
npx @zcus/zero-agent
```

**Option 2 — Docker (server/VPS):**

```bash
docker run -d --name Zero Agent -p 20130:20130 \
  -v "$HOME/.zero-agent:/app/data" -e DATA_DIR=/app/data \
  zcus/zero-agent:latest
```

Published images: [GitHub Repo](https://github.com/zcuss/Zero-Agent) • [GHCR](https://github.com/zcuss/Zero-Agent/pkgs/container/zero-agent) (multi-platform amd64/arm64).

🎉 Dashboard opens at `http://localhost:20130`

**2. Connect a FREE provider (no signup needed):**

Dashboard → Providers → Connect **Kiro AI** (free Claude unlimited) or **OpenCode Free** (no auth) → Done!

**3. Use in your CLI tool:**

```
Claude Code/Codex/OpenClaw/Cursor/Cline Settings:
  Endpoint: http://localhost:20130/v1
  API Key:  [copy from dashboard]
  Model:    kr/claude-sonnet-4.5
```

That's it! Start coding with FREE AI models.

---

## 🚀 CLI Options

```bash
zero                          # Start with default settings
zero --port 8080        # Custom port
zero --no-browser       # Don't open browser
zero --skip-update      # Skip auto-update check
zero --help             # Show all options
```

**Dashboard**: `http://localhost:20130/dashboard`

---

## 🛠️ Supported CLI Tools

Claude-Code • OpenClaw • Codex • OpenCode • Cursor • Antigravity • Cline • Continue • Droid • Roo • Copilot • Kilo Code • Gemini CLI • Qwen Code • iFlow • Crush • Crusher • Aider

Any tool supporting OpenAI/Claude-compatible API works.

---

## 💾 Data Location

- **macOS/Linux**: `~/.zero-agent/db/data.sqlite`
- **Windows**: `%APPDATA%/zero-agent/db/data.sqlite`
- **Docker**: `/app/data/db/data.sqlite` (mount `$HOME/.zero-agent` to persist)

---

## 📚 Documentation

Full docs, advanced setup, video tutorials & development guide:

- **GitHub**: https://github.com/zcuss/Zero-Agent
- **Full README**: https://github.com/zcuss/Zero-Agent/blob/main/app/README.md
- **Website**: https://github.com/zcuss/Zero-Agent

---

## 🙏 Acknowledgments

- **[CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI)** - Original Go implementation

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
