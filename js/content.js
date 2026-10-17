// Original passage and questions. Every sentence carries who is speaking (voice) and,
// where it belongs to the argument's skeleton, which map node it supports.

export const PASSAGE = [
  [
    { id: 'p1s1', voice: 'narration', text: 'When conservators finished cleaning a celebrated Renaissance fresco cycle, the colors that emerged were startlingly bright: acid greens, hot pinks, clear lemon yellows.' },
    { id: 'p1s2', voice: 'narration', text: 'Generations of viewers had known the same figures as sober and smoky.' },
    { id: 'p1s3', voice: 'narration', text: 'Many visitors were delighted; some critics were appalled.' },
    { id: 'p1s4', voice: 'critics', cue: 'they charged', text: 'The restorers, they charged, had not uncovered the painting but invented a new one.' },
  ],
  [
    { id: 'p2s1', voice: 'narration', text: 'Behind the quarrel lies a view of authenticity that most restorers share.' },
    { id: 'p2s2', voice: 'restorers', node: 'OV', cue: 'On this view', text: 'On this view, a work of art is authentic to the degree that it matches the object as it left the artist’s hands.' },
    { id: 'p2s3', voice: 'restorers', node: 'OV', text: 'Grime, yellowed varnish, and the retouchings of later centuries are accretions; removing them returns us to the real thing.' },
    { id: 'p2s4', voice: 'restorers', node: 'OV', text: 'The restorer’s ideal is to make time run backward.' },
  ],
  [
    { id: 'p3s1', voice: 'author', node: 'T', cue: 'I want to suggest', text: 'I want to suggest that this ideal, however natural it seems, rests on a confusion.' },
    { id: 'p3s2', voice: 'author', node: 'T', text: 'A painting is not a frozen event but a physical object with a history, and some of that history cannot be separated from what the work has come to mean.' },
    { id: 'p3s3', voice: 'author', node: 'R1', text: 'The dimming of a canvas is not merely dirt laid over meaning; for centuries it has shaped how the work was seen, copied, and described.' },
    { id: 'p3s4', voice: 'author', node: 'R1', text: 'When a later painter studied a master’s “somber palette,” the somberness he learned from was real, even if the master never intended it.' },
    { id: 'p3s5', voice: 'author', node: 'R1', text: 'To scrub it away is to erase the evidence of a conversation in which the work took part.' },
  ],
  [
    { id: 'p4s1', voice: 'author', node: 'R2', cue: 'Nor can', text: 'Nor can the restorer’s ideal be fully achieved.' },
    { id: 'p4s2', voice: 'author', node: 'R2', text: 'Pigments do not merely darken; some fade, some shift in hue, and some react with their neighbors.' },
    { id: 'p4s3', voice: 'author', node: 'R2', text: 'No cleaning can return a four-hundred-year-old surface to its first day; at best it produces a new state, guided by the restorer’s judgment about what the artist must have wanted.' },
    { id: 'p4s4', voice: 'author', node: 'R2', text: 'That judgment may be well informed, but it is a judgment, and to present its results as “the original” is to disguise interpretation as discovery.' },
  ],
  [
    { id: 'p5s1', voice: 'author', node: 'C', cue: 'None of this means', text: 'None of this means that paintings should be left to decay.' },
    { id: 'p5s2', voice: 'author', node: 'C', text: 'Stabilizing flaking paint or halting active damage serves every view of authenticity, since it preserves the object whose history we care about.' },
    { id: 'p5s3', voice: 'author', node: 'Rec', cue: 'What I resist', text: 'What I resist is the further step of erasing that history for the sake of an origin we can only approximate.' },
    { id: 'p5s4', voice: 'author', node: 'Rec', text: 'A restored painting should wear its age honestly, and where intervention is unavoidable, it should remain visible to the informed eye: a repair rather than a disguise.' },
  ],
];

export const VOICES = {
  author: { label: 'The author' },
  restorers: { label: 'The restorers’ view' },
  critics: { label: 'The critics’ view' },
  narration: { label: 'Background' },
};

// Skeleton of the argument. x, y, w, h are in a 640 × 380 layout.
export const NODES = {
  R1: { kind: 'Reason for the claim', where: 'paragraph 3', text: 'Aging has shaped how the work was seen, copied, and described', x: 20, y: 16, w: 280, h: 80 },
  R2: { kind: 'Reason for the claim', where: 'paragraph 4', text: 'No cleaning can recover the original; it produces an interpretation', x: 340, y: 16, w: 280, h: 80 },
  T: { kind: 'Author’s main claim', where: 'paragraph 3', text: 'A painting’s history is part of what it is, so the restorers’ ideal is confused', x: 20, y: 150, w: 316, h: 82 },
  OV: { kind: 'View the author rejects', where: 'paragraph 2', text: 'Authentic means “as it left the artist’s hands”: strip away later accretions', x: 400, y: 150, w: 220, h: 82 },
  Rec: { kind: 'Recommendation', where: 'paragraph 5', text: 'Restored paintings should wear their age, with repairs left visible', x: 20, y: 286, w: 316, h: 80 },
  C: { kind: 'Limit the author grants', where: 'paragraph 5', text: 'Stabilizing active damage is still fine', x: 400, y: 286, w: 220, h: 80 },
};

