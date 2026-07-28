<div align="center">
  <br/>
  <h1 align="center" style="font-size:2.8rem;font-weight:700;background:linear-gradient(135deg,#FFD700,#FF1493);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">AI World Hub</h1>

  <p align="center"><strong>16 Free In-Browser Tools to Build, Format, Debug &amp; Optimize Your AI Prompts</strong></p>

  <p align="center">
    <a href="https://aiworldhub.site" target="_blank">🌐 Live Website</a> •
    <a href="https://aiworldhub.site/tools" target="_blank">🛠️ Tools</a> •
    <a href="https://aiworldhub.site/prompts" target="_blank">📝 Prompt Library</a> •
    <a href="https://aiworldhub.site/playground" target="_blank">🎮 Playground</a> •
    <a href="https://aiworldhub.site/blog" target="_blank">📚 Blog</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/github/license/toolkitaiprompt-ui/AI-Prompt-Toolkit?color=gold" alt="License"/>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19"/>
    <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss" alt="Tailwind 4"/>
    <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite" alt="Vite 7"/>
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare" alt="Cloudflare Pages"/>
    <img src="https://img.shields.io/badge/status-active-success" alt="Active"/>
  </p>
</div>

---

## 📖 Purpose

AI World Hub is a **free, privacy-first, in-browser toolkit** for anyone who works with AI prompts. Every tool runs 100% in your browser — zero data leaves your device, zero sign-up required, zero cost forever.

**Who is this for?**
Anyone using AI tools — students, developers, marketers, writers, and teams. If you write prompts for ChatGPT, Claude, Gemini, or any other model, these tools help you get better results faster.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔧 **16 Free AI Tools** | Variable Extractor, JSON Schema Generator, JSON Validator, Token Estimator, Prompt Formatter, Cleaner, Converter, Persona Builder, Optimizer, Comparison Tool, Mega Prompt Builder, Prompt Debugger, Security Scanner, Prompt Chain Builder, Prompt Translator, API Request Builder |
| 🎮 **AI Prompt Playground** | Interactive playground with blog, code, and email templates, live token estimation, and prompt health scoring |
| 📝 **Prompt Library** | 225+ ready-to-use prompts across 15 roles (ChatGPT, Content Writer, Developer, Marketer, SEO Specialist, and more) |
| 📋 **Changelog** | Version history tracking all tool updates and new features |
| 📚 **Blog** | 50+ SEO-optimized prompt engineering guides |
| 🔒 **100% Private** | All processing in-browser. Prompts never leave your device |
| ⚡ **Fast** | Built with Vite 7 + React 19. Deployed globally on Cloudflare Pages |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

### 🔧 All 16 Tools

| # | Tool | What It Does |
|---|------|-------------|
| 1 | **Prompt Variable Extractor** | Extract variables (`{name}`, `{{city}}`, `[tone]`) from any prompt |
| 2 | **JSON Schema Generator** | Generate JSON Schema from sample data |
| 3 | **JSON Validator** | Validate JSON against a schema |
| 4 | **Prompt Formatter** | Format messy prompts into clean numbered instructions |
| 5 | **Prompt Cleaner** | Remove noise characters and fix spacing |
| 6 | **Token Estimator** | Estimate tokens, words, and characters before API calls |
| 7 | **Prompt Converter** | Convert prompts between ChatGPT, Claude, Gemini, and Cursor formats |
| 8 | **AI Persona Builder** | Generate system prompts for specific roles |
| 9 | **Advanced Prompt Optimizer** | Polish prompts with role, format, tone & constraint patterns |
| 10 | **Prompt Comparison Tool** | Compare two prompts side-by-side with scores |
| 11 | **Mega Prompt Builder** | Build structured mega prompts with an 8-step wizard (role, task, context, audience, format, tone, constraints, examples) |
| 12 | **Prompt Debugger** | Diagnose AI prompts with a health score (0-100), 12+ issue detectors, and auto-fix suggestions |
| 13 | **Prompt Security Scanner** | Scan prompts for injection attacks, jailbreaks, PII leaks, and security threats with risk scoring |
| 14 | **Prompt Chain Builder** | Chain up to 5 sequential prompt steps with different output formats and Markdown export |
| 15 | **Prompt Translator** | Translate prompts into 8 languages (Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic) while preserving variables |
| 16 | **API Request Builder** | Build API requests for OpenAI, Anthropic, and Gemini with cURL export |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Tailwind CSS 4** | Styling & Design System |
| **Vite 7** | Build Tool & Dev Server |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |
| **React Router 7** | Client-Side Routing |
| **Cloudflare Pages** | Hosting, CDN & Global Deploy |

---

## 🚀 Setup & Development

### Prerequisites
- Node.js 20+
- npm 10+

### Local Setup
```bash
# Clone the repository
git clone https://github.com/toolkitaiprompt-ui/AI-Prompt-Toolkit.git
cd AI-Prompt-Toolkit/artifacts/ai-prompt-toolkit

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The dev server starts at `http://localhost:5173`.

