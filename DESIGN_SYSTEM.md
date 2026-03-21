# Design System & Style Guide

## 🎨 Color Palette

### Primary Colors
- **Primary Blue**: `#0066ff` - Main brand color for CTAs, text highlights
- **Secondary Cyan**: `#00d4ff` - Accent color for hover states
- **Dark Background**: `#0f0f1e` - Main background color
- **Dark Surface**: `#1a1a2e` - Surface/card backgrounds

### Gradient Colors
- **Blue to Cyan**: `linear-gradient(135deg, #0066ff, #00d4ff)`
- **Purple Mix**: `linear-gradient(135deg, #667eea, #764ba2)`
- **Pink to Red**: `linear-gradient(135deg, #f093fb, #f5576c)`

### Neutral Colors
- **Text Primary**: `#ffffff` (white)
- **Text Secondary**: `#b0b0c9` (light gray)
- **Text Tertiary**: `#808089` (medium gray)
- **Border**: `rgba(0, 102, 255, 0.2)` (semi-transparent blue)

```css
/* Usage in Tailwind */
className="text-white"      /* Primary text */
className="text-gray-300"   /* Secondary text */
className="text-gray-400"   /* Tertiary text */
className="bg-dark"         /* Dark background */
className="border-blue/20"  /* Semi-transparent border */
```

---

## 🔤 Typography

### Font Families
- **Primary Font**: Poppins (display, headings)
- **Secondary Font**: Inter (body text, UI)

### Font Sizes
- **H1 (Hero)**: 48px - 80px (text-5xl to text-7xl)
- **H2 (Section)**: 36px - 48px (text-4xl to text-5xl)
- **H3 (Subsection)**: 24px - 28px (text-2xl to text-3xl)
- **Body**: 16px - 18px (text-base to text-lg)
- **Small**: 12px - 14px (text-sm)

### Font Weights
- **Light**: 300 - Body text alternatives
- **Regular**: 400 - Default body text
- **Medium**: 500 - Emphasis text
- **Semibold**: 600 - Headings, strong text
- **Bold**: 700 - Major headings
- **Extra Bold**: 800 - Hero text

---

## ✨ Animation System

### Duration Scales
- **Fast**: 0.3s - Quick interactions
- **Normal**: 0.6s - Standard animations
- **Slow**: 0.8s - Entrance animations
- **Very Slow**: 2s+ - Page load animations

### Easing Functions
- **Ease Out**: `cubic-bezier(0.23, 1, 0.320, 1)` - Smooth natural motion
- **Ease In Out**: `ease-in-out` - Balanced animations
- **Step End**: `step-end` - Typing effect, blink

### Key Animations

#### Float Animation
- Duration: 6s
- Direction: Vertical wavey motion
- Use case: Hero section background elements

#### Typing Animation
- Duration: 3.5s
- Effect: Text appears character by character
- Use case: Hero section dynamic text

#### Slide Up
- Duration: 0.8s
- Effect: Content slides up with fade
- Use case: Section entrance on scroll

#### Fade In
- Duration: 0.8s
- Effect: Smooth opacity change
- Use case: Hero text appearance

#### Glow
- Duration: 2s
- Effect: Box shadow pulsing
- Use case: Skill badges, project cards on hover

#### Bounce
- Effect: Up and down motion
- Use case: Scroll indicator at bottom

---

## 🏗️ Layout & Spacing

### Container Widths
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Spacing Scale (Tailwind)
- **xs**: 2px (0.125rem)
- **sm**: 4px (0.25rem)
- **md**: 8px (0.5rem)
- **lg**: 16px (1rem)
- **xl**: 32px (2rem)
- **2xl**: 64px (4rem)

### Common Spacing Patterns
```javascript
// Section padding
className="py-20"           // 80px vertical padding

// Component padding
className="p-6"             // 24px on all sides
className="p-8"             // 32px on all sides

// Gap between items
className="gap-4"           // 16px gap
className="gap-6"           // 24px gap
className="gap-8"           // 32px gap
```

---

