# Study Guide for Computer Organization & Architecture

This guide helps you navigate the COA Study Material effectively.

## Learning Path

### Phase 1: Fundamentals (`lessons/01-pipeline-fundamentals.html`)
- Understanding pipeline basics
- 5-stage pipeline overview
- Clock cycles and throughput
- **Time Estimate**: 2-3 hours
- **Key Concepts**: IF, ID, EX, MEM, WB stages

### Phase 2: Deep Dive (`lessons/02-pipeline-stages-and-control.html`)
- Detailed stage analysis
- Each stage's responsibilities
- Control signal flow
- **Time Estimate**: 3-4 hours
- **Key Concepts**: Opcode decoding, register forwarding

### Phase 3: Challenges (`lessons/03-hazards-forwarding-and-branching.html`)
- Data hazards (RAW, WAW, WAR)
- Control hazards (branch prediction)
- Structural hazards (resource conflicts)
- **Time Estimate**: 3-4 hours
- **Key Concepts**: Stall cycles, forwarding unit

## Interactive Tools

### Pipeline Simulator (`tools/pipeline-simulator.jsx`)
**Best for**: Hands-on visualization and practice

Features:
- Step-by-step instruction execution
- Visual hazard highlighting
- Custom instruction input
- Performance metric calculation

**Example Problems**:
1. Trace a simple 3-instruction sequence
2. Identify all hazards in a program
3. Calculate total cycles with/without forwarding
4. Design forwarding paths for given instructions

### Formula Brain (`tools/formula-brain.jsx`)
**Best for**: Problem solving and formula memorization

Modes:
1. **Explorer**: Browse all formulas with explanations
2. **Flashcards**: Spaced repetition learning (30 min/day)
3. **Quiz**: Practice 6 numerical problems
4. **Memory Trainer**: Active recall exercises
5. **Cheatsheet**: Quick reference for exams

## Recommended Study Schedule

### Week 1: Foundations
- **Monday**: Read Lesson 1 + Formula Explorer
- **Tuesday**: Pipeline Simulator tutorial
- **Wednesday-Thursday**: Read Lesson 2 + practice problems
- **Friday**: Quiz Mode in Formula Brain (score tracking)

### Week 2: Challenges
- **Monday-Tuesday**: Study Lesson 3
- **Wednesday**: Simulator - custom programs
- **Thursday**: Flashcard mode daily (30 min)
- **Friday**: Memory Trainer intensive

### Week 3: Mastery
- **Daily**: Flashcards (20 min)
- **3x/week**: Quiz problems
- **2x/week**: Simulator practice
- **Before exam**: Cheatsheet review

## Key Formulas to Memorize (Critical)

1. **CPI = Base CPI + Stalls per instruction**
2. **AMAT = Hit time + Miss rate × Miss penalty**
3. **CPU time = Instructions × CPI × Clock period**
4. **Speedup = CPI(old) / CPI(new)**
5. **Branch penalty = Stages before resolution**

## Common Mistakes to Avoid

1. **Forgetting forwarding paths**: Forwarding eliminates most RAW hazards
2. **Misunderstanding AMAT**: Hit time is paid on EVERY access (hits + misses)
3. **Wrong CPI calculation**: Must account for ALL hazard sources
4. **Ignoring data/instruction separately**: Different miss rates for I$ and D$
5. **Control hazard myths**: Branch prediction reduces but doesn't eliminate penalty

## Practice Problems

### Easy (Warm-up)
- Calculate base CPI for simple pipeline
- Identify stage for given operations
- Memory hierarchy basics

### Medium (Standard Exams)
- Hazard detection in instruction sequence
- AMAT calculations with caches
- CPI with multiple stalls

### Critical (Competitive)
- Design forwarding logic
- Multi-level cache optimization
- Cache design trade-offs

## Success Metrics

Track your progress:
- [ ] Score 80%+ on Quiz Mode
- [ ] Complete Flashcard deck 3 times
- [ ] Understand every formula's context
- [ ] Solve custom problems in Simulator (>90% accuracy)
- [ ] Complete Memory Trainer (fast recall)

## Additional Resources

### Topics to Explore
- LEGv8 assembly language
- Hazard resolution strategies
- Cache replacement policies
- Memory subsystem design
- Performance optimization techniques

### External References
- Computer Organization & Design by Patterson & Hennessy
- Modern Processor Design by Shen & Lipasti
- Computer Architecture: A Quantitative Approach

## Getting Help

1. **Stuck on a formula?** - Use Explorer mode with examples
2. **Wrong quiz answer?** - Review the worked solution and retry
3. **Simulator confusion?** - Step through simple examples first
4. **Want more problems?** - Check quiz section for detailed explanations

---

**Target Mastery Time**: 3-4 weeks of consistent study
**Exam Confidence Level**: 90%+ after completing all modes
