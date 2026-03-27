# COA Study Material - Computer Organization & Architecture Learning Platform

A comprehensive interactive learning platform for Computer Organization and Architecture (COA) with hands-on pipeline simulation, formula tools, and problem solving.

## Features

- **Pipeline Simulator**: Visualize 5-stage pipeline execution with hazard detection
- **COA Formulas**: 50+ essential formulas with interactive learning modes
- **Study Modes**: Formula Explorer, Flashcards, Problem Quiz, Memory Trainer, Cheatsheet
- **Interactive Datapath**: Visual representation of CPU datapath components
- **Hazard Detection**: RAW, Control, and Structural hazard identification
- **Forwarding Visualization**: Learn how data forwarding eliminates hazards

## Project Structure

```
coa/
├── coa.html              # Lesson 1: Basic Pipeline Concepts
├── coa2.html             # Lesson 2: Advanced Stages
├── coa3.html             # Lesson 3: Hazards & Solutions
├── coa4.jsx              # Interactive Pipeline Simulator
├── cao5.jsx              # COA Formula Learning Tool
└── pipeline-site/        # React-based Study Platform
    ├── src/
    │   ├── App.jsx       # Main application container
    │   ├── Cao5.jsx      # Formula tool component
    │   └── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd pipeline-site
npm install
npm run dev
```

Visit `http://localhost:5173` to access the learning platform.

## Study Materials Included

### Lessons
1. **coa.html** - Pipeline fundamentals
2. **coa2.html** - Pipeline stages deep dive
3. **coa3.html** - Hazards and forwarding

### Interactive Tools
- **Pipeline Simulator** (coa4.jsx)
  - 5-stage pipeline execution
  - Instruction tracing
  - Hazard visualization
  - Performance metrics

- **Formula Brain** (cao5.jsx)
  - 50+ formulas organized by topic
  - 5 study modes
  - 6 practice problems
  - Critical/Medium/Easy difficulty levels

## Topics Covered

- Pipeline Architecture
- Data Hazards (RAW, WAW, WAR)
- Control Hazards
- Structural Hazards
- Forwarding/Bypassing
- Cache Hierarchies
- Memory Management
- AMAT Calculations
- CPI Analysis

## Technologies

- React 18+
- Vite (build tool)
- JavaScript/JSX
- Modern CSS-in-JS

## License

Open source educational material

## Author

Somesh Bharathwaj
