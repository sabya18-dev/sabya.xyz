# Sabyasachi Samal - Modern Portfolio Website

A stunning, modern, responsive portfolio website built with React, Tailwind CSS, and advanced animations. This portfolio showcases projects, skills, and provides an easy way to get in touch.

## 🌟 Features

- **Modern Design**: Clean, premium, futuristic UI with glassmorphism effects
- **3D Effects**: Interactive 3D card transformations and hover effects
- **Smooth Animations**: Fade-in, slide-up, typing, and custom animations
- **Fully Responsive**: Perfect on mobile, tablet, and desktop
- **Dark Mode**: Elegant dark theme with blue gradient accents
- **Dynamic Typing**: Animated hero text with role cycling
- **Interactive Components**:
  - Sticky navigation with smooth scrolling
  - 3D tilt effect on about section card
  - Glowing skill badges with hover effects
  - Project cards with overlay effects
  - Contact form with validation
- **Modern Tech Stack**: React + Tailwind CSS + React Icons

## 📁 Project Structure

```
portfolio/
├── public/
│   └── index.html           # Main HTML file
├── src/
│   ├── components/
│   │   ├── Navbar.js       # Navigation component
│   │   ├── Hero.js         # Hero section with animations
│   │   ├── About.js        # About section with 3D tilt
│   │   ├── Skills.js       # Skills grid with hover effects
│   │   ├── Projects.js     # Project showcase cards
│   │   └── Contact.js      # Contact form and info
│   ├── App.js              # Main app component
│   ├── App.css             # Global styles and animations
│   ├── index.css           # Tailwind CSS imports
│   └── index.js            # React entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory:**
```bash
cd portfolio
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## 🛠️ Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner.

## 🎨 Customization

### Colors
Edit the color scheme in `tailwind.config.js`:
```javascript
colors: {
  blue: '#0066ff',
  blueDark: '#004fd1',
  // Add your custom colors
}
```

### Content
Update personal information in respective components:
- **Hero**: `src/components/Hero.js` - Name, subtitle, roles
- **About**: `src/components/About.js` - Bio and skills
- **Skills**: `src/components/Skills.js` - Add/remove skills
- **Projects**: `src/components/Projects.js` - Update project details
- **Contact**: `src/components/Contact.js` - Contact information and links

### Fonts
Fonts are imported from Google Fonts in `public/index.html`. To change:
1. Update the font URLs
2. Modify the font family in `tailwind.config.js`

## 📦 Dependencies

- **react** - UI library
- **react-dom** - DOM rendering
- **react-icons** - Icon library
- **react-scroll** - Smooth scrolling navigation
- **tailwindcss** - Utility-first CSS framework
- **postcss** - CSS transformations
- **autoprefixer** - Vendor prefixes

## 🎯 Key Features Explained

### 3D Tilt Effect
The About section features a mouse-tracking tilt effect that responds to cursor position:
```javascript
onMouseMove={(e) => {
  const x = (e.clientY - rect.top) / rect.height - 0.5;
  const y = (e.clientX - rect.left) / rect.width - 0.5;
  setTilt({ x: x * 10, y: y * 10 });
}}
```

### Typing Animation
The hero section includes a dynamic typing animation with role cycling:
```javascript
const roles = ['Full Stack Developer', 'Java Developer', 'AI Enthusiast'];
// Automatically cycles through roles with typing effect
```

### Responsive Design
All components use Tailwind's responsive utilities:
- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Flexible grid layouts

### Glassmorphism
Modern glass effect achieved through:
- `backdrop-filter: blur(20px)`
- Semi-transparent backgrounds
- Subtle borders with transparency

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy with one click

### Netlify
1. Run `npm build`
2. Deploy the `build` folder to Netlify

### Traditional Hosting
1. Run `npm build`
2. Upload `build` folder to your hosting provider
3. Configure server for SPA routing

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Scroll](https://www.npmjs.com/package/react-scroll)

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Sabyasachi Samal**
- Email: sabyasachisamal28@gmail.com
- GitHub: https://github.com/sabya18-dev
- LinkedIn: https://www.linkedin.com/in/sabyasachi-samal-993896303/
- Twitter: https://x.com/amsavyasachi

## 🤝 Contributing

Contributions are welcome! Feel free to fork this project and submit pull requests.

## 💡 Tips for Best Results

1. **Optimize Images**: Use compressed images for faster loading
2. **SEO**: Update meta tags in `public/index.html`
3. **Performance**: Use React DevTools to profile components
4. **Accessibility**: Test with keyboard navigation and screen readers
5. **Analytics**: Consider adding Google Analytics or similar

## 🔧 Troubleshooting

### Port already in use
```bash
# Change port
PORT=3001 npm start
```

### Dependencies issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
# Update dependencies
npm update
npm audit fix
```

---

**Happy coding! 🚀**

For more information or support, feel free to reach out via email or social media.
