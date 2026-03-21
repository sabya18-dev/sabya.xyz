# 📁 Complete File Directory & Documentation

This file provides a comprehensive overview of all files in the portfolio project.

---

## 🏠 Root Directory Files

### Configuration Files
| File | Purpose | Edit? |
|------|---------|-------|
| `package.json` | Dependencies, project metadata, scripts | Only if adding packages |
| `tailwind.config.js` | Tailwind CSS customization, themes, colors | Yes - for custom colors |
| `postcss.config.js` | PostCSS plugins configuration | No - rarely needs editing |
| `.gitignore` | Git ignore rules | No |
| `.env.example` | Environment variables template | Edit and rename to `.env` |

### Documentation Files
| File | Purpose | Read for |
|------|---------|----------|
| `README.md` | Full project documentation | Project overview, features |
| `SETUP_GUIDE.md` | Installation and troubleshooting | Setup instructions, debugging |
| `QUICK_START.md` | Quick reference guide | Fast setup, common tasks |
| `DESIGN_SYSTEM.md` | Design tokens and style guidelines | Design consistency, customization |
| `FILE_DIRECTORY.md` | This file - complete file structure | Project navigation |

---

## 📂 Public Directory (`/public`)

### HTML Files
| File | Purpose |
|------|---------|
| `index.html` | Main HTML entry point for React |

**Key Content**:
- Meta tags (title, description, viewport)
- Google Fonts import
- Root element for React mounting (`<div id="root">`)
- Global styles

---

## 📂 Source Directory (`/src`)

### Entry Point
| File | Purpose |
|------|---------|
| `index.js` | React DOM entry point |
| `App.js` | Main App component, state management |

### Global Styles
| File | Purpose | Edit for |
|------|---------|----------|
| `index.css` | Tailwind CSS imports | Base styles (rarely) |
| `App.css` | Global animations and effects | Custom animations, keyframes |

### Components Directory (`/src/components`)

#### Navigation & Layout
| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| Navbar | `Navbar.js` | Top navigation bar | `isDark`, `setIsDark`, `scrolled` |
| Loader | `Loader.js` | Loading animation | None |

#### Page Sections
| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| Hero | `Hero.js` | Landing section | None |
| About | `About.js` | About me section | `isDark` |
| Skills | `Skills.js` | Technical skills | `isDark` |
| Projects | `Projects.js` | Portfolio projects | `isDark` |
| Contact | `Contact.js` | Contact section | `isDark` |

### Hooks Directory (`/src/hooks`)

| Hook | File | Purpose | Returns |
|------|------|---------|---------|
| `useAnimation` | `useAnimation.js` | Animation utilities | `useInView`, `useScrollPosition` |

**Available Hooks**:
```javascript
const { ref, inView } = useInView({ triggerOnce: true })
const scrollPosition = useScrollPosition()
```

### Constants Directory (`/src/constants`)

| File | Contents |
|------|----------|
| `index.js` | Personal info, skills data, projects data, social links, colors |

---

## 🔍 Detailed File Structure

```
portfolio/
│
├── 📄 Configuration & Documentation
│   ├── package.json                 # Dependencies & scripts
│   ├── tailwind.config.js           # Tailwind theme config
│   ├── postcss.config.js            # PostCSS setup
│   ├── .gitignore                   # Git ignore rules
│   ├── .env.example                 # Environment variables
│   │
│   └── 📖 Documentation
│       ├── README.md                # Full documentation
│       ├── SETUP_GUIDE.md          # Setup instructions
│       ├── QUICK_START.md          # Quick reference
│       ├── DESIGN_SYSTEM.md        # Style guide
│       └── FILE_DIRECTORY.md       # This file
│
├── public/
│   └── 🌐 index.html                # Main HTML file
│
└── src/
    │
    ├── 📝 Entry Points
    │   ├── index.js                 # React DOM entry
    │   └── App.js                   # Main App component
    │
    ├── 🎨 Styles
    │   ├── index.css                # Tailwind imports
    │   └── App.css                  # Global animations
    │
    ├── 🧩 components/
    │   ├── Navbar.js               # Navigation bar
    │   ├── Hero.js                 # Hero section
    │   ├── About.js                # About section
    │   ├── Skills.js               # Skills section
    │   ├── Projects.js             # Projects section
    │   ├── Contact.js              # Contact section
    │   └── Loader.js               # Loading animation
    │
    ├── 🎯 hooks/
    │   └── useAnimation.js         # Custom hooks
    │
    └── ⚙️ constants/
        └── index.js                # App constants
```

---

## 📋 File-by-File Documentation

### `package.json`
**What**: Project metadata and dependencies
**Edit**: Add new npm packages with `npm install`
**Key Sections**:
- `dependencies`: Required packages
- `devDependencies`: Development tools
- `scripts`: Available commands

### `tailwind.config.js`
**What**: Tailwind CSS configuration
**Edit**: For colors, fonts, animations, extensions
**Key Sections**:
- `colors`: Custom color palette
- `fontFamily`: Custom fonts
- `animation`: Custom animations
- `keyframes`: Animation definitions

### `public/index.html`
**What**: Main HTML file
**Edit**: For meta tags, fonts, title
**Key Content**:
- `<meta>` tags for SEO
- Google Fonts import
- Root div for React

### `src/index.js`
**What**: React entry point
**Edit**: Rarely, only for setup changes

### `src/App.js`
**What**: Main React component
**Edit**: For dark mode logic, global state
**Key Features**:
- Loader display
- Dark mode toggle
- Layout structure

### `src/App.css`
**What**: Global animations and styles
**Edit**: For custom animations, effects
**Includes**:
- Keyframe animations
- Glassmorphism effects
- Button styles

