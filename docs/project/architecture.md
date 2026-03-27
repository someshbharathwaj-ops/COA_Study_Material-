# Project Architecture

## System Overview

COA Study Material is a comprehensive interactive learning platform with both standalone tools and an integrated React-based application.

```
┌─────────────────────────────────────────────────────────┐
│         COA Study Material (coa repository)             │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────┐  ┌──────────────────────────┐     │
│  │  HTML Lessons   │  │  Standalone Tools (JSX)  │     │
│  │                 │  │                          │     │
│  │ - coa.html      │  │ - coa4.jsx (Simulator)   │     │
│  │ - coa2.html     │  │ - cao5.jsx (Formulas)    │     │
│  │ - coa3.html     │  │                          │     │
│  └─────────────────┘  └──────────────────────────┘     │
│                                                           │
│  ┌────────────────────────────────────────────────┐     │
│  │    React Application (pipeline-site)            │     │
│  ├────────────────────────────────────────────────┤     │
│  │                                                  │     │
│  │  ┌──────────────────────────────────────────┐  │     │
│  │  │         App.jsx (Main Container)        │  │     │
│  │  │  ┌────────────────────────────────────┐ │  │     │
│  │  │  │      10 Course Sections            │ │  │     │
│  │  │  │  + Cao5 Component (Formulas)      │ │  │     │
│  │  │  │  + Navigation Sidebar             │ │  │     │
│  │  │  │  + Styling & Theme               │ │  │     │
│  │  │  └────────────────────────────────────┘ │  │     │
│  │  │                                          │  │     │
│  │  └──────────────────────────────────────────┘  │     │
│  │                                                  │     │
│  └────────────────────────────────────────────────┘     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
coa/
├── .git/                          # Git repository
├── .gitignore                     # Git ignore rules
├── LICENSE                        # MIT License
├── README.md                      # Project overview
├── CONTRIBUTING.md                # Contribution guidelines
├── STUDY_GUIDE.md                 # Learning path
├── GLOSSARY.md                    # Terminology
├── CHANGELOG.md                   # Release history
├── ARCHITECTURE.md                # This file
│
├── Standalone Components:
├── coa.html                       # Lesson 1: Basics
├── coa2.html                      # Lesson 2: Deep dive
├── coa3.html                      # Lesson 3: Challenges
├── coa4.jsx                       # Pipeline simulator
├── cao5.jsx                       # Formula tool
│
└── pipeline-site/                 # React Application
    ├── package.json               # Dependencies
    ├── vite.config.js            # Vite configuration
    ├── index.html                # Entry HTML
    │
    ├── src/
    │   ├── App.jsx               # Main app container
    │   ├── Cao5.jsx              # Formulas component (adapted)
    │   └── main.jsx              # React entry point
    │
    ├── public/                   # Static assets
    └── dist/                     # Build output (generated)
```

## Technology Stack

### Frontend
- **React 18+**: Component-based UI
- **Vite**: Modern build tool, fast HMR
- **JavaScript ES6+**: Modern syntax
- **CSS-in-JS**: Inline styles with constants

### Development
- **Node.js**: JavaScript runtime
- **npm**: Package manager
- **Git**: Version control

### No External Dependencies
- Pure React (no additional UI libraries)
- No CSS frameworks (custom dark theme)
- No state management library (React hooks only)
- No backend required

## Component Architecture

### App.jsx (Main Container)
```
App
├── Navigation Sidebar
│   ├── Logo
│   ├── NavItems (11 sections)
│   └── Page info
│
└── Main Content
    ├── IntroSection
    ├── PipelineSection
    ├── StagesSection
    ├── DatapathSection
    ├── HazardsSection
    ├── ForwardingSection
    ├── ControlSection
    ├── SimulatorSection
    ├── PlaygroundSection
    ├── QuizSection
    └── FormulasSection (Cao5 component)
```

### Cao5.jsx (Formula Tool)
```
Cao5
├── Header (sticky)
│   ├── Title & stats
│   └── Mode tabs (5 modes)
│
├── Content Area
│   ├── Mode-Specific Component
│   │   ├── FormulaExplorer
│   │   ├── FlashcardMode
│   │   ├── QuizMode
│   │   ├── MemoryTrainer
│   │   └── CheatSheet
│   │
│   └── Shared Components
│       ├── Pill (difficulty badge)
│       └── FormulaCard (expandable)
│
└── Footer
```

