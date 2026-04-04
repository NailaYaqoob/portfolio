# CLAUDE.md — Portfolio Project

## About the Owner

**Name:** Naila Yaqoob  
**Role:** Spec-Driven Software Development / Agentic AI Engineer  
**Location:** Karachi, Sindh, Pakistan  
**Email:** nailayaqoob86@gmail.com  
**LinkedIn:** https://www.linkedin.com/in/naila-yaqoob-89a185205/  
**GitHub:** https://github.com/NailaYaqoob  

**Background:** 11+ years as a Chemistry Teacher (career transitioning into AI/software development).  
**Approach:** Passionate about building real-world, business-focused AI solutions — not generic demos.

---

## Project Overview

A **freelance portfolio website** for Naila Yaqoob, positioning her as an AI Developer & Automation Specialist available for hire. The site is business-outcome focused, targeting SMBs who need AI chatbots, automation agents, and RAG systems.

**Live deployment:** Render (FastAPI serves static files + contact form API)

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Vanilla HTML/CSS/JS (no framework)              |
| Backend   | FastAPI (Python)                                |
| Fonts     | Inter + JetBrains Mono (Google Fonts)           |
| Deployment| Render                                          |
| Email     | Gmail SMTP via Python `smtplib`                 |

### Key Files
- `index.html` — full portfolio page (all sections in one file)
- `style.css` — all styles (dark theme, CSS custom properties)
- `script.js` — navbar scroll, typing effect, fade-in observer, counter animation
- `main.py` — FastAPI app: serves static files + `/api/contact` POST endpoint
- `requirements.txt` — Python dependencies for Render
- `.env` — `SMTP_USER`, `SMTP_PASS`, `RECEIVER_EMAIL` (never commit this)

---

## Design System

| Token          | Value                                     |
|----------------|-------------------------------------------|
| Background     | `#0a0a0f` / `#0f0f1a` / `#12121f`        |
| Primary color  | Purple `#7c3aed` / `#9d5ff5`             |
| Accent color   | Cyan `#06b6d4` / `#22d3ee`               |
| Gradient       | `linear-gradient(135deg, #7c3aed, #06b6d4)` |
| Font           | Inter (body), JetBrains Mono (code tags)  |
| Border radius  | 16px (cards), 10px (sm), 24px (lg)        |

---

## Site Sections

1. **Navbar** — sticky, scrolls to section anchors, mobile hamburger menu
2. **Hero** — typing animation cycling through: AI Chatbots, Automation Agents, RAG Systems, AI Employees, Intelligent Tools
3. **About** — stats (10+ yrs experience, 8+ AI projects, 12+ tech skills), skill tags
4. **Services** — 6 cards: AI Chatbot, RAG Document Assistant, AI Business Automation Agent, AI Employee, Fullstack AI Web App, Custom GPT Development
5. **Projects** — case studies (featured: AI Employee project)
6. **Why Me** — differentiators (teaching background → clear communication)
7. **Contact** — form POSTs to `/api/contact`, emails via Gmail SMTP

---

## Skills Displayed in Portfolio

Python, TypeScript, FastAPI, PostgreSQL, Docker, OpenAI SDK, CrewAI, RAG, Chainlit, Custom GPTs

---

## Environment Variables (`.env`)

```
SMTP_USER=<gmail address>
SMTP_PASS=<gmail app password>
RECEIVER_EMAIL=<destination email>
```

---

## Development Notes

- No build step — plain HTML/CSS/JS, edit files directly
- FastAPI serves `index.html` as static mount at `/`; contact form at `/api/contact`
- `portfolio/` subdirectory is a git-tracked mirror/copy — treat `E:\portfolio\` root as the source of truth
- Python version pinned in `.python-version`
- CORS is restricted to `https://naila-portfolio.onrender.com` (production domain)
