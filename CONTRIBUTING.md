# Contributing to COA Study Material

Thank you for your interest in contributing! This project is designed to help students learn Computer Organization & Architecture through interactive tools and visualizations.

## How to Contribute

### Reporting Issues
- Check existing issues first
- Provide clear description with screenshots/videos if applicable
- Include your environment details (browser, OS)

### Adding Content

#### New Formulas
To add new formulas to the Formula Brain tool:
1. Edit `cao5.jsx` or `pipeline-site/src/Cao5.jsx`
2. Add to the appropriate topic in the `TOPICS` array
3. Follow the formula structure:
```javascript
{
  id: "unique-id",
  title: "Formula Title",
  level: "easy|medium|critical",
  formula: "LaTeX or plain text formula",
  meaning: "What it means",
  when: "When to use it",
  example: "Example usage",
  mistake: "Common mistake to avoid"
}
```

#### New Lessons
1. Create `.html` file for standalone lessons
2. Include comprehensive explanations with examples
3. Add to lessons directory

#### Quiz Questions
To add questions to `cao5.jsx` QUIZ_QUESTIONS:
```javascript
{
  q: "Question text",
  formula: "Formula to use",
  answer: "Worked solution",
  topic: "topic-id"
}
```

## Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow existing code patterns
- Test on multiple screen sizes

## Development Setup

```bash
# Install dependencies
cd pipeline-site
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/description`
3. Make changes with meaningful commits
4. Test thoroughly
5. Submit PR with clear description

## Project Structure to Follow

```
coa/
├── standalone lessons (*.html)
├── standalone tools (*.jsx)
├── pipeline-site/
│   ├── React app
│   ├── Components
│   └── Styling
└── Documentation
```

## Testing

- Test responsive design (mobile, tablet, desktop)
- Verify all interactive features work
- Check formula calculations
- Test on Chrome, Firefox, Safari

Thank you for helping make COA learning accessible to everyone!
