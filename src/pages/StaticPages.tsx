import SectionShell from "../components/SectionShell";

export function AboutPage() {
  return (
    <SectionShell
      title="About AI World Hub"
      description="Learn about AI World Hub — free in-browser tools for prompt engineering teams worldwide."
      keywords="About AI World Hub, Best AI Tools, Free AI Tools, Prompt Engineering"
    >
      <div className="max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">About Us</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Build Reliable AI Prompts, Faster & Smarter</h1>
          <p className="text-lg text-slate-400">
            AI World Hub is a free, browser-based platform offering professional prompt engineering tools for teams and individuals worldwide.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <p className="text-3xl font-bold text-white">19</p>
            <p className="mt-1 text-sm text-slate-400">Free Tools</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <p className="text-3xl font-bold text-white">25+</p>
            <p className="mt-1 text-sm text-slate-400">Blog Guides</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <p className="text-3xl font-bold text-white">100%</p>
            <p className="mt-1 text-sm text-slate-400">In-Browser</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
          <p className="text-slate-300">
            We believe that great AI output starts with great prompts. Our mission is to make professional prompt engineering accessible to everyone — developers, marketers, support teams, and AI enthusiasts. No sign-ups, no server round-trips, no data collection. Every tool runs entirely in your browser.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">What We Offer</h2>
          <ul className="ml-6 list-disc space-y-2 text-slate-300">
            <li><strong className="text-white">Prompt Variable Extractor</strong> — Extract placeholders from any prompt template.</li>
            <li><strong className="text-white">JSON Schema Generator</strong> — Create structured schemas for reliable AI output.</li>
            <li><strong className="text-white">JSON Validator</strong> — Validate model responses against your schema.</li>
            <li><strong className="text-white">Prompt Formatter</strong> — Turn messy notes into clean, numbered instructions.</li>
            <li><strong className="text-white">Prompt Cleaner</strong> — Remove noise characters and fix formatting.</li>
            <li><strong className="text-white">Token Estimator</strong> — Project token usage and costs before API calls.</li>
            <li><strong className="text-white">Prompt Converter</strong> — Convert ChatGPT prompts to Claude, Gemini, or Cursor format.</li>
            <li><strong className="text-white">AI Persona Builder</strong> — Generate expert system prompts for any role.</li>
            <li><strong className="text-white">Advanced Prompt Optimizer</strong> — Polish prompts for clarity and effectiveness.</li>
            <li><strong className="text-white">Prompt Comparison Tool</strong> — Compare prompts side-by-side with detailed metrics.</li>
            <li><strong className="text-white">Mega Prompt Builder</strong> — Build structured mega prompts with an 8-step wizard.</li>
            <li><strong className="text-white">Prompt Debugger</strong> — Diagnose prompts with a health score and 12+ issue detectors.</li>
            <li><strong className="text-white">Prompt Security Scanner</strong> — Scan prompts for injection attacks and PII leaks.</li>
            <li><strong className="text-white">Prompt Chain Builder</strong> — Chain up to 5 sequential prompt steps with output formats.</li>
            <li><strong className="text-white">Prompt Translator</strong> — Translate prompts into 8 languages while preserving variables.</li>
            <li><strong className="text-white">API Request Builder</strong> — Build API requests for OpenAI, Anthropic, and Gemini with cURL export.</li>
            <li><strong className="text-white">AI Image Prompt Generator</strong> — Generate image prompts for DALL-E, Midjourney, and Stable Diffusion.</li>
            <li><strong className="text-white">AI Content Summarizer</strong> — Summarize long articles and reports into TL;DR, bullets, or abstracts.</li>
            <li><strong className="text-white">AI Regex Generator</strong> — Turn plain English descriptions into tested regex patterns.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Privacy First</h2>
          <p className="text-slate-300">
            Unlike many online tools, AI World Hub processes everything locally in your browser. Your prompts, data, and text never leave your device. We do not store, collect, or share your inputs with any server.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Who We Serve</h2>
          <p className="text-slate-300">
            Our tools are used by prompt engineering teams, AI developers, content creators, marketers, and enterprises across the globe. Whether you are building production AI workflows or experimenting with your first prompt, AI World Hub is designed to help you work faster and smarter.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
          <h2 className="text-xl font-semibold text-white">Contact Us</h2>
          <p className="mt-3 text-slate-400">
            Questions, feedback, or partnership inquiries? Email us at{" "}
            <a href="mailto:toolkitaiprompt@gmail.com" className="text-cyan-400 hover:underline">toolkitaiprompt@gmail.com</a>
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

export function ChangelogPage() {
  const changelog: { version: string; date: string; changes: { type: string; text: string }[] }[] = [
    {
      version: "3.1.0",
      date: "August 2026",
      changes: [
        { type: "New", text: "Added 3 new tools: AI Image Prompt Generator, AI Content Summarizer, and AI Regex Generator — bringing the total to 19 tools." },
        { type: "Improved", text: "Fixed broken structured data (ItemList, FAQ, SoftwareApplication) so search engines can index all 19 tools correctly." },
        { type: "Improved", text: "Updated tool counts across the site, JSON-LD, sitemap metadata, and llms.txt for consistent SEO." },
        { type: "Fixed", text: "Removed visible ad placeholder boxes until real ad zones are configured." },
        { type: "Fixed", text: "Homepage demo now shows honest per-tool output with real token statistics." },
        { type: "Fixed", text: "Search now covers the prompt templates library." },
      ],
    },
    {
      version: "3.0.0",
      date: "January 2026",
      changes: [
        { type: "New", text: "Added 6 new tools: Mega Prompt Builder, Prompt Debugger, Security Scanner, Prompt Chain Builder, Prompt Translator, and API Request Builder — bringing the total to 16 tools." },
        { type: "New", text: "Launched the AI Prompt Library with 225+ prompts across 15 professional roles." },
        { type: "New", text: "Added the interactive Prompt Playground for generating and testing blog, code, and email prompt templates with live token estimation and health scoring." },
        { type: "New", text: "Added Prompt Translator supporting 8 languages (Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic)." },
        { type: "Improved", text: "Updated navigation to include Playground, Prompts, and Tools sections for easier access." },
        { type: "Improved", text: "Enhanced SEO with high-search AI prompting keywords and structured data for all 16 tools." },
        { type: "Improved", text: "Added llms.txt for AI agent discovery and structured data optimization." },
      ],
    },
    {
      version: "2.1.0",
      date: "December 2025",
      changes: [
        { type: "New", text: "Added Prompt Comparison Tool with side-by-side diff highlighting and readability scoring." },
        { type: "New", text: "Added AI Persona Builder for generating expert system prompts for different roles." },
        { type: "Improved", text: "Enhanced mobile responsiveness across all pages and tools." },
        { type: "Improved", text: "Optimized bundle size for faster load times on mobile devices." },
      ],
    },
    {
      version: "2.0.0",
      date: "November 2025",
      changes: [
        { type: "New", text: "Added Advanced Prompt Optimizer with role, format, tone, and constraint patterns." },
        { type: "New", text: "Added Prompt Converter for ChatGPT to Claude, Gemini, and Cursor format conversion." },
        { type: "Improved", text: "Redesigned the entire UI with a modern dark theme and gold accent design." },
        { type: "Improved", text: "Added comprehensive blog section with prompt engineering guides and tutorials." },
      ],
    },
    {
      version: "1.0.0",
      date: "October 2025",
      changes: [
        { type: "New", text: "Launched AI World Hub with 9 in-browser prompt engineering tools." },
        { type: "New", text: "Tools include: Variable Extractor, JSON Schema Generator, JSON Validator, Prompt Formatter, Prompt Cleaner, Token Estimator, and more." },
        { type: "Core", text: "Privacy-first architecture — all processing happens in the browser, no data collection." },
      ],
    },
  ];

  const typeColors: Record<string, string> = {
    New: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    Improved: "border-blue-500/25 bg-blue-500/10 text-blue-300",
    Core: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  };

  return (
    <SectionShell
      title="Changelog — AI Prompt Toolkit Updates | AI World Hub"
      description="Track all updates and new features added to AI World Hub's AI prompt engineering toolkit. See version history, new tools, improvements, and bug fixes."
      keywords="AI Prompt Toolkit Changelog, Updates, New Features, Version History, AI Tools Updates"
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400/80">Version History</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Changelog</h1>
          <p className="max-w-2xl text-base sm:text-lg text-slate-400">
            Every update, new tool, and improvement to the AI World Hub toolkit — all in one place.
          </p>
        </div>

        <div className="space-y-8">
          {changelog.map((entry) => (
            <div key={entry.version} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <h2 className="text-lg font-semibold text-white">v{entry.version}</h2>
                <span className="text-sm text-slate-500">{entry.date}</span>
              </div>
              <ul className="mt-4 space-y-3">
                {entry.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeColors[change.type] || typeColors.New}`}>{change.type}</span>
                    <span className="text-sm leading-relaxed text-slate-300">{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function PrivacyPage() {
  return (
    <SectionShell
      title="Privacy Policy | AI World Hub"
      description="Privacy policy outlining data handling, cookie usage, advertising partners, and user rights for AI World Hub."
      keywords="Privacy Policy, Free AI Prompt Tools, Prompt Engineering"
    >
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: June 24, 2026</p>
      <div className="mt-6 max-w-4xl space-y-6 text-slate-300">
        <p>At AI World Hub, accessible from https://aiworldhub.site, the privacy of our visitors is one of our main priorities. This Privacy Policy document explains the types of information we collect and how we use, store, and protect it.</p>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Information We Collect</h2>
          <p>All tools on AI World Hub process data <strong>entirely within your browser</strong>. Text, prompts, and JSON data you enter into the tools are never sent to our servers, never stored, and never shared with third parties.</p>
          <p>We do collect anonymous usage data through third-party analytics services (described below) to understand how the website is used and to improve our tools.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Log Files</h2>
          <p>Like most websites, our hosting provider (Cloudflare) and analytics services automatically log standard information such as IP address, browser type, referring pages, timestamps, and pages visited. This data is used solely for analytics and security purposes and is not linked to personally identifiable information.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are small files that may include an anonymous unique identifier.</p>
          <p>Types of cookies we use:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li><strong>Essential cookies:</strong> Required for the website to function correctly.</li>
            <li><strong>Analytics cookies:</strong> Used by Google Analytics to understand visitor behavior.</li>
            <li><strong>Advertising cookies:</strong> Used by Monetag to display relevant ads.</li>
          </ul>
          <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent through your browser settings.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Monetag Advertising</h2>
          <p>We use Monetag to display advertisements. Monetag, as a third-party vendor, may use cookies to serve ads based on your prior visits to this and other websites.</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Monetag may use advertising cookies to serve ads to you based on your visit to our site and/or other sites on the Internet.</li>
            <li>You may opt out of personalized advertising by visiting <a href="https://www.monetag.com/privacy-policy/" className="text-cyan-400 hover:underline">Monetag Privacy Policy</a>.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Google Analytics</h2>
          <p>We use Google Analytics to collect and analyze visitor data. This service collects information such as how often users visit, what pages they view, and what other sites they used prior to coming to our website. This data is aggregated and anonymous.</p>
          <p>You can review Google's privacy policy at <a href="https://policies.google.com/privacy" className="text-cyan-400 hover:underline">https://policies.google.com/privacy</a>.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Cloudflare Analytics</h2>
          <p>We use Cloudflare Web Analytics, which is a privacy-friendly analytics solution that does not use cross-site tracking or fingerprinting. Cloudflare does not track individual visitors.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Third-Party Privacy Policies</h2>
          <p>Our Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information on their practices as well as for instructions about how to opt-out of certain options.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Children's Information</h2>
          <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. AI World Hub does not knowingly collect any Personal Identifiable Information from children under the age of 13.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Your Data Protection Rights</h2>
          <p>You have the right to:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Request access to your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent to data processing</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Contact Us</h2>
          <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:toolkitaiprompt@gmail.com" className="text-cyan-400 hover:underline">toolkitaiprompt@gmail.com</a>.</p>
        </div>
      </div>
    </SectionShell>
  );
}

export function TermsPage() {
  return (
    <SectionShell
      title="Terms of Service | AI World Hub"
      description="Terms and conditions for using AI World Hub tools and services."
      keywords="Terms of Service, Free AI Prompt Tools, Prompt Engineering"
    >
      <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: June 24, 2026</p>
      <div className="mt-6 max-w-4xl space-y-6 text-slate-300">
        <p>Welcome to AI World Hub. By accessing or using our website at https://aiworldhub.site, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.</p>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">1. Use of Our Services</h2>
          <p>AI World Hub provides free, browser-based tools for prompt engineering, including variable extraction, JSON schema generation, validation, formatting, cleaning, token estimation, and optimization. All tools are provided for personal and professional productivity purposes.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">2. Intellectual Property</h2>
          <p>All content, tools, design, and code on this website are the property of AI World Hub unless otherwise stated. You may not reproduce, distribute, or create derivative works without explicit written permission.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">3. No Warranty</h2>
          <p>The tools and content provided on this website are offered "as is" and "as available," without warranties of any kind, either express or implied. We do not guarantee that the tools will be error-free, accurate, or uninterrupted.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">4. Limitation of Liability</h2>
          <p>Under no circumstances shall AI World Hub be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, our tools and services.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">5. User Responsibility</h2>
          <p>Users are solely responsible for the content they process through our tools and for verifying the accuracy of any output before using it in production or business environments.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">6. Third-Party Services</h2>
          <p>Our website uses third-party services such as Google Analytics. We are not responsible for the practices or content of these third-party services. Please review their respective terms and policies.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">7. Changes to Terms</h2>
          <p>We reserve the right to update or modify these Terms of Service at any time without prior notice. Continued use of the website after changes constitutes acceptance of the new terms.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">8. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">9. Contact</h2>
          <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:toolkitaiprompt@gmail.com" className="text-cyan-400 hover:underline">toolkitaiprompt@gmail.com</a>.</p>
        </div>
      </div>
    </SectionShell>
  );
}

export function NotFoundPage() {
  return (
    <SectionShell title="Page Not Found" description="The requested page could not be found.">
      <h1 className="text-3xl font-bold text-white">404 — Page Not Found</h1>
      <p className="mt-3 text-slate-400">Use the navigation to return to the AI World Hub pages.</p>
    </SectionShell>
  );
}
