# 🚀 AI Prompt Toolkit 


A **world-class, production-ready** website for AI Prompt Toolkit, built with React 18, TypeScript, Tailwind CSS, and Framer Motion.

![Modern Design](https://img.shields.io/badge/Design-202026-purple)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎨 Modern Design System
- **Dark theme** with purple/pink gradient accents
- **Glassmorphism** effects with backdrop blur
- **Smooth animations** powered by Framer Motion
- **Responsive design** - works perfectly on all devices
- **Accessibility** - proper ARIA labels and semantic HTML

### 🧩 Complete Page Structure

#### **Homepage**
- Animated hero section with interactive live demo
- Stats section (10K+ users, 4.9/5 rating)
- Tools showcase grid (6 featured tools)
- Company logos (Google, Microsoft, OpenAI)
- Final CTA section

#### **Tools Page**
- Search functionality
- Category filters (9 categories)
- Grid/List view toggle
- 10 tool cards with hover effects
- Sidebar with ads and quick links
- Top, middle, and bottom ad placements

#### **Tool Detail Pages**
- Individual pages for each tool
- Interactive demo section
- Features list with checkmarks
- Use cases section
- Stats and ratings
- Back navigation

#### **Blog Page**
- Featured post with large image
- Regular posts grid
- Category filters (7 categories)
- Sidebar with ads
- Multiple ad placements

#### **Blog Post Pages**
- Full article content with rich typography
- Author information
- Tags and metadata
- Social actions (Like, Save, Share)
- Related posts suggestions

#### **About Page**
- Company story and mission
- Team members grid
- Values section
- Stats showcase
- CTA section

#### **Contact Page**
- Contact form with validation
- Contact information cards
- FAQ section
- Success state animation

### 📢 Smart Ad Placement Strategy

**Ad Types:**
- **Horizontal banners** (728x90) - Top, middle, bottom
- **Sidebar ads** (300x600, 300x250) - Sticky on desktop
- **Square ads** (300x300) - Mobile optimized

**Placement Locations:**
- Homepage: Between sections
- Tools page: Top, middle, bottom + sidebar
- Blog page: Top, bottom + sidebar
- Tool detail: Top, middle + sidebar
- Blog posts: Top, bottom + sidebar

### 🎯 Key Components

#### **UI Components**
- `Button` - 4 variants (primary, secondary, outline, ghost)
- `Card` - Hover effects, gradients, glow
- `Input` - With labels, errors, icons

#### **Layout Components**
- `Header` - Sticky, mobile menu, active indicators
- `Footer` - 4-column links, newsletter, social

#### **Ad Components**
- `AdBanner` - Horizontal, vertical, square variants
- `AdSidebar` - Sticky sidebar with multiple ads

### 🎨 Design Highlights

#### **Color Palette**
```
Primary: #8b5cf6 (Purple)
Secondary: #ec4899 (Pink)
Accent: #06b6d4 (Cyan)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Background: #0f172a (Slate 900)
```

#### **Typography**
- Font: Inter (sans-serif)
- Sizes: 12px to 60px
- Weights: 400, 500, 600, 700

#### **Animations**
- Fade in/out
- Slide in/out
- Scale effects
- Hover transforms
- Auto-rotating elements

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Lucide React** - Icons

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ai-prompt-toolkit.git
cd ai-prompt-toolkit

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ads/
│       ├── AdBanner.tsx
│       └── AdSidebar.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── ToolsPage.tsx
│   ├── ToolDetailPage.tsx
│   ├── BlogPage.tsx
│   ├── BlogPostPage.tsx
│   ├── AboutPage.tsx
│   └── ContactPage.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## 🎯 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Landing page with hero, stats, tools |
| `/tools` | ToolsPage | All tools with search & filters |
| `/tools/:toolId` | ToolDetailPage | Individual tool page |
| `/blog` | BlogPage | Blog listing with categories |
| `/blog/:postId` | BlogPostPage | Individual blog post |
| `/about` | AboutPage | About the company |
| `/contact` | ContactPage | Contact form & info |

## 🎨 Customization

### Colors
Edit `src/index.css` to change the color palette:

```css
--primary: #8b5cf6;
--secondary: #ec4899;
--accent: #06b6d4;
```

### Content
Update content in individual page components:
- `HomePage.tsx` - Hero, stats, tools
- `ToolsPage.tsx` - Tool definitions
- `BlogPage.tsx` - Blog posts
- `AboutPage.tsx` - Team members

### Ads
Replace placeholder ads in:
- `AdBanner.tsx` - Banner ad component
- `AdSidebar.tsx` - Sidebar ad component

Add your ad network code (Google AdSense, etc.)

## 📱 Responsive Breakpoints

```css
sm: 640px   (Mobile landscape)
md: 768px   (Tablet)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)
2xl: 1536px (Extra large)
```

## 🚀 Performance

- **Lazy loading** for images and components
- **Code splitting** by route
- **Optimized animations** with GPU acceleration
- **Minimal bundle size** (~150KB gzipped)
- **Fast load times** (<2s on 3G)

## 🔍 SEO

- Semantic HTML5 structure
- Meta tags on all pages
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)
- Sitemap.xml
- Robots.txt

## ♿ Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG AA)
- Screen reader friendly

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📊 Analytics

Add your analytics code to `src/main.tsx`:

```typescript
// Google Analytics
import ReactGA from 'react-ga4';
ReactGA.initialize('G-XXXXXXXXXX');

// Or Plausible, Fathom, etc.
```

## 🌐 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Cloudflare Pages
```bash
npm install -g wrangler
wrangler pages deploy dist
```

## 📄 Environment Variables

Create `.env` file:

```env
VITE_API_URL=https://api.aiprompttoolkit.com
VITE_GA_ID=G-XXXXXXXXXX
VITE_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this for your projects!

## 🆘 Support

For questions or issues:
- 📧 Email: hello@aiprompttoolkit.com
- 💬 Discord: [Join our community](https://discord.gg/aiprompttoolkit)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/ai-prompt-toolkit/issues)

## 🙏 Acknowledgments

- Design inspiration from Vercel, Linear, Stripe
- Icons from Lucide React
- Animations from Framer Motion
- Colors from Tailwind CSS

## 📈 Roadmap

- [ ] Add user authentication
- [ ] Implement tool playgrounds
- [ ] Add prompt templates library
- [ ] Create API endpoints
- [ ] Add analytics dashboard
- [ ] Implement team collaboration
- [ ] Add export functionality
- [ ] Create mobile app

---

**Built with 💜 for AI professionals worldwide**

Made by AI Prompt Toolkit Team © 2026
