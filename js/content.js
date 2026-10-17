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
  R1: { kind: 'Reason', where: 'paragraph 3', text: 'Aging has shaped how the work was seen, copied, and described', x: 20, y: 16, w: 280, h: 80 },
  R2: { kind: 'Reason', where: 'paragraph 4', text: 'No cleaning can recover the original; it produces an interpretation', x: 340, y: 16, w: 280, h: 80 },
  T: { kind: 'Thesis', where: 'paragraph 3', text: 'A painting’s history is part of what it is, so the restorers’ ideal is confused', x: 20, y: 150, w: 316, h: 82 },
  OV: { kind: 'Opposing view', where: 'paragraph 2', text: 'Authentic means “as it left the artist’s hands”: strip away later accretions', x: 400, y: 150, w: 220, h: 82 },
  Rec: { kind: 'Recommendation', where: 'paragraph 5', text: 'Restored paintings should wear their age, with repairs left visible', x: 20, y: 286, w: 316, h: 80 },
  C: { kind: 'Concession', where: 'paragraph 5', text: 'Stabilizing active damage is still fine', x: 400, y: 286, w: 220, h: 80 },
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
        rationale: 'This fits the author’s concession in paragraph 5 that stabilizing damage is acceptable. It is consistent with the passage and leaves paragraph 4’s claim untouched.',
      },
    ],
    answer: 'A',
    explanation: 'Paragraph 4 gives the author’s second reason for rejecting the restorers’ ideal: the ideal cannot be reached, because aging changes pigments in ways no cleaning can reverse. A finding that makes the ideal reachable removes that reason. Drop each choice into the argument below to see where it lands.',
    takeaway: 'To weaken an argument, find the claim it depends on and look for a choice that makes that claim false. Choices that support the argument, or that concern something the argument never relies on, are traps.',
  },
  {
    skill: 'Foundations of comprehension',
    tool: 'voice',
    stem: 'The claim in paragraph 2 that removing accretions “returns us to the real thing” is presented in the passage as:',
    choices: [
      {
        id: 'A',
        text: 'a view the author attributes to others and then disputes.',
        evidence: ['p2s1', 'p2s3', 'p3s1'],
        rationale: 'The sentence sits inside the restorers’ view, introduced as “a view of authenticity that most restorers share” and marked by “On this view.” Paragraph 3 opens with the author’s rejection: the ideal “rests on a confusion.”',
      },
      {
        id: 'B',
        text: 'the author’s own conclusion, supported by the evidence in paragraph 1.',
        evidence: ['p1s3', 'p1s4', 'p2s3'],
        rationale: 'Paragraph 1 only reports a dispute; it offers no evidence for this claim. And the claim is not the author’s. In the voice lens, it belongs to the restorers.',
      },
      {
        id: 'C',
        text: 'a concession the author makes before stating the thesis.',
        evidence: ['p5s1', 'p5s2'],
        rationale: 'The author’s only concession comes in paragraph 5, after the thesis: paintings should not be left to decay. The author never grants that removing accretions recovers the real thing.',
      },
      {
        id: 'D',
        text: 'a principle the author applies in the recommendation of paragraph 5.',
        evidence: ['p5s3', 'p5s4'],
        rationale: 'Paragraph 5 recommends the opposite. Paintings should “wear their age,” keeping exactly the history this claim would strip away.',
      },
    ],
    answer: 'A',
    explanation: 'CARS passages often lay out views the author does not hold. Here the signal phrase “On this view” marks the sentence as the restorers’ position, and the next paragraph begins with the author rejecting it. Turn on the voice lens to see who is speaking in every sentence, then check where each choice’s evidence actually comes from.',
    takeaway: 'Before deciding what the author believes, track who is speaking. Phrases like “on this view,” “they charged,” and “I want to suggest” mark shifts between reported views and the author’s own.',
  },
  {
    skill: 'Reasoning beyond the text',
    tool: 'principle',
    stem: 'A museum must treat a seventeenth-century portrait whose paint is flaking and whose varnish has yellowed. Based on the passage, which plan would the author most likely endorse?',
    criteria: [
      { id: 'halt', label: 'Stops the damage', source: 'p5s1', note: 'Paintings should not be left to decay.' },
      { id: 'age', label: 'Keeps the work’s age', source: 'p5s3', note: 'Do not erase history for an approximate origin.' },
      { id: 'visible', label: 'Repairs stay visible', source: 'p5s4', note: 'A repair rather than a disguise.' },
    ],
    choices: [
      {
        id: 'A',
        text: 'Remove the yellowed varnish to reveal the original colors, then stabilize the flaking paint.',
        checks: { halt: 'yes', age: 'no', visible: 'na' },
        rationale: 'Stabilizing is fine, but stripping the varnish to “reveal the original colors” is the step the author resists: erasing the work’s history for an origin that can only be approximated.',
      },
      {
        id: 'B',
        text: 'Stabilize the flaking paint, keep the varnish, and fill small losses with a tone slightly lighter than the surrounding paint.',
        checks: { halt: 'yes', age: 'yes', visible: 'yes' },
        rationale: 'This plan halts the damage, keeps the painting’s aged surface, and leaves the fills visible to an informed eye. It meets every part of the author’s rule.',
      },
      {
        id: 'C',
        text: 'Leave the painting untouched so that no part of its history is altered.',
        checks: { halt: 'no', age: 'yes', visible: 'na' },
        rationale: 'The author explicitly rejects letting paintings decay. Leaving active flaking untreated fails the first part of the rule, however faithful it is to the painting’s history.',
      },
      {
        id: 'D',
        text: 'Stabilize the flaking paint and fill losses with paint matched so closely that the repairs cannot be seen.',
        checks: { halt: 'yes', age: 'yes', visible: 'no' },
        rationale: 'Close, but invisible fills are exactly what the author calls a disguise. The passage asks for repairs that remain visible to the informed eye.',
      },
    ],
    answer: 'B',
    explanation: 'Paragraph 5 gives the author’s working rule: halt damage, do not erase the work’s age, and keep unavoidable repairs visible. Three of the plans satisfy only part of that rule. Run the test to check every plan against all three parts.',
    takeaway: 'For application questions, turn the author’s stance into a short rule, then test each choice against every part of it. Wrong answers usually satisfy part of the rule, not all of it.',
  },
];