### Production Build
```bash
npm run build
# Output: dist/public/
# Prerenders 87 HTML pages with unique SEO tags + hreflang
```

---

## 🚢 Deployment

This project is deployed on **Cloudflare Pages** (free tier).

### Deploy via Cloudflare Dashboard
1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist/public`
4. Set environment variable: `NODE_VERSION=20`

### Deploy via Wrangler CLI
```bash
npm install -g wrangler
wrangler pages deploy dist/public --branch=production
```

### Manual Deploy (from this repo)
```bash
npm run build
# Push to GitHub → Cloudflare auto-deploys from main/production branch
```

---

## 📁 Project Structure

```
artifacts/ai-prompt-toolkit/
├── src/
│   ├── components/        # React components
│   │   ├── HomePage.tsx   # Homepage with sections
│   │   ├── ToolCard.tsx   # Tool card with glass styling
│   │   ├── BlogCard.tsx   # Blog article card
│   │   ├── MegaPromptBuilder.tsx
│   │   ├── PromptDebugger.tsx
│   │   ├── SecurityScanner.tsx
│   │   ├── PromptChainBuilder.tsx
│   │   ├── PromptTranslator.tsx
│   │   ├── ApiRequestBuilder.tsx
│   │   └── ... (PromptOptimizer, PersonaBuilder, etc.)
│   ├── pages/             # Route-level pages
│   ├── data/              # Static content data
│   │   ├── blogPosts.ts   # 50+ blog articles
│   │   ├── templates.ts   # Prompt templates
│   │   └── categories.ts  # Categories
│   ├── lib/
│   │   └── toolkit.ts     # Core tool logic (pure JS)
│   ├── App.tsx            # Routes, Layout, Navbar, Footer
│   ├── index.css          # Design system & global CSS
│   └── seoConfig.ts       # Per-route SEO metadata
├── public/
│   ├── images/            # Blog & hero images
│   ├── icons/             # Brand SVGs (Google, OpenAI, etc.)
│   ├── robots.txt
│   ├── sitemap.xml        # 60+ URLs
│   └── favicon.svg
├── prerender.mjs          # Static prerender script (87 pages)
├── index.html             # Entry point
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to help:

### Bug Reports & Feature Requests
- Open a [GitHub Issue](https://github.com/toolkitaiprompt-ui/AI-Prompt-Toolkit/issues)
- Describe the problem/feature clearly
- Include screenshots if applicable

### Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Ensure the build passes: `npm run build`
5. Submit a PR against the `production-replit` branch

### Code Style
- TypeScript strict mode
- Tailwind CSS for styling
- Framer Motion for animations where appropriate
- Ensure 0 build errors before submitting

---

## 📋 Changelog

### v3.0.0 — 2026-07-28 — `production-replit`
- **6 New Tools Added**: Mega Prompt Builder, Prompt Debugger, Security Scanner, Prompt Chain Builder, Prompt Translator, API Request Builder
- **Tool count**: Expanded from 10 to 16 tools
- **New Pages**: AI Prompt Playground (interactive testing), Prompt Library (225+ prompts across 15 roles), Changelog page
- **Navigation**: Updated to Home, Playground, Tools, Prompts, Blog, About
- **SEO**: Added JSON-LD structured data for all 16 tools (ItemList schema), high-search AI prompting keywords
- **Prerendering**: Expanded to 87 prerendered pages
- **Prompt Library**: 225+ role-based prompts for ChatGPT, developers, marketers, SEO specialists, and more

### 2026-07-25 — `production-replit`
- **Branding**: Unified "AI World Hub" across all pages, SEO, structured data
- **Navigation**: Simplified to 4 core links; secondary pages under "More"
- **Value proposition**: Sharper heading, benefits visible in 3 seconds
- **FAQ**: Expanded to 6 questions with clear privacy/data handling answers
- **Mobile**: Better spacing, smaller fonts, responsive cards
- **Categories page**: Glass cards matching homepage design
- **Templates page**: Amber design system, glass cards
- **Image Generator**: Cyan→Amber color system migration
- **Global layout**: Added overflow safeguards, text wrapping, min-width fixes
- **Hero**: Smooth-scroll "Watch Demo" button, cleaner mobile background
- **Colors**: Removed all remaining cyan accents from public UI
- **Typography**: Responsive heading sizes, consistent scales
- **Tool cards**: Equal height, glass styling, subtle hover effects

### 2026-07-20 — Initial redesign
- Dark Glass Premium design system (amber/gold/pink accents)
- Glass pill navbar, premium cards, consistent spacing
- Hero image, featured/trending sections, blog cards
- Global search modal, SEO optimization, structured data

### 2026-07-15 — Launch
- 16 tools, templates, categories, blog
- Vite 7 + React 19 + Tailwind 4 setup
- Cloudflare Pages deployment

---

## 🌐 Live Website

**👉 [https://aiworldhub.site](https://aiworldhub.site)**

---

## 📄 License

MIT — Free for personal and commercial use. See [LICENSE](./LICENSE).

---

<div align="center">
  <sub>Built with ❤️ for the AI community</sub>
</div>
