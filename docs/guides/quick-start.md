# Quick Start Guide

Use this guide if you want to get productive with the repository quickly.

## Run The React Study App

```bash
cd pipeline-site
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Explore The Core Study Material

Start with the lesson sequence:

1. `lessons/01-pipeline-fundamentals.html`
2. `lessons/02-pipeline-stages-and-control.html`
3. `lessons/03-hazards-forwarding-and-branching.html`

Then use the standalone tools:

- `tools/pipeline-simulator.jsx`
- `tools/formula-brain.jsx`

## Recommended First Session

1. Read Lesson 1 for the basic pipeline model.
2. Open the React app and scan the navigation sections.
3. Practice one short instruction sequence in the simulator.
4. Review formulas in explorer mode.
5. Check `docs/guides/study-guide.md` if you want a longer study plan.

## Troubleshooting

### Port 5173 Is Busy

```bash
npm run dev -- --port 3000
```

### Dependencies Fail To Install

Try removing `pipeline-site/node_modules` and reinstalling:

```bash
npm install
```

### Production Build

```bash
cd pipeline-site
npm run build
npm run preview
```

## Where To Go Next

- `docs/guides/study-guide.md` for a structured revision plan
- `docs/reference/glossary.md` for terminology
- `docs/reference/faq.md` for common questions
- `docs/project/architecture.md` for repository structure