export const EDGES = [
  { from: 'R1', to: 'T', kind: 'supports', d: 'M160 96 L150 148' },
  { from: 'R2', to: 'T', kind: 'supports', d: 'M470 96 C 470 128, 330 124, 300 148' },
  { from: 'T', to: 'OV', kind: 'rejects', d: 'M336 191 L398 191', label: 'rejects', lx: 367, ly: 182 },
  { from: 'T', to: 'Rec', kind: 'supports', d: 'M178 232 L178 284' },
  { from: 'C', to: 'Rec', kind: 'concedes', d: 'M400 326 L338 326', label: 'qualifies', lx: 368, ly: 317 },
];

export const QUESTIONS = [
  {
    skill: 'Reasoning within the text',
    tool: 'map',
    focusNode: 'R2',
    focusLabel: 'This box is paragraph 4’s argument',
    stemFocus: 'paragraph 4',
    toolIntro: 'Paragraph 4 argues that no cleaning can return an old painting to its first state, so a cleaned painting is really an interpretation. On this map of the whole argument, that is the marked box: one of the two reasons the author gives for the main claim. (Paragraph 4 is also marked in blue in the passage.) A choice challenges paragraph 4 only if it lands on that box. Test each choice below to see where it lands.',
    toolHead: 'Where each choice lands in the argument',
    stem: 'Which of the following findings, if true, would most seriously challenge the author’s argument in paragraph 4?',
    choices: [
      {
        id: 'A',
        text: 'Spectral analysis can identify the original hue of every pigment in a painting, allowing its surface to be returned precisely to its first state.',
        target: 'R2', effect: 'undercuts',
        rationale: 'Paragraph 4 depends on the claim that no cleaning can return an old surface to its first day, so a cleaned painting is only an interpretation. If analysis could recover every original hue exactly, restoration would be discovery after all, and the paragraph’s argument would fail.',
      },
      {
        id: 'B',
        text: 'Most museum visitors prefer paintings that have been cleaned to those that have not.',
        target: null, effect: 'misses',
        rationale: 'What visitors prefer says nothing about whether restoration can reach the original. The passage already grants that many visitors were delighted (paragraph 1); the author’s argument never depends on what viewers like.',
      },
      {
        id: 'C',
        text: 'Painters in later centuries often based their own palettes on darkened versions of earlier works.',
        target: 'R1', effect: 'supports',
        rationale: 'This helps the author rather than hurting them. It is evidence for paragraph 3’s claim that aging shaped how works were seen and copied, and it does not touch paragraph 4 at all.',
      },
      {
        id: 'D',
        text: 'Stabilizing flaking paint sometimes requires adding new material to a painting’s surface.',
        target: 'C', effect: 'fits',
        rationale: 'This fits the limit the author grants in paragraph 5: stabilizing damage is acceptable. It is consistent with the passage and leaves paragraph 4’s claim untouched.',
      },
    ],
    answer: 'A',
    explanation: 'Paragraph 4 gives the author’s second reason for rejecting the restorers’ ideal: the ideal cannot be reached, because aging changes pigments in ways no cleaning can reverse. Choice A would remove that reason. If every original hue could be identified and restored, cleaning really could return a painting to its first state, and restoration would be discovery rather than interpretation.',
    takeaway: 'To weaken an argument, find the claim it depends on, then choose the finding that would make that claim false. Here, paragraph 4 depends on the claim that no cleaning can recover the original. Choices that support the argument (C), fit it (D), or address something it never relies on (B) are traps.',
  },
  {
    skill: 'Foundations of comprehension',
    tool: 'voice',
    toolHead: 'Whose words each choice relies on',
    stem: 'Based on the passage, the author would most likely agree with the critics described in paragraph 1 that:',
    choices: [
      {
        id: 'A',
        text: 'the cleaned fresco is not, strictly speaking, the painting as its artist left it.',
        evidence: ['p1s4', 'p4s3', 'p4s4'],
        rationale: 'The critics charged that the restorers “invented a new one.” The author reaches a more careful version of the same point in paragraph 4: cleaning at best “produces a new state,” so presenting it as “the original” disguises interpretation as discovery.',
      },
      {
        id: 'B',
        text: 'the restorers introduced colors that the artist never used.',
        evidence: ['p1s4', 'p4s4'],
        rationale: 'Tempting, because it echoes the critics’ word “invented.” But the author never accuses the restorers of adding colors; their judgment “may be well informed.” The author’s objection is to calling the result the original, not to fabrication.',
      },
      {
        id: 'C',
        text: 'visitors were wrong to be delighted by the brighter colors.',
        evidence: ['p1s3'],
        rationale: 'The passage reports that visitors were delighted but never judges their reaction. The author’s argument concerns what restoration can claim to recover, not whether its results can be enjoyed.',
      },
      {
        id: 'D',
        text: 'the fresco should have been left untreated, whatever its condition.',
        evidence: ['p5s1', 'p5s2'],
        rationale: 'The critics never say this, and the author rejects it outright: paintings should not be left to decay, and stabilizing damage “serves every view of authenticity.”',
      },
    ],
    answer: 'A',
    explanation: 'This question asks where two voices overlap. The critics claim the restorers invented a new painting. The author never repeats that charge, but paragraph 4 reaches a related, more careful conclusion: cleaning yields a new state, an interpretation rather than the original. Choice A keeps that shared core and drops the accusation.',
    takeaway: 'When a question asks whether the author agrees with someone, look for partial agreement. Here, the author shares the critics’ core point but not their charge of invention. The right answer usually keeps the shared core and drops the strongest wording; a choice that repeats the other party’s exact charge (B) is often the trap.',
  },
  {
    skill: 'Reasoning beyond the text',
    tool: 'principle',
    toolHead: 'Each response tested against the author’s rule',
    stem: 'A museum learns that a seventeenth-century altarpiece was extensively overpainted in the nineteenth century by an artist who “corrected” its figures. The overpainting is stable and is not damaging the panel beneath it. Based on the passage, which response would the author most likely favor?',
    ruleSource: 'paragraphs 4 and 5',
    criteria: [
      { id: 'history', label: 'Keeps the work’s history', source: 'p5s3', note: 'Do not erase history for an approximate origin.' },
      { id: 'honest', label: 'Hides nothing', source: 'p5s4', note: 'A repair rather than a disguise.' },
      { id: 'claim', label: 'Doesn’t claim to restore the original', source: 'p4s4', note: 'Do not disguise interpretation as discovery.' },
    ],
    choices: [
      {
        id: 'A',
        text: 'Remove the overpainting, since it was never part of the original artist’s design.',
        checks: { history: 'no', honest: 'na', claim: 'no' },
        rationale: 'This is the restorers’ ideal from paragraph 2: treat later retouchings as accretions and strip them away to reach the artist’s intention. The author rejects erasing a work’s history “for the sake of an origin we can only approximate.”',
      },
      {
        id: 'B',
        text: 'Keep the overpainting, and publish technical images showing the earlier layer beneath it.',
        checks: { history: 'yes', honest: 'yes', claim: 'yes' },
        rationale: 'The overpainting is part of the altarpiece’s history, so the author would keep it. Publishing images of the earlier layer adds knowledge without erasing anything or presenting a reconstruction as the original. It meets every part of the rule.',
      },
      {
        id: 'C',
        text: 'Remove the overpainting, but keep a detailed photographic record of it for scholars.',
        checks: { history: 'no', honest: 'yes', claim: 'no' },
        rationale: 'Tempting, because nothing is concealed and the record survives. But the author cares about the object’s history, not a record of what was taken from it. The overpainting would still be erased from the painting itself, in pursuit of the original.',
      },
      {
        id: 'D',
        text: 'Keep the overpainting, but retouch the edges where the two painters’ work meets so that the boundary can no longer be seen.',
        checks: { history: 'yes', honest: 'no', claim: 'yes' },
        rationale: 'Keeping the overpainting is right, but hiding the seam between the two painters disguises the work’s history. The author wants interventions to remain “visible to the informed eye.”',
      },
    ],
    answer: 'B',
    explanation: 'The scenario has a twist: nothing is decaying, so the question is purely about history. The author treats a work’s later life, including later retouchings, as part of what it is. Choice B keeps the overpainting, adds knowledge instead of subtracting history, and makes no claim to recover the original.',
    takeaway: 'For application questions, turn the author’s stance into a short rule, then test each choice against every part of it. Here, every wrong response breaks at least one part, including C, which sounds responsible because it keeps a record.',
  },
];

// Warm-up: sort key sentences by the job each does, before any question.
export const ROLES = ['Author’s main claim', 'Reason for the claim', 'View the author rejects', 'Limit the author grants', 'Recommendation'];
export const BUILD = [
  { id: 'p2s2', role: 'View the author rejects', why: '“On this view” reports the restorers’ position, which the author goes on to reject.' },
  { id: 'p3s1', role: 'Author’s main claim', why: '“I want to suggest” marks the author’s own central claim, which the rest of the passage defends.' },
  { id: 'p3s3', role: 'Reason for the claim', why: 'It supports the main claim: the aging of a painting is part of how the work was seen and used.' },
  { id: 'p4s3', role: 'Reason for the claim', why: '“Nor can…” opens a second, independent reason: the restorers’ goal cannot actually be reached.' },
  { id: 'p5s1', role: 'Limit the author grants', why: '“None of this means…” limits the author’s own argument: letting paintings decay is still not acceptable.' },
  { id: 'p5s4', role: 'Recommendation', why: 'It says what should be done, given the argument: let paintings wear their age, with repairs left visible.' },
];