## 🎯 Component Styles

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #0066ff, #00d4ff);
  padding: 12px 30px;
  border-radius: 50px;
  border: none;
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 102, 255, 0.4);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 102, 255, 0.6);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: rgba(0, 102, 255, 0.1);
  border: 2px solid #0066ff;
  color: #0066ff;
  padding: 10px 28px;
  border-radius: 50px;
}

.btn-secondary:hover {
  background: #0066ff;
  color: white;
}
```

### Cards

#### Glass Card
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}
```

#### Dark Glass Card
```css
.glass-dark {
  background: rgba(15, 15, 30, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 102, 255, 0.2);
  border-radius: 20px;
}
```

### Text Effects

#### Gradient Text
```css
.text-gradient {
  background: linear-gradient(135deg, #0066ff, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

#### Glow Text
```css
.glow-text {
  text-shadow: 0 0 20px rgba(0, 102, 255, 0.8);
}
```

---

## 🔆 Shadow System

### Soft Shadows
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
```

### Medium Shadows
```css
box-shadow: 0 4px 15px rgba(0, 102, 255, 0.4);
```

### Large Shadows
```css
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
```

### Glow Shadow
```css
box-shadow: 0 0 30px rgba(0, 102, 255, 0.4);
```

---

## 📐 Border Radius

- **sm**: 4px - Small elements
- **md**: 8px - Medium components
- **lg**: 12px - Large components
- **xl**: 16px - Extra large
- **2xl**: 20px - Cards, containers
- **full**: 9999px - Rounded circles (pill buttons)

### Common Usage
```javascript
className="rounded-lg"     // 12px radius
className="rounded-2xl"    // 20px radius
className="rounded-full"   // Perfect circle
```

---

## 🎬 3D Effects

### Transform Properties
```css
/* Card tilt on hover */
transform: rotateX(5deg) rotateY(5deg) translateZ(20px);

/* Scale on hover */
transform: scale(1.05);

/* Translate on hover */
transform: translateY(-3px);
```

### Perspective
```css
perspective: 1000px;
transform-style: preserve-3d;
```

---

## 📱 Responsive Design

### Breakpoint Usage
```javascript
// Text size responsive
className="text-3xl md:text-4xl lg:text-5xl"

// Grid responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Padding responsive
className="px-4 md:px-8 lg:px-12"

// Display responsive
className="hidden md:flex lg:block"
```

### Mobile-First Approach
Always design for mobile first, then enhance with breakpoints.

```javascript
// ✅ Good - mobile first
className="text-base md:text-lg lg:text-xl"

// ❌ Avoid - desktop first
className="text-xl lg:text-base md:text-sm"
```

---

## 🎨 Design Tokens Reference

### Colors
```javascript
PRIMARY: '#0066ff'
SECONDARY: '#00d4ff'
DARK: '#0f0f1e'
DARK_BG: '#1a1a2e'
```

### Spacing
```javascript
XS: '2px'
SM: '4px'
MD: '8px'
LG: '16px'
XL: '32px'
```

### Animations
```javascript
FAST: '0.3s'
NORMAL: '0.6s'
SLOW: '0.8s'
```

---

## ✅ Design Checklist

- [ ] Colors match palette
- [ ] Typography follows font sizes
- [ ] Spacing uses scale
- [ ] Animations have proper duration
- [ ] Border radius is consistent
- [ ] Shadows are appropriate
- [ ] Responsive breakpoints tested
- [ ] Glass effect has blur applied
- [ ] Hover states are defined
- [ ] Buttons have proper padding

---

## 🔗 Component Links

- Colors: `tailwind.config.js` lines 4-10
- Animations: `src/App.css` lines 32-100
- Spacing: `tailwind.config.js` (Tailwind default scale)
- Typography: `public/index.html` & `tailwind.config.js`

---

## 📚 Additional Resources

- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Tailwind Spacing Scale](https://tailwindcss.com/docs/customizing-spacing)
- [CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [Easing Functions](https://easings.net/)

---

**Version**: 1.0.0
**Last Updated**: 2024
