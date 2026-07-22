# 🚀 AI Prompt Toolkit - Homepage 

A **world-class, production-ready** homepage design for AI Prompt Toolkit, built with React, TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

### 🎨 Modern Design
- **Animated backgrounds** with gradient effects and mesh patterns
- **Glassmorphism** cards with backdrop blur
- **Smooth animations** powered by Framer Motion
- **Dark theme** with purple/pink gradient accents
- **Responsive design** - works perfectly on mobile, tablet, and desktop

### 🧩 Sections Included

1. **Hero Section**
   - Animated gradient background
   - Interactive tool demo (live prompt optimizer)
   - Social proof (10K+ users, 4.9/5 rating)
   - Company logos
   - Dual CTAs

2. **Tools Showcase**
   - 10 professional tools in a grid layout
   - Hover effects with glow
   - Tool examples and stats
   - Premium badges for pro features

3. **How It Works**
   - 4-step process visualization
   - Connection lines between steps
   - Icons and examples for each step

4. **Testimonials**
   - 6 testimonials from AI professionals
   - Star ratings
   - Avatar gradients
   - Stats bar (10K+ users, $500K+ saved)

5. **Pricing**
   - 3 pricing tiers (Free, Pro, Team)
   - Feature comparison
   - Popular badge highlight
   - Money-back guarantee

6. **FAQ**
   - Accordion-style Q&A
   - Smooth expand/collapse animations
   - 12 common questions answered

7. **Call to Action**
   - Animated background
   - Feature highlights
   - Trust indicators
   - Dual CTAs

8. **Footer**
   - 4-column link structure
   - Newsletter signup
   - Social media links
   - Legal links

### 🎯 Key Highlights

- **Interactive Demo**: Users can try the prompt optimizer right in the hero section
- **Social Proof**: Testimonials, ratings, and user counts throughout
- **Clear CTAs**: Multiple call-to-action buttons strategically placed
- **Professional Feel**: Enterprise-grade design that builds trust
- **Performance**: Optimized animations and rendering
- **Accessibility**: Proper ARIA labels and semantic HTML

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 📦 Installation

```bash
# Install dependencies
npm install react framer-motion lucide-react

# Make sure you have Tailwind CSS configured
# Add the components to your project
```

## 🎨 Customization

### Colors
The design uses a purple/pink gradient theme. To customize:

```jsx
// Change gradient colors
from-purple-500 to-pink-500  // Primary gradient
from-cyan-500 to-blue-500    // Secondary gradient
from-amber-500 to-orange-500 // Accent gradient
```

### Content
All content is stored in component files. Edit the arrays at the top of each component:
- `tools` in ToolsShowcase.tsx
- `testimonials` in TestimonialsSection.tsx
- `plans` in PricingSection.tsx
- `faqs` in FAQSection.tsx

### Animations
Adjust animation timings in Framer Motion props:
```jsx
transition={{ duration: 0.6, delay: 0.2 }}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3-4 columns)

## 🚀 Usage

```jsx
import App from './App';

function YourApp() {
  return <App />;
}
```

## 🎯 Performance Tips

1. **Lazy load** sections below the fold
2. **Optimize images** (use WebP format)
3. **Code split** by route if integrating into larger app
4. **Use React.memo** for static components

## 📄 License

MIT - Feel free to use this for your projects!

## 🤝 Support

For questions or issues, reach out to the AI Prompt Toolkit team.

---

**Built with 💜 for AI professionals worldwide**