### `src/components/Navbar.js`
**What**: Top navigation bar
**Edit**: For nav links, branding
**Features**:
- Sticky positioning
- Mobile menu
- Theme toggle
- Smooth scroll navigation

**Props**:
- `isDark` - Dark mode state
- `setIsDark` - Dark mode setter
- `scrolled` - Is page scrolled down?

### `src/components/Hero.js`
**What**: Landing section
**Edit**: For name, bio, roles, CTA buttons
**Features**:
- Animated background
- Typing animation
- Animated 3D illustration
- Social links
- CTA buttons

### `src/components/About.js`
**What**: About me section
**Edit**: For biography, skills specialty
**Features**:
- 3D tilt effect on hover
- About text
- Skills list
- Stats display

**Props**:
- `isDark` - Dark mode state

### `src/components/Skills.js`
**What**: Technical skills display
**Edit**: For skills list, icons
**Features**:
- 3D hover effects
- Glowing badges
- Icons with colors
- Stats cards

**Props**:
- `isDark` - Dark mode state

### `src/components/Projects.js`
**What**: Portfolio projects showcase
**Edit**: For project titles, descriptions, links
**Features**:
- 3D card transformations
- Hover overlay effects
- Tech stack badges
- Project links

**Props**:
- `isDark` - Dark mode state

### `src/components/Contact.js`
**What**: Contact section with form
**Edit**: For contact info, form
**Features**:
- Contact information display
- Social links
- Contact form with validation
- Success message

**Props**:
- `isDark` - Dark mode state

### `src/components/Loader.js`
**What**: Loading animation shown on page load
**Edit**: For custom loading animation

### `src/hooks/useAnimation.js`
**What**: Custom React hooks for animations
**Includes**:
- `useInView()` - Detect if element visible
- `useScrollPosition()` - Get scroll position

### `src/constants/index.js`
**What**: Centralized constants
**Edit**: For personal info, projects, skills, social links
**Includes**:
- Personal information
- Roles array
- Skills list
- Projects data
- Contact methods
- Social links
- Color palette

---

## 📝 How to Edit Each File

### Add a New Skill
**File**: `src/constants/index.js`
```javascript
export const SKILLS = [
  { name: 'NewSkill', category: 'Category' },
  // ...
];
```

### Add a New Project
**File**: `src/constants/index.js`
```javascript
export const PROJECTS = [
  {
    id: 4,
    title: 'Project Title',
    description: 'Description',
    tech: ['Tech1', 'Tech2'],
    codeLink: 'https://...',
    demoLink: 'https://...',
  },
];
```

### Change Color Scheme
**File**: `tailwind.config.js`
```javascript
colors: {
  blue: '#YOUR_COLOR',
  blueDark: '#YOUR_DARK_COLOR',
}
```

### Change Fonts
**File**: `public/index.html`
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT..." rel="stylesheet">
```

### Update Personal Info
**File**: `src/constants/index.js`
```javascript
export const PERSONAL_INFO = {
  name: 'Your Name',
  email: 'your@email.com',
  // ...
};
```

---

## 🔄 File Dependencies

```
App.js
├── Navbar.js
├── Hero.js
├── About.js (useInView hook)
├── Skills.js
├── Projects.js
├── Contact.js
├── Loader.js
└── App.css

Components
├── useAnimation.js (custom hooks)
└── constants/index.js (data)

Constants
└── PERSONAL_INFO, SKILLS, PROJECTS, SOCIAL_LINKS
```

---

## 📊 Lines of Code

| File | Type | Size |
|------|------|------|
| `App.js` | Component | ~35 lines |
| `App.css` | Styles | ~280 lines |
| `Navbar.js` | Component | ~60 lines |
| `Hero.js` | Component | ~140 lines |
| `About.js` | Component | ~120 lines |
| `Skills.js` | Component | ~110 lines |
| `Projects.js` | Component | ~130 lines |
| `Contact.js` | Component | ~180 lines |
| `Loader.js` | Component | ~30 lines |
| **Total** | | **~1,000+ lines** |

---

## 🎯 Quick Edit Locations

| Task | File | Approx Line |
|------|------|-------------|
| Change name | `Hero.js` | 50 |
| Change colors | `tailwind.config.js` | 5-10 |
| Add skill | `constants/index.js` | 35 |
| Add project | `constants/index.js` | 55 |
| Update email | `Contact.js` | 45 |
| Change fonts | `public/index.html` | 10 |
| Add nav link | `Navbar.js` | 14 |

---

## 🔒 Files NOT to Edit

- `postcss.config.js` - PostCSS setup
- `package.json` - Unless adding packages
- `index.js` - React entry point
- `.gitignore` - Git configuration
- Auto-generated files in `build/` folder

---

## 🚀 Deployment Files

When deploying, only these matter:
- `build/` folder (generated by `npm build`)
- Everything in `public/` becomes static assets
- `package.json` for build configuration

---

## 📞 File Support

| Topic | See File |
|-------|----------|
| **Setup Issues** | `SETUP_GUIDE.md` |
| **How to Customize** | `QUICK_START.md` + specific component |
| **Design Reference** | `DESIGN_SYSTEM.md` |
| **Full Documentation** | `README.md` |
| **Find Anything** | This file (`FILE_DIRECTORY.md`) |

---

**Version**: 1.0.0
**Last Updated**: 2024

---

## 🗺️ Navigation Map

```
START HERE
    ↓
README.md (overview)
    ↓
QUICK_START.md (setup)
    ↓
SETUP_GUIDE.md (detailed)
    ↓
FILE_DIRECTORY.md (this file)
    ↓
Specific Component Files
    ↓
DESIGN_SYSTEM.md (styling)
```

**Happy exploring! 🚀**
