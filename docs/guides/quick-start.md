# Quick Start Guide

Get COA Study Material running in 5 minutes!

## Prerequisites

- Node.js 16 or higher
- npm (comes with Node.js)
- Git (optional, for cloning)

## Installation

### Option 1: Using Git Clone (Recommended)

```bash
# Clone the repository
git clone https://github.com/someshbharathwaj-ops/COA_Study_Material-.git
cd coa

# Navigate to React app
cd pipeline-site

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open your browser to: **http://localhost:5173**

### Option 2: Manual Download

1. Download from GitHub as ZIP
2. Extract to a folder
3. Open terminal in `pipeline-site` folder
4. Run:
```bash
npm install
npm run dev
```

## Using Standalone Tools

### Pipeline Simulator (`tools/pipeline-simulator.jsx`)
1. Open `tools/pipeline-simulator.jsx` in a JavaScript runtime
2. Or use in HTML:
```html
<script src="../tools/pipeline-simulator.jsx"></script>
```

### Formula Tool (`tools/formula-brain.jsx`)
- Integrated in React app automatically
- Also usable as standalone component

### HTML Lessons
Simply open in browser:
- `lessons/01-pipeline-fundamentals.html` - Start here
- `lessons/02-pipeline-stages-and-control.html` - Continue with stage behavior
- `lessons/03-hazards-forwarding-and-branching.html` - Finish with hazards and recovery

## First Steps

1. **Start with Lesson 1**: Click "01 Introduction" in sidebar
2. **Explore the Pipeline**: View "02 Pipeline" section
3. **Use the Simulator**: Scroll to "08 Simulator" for hands-on practice
4. **Learn Formulas**: Click "11 Formulas" for formula tool
5. **Take Quiz**: Try your knowledge in "10 Quiz" section

## Navigation

- **Sidebar**: Click any section to jump (smooth scroll)
- **Dark Theme**: Automatically applied
- **Responsive**: Works on mobile & desktop

## Study Modes in Formula Tool

1. **Explorer**: Browse all formulas by topic
2. **Flashcards**: Practice memorization
3. **Quiz**: Answer 6 numerical problems
4. **Memory Trainer**: Active recall training
5. **Cheatsheet**: Quick reference

## Keyboard Shortcuts (Recommended)

| Action | Shortcut |
|--------|----------|
| Scroll to next section | `Page Down` |
| Scroll to previous section | `Page Up` |
| Jump to specific section | `Ctl+F` search |
| Copy formula | Click "Copy" button |
| Expand formula card | Click card title |

## Troubleshooting

### Port Already in Use

If port 5173 is busy:
```bash
npm run dev -- --port 3000
```
Then visit: http://localhost:3000

### Dependencies Not Installing

```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules
npm install
```

### Styles Not Loading

Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Browser Compatibility

Works best in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Next Steps

1. **Complete `docs/guides/study-guide.md`** for structured learning
2. **Reference `docs/reference/glossary.md`** for terminology
3. **Check out CONTRIBUTING.md** to contribute
4. **Read `docs/project/architecture.md`** for technical details

## Tips for Success

✅ Study 30 minutes daily with Flashcards
✅ Use Simulator to visualize concepts
✅ Complete all Quiz problems
✅ Reference Glossary while learning
✅ Track progress through all 5 study modes

## Getting Help

- 📖 See STUDY_GUIDE.md for learning strategies
- 🔍 Search GLOSSARY.md for terms you don't know
- 📚 Check existing lessons for context
- 💡 Use Formula Explorer with topic filters
- 🎓 Reference the quiz solutions

## Production Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ folder to your host
# (Netlify, Vercel, GitHub Pages, etc.)
```

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 512MB | 2GB+ |
| Browser | Chrome 90 | Latest |
| Node.js | 16.x | 18.x LTS |
| Disk | 500MB | 1GB |

## Support

Need help?
1. Check TROUBLESHOOTING section above
2. Read the relevant documentation
3. Search GitHub issues
4. Open a new issue with details

---

**Estimated Learning Time**: 3-4 weeks for full mastery
**Time to First Success**: 5 minutes (this guide!)
**Questions?** Check the docs or GitHub issues

*Happy Learning! 📚*
