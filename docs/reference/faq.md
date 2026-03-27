# Frequently Asked Questions (FAQ)

## Learning & Study

### Q: How much time do I need to study to master COA?
**A:** Most students need 3-4 weeks of consistent study:
- Week 1: Foundations (8-10 hours)
- Week 2: Challenges (8-10 hours)
- Week 3+: Practice & mastery (5-7 hours/week)

Total: **25-30 hours for solid understanding**, 40+ hours for competitive mastery.

### Q: What's the best way to use this platform?
**A:** Follow the recommended learning path:
1. Read Lesson 1 in `lessons/01-pipeline-fundamentals.html` - 1 hour
2. Explore formulas - 30 minutes
3. Use simulator - 1 hour
4. Flashcards daily - 30 minutes
5. Take quiz - 1 hour
6. Practice problems - 2 hours

See [`../guides/study-guide.md`](../guides/study-guide.md) for a detailed plan.

### Q: I don't understand a formula. Help?
**A:** Try these in order:
1. **Formula Explorer**: Expand card for meaning & example
2. **Glossary**: Search for related terms in [`glossary.md`](glossary.md)
3. **Quiz**: See worked solutions
4. **Lessons**: Read context in HTML lessons
5. **Memory Trainer**: Active recall builds understanding

### Q: Should I memorize all 50 formulas?
**A:** No! Focus on:
- **Must memorize** (8): CPI, AMAT, Speedup, Throughput, Branch penalty, Memory stalls, Address breakdown, Control signals
- **Must understand** (15): When to use each formula
- **Good to know** (27): Less common specialized formulas

Use difficulty levels (critical/medium/easy) as guide.

### Q: How do I track progress?
**A:** Monitor these:
- Quiz score (target: 80%+)
- Flashcard mastery (all cards "know")
- Memory Trainer speed (< 5 min recall)
- Custom problem accuracy (> 90%)

Save screenshots for motivation!

### Q: Can I skip lessons and go straight to formulas?
**A:** Not recommended. Lessons provide **context** which helps formulas stick. Minimum path:
1. Spend 1 hour on Lesson 1
2. Then jump to formulas
3. Return to Lessons 2-3 when confused

### Q: What if I have 1 week to exam?
**A:** Intensive study plan:
- **Days 1-2**: Cheatsheet intensive review
- **Days 3-4**: Quiz questions (solve all 6 multiple times)
- **Days 5-6**: Memory Trainer for recall speed
- **Day 7**: Mixed review + redo mistake topics

Target: Safe passing (70%+) with this approach.

---

## Technical Questions

### Q: Why does the site feel slow on first load?
**A:** First load includes:
- All 50+ formula data
- Interactive component initialization
- Style calculations

Subsequent loads are instant (browser caching). If truly slow:
1. Check internet speed (test on speedtest.net)
2. Try different browser
3. Clear cache: Ctrl+Shift+Delete
4. See [`../project/deployment.md`](../project/deployment.md) for optimization

### Q: Can I use this offline?
**A:** Currently no, but it's planned for v1.1. For now:
- Print HTML lessons
- Screenshots formulas
- Use Memory Trainer (no internet needed after load)

### Q: Which browser should I use?
**A:** Best experience on:
- **Recommended**: Chrome 90+, Firefox 88+
- **Also works**: Safari 14+, Edge 90+
- **Mobile**: iOS Safari, Chrome Android

Avoid Internet Explorer (not supported).

### Q: How do I fix "Formula not loading"?
**A:** Try:
1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear cache**: Settings → Clear browsing data
3. **Different browser**: Rules out browser issue
4. **Report issue**: Tell us what formula failed

### Q: Can I export my progress?
**A:** In v1.1 yes! Current workaround:
- Screenshot quiz results
- Note flashcard completion
- Use browser DevTools console to access localStorage (advanced users)

### Q: Will my data be saved?
**A:** Currently uses browser localStorage (stays on your device). Not synced across devices yet. Future versions will offer cloud sync.

---

## Content Questions

### Q: Are there more formulas in a different area?
**A:** All 50 formulas are in Formula Brain. No hidden ones. Organized by topic:
- Pipelining (6)
- Hazards (6)
- Memory (6)
- Cache Addressing (4)
- Cache Design (4)
- Datapath (5)
- Plus 19 others

