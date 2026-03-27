# Contributing to COA Study Material

Thanks for helping improve this repository. The goal is to keep the material accurate, approachable, and easy to maintain for students preparing for Computer Organization and Architecture topics.

## Repository Layout

- `lessons/`: standalone lesson pages
- `tools/`: standalone study utilities
- `pipeline-site/`: React/Vite interface
- `docs/`: learning guides, reference notes, and project documentation

## Good Contribution Types

- Fix conceptual mistakes in COA explanations
- Improve worked examples and quiz clarity
- Add missing formulas, diagrams, or hazard cases
- Improve accessibility, navigation, and responsiveness
- Clean up naming, documentation, and repository structure

## Before You Start

1. Read the relevant lesson or guide before editing it.
2. Prefer focused pull requests over bundled changes.
3. Keep terminology consistent with the glossary in `docs/reference/glossary.md`.
4. If you change learning paths or file names, update the README and related docs in the same pull request.

## Adding Formula Content

To update the formula tool:

1. Edit `tools/formula-brain.jsx` or `pipeline-site/src/Cao5.jsx`.
2. Add entries to the appropriate topic inside the formula dataset.
3. Follow the existing structure:

```javascript
{
  id: "unique-id",
  title: "Formula Title",
  level: "easy|medium|critical",
  formula: "LaTeX or plain text formula",
  meaning: "What it means",
  when: "When to use it",
  example: "Worked example",
  mistake: "Common mistake to avoid"
}
```

## Adding Lessons or Study Notes

1. Place new lesson pages in `lessons/`.
2. Use descriptive kebab-case file names.
3. Keep explanations exam-oriented and example-driven.
4. Update `README.md`, `docs/README.md`, and any relevant study guides when adding new material.

## Local Development

```bash
cd pipeline-site
npm install
npm run dev
```

Use `npm run build` before opening a pull request when the React app is affected.

## Content Quality Checklist

- Concepts are technically correct
- Examples are complete and readable
- Naming matches the repository structure
- Links point to the current file paths
- Screens and layouts still work on mobile and desktop

## Pull Request Guidance

1. Create a branch with a descriptive name.
2. Make small, reviewable commits.
3. Explain what changed and why it helps learners.
4. Include screenshots for UI changes when possible.
5. Mention any testing or manual verification you performed.

## Review Standard

Changes should improve at least one of these:

- conceptual clarity
- study flow
- repository maintainability
- learner confidence

If a contribution adds noise, duplicates existing material, or makes the repo harder to navigate, it should be revised before merge.
