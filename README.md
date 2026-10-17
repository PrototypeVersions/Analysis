# Analysis — Follow the reasoning

**Live:** https://prototypeversions.github.io/Analysis/

A focused demonstration of interactive CARS explanations: one original 504-word humanities passage and three questions. The learner reads the passage, answers a question, and explores the rationale for every option. There is no warm-up or separate argument-mapping quiz.

1. **Evaluate new evidence — Reasoning beyond the text.** An explicitly labeled Question 1 explanation connects three things: the author’s actual sentence in paragraph 4, the hypothetical finding in an answer option, and the finding’s effect on that claim. Buttons say “Why A is correct” and “Why B/C/D is incorrect”; the same source sentence stays highlighted for all four explanations. A visual comparison shows the author’s “no exact recovery” claim beside what each hypothetical finding establishes. The detailed three-step explanation remains available below it. Weakening that reason does not automatically refute the whole argument.
2. **Compare perspectives — Reasoning within the text.** An interactive overlap diagram shows the critics’ and author’s shared conclusion in answer A; each region opens its source quotations. A viewpoint lens and quoted evidence distinguish reported positions from the author's own position. Background narration is not treated as a separate speaker.
3. **Apply a position — Reasoning beyond the text.** A comparison checks the choices against relevant passage priorities, distinguishing a conflict from an unspecified detail. An optional condition toggle explores why active damage would change the reasoning.

The two beyond-the-text tasks and one within-the-text task illustrate selected skills; this is not a claim to reproduce the full CARS blueprint. Definitions follow the [AAMC overview](https://students-residents.aamc.org/whats-mcat-exam/critical-analysis-and-reasoning-skills-section-overview) and [official content description](https://students-residents.aamc.org/media/9271/download).

## Interaction and accessibility

- Native radio inputs, independent cross-out controls, visible keyboard focus, text labels for color-coded meanings, and source quotations beside explanations.
- Question navigation, a session review, and reset. Progress is held only in memory in the current tab; reloading starts a fresh attempt.
- Passage highlights preserve sentence boundaries and evidence associations, even across paragraphs.
- Responsive reading and question panels, with links to move between them on smaller screens.
- No accounts, analytics, scoring predictions, or time limit. Feedback is available after each answer and can inform later questions.

## Source

Plain HTML, CSS, and ES modules; no build step. `js/content.js` contains the passage, choices, answer keys, and rationales. `js/app.js` handles interactions. GitHub Pages serves the repository root.

Original practice material developed with AI assistance for Blake A. Myers. The constructed debate is for close reading, not professional conservation advice. This is an independent teaching prototype, not a validated assessment or a full exam simulation. It is not affiliated with AAMC or UWorld.
