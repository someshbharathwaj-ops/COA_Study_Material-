# Project Architecture

This repository is organized as a study-material workspace with three main surfaces: lesson content, standalone tools, and a React application that brings the material together in one interface.

## Top-Level Structure

```text
coa/
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── docs/
│   ├── guides/
│   ├── project/
│   └── reference/
├── lessons/
│   ├── 01-pipeline-fundamentals.html
│   ├── 02-pipeline-stages-and-control.html
│   └── 03-hazards-forwarding-and-branching.html
├── tools/
│   ├── formula-brain.jsx
│   └── pipeline-simulator.jsx
└── pipeline-site/
    ├── index.html
    ├── package.json
    ├── src/
    │   ├── App.jsx
    │   └── Cao5.jsx
    └── vite.config.js
```

## Learning Content Layers

### Lessons

The `lessons/` directory contains standalone HTML study pages that explain concepts in sequence:

1. fundamentals of pipelining
2. stage responsibilities and control flow
3. hazards, forwarding, and branch handling

These files are best suited for direct reading and revision.

### Standalone Tools

The `tools/` directory contains portable study utilities:

- `pipeline-simulator.jsx` for visual pipeline tracing and hazard reasoning
- `formula-brain.jsx` for formula review, recall, and practice

These files can be maintained independently of the React app.

### React App

The `pipeline-site/` directory packages the material into a single learner-facing interface built with React and Vite. It serves as the interactive front end for browsing topics, revising formulas, and exploring the study content in one place.

## Documentation Layers

- `docs/guides/`: student-facing usage and study guidance
- `docs/reference/`: quick lookup material such as glossary and FAQ
- `docs/project/`: repository maintenance and engineering notes

## Maintenance Principles

- Keep the root focused on repository entry points only.
- Place learning assets by purpose rather than file type alone.
- Update links and documentation whenever files are moved or renamed.
- Treat the React app as one surface of the repo, not the entire repo.
