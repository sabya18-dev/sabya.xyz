# Portfolio Setup Guide

This guide will help you get the portfolio website up and running on your machine.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:
- **Node.js** (v14.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning)
- A code editor like **VS Code**, **Sublime Text**, or **WebStorm**

### Check Installation
```bash
node --version
npm --version
```

## 🚀 Installation Steps

### 1. Navigate to Project Directory
```bash
cd "c:\Users\SABYASACHI\OneDrive\Documents\Desktop\protofolio"
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages listed in `package.json`:
- React & React DOM
- Tailwind CSS
- React Icons
- React Scroll

### 3. Start Development Server
```bash
npm start
```

The application will automatically open in your default browser at `http://localhost:3000`

## 📱 Project Structure Breakdown

```
portfolio/
│
├── public/
│   └── index.html              # Main HTML entry point
│
├── src/
│   ├── components/
│   │   ├── Navbar.js           # Top navigation bar
│   │   ├── Hero.js             # Landing section with animations
│   │   ├── About.js            # About me section
│   │   ├── Skills.js           # Technical skills display
│   │   ├── Projects.js         # Portfolio projects
│   │   ├── Contact.js          # Contact form & info
│   │   └── Loader.js           # Loading animation
│   │
│   ├── hooks/
│   │   └── useAnimation.js     # Custom React hooks for animations
│   │
│   ├── constants/
│   │   └── index.js            # App-wide constants
│   │
│   ├── App.js                  # Main App component
│   ├── App.css                 # Global styles & animations
│   ├── index.css               # Tailwind CSS base styles
│   └── index.js                # React DOM entry point
│
├── package.json                # Dependencies & scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

## 🎨 Customization Guide

### Change Personal Information

#### Edit Hero Section (Name, Bio)
File: `src/components/Hero.js`
```javascript
// Around line 50-60
<h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
  Hey, I am<br />
  <span className="text-gradient">YOUR_NAME</span>
</h1>
```

#### Update Skills
File: `src/components/Skills.js`
```javascript
const skillsData = [
  { name: 'YOUR_SKILL', icon: <Icon />, color: '#COLOR_HEX' },
  // Add more skills...
];
```

#### Update Projects
File: `src/components/Projects.js`
```javascript
const projectsData = [
  {
    id: 1,
    title: 'Your Project Title',
    description: 'Project description',
    tech: ['React', 'Node.js'],
    // ...
  },
];
```

#### Update Contact Information
File: `src/components/Contact.js`
```javascript
const contactMethods = [
  {
    icon: <FaEnvelope className="text-4xl" />,
    label: 'Email',
    value: 'your-email@example.com',
    link: 'mailto:your-email@example.com',
  },
  // Add more contact methods...
];
```

### Change Color Scheme
File: `tailwind.config.js`
```javascript
theme: {
  extend: {
    colors: {
      blue: '#YOUR_COLOR',
      blueDark: '#YOUR_DARK_COLOR',
    },
  },
}
```

### Change Fonts
File: `public/index.html`
```html
<!-- Replace with your preferred Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

## 🔧 Available Commands

### Development
```bash
npm start
# Starts dev server on http://localhost:3000
# Hot reload enabled - changes refresh automatically
```

### Production Build
```bash
npm build
# Creates optimized production build in `/build` folder
# Minifies and optimizes all assets
```

### Run Tests
```bash
npm test
# Launches test runner in interactive watch mode
```

### Eject Configuration (⚠️ Advanced)
```bash
npm eject
# Ejects Create React App configuration
# This is irreversible! Only use if you need custom configuration
```

## 🌐 Deployment Options

### Option 1: Vercel (Easiest)
1. Push code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Click "New Project" → Select your GitHub repo
4. Deploy (automatic!)

### Option 2: Netlify
1. Build: `npm build`
2. Go to [Netlify.com](https://netlify.com)
3. Drag & drop `build` folder
4. Done!

### Option 3: GitHub Pages
```bash
# Add to package.json
"homepage": "https://username.github.io/repo-name"

# Build and deploy
npm build
npm install -g gh-pages
npm run deploy
```

### Option 4: Manual Hosting
1. Run: `npm build`
2. Upload `build` folder to your hosting (cPanel, FTP, etc.)
3. Configure server for SPA routing
4. Done!

## 🛠️ Troubleshooting

### Issue: Port 3000 Already in Use
```bash
# Use different port
PORT=3001 npm start

# Or kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue: Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
# Windows:
rmdir /s node_modules
del package-lock.json

# Mac/Linux:
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Components Not Rendering
- Check browser console for errors (F12)
- Verify all imports are correct
- Ensure component names match in imports
- Check for syntax errors

### Issue: Styles Not Applying
```bash
# Restart dev server if you modified tailwind.config.js
npm start

# Clear browser cache (Ctrl+Shift+Delete)
```

### Issue: Build Fails
```bash
# Update all dependencies
npm update

# Fix security issues
npm audit fix

# Try building again
npm build
```

## 📊 Performance Tips

1. **Code Splitting**: React automatically splits code in production build
2. **Image Optimization**: Compress images before using
3. **Lazy Loading**: Consider lazy loading components for large sections
4. **Browser Caching**: Deploy with proper cache headers
5. **CDN**: Use CDN for static assets in production

## 🔒 Security Tips

1. Never commit `.env` file with sensitive data
2. Use HTTPS in production
3. Validate form inputs on both client and server
4. Keep dependencies updated: `npm audit`
5. Don't expose API keys in frontend code

## 📚 Learning Resources

- [React Official Docs](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Icons Library](https://react-icons.github.io/react-icons/)
- [Create React App Docs](https://create-react-app.dev/)
- [JavaScript ES6+ Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🐛 Debugging Tips

### Use React DevTools
Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools) for Chrome

### Console Logging
```javascript
console.log('Debug value:', variable);
console.table(arrayOfObjects);
```

### Network Tab
Check `Network` tab in DevTools to see API calls and resource loading

## 📝 Notes

- Keep your dependencies updated regularly
- Test on multiple browsers and devices
- Use browser DevTools consistently
- Follow React best practices
- Comment your code for future reference

## 🆘 Getting Help

If you encounter issues:
1. Check the error message carefully
2. Search for the error on Google/Stack Overflow
3. Check project README.md
4. Review React/Tailwind documentation
5. Contact the developer

---

**Happy developing! 🚀**

For questions or issues, feel free to reach out to Sabyasachi Samal
- Email: sabyasachisamal28@gmail.com
- GitHub: https://github.com/sabya18-dev
