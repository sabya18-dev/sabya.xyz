# Quick Reference Guide

## 🚀 Quick Start (3 Steps)

```bash
# 1. Navigate to project
cd "c:\Users\SABYASACHI\OneDrive\Documents\Desktop\protofolio"

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

The portfolio will open at `http://localhost:3000`

---

## 📂 Key Files to Edit

| Section | File | What to Change |
|---------|------|----------------|
| **Name/Bio** | `src/components/Hero.js` | Lines 50-60 |
| **About Text** | `src/components/About.js` | Lines 40-50 |
| **Skills** | `src/components/Skills.js` | Lines 8-27 |
| **Projects** | `src/components/Projects.js` | Lines 8-40 |
| **Contact Info** | `src/components/Contact.js` | Lines 42-60 |
| **Colors** | `tailwind.config.js` | Lines 4-10 |

---

## 🎨 Customization Shortcuts

### Update Name
File: `src/components/Hero.js`
```javascript
<span className="text-gradient">YOUR_NAME</span>
```

### Update Email
File: `src/components/Contact.js`
```javascript
value: 'your-email@example.com',
```

### Update Social Links
File: `src/components/Contact.js`
```javascript
link: 'https://your-link.com',
```

---

## 🛠️ Common Commands

```bash
npm start          # Start development server
npm build          # Create production build
npm test           # Run tests
npm eject          # Eject configuration (irreversible!)
```

---

## 🔗 Important Links

- **Local Dev**: http://localhost:3000
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com
- **React Icons**: https://react-icons.github.io/react-icons/

---

## ⚙️ Project Configuration

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `tailwind.config.js` | Tailwind CSS customization |
| `postcss.config.js` | PostCSS processing |
| `.env.example` | Environment variables template |
| `.gitignore` | Git ignore rules |

---

## 📱 Responsive Breakpoints (Tailwind)

```
sm:  640px   (tablets)
md:  768px   (medium devices)
lg:  1024px  (large screens)
xl:  1280px  (extra large)
```

Usage: `md:text-4xl` (text-size on medium and up)

---

## 🎯 Component Overview

```
App
├── Navbar        (Navigation with theme toggle)
├── Hero          (Landing section with typing animation)
├── About         (About me with 3D tilt effect)
├── Skills        (Tech stack with hover effects)
├── Projects      (Portfolio projects 3D cards)
├── Contact       (Contact form & information)
└── Footer        (Copyright info)
```

---

## 🚨 Troubleshooting Checklist

- [ ] Node.js installed? (Check: `node --version`)
- [ ] Dependencies installed? (Run: `npm install`)
- [ ] Port 3000 free? (Change: `PORT=3001 npm start`)
- [ ] Dependencies errors? (Try: `npm audit fix`)
- [ ] Still stuck? Check browser console (F12)

---

## 📦 Build & Deploy

```bash
# Build for production
npm build

# This creates /build folder
# Deploy /build folder to hosting
```

**Recommended Hosting:**
- **Vercel** (easiest)
- **Netlify**
- **GitHub Pages**
- **Traditional Hosting** (FTP/cPanel)

---

## 🔐 Before Going Live

- [ ] Update all personal information
- [ ] Add project links and descriptions
- [ ] Test on mobile devices
- [ ] Check all links work
- [ ] Optimize images
- [ ] Run `npm build` successfully
- [ ] Test form submissions

---

## 💡 Tips & Tricks

- **Hot Reload**: Changes auto-refresh while `npm start` running
- **Browser Dev Tools**: Press F12 to open
- **React DevTools**: Install Chrome extension for better debugging
- **Tailwind Classes**: Refer to docs for utility classes
- **Icons**: Browse available icons at react-icons site

---

## 📞 Contact & Support

**Developer:** Sabyasachi Samal
- **Email**: sabyasachisamal28@gmail.com
- **GitHub**: https://github.com/sabya18-dev
- **LinkedIn**: https://www.linkedin.com/in/sabyasachi-samal-993896303/
- **Twitter**: https://x.com/amsavyasachi

---

## 🎓 Next Steps

1. ✅ Follow Quick Start (3 steps above)
2. ✅ Customize personal information
3. ✅ Update projects and skills
4. ✅ Test on different devices
5. ✅ Build: `npm build`
6. ✅ Deploy to your hosting

---

**Version**: 1.0.0
**Last Updated**: 2024
**License**: MIT

For detailed guides, see:
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Installation & troubleshooting
