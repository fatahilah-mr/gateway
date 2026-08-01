---
title: "FATAH | Gateway Link Hub & Personal Portal"
description: "An ultra-fast, responsive, and elegant independent personal link portal and portfolio hub, powered by React 18, Vite, GSAP 3D motion, MUI Material Icons, and Sveltia Headless CMS."
status: "active"
techStack:
  - React 18
  - Vite
  - GSAP 3
  - MUI Material Icons
  - Sveltia CMS
  - Cloudflare Pages
  - CSS3 Glassmorphism
startDate: "2026-07-23"
repoUrl: "https://github.com/fatahilah-mr/gateway"
demoUrl: "https://fatah.web.id"
heroImage: "/uploads/gateway-hero.png"
featured: true
references:
  - title: "Sveltia CMS Documentation"
    url: "https://sveltiacms.dev"
  - title: "GSAP Documentation & Easing Guide"
    url: "https://gsap.com/docs/v3/"
  - title: "MUI Material Icons Library"
    url: "https://mui.com/material-ui/material-icons/"
  - title: "Cloudflare Pages & Functions Docs"
    url: "https://developers.cloudflare.com/pages/"
---

## 📌 1. Problem

Popular link aggregator platforms such as Linktree or Lnk.bio impose several fundamental limitations for a web developer and network engineer:
- **Design & Customization Constraints:** Default templates feel rigid, generic, and fail to reflect a high-standard personal brand identity.
- **Subscription Fees:** Essential capabilities such as detailed analytics, custom domain mapping, custom icon choices, and removing third-party branding require monthly subscriptions.
- **Performance & Vendor Lock-in Issues:** Hosted third-party platforms often load slowly on mobile devices over low-bandwidth connections and are susceptible to downtime or unannounced service policy changes.
- **Need for Zero-Code Content Management:** On the other hand, building a pure static HTML portal requires manual code editing (*hardcoding*) and full redeployments for simple link or text updates, which is inconvenient when managing links from a mobile device.

---

## 👤 2. Target User

1. **Recruiters & Potential Clients:** Access work history, interactive portfolio projects, and professional resume instantly in one click.
2. **Peers & Developer Community:** Reach GitHub repositories, tech blog posts (`fatahmr.my.id`), and professional social networks (LinkedIn, Threads, X/Twitter).
3. **Project Owner (Fatahilah Miftahul Rahman):** Manage, edit, add, or remove links and bilingual content independently without touching code through a mobile-friendly CMS interface.

---

## 💡 3. Solution

Built **FATAH Gateway**, a high-performance Single Page Application (SPA) that combines modern aesthetics with serverless edge infrastructure:
- **Free & Ultra-Fast Edge Infrastructure:** Hosted on Cloudflare Pages global Edge Network backed by serverless *Cloudflare Functions* for OAuth authentication.
- **Git-Based Headless CMS:** Integrated **Sveltia CMS** connected directly to the GitHub repository. Every content edit in the CMS triggers an automatic Git commit and Cloudflare Pages deployment.
- **Glassmorphism Design & 3D Micro-Animations:** Uses custom CSS combined with GSAP to create smooth entrance animations, interactive 3D tilt responses on hover, and elastic click feedback.
- **Native Dual Language & Dual Theme:** Real-time language switching (Indonesian 🇮🇩 & English 🇬🇧) and dark/light modes that automatically synchronize with the user's OS system preferences.

---

## ⭐ 4. Key Features

- **Zero-Code Content Management (Sveltia CMS Panel):** Manage link order, icons, titles, bilingual descriptions, and header/footer text instantly via `/admin/`.
- **GSAP 3D Interactive Cards:** Each link card features 3D physics responding to cursor movements and touch gestures with smooth transform perspective easing.
- **MUI Material Icons Integration:** Centralized icon mapping using Google Material Design icons with 30+ popular choices (including official brand icons like GitHub, LinkedIn, WhatsApp, YouTube, Instagram, Telegram, Threads, etc.).
- **Serverless GitHub OAuth Infrastructure:** Fast, secure CMS authentication powered by Cloudflare Pages Functions (`/api/auth`) without relying on slow external backend services.
- **Dynamic System Theme & Language Sync:** Instant real-time language and theme switching without page reloads, accompanied by an elegant animated loading overlay.
- **Complete SEO & Canonical Enforcement:** Resolves Google Search Console duplicate page issues via canonical tag enforcement across HTML head, React state, HTTP Response Headers, and Cloudflare 301 Redirect Rules (`_redirects`).