## Data Structures

### Formula Object
```javascript
{
  id: "unique-id",                    // Unique identifier
  title: "Formula Name",              // Display name
  level: "easy|medium|critical",      // Difficulty
  formula: "Mathematical formula",    // Display text
  meaning: "What it means",          // Explanation
  when: "When to use",               // Context
  example: "Example usage",          // Worked example
  mistake: "Common mistake"          // Error to avoid
}
```

### Topic Object
```javascript
{
  id: "topic-id",                    // Topic identifier
  label: "Topic Label",              // Display name
  icon: "📚",                        // Emoji icon
  color: "#color",                   // Brand color
  formulas: [Formula, ...]           // Array of formulas
}
```

### Quiz Question Object
```javascript
{
  q: "Question text",                // Problem statement
  formula: "Required formula",       // Hint
  answer: "Worked solution",         // Full solution
  topic: "topic-id"                  // Related topic
}
```

## State Management

### React Hooks Usage
- **useState**: Mode selection, UI state, quiz scores
- **useEffect**: IntersectionObserver setup, component lifecycle
- **useRef**: DOM references, timer management
- **useCallback**: Memoized event handlers

### No Global State
- Each section manages its own state
- Cao5 component is self-contained
- IntersectionObserver for navigation sync

## Styling Strategy

### CSS Architecture
- **CSS-in-JS**: Inline style objects
- **Component scoping**: Unique classes where needed
- **Design tokens**: @import Google Fonts in HTML
- **Color variables**: - prefix CSS variables
- **Dark theme**: #010409 background with gradients

### Key Colors
- Primary: #00f5d4 (cyan)
- Secondary: #a78bfa (purple)
- Accent: #ff6b6b (red)
- Background: #010409
- Surface: #0d1117
- Border: #21262d
- Text: #e6edf3
- Text secondary: #8b949e

## Performance Optimizations

### Rendering
- Component-level optimization with React.memo (implicit)
- Memoized callbacks to prevent re-renders
- IntersectionObserver for visibility tracking

### Bundle Size
- No external dependencies (minimal bundle)
- Tree-shaking enabled in Vite
- Code splitting for route optimization

### Runtime
- Efficient event listeners
- Proper cleanup in useEffect
- Debounced search in formula explorer

## Deployment Architecture

### Local Development
```
npm install          # Install dependencies
npm run dev          # Vite dev server (localhost:5173)
```

### Production Build
```
npm run build        # Creates dist/ directory
npm run preview      # Preview production build
```

### Hosting Options
- **Vercel**: Zero-config deployment
- **Netlify**: Automatic builds from Git
- **GitHub Pages**: Static hosting
- **Traditional servers**: Copy dist/ contents

## Security Considerations

### Data Privacy
- No user data collection
- No backend authentication
- All computation client-side
- localStorage only (optional progress)

### Code Safety
- No eval() or dynamic execution
- Input sanitization for quiz answers
- No external API calls
- MIT licensed (inspect freely)

## Browser Compatibility

| Browser | Support | Min Version |
|---------|---------|-------------|
| Chrome | ✅ Full | 90+ |
| Firefox | ✅ Full | 88+ |
| Safari | ✅ Full | 14+ |
| Edge | ✅ Full | 90+ |
| Safari Mobile | ✅ Full | 13+ |
| Chrome Mobile | ✅ Full | 90+ |

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- High contrast dark theme
- Keyboard navigation support
- Focus indicators on interactive elements
- Readable font sizes (minimum 13px)

## Future Architecture Plans

### v2.0 Enhancements
- Component library extraction
- Storybook integration
- TypeScript migration
- Redux/Context for state
- Backend API integration
- User authentication
- Database for progress tracking
- Collaborative features

### Scalability
- Current architecture supports 100+ formulas
- Component system ready for expansion
- Modular study modes
- Easy to add new lessons

---

**Architecture follows:** React best practices, accessibility standards, and performance optimization guidelines.
