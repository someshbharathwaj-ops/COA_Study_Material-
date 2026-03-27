# COA Study Material Repository

Professional study material for Computer Organization and Architecture, centered on pipelining, hazards, datapaths, performance formulas, and hands-on practice.

## What This Repository Includes

- `lessons/`: standalone lesson pages for the core pipeline learning path
- `tools/`: standalone interactive JSX tools for simulation and formula practice
- `pipeline-site/`: the React/Vite study interface
- `docs/`: guides, project notes, reference material, and maintenance docs

## Recommended Learning Flow

1. Start with [`lessons/01-pipeline-fundamentals.html`](lessons/01-pipeline-fundamentals.html)
2. Continue to [`lessons/02-pipeline-stages-and-control.html`](lessons/02-pipeline-stages-and-control.html)
3. Finish the lesson track with [`lessons/03-hazards-forwarding-and-branching.html`](lessons/03-hazards-forwarding-and-branching.html)
4. Practice with [`tools/pipeline-simulator.jsx`](tools/pipeline-simulator.jsx)
5. Reinforce formulas with [`tools/formula-brain.jsx`](tools/formula-brain.jsx)
6. Use [`docs/guides/study-guide.md`](docs/guides/study-guide.md) for a paced revision plan

## Run The React App

```bash
cd pipeline-site
npm install
npm run dev
```

Open the local Vite URL shown in the terminal to explore the interactive study interface.

## Documentation Map

- [`docs/README.md`](docs/README.md): docs index
- [`docs/guides/quick-start.md`](docs/guides/quick-start.md): fast setup and first-study path
- [`docs/guides/study-guide.md`](docs/guides/study-guide.md): multi-week study plan
- [`docs/reference/glossary.md`](docs/reference/glossary.md): COA terms and definitions
- [`docs/reference/faq.md`](docs/reference/faq.md): common learner questions
- [`docs/project/architecture.md`](docs/project/architecture.md): repository layout and technical overview
- [`docs/project/roadmap.md`](docs/project/roadmap.md): planned improvements
- [`docs/project/deployment.md`](docs/project/deployment.md): app deployment notes
- [`docs/project/testing.md`](docs/project/testing.md): verification checklist
- [`docs/project/security.md`](docs/project/security.md): security guidance

## Repository Standards

- Root-level files are kept minimal and intentional
- Learning content is grouped by purpose instead of scattered across the root
- Documentation uses lowercase kebab-case names for cleaner long-term maintenance

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution guidelines and content conventions.

## License

This project is released under the MIT License. See [`LICENSE`](LICENSE).