---

## 🧱 5. Challenges & Lessons Learned

- **Challenge 1: Blank Screen & Bundler Compatibility Issues in Decap CMS**
  - *Issue:* The initial Decap CMS implementation suffered from blank white screen errors in production due to module bundling conflicts and router hash mismatches on Cloudflare Pages.
  - *Solution:* Fully migrated to **Sveltia CMS**, a lightweight, modern alternative fully compatible with the existing `config.yml` schema, featuring clear error boundaries and significantly faster startup times.

- **Challenge 2: Bundle Size & Module Bloat from Unused Icon Libraries**
  - *Issue:* Importing icon libraries naively inflated the production bundle to over 1,700 JavaScript modules.
  - *Solution:* Migrated to `@mui/icons-material` with a centralized module mapper (`src/data/iconMap.js`). This reduced the bundle size down to **315 modules** (~109 KB gzip JS) and cut build time to ~10 seconds.

- **Challenge 3: "Duplicate Without User-Selected Canonical" Errors in Google Search Console**
  - *Issue:* Migrating the main domain from `links.fatahmr.my.id` to `fatah.web.id` caused Googlebot to detect duplicate URL variations (HTTP/HTTPS, WWW/Non-WWW, and query parameters).
  - *Solution:* Implemented a triple-layer canonical enforcement architecture:
    1. Injected `<link rel="canonical" href="https://fatah.web.id/" />` centrally in `index.html` and `SEOHead.jsx`.
    2. Added HTTP Header `Link: <https://fatah.web.id/>; rel="canonical"` in `public/_headers`.
    3. Configured 301 Permanent Redirects in `public/_redirects`.

---

## 📈 6. Impact

- **Before:** Dependent on third-party aggregators with limited customization, or manual code edits for simple link updates.
- **After:**
  - **Loading Speed:** Achieved Lighthouse score 95+ on mobile with smooth 60 FPS animations.
  - **Cost Efficiency:** 100% free hosting with enterprise-grade reliability on Cloudflare's Edge Network.
  - **Zero-Code Management:** Add or edit link cards in under 1 minute directly from a smartphone via `/admin`.
  - **Consolidated SEO & Identity:** Fully indexed by search engines under the clean custom domain `fatah.web.id`.

---

## 🛠️ Tech Choices

- **React 18 & Vite:** Selected for component architecture maturity, fast Hot Module Replacement (HMR), and Vite's tree-shaking bundler.
- **GSAP (GreenSock Animation Platform) 3:** Chosen over standard CSS animations for precise timeline control, high GPU performance without jank, and flexible 3D/easing modules.
- **Sveltia CMS:** Selected as the Git-based Headless CMS for its serverless architecture, speed, and intuitive YAML configuration format.
- **MUI Material Icons (`@mui/icons-material`):** Replaced manual SVGs to ensure consistent Google Material Design aesthetics, thousands of icons, and easy prop/CSS styling.
- **Cloudflare Pages & Functions:** Chosen for global CDN distribution, free SSL certificates, and serverless JavaScript execution for OAuth handling.

---

## 🖼️ Screenshots & Visual Demo

![Main Gateway Interface](/uploads/gateway-hero.png)
*Figure 1: Main FATAH Gateway interface showcasing interactive link cards with dark/light theme toggle and dual-language support.*

![Sveltia CMS Admin Panel](/uploads/gateway-admin.png)
*Figure 2: Sveltia CMS dashboard (/admin/) for zero-code link management and content configuration.*
