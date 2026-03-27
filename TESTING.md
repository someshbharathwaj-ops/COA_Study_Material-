# Testing Guide

Quality assurance procedures for COA Study Material.

## Manual Testing Checklist

### Navigation & Layout
- [ ] Sidebar links all functional
- [ ] Active section highlighting works
- [ ] Smooth scrolling activates
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] Dark theme consistent across all sections
- [ ] No layout shifts during scroll

### Formula Tool (Cao5)
- [ ] All 50 formulas load correctly
- [ ] Search/filter works on all topics
- [ ] Difficulty badges display
- [ ] Copy button works and shows feedback
- [ ] Card expansion/collapse animations smooth

### Study Modes
**Formula Explorer**
- [ ] Topic tabs switch correctly
- [ ] Search highlights matched formulas
- [ ] Level filter works
- [ ] Cards open/close smoothly

**Flashcards**
- [ ] Random shuffle on start
- [ ] Reveal button works
- [ ] Both answer buttons function
- [ ] Progress bar advances correctly
- [ ] Completion screen shows
- [ ] Restart resets state

**Quiz Mode**
- [ ] All 6 questions load
- [ ] Hint formula displays
- [ ] Answer reveal works
- [ ] Scoring tracks correctly
- [ ] Results show final score
- [ ] Retry button resets

**Memory Trainer**
- [ ] Study phase shows formula
- [ ] Recall phase covers formula
- [ ] Timer counts down
- [ ] Success/retry buttons work
- [ ] Score accumulates

**Cheatsheet**
- [ ] Full grid displays
- [ ] Scrolling works
- [ ] All formulas visible
- [ ] Responsive on mobile

### Pipeline Simulator
- [ ] Instruction input accepts valid entries
- [ ] Step-by-step execution works
- [ ] Pipeline visualization updates
- [ ] Hazard highlighting shows/hides
- [ ] Forwarding paths display correctly
- [ ] Metrics calculate accurately

### Lessons (HTML)
- [ ] All 3 lessons load without errors
- [ ] Content readable (contrast adequate)
- [ ] Code examples render properly
- [ ] Scrolling is smooth
- [ ] Links work (no 404s)

### Performance
- [ ] Initial page load < 3 seconds
- [ ] Formula search responsive (< 100ms)
- [ ] Animations smooth (60 FPS)
- [ ] No memory leaks (check DevTools)
- [ ] No console errors
- [ ] Network requests reasonable

### Browser Compatibility

Test on:
| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Must pass |
| Firefox | Latest | ✅ Must pass |
| Safari | Latest | ✅ Must pass |
| Edge | Latest | ✅ Must pass |
| Mobile Chrome | Latest | ✅ Must pass |
| Mobile Safari | Latest | ✅ Should pass |

### Accessibility
- [ ] Keyboard navigation works (Tab/Shift+Tab)
- [ ] All buttons have focus indicators
- [ ] Color isn't only differentiator
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Zoom to 200% works
- [ ] Screen reader compatible (test with NVDA)

## Automated Testing (Future)

Setup for v1.1+:

### Unit Tests
```bash
npm install --save-dev vitest @testing-library/react
```

Example test:
```javascript
import { render, screen } from '@testing-library/react';
import FormulaCard from './FormulaCard';

test('formula card expands on click', () => {
  const formula = { title: 'Test', level: 'critical' };
  render(<FormulaCard formula={formula} />);
  
  const button = screen.getByRole('button', { name: 'Test' });
  fireEvent.click(button);
  
  expect(screen.getByText('Meaning:')).toBeVisible();
});
```

### E2E Tests
```bash
npm install --save-dev playwright
```

### Performance Testing
```bash
npm install --save-dev lighthouse
```

## Testing Scenarios

### Learning Path Test
User should be able to:
1. Open app → See intro
2. Click "Formulas" → See Formula Explorer
3. Filter by "critical" → See 18 formulas
4. Click flashcard mode → Start studying
5. Complete 10 flashcards → See progress

**Expected**: < 2 minutes setup time

### First-Time User Test
New user should:
1. Understand what each section does (tooltip/guidance)
2. Find entry point (obvious start button)
3. Complete one full study mode without help
4. Know next steps (progress tracking)

**Expected**: Intuitive, no guidance needed (except reading)

### Problem-Solving Test
For "Calculate CPI with hazards" quiz:
1. Read question carefully
2. Identify required formula
3. Perform calculation
4. Compare with worked solution
5. Understand any mistakes

**Expected**: User learns from mistakes

## Bug Report Template

```markdown
**Title**: [Short description]

**Environment**:
- Browser: Chrome 95
- OS: Windows 10
- Device: Desktop

**Steps to Reproduce**:
1. Go to '...'
2. Click '...'
3. Scroll to '...'
4. See error

**Expected**: [What should happen]
**Actual**: [What actually happened]

**Screenshots**: [If applicable]

**Console Errors**: [Any JavaScript errors?]
```

## Performance Benchmarks

Target metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 2s
- **Bundle size**: < 200KB (gzipped)

Check with:
```bash
npm run build
npm run preview
# Open DevTools > Lighthouse
```

## Regression Testing

Before each release:
- [ ] All 11 sections navigate correctly
- [ ] All 5 study modes fully functional
- [ ] No JavaScript console errors
- [ ] No visual regressions (screenshot comparison)
- [ ] Quiz calculations stay accurate
- [ ] Simulator hazard detection works

## Mobile Testing

Test on actual devices:
- [ ] iPhone 12/13 (Safari)
- [ ] Android 11+ (Chrome)
- [ ] iPad (various sizes)
- [ ] Landscape/portrait orientation
- [ ] Touch interactions work
- [ ] Text readable without zoom
- [ ] Buttons easily clickable (44px minimum)

## Accessibility Testing

Tools:
- **axe DevTools**: Automated accessibility scan
- **WAVE**: Browser extension for issues
- **NVDA**: Screen reader (Windows free)
- **JAWS**: Professional screen reader
- **Zoom**: Test at 200% magnification

## Load Testing

Simulate concurrent users:
```bash
npm install -g autocannon

# Benchmark development server
autocannon http://localhost:5173
```

Expected results:
- 1000 requests/second minimum
- Sub-100ms response time
- No memory leaks after 10k requests

## Continuous Integration

Setup GitHub Actions:
```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## Test Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Check:
```bash
npm run test -- --coverage
```

---

**Quality ensures learning effectiveness. Test thoroughly before releases!**