### Q: Can I add my own formulas/problems?
**A:** Yes! See [CONTRIBUTING.md](CONTRIBUTING.md). Process:
1. Fork repo on GitHub
2. Add to `tools/formula-brain.jsx` or `tools/pipeline-simulator.jsx`
3. Submit pull request
4. Get credited in changelog

### Q: Why are some quiz answers long?
**A:** Because learning is in the **working**! Each solution shows:
- Step-by-step calculation
- Common mistakes to avoid
- Intuition for formula
- Related concepts

Reading through === learning process.

### Q: Are these real exam questions?
**A:** No, they're inspired by common patterns but original. They're representative of **difficulty level**, not actual exams.

---

## Troubleshooting

### Q: Formula styling looks broken?
**A:** Most likely CSS issue. Fix:
1. Hard refresh (Ctrl+Shift+R)
2. Disable extensions (especially dark mode extensions)
3. Check zoom level (should be 100%)
4. Try incognito window (rules out extensions)

### Q: Simulator won't let me enter instructions?
**A:** Simulator requires proper format:
- Valid instruction: `add $1, $2, $3`
- Valid syntax: `opcode $rd, $rs, $rt`
- Not valid: `ADD R1 R2 R3` (wrong case/format)

See lesson for proper assembly syntax.

### Q: Quiz answer seems wrong to me?
**A:** Possible issues:
1. Misread the question (re-read carefully)
2. Different rounding method (usually okay)
3. Genuinely incorrect (report as issue!)

Before reporting, check:
- Formula used is correct
- Numbers entered correctly
- Units match (cycles vs seconds, etc.)

### Q: Flashcards not syncing between sites?
**A:** Flashcards use browser localStorage. They're **per-device**, not cloud-synced. Current behavior:
- Phone flashcards ≠ laptop flashcards
- Clear browser cache = lose progress

Workaround: Use same device for consistency. Cloud sync coming in v1.1.

---

## Account & Access

### Q: Do I need an account?
**A:** No! Completely free and anonymous. No sign-up required.

### Q: Is my data secure?
**A:** Yes! We don't collect/store personal data. Only your browser's localStorage is used.

### Q: Can I share access with classmates?
**A:** Yes! Share the URL. Everyone gets a fresh copy.

### Q: Who owns this platform?
**A:** Open-source project by Somesh Bharathwaj. MIT licensed. You own your usage.

---

## Performance & Optimization

### Q: Why is the site slow?
**A:** Possible causes:
1. **Internet**: Test download speed (need 1Mbps minimum)
2. **Browser**: Too many extensions → try incognito
3. **Device**: Old device → try simpler browser (Firefox Lite)
4. **Network**: WiFi dropping → switch to wired/mobile hotspot

### Q: How can I speed up formula loading?
**A:**
- Disable dark mode extensions
- Close unnecessary tabs
- Clear browser cache
- Use Chrome (typically fastest)

### Q: Should I upgrade my computer to use this?
**A:** No! Works on older devices. Minimum specs:
- RAM: 512MB
- Browser: Any from 2018+
- Internet: 1Mbps

If slow, it's software not hardware.

---

## Community & Contribution

### Q: Can I contribute problems/formulas?
**A:** Absolutely! Fork on GitHub and submit PR. See [CONTRIBUTING.md](CONTRIBUTING.md).

### Q: How do I report a bug?
**A:** Open GitHub issue with:
- What happened
- What you expected
- Screenshot if possible
- Browser/device info

### Q: Can I translate this to another language?
**A:** Yes! We're planning v2.0 multi-language. Get involved early:
1. Open issue expressing interest
2. We'll coordinate translation
3. Get credited as translator

### Q: How can I suggest improvements?
**A:** GitHub issues or discussions. Include:
- What you want
- Why it would help
- How it relates to COA learning

Community votes determine priority!

---

## Still Have Questions?

1. **Search existing issues**: GitHub Issues
2. **Check documentation**: Start with README.md
3. **Open new issue**: GitHub Issues → New Issue
4. **Email**: Contact Somesh (in repository)

*Most questions answered within 24 hours!*

---

**Last Updated**: v1.0.0 release
**Next FAQ Update**: After v1.1 feedback collection
