import { PASSAGE, QUESTIONS } from './content.js?v=9';

const $ = (id) => document.getElementById(id);
const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const narrow = () => window.matchMedia('(max-width: 1000px)').matches;
const SENTENCES = Object.fromEntries(PASSAGE.flat().map(s => [s.id, s]));
const passage = $('passage');
const freshQuestion = () => ({ selected: null, submitted: false, struck: new Set(), tested: new Set(), evidence: null });
let state = QUESTIONS.map(freshQuestion), view = 0;
let lensOn = false;

passage.innerHTML = PASSAGE.map((paragraph, i) => `<p><span class="para-number" aria-label="Paragraph ${i + 1}">${i + 1}</span>${paragraph.map(s => {
  let text = esc(s.text);
  if (s.cue) text = text.replace(esc(s.cue), `<span class="cue">${esc(s.cue)}</span>`);
  return `<span class="s" data-id="${s.id}" data-voice="${s.voice}" title="${s.voice === 'narration' ? 'Background' : s.voice === 'author' ? 'Author’s position' : s.voice === 'critics' ? 'Critics’ position' : 'Restorers’ position'}">${text}</span>`;
}).join(' ')}</p>`).join('');
$('wordCount').textContent = `${PASSAGE.flat().map(s => s.text).join(' ').split(/\s+/).length} words`;

function lightSentences(ids = []) {
  passage.querySelectorAll('.s.lit').forEach(el => el.classList.remove('lit'));
  ids.forEach(id => passage.querySelector(`[data-id="${id}"]`)?.classList.add('lit'));
  if (ids.length && !narrow()) passage.querySelector(`[data-id="${ids[0]}"]`)?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
}
const nodeSentences = (node) => PASSAGE.flat().filter(s => s.node === node).map(s => s.id);
function evidenceMarkup(ids) {
  return ids.map(id => {
    const s = SENTENCES[id];
    const label = s.voice === 'narration' ? 'Background' : s.voice === 'author' ? 'Author’s position' : s.voice === 'critics' ? 'Critics’ position' : 'Restorers’ position';
    return `<blockquote class="source-quote"><span>${label} · Paragraph ${id.match(/^p(\d+)/)[1]}</span>“${esc(s.text)}”</blockquote>`;
  }).join('');
}
function setLens(on) {
  lensOn = on;
  passage.classList.toggle('voice-on', on);
  $('voiceLegend').hidden = !on;
  document.querySelectorAll('.lens-toggle').forEach(b => b.setAttribute('aria-checked', String(on)));
}

// Wrap text nodes independently: selections spanning paragraphs never move sentence metadata.
let savedRange = null;
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed && passage.contains(selection.anchorNode) && passage.contains(selection.focusNode)) savedRange = selection.getRangeAt(0).cloneRange();
});
$('hlBtn').addEventListener('mousedown', e => e.preventDefault());
$('hlBtn').addEventListener('click', () => {
  const range = savedRange;
  if (!range || !passage.contains(range.commonAncestorContainer)) {
    $('toolStatus').textContent = 'Select some passage text first.';
    return;
  }
  const walker = document.createTreeWalker(passage, NodeFilter.SHOW_TEXT);
  const segments = [];
  let node;
  while ((node = walker.nextNode())) {
    if (!node.parentElement.closest('.s') || node.parentElement.closest('mark') || !range.intersectsNode(node)) continue;
    const start = node === range.startContainer ? range.startOffset : 0;
    const end = node === range.endContainer ? range.endOffset : node.length;
    if (end > start) segments.push({ node, start, end });
  }
  segments.reverse().forEach(({ node, start, end }) => {
    const part = document.createRange();
    part.setStart(node, start); part.setEnd(node, end);
    const mark = document.createElement('mark'); mark.className = 'hl';
    part.surroundContents(mark);
  });
  window.getSelection()?.removeAllRanges(); savedRange = null;
  $('toolStatus').textContent = 'Selection highlighted. Use Clear highlights to remove all markings.';
});
function clearHighlights() {
  passage.querySelectorAll('mark.hl').forEach(mark => mark.replaceWith(...mark.childNodes));
  passage.normalize(); savedRange = null;
}
$('clearHL').addEventListener('click', () => { clearHighlights(); $('toolStatus').textContent = 'Highlights cleared.'; });
passage.addEventListener('click', e => {
  const mark = e.target.closest('mark.hl');
  if (mark) { mark.replaceWith(...mark.childNodes); passage.normalize(); savedRange = null; }
});

function go(next, focus = true) {
  view = [-2, 0, 1, 2].includes(next) ? next : 0;
  render();
  if (focus) {
    const target = $(view === -2 ? 'summaryTitle' : 'stem');
    target.focus({ preventScroll: true });
    $('questionPanel').scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  }
}
function render() {
  setLens(false); lightSentences();
  $('summaryView').hidden = view !== -2;
  $('qView').hidden = view < 0;
  $('qCounter').textContent = view === -2 ? 'Session review' : `Question ${view + 1} of ${QUESTIONS.length}`;
  document.querySelectorAll('[data-go]').forEach(b => {
    if (Number(b.dataset.go) === view) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
  });
  history.replaceState(null, '', view === -2 ? '#review' : `#q${view + 1}`);
  if (view === -2) renderSummary(); else renderQuestion();
}
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(Number(b.dataset.go))));
$('prevQ').addEventListener('click', () => go(view - 1));
$('nextQ').addEventListener('click', () => go(view === QUESTIONS.length - 1 ? -2 : view + 1));
$('restartBtn').addEventListener('click', () => { state = QUESTIONS.map(freshQuestion); clearHighlights(); go(0); });
$('toPassage').addEventListener('click', () => { $('readingPanel').focus(); $('readingPanel').scrollIntoView({ block: 'start' }); });
$('toQuestion').addEventListener('click', () => { $('questionPanel').focus(); $('questionPanel').scrollIntoView({ block: 'start' }); });

function renderQuestion() {
  const q = QUESTIONS[view], st = state[view];
  $('skill').textContent = `${q.activity} · ${q.skill}`;
  $('stem').textContent = q.stem;
  $('answerHint').hidden = st.submitted;
  $('choices').classList.toggle('locked', st.submitted);
  $('choices').innerHTML = q.choices.map(c => {
    const correct = st.submitted && c.id === q.answer, wrong = st.submitted && c.id === st.selected && !correct;
    return `<div class="choice ${st.struck.has(c.id) ? 'struck' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}" data-id="${c.id}"><label class="answer-label"><input type="radio" name="answer" value="${c.id}" ${st.selected === c.id ? 'checked' : ''} ${st.submitted ? 'disabled' : ''}><span class="letter">${c.id}</span><span class="ctext">${esc(c.text)}${correct ? '<strong class="answer-tag">Correct answer</strong>' : wrong ? '<strong class="answer-tag">Your answer</strong>' : ''}</span></label><button type="button" class="strike" data-strike="${c.id}" aria-label="Cross out choice ${c.id}" aria-pressed="${st.struck.has(c.id)}" ${st.submitted ? 'hidden' : ''}><span aria-hidden="true">⊖</span></button></div>`;
  }).join('');
  $('submitBtn').hidden = st.submitted; $('submitBtn').disabled = !st.selected;
  $('explain').hidden = !st.submitted;
  $('prevQ').disabled = view === 0;
  $('nextQ').textContent = view === QUESTIONS.length - 1 ? 'Review this session →' : 'Next question →';
  $('tool').innerHTML = '';
  if (st.submitted) renderExplanation(q, st);
}
$('choices').addEventListener('change', e => {
  const st = state[view];
  if (!st || st.submitted || e.target.name !== 'answer') return;
  st.selected = e.target.value; st.struck.delete(st.selected);
  e.target.closest('.choice').classList.remove('struck');
  e.target.closest('.choice').querySelector('.strike').setAttribute('aria-pressed', 'false');
  $('submitBtn').disabled = false;
});
$('choices').addEventListener('click', e => {
  const button = e.target.closest('[data-strike]'), st = state[view];
  if (!button || !st || st.submitted) return;
  const id = button.dataset.strike;
  if (st.struck.has(id)) st.struck.delete(id); else {
    st.struck.add(id);
    if (st.selected === id) { st.selected = null; button.closest('.choice').querySelector('input').checked = false; $('submitBtn').disabled = true; }
  }
  button.closest('.choice').classList.toggle('struck', st.struck.has(id));
  button.setAttribute('aria-pressed', String(st.struck.has(id)));
});
$('submitBtn').addEventListener('click', () => {
  const st = state[view]; if (!st?.selected || st.submitted) return;
  st.submitted = true; render();
  $('result').focus({ preventScroll: true });
  $('explain').scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
});
function renderExplanation(q, st) {
  const correct = st.selected === q.answer;
  $('result').className = `result ${correct ? 'ok' : 'no'}`;
  $('result').textContent = correct ? `Correct — ${q.answer}.` : `You chose ${st.selected}. The best answer is ${q.answer}.`;
  $('whyHead').textContent = `Why ${q.answer} is best supported`;
  $('explanation').textContent = q.explanation;
  $('takeaway').textContent = q.takeaway;
  const root = $('tool'); root.innerHTML = `<h3>${esc(q.toolHead)}</h3>`;
  ({ trace: buildTrace, voice: buildVoice, principle: buildPrinciple })[q.tool](root, q, st);
}

const effectLabels = { undercuts: 'Directly weakens paragraph 4', supports: 'Supports paragraph 3 instead', fits: 'Fits paragraph 5; leaves paragraph 4 intact', misses: 'Does not test paragraph 4’s claim' };
function buildTrace(root, q, st) {
  root.insertAdjacentHTML('beforeend', `<p class="hint">You have answered the question. Select a choice below to explore its explanation and see how it relates to the claim the question targets.</p>
    <div class="target-claim"><span class="eyebrow">The claim being tested · Paragraph 4</span><p>Cleaning cannot fully recover an original appearance without interpretation.</p></div>
    <div class="trace-options" role="group" aria-label="Explore answer explanations">${q.choices.map(c => `<button type="button" class="trace-button" data-choice="${c.id}" aria-pressed="false"><span class="letter">${c.id}</span><span>${esc(c.text)}</span></button>`).join('')}</div>
    <div class="trace-detail" aria-live="polite"></div>`);
  const trace = id => {
    const c = q.choices.find(choice => choice.id === id);
    st.evidence = id;
    root.querySelectorAll('[data-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.choice === id)));
    const ids = c.target ? nodeSentences(c.target) : ['p1s3'];
    root.querySelector('.trace-detail').innerHTML = `<div class="verdict ${c.effect}"><p class="eyebrow">Choice ${id}${id === q.answer ? ' · Correct answer' : ''}</p><h4>${effectLabels[c.effect]}</h4><p>${esc(c.rationale)}</p></div><details class="source-details"><summary>Read the relevant passage evidence</summary>${evidenceMarkup(ids)}</details>`;
    lightSentences(ids);
  };
  root.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => trace(button.dataset.choice)));
  trace(st.evidence || st.selected);
}
function buildVoice(root, q, st) {
  root.insertAdjacentHTML('beforeend', `<p class="hint">The colors mark whose position is being represented, even when the author reports someone else’s view. Background is narration by the author, not a fourth speaker. Choose an answer below to compare the relevant sentences; some evidence contradicts the choice.</p><button type="button" class="lens-toggle" id="lensBtn" role="switch" aria-checked="true"><span class="switch" aria-hidden="true"></span>Color the passage by viewpoint</button><div class="evidence-list">${q.choices.map(c => `<div class="voice-card"><button type="button" class="ev ${c.id === q.answer ? 'right' : ''}" data-evidence="${c.id}" aria-expanded="false"><span class="letter">${c.id}</span><span>${esc(c.text)}<span class="ev-action">Inspect evidence</span></span></button><div class="voice-detail" hidden></div></div>`).join('')}</div><p class="tool-feedback" role="status"></p>`);
  $('lensBtn').addEventListener('click', () => setLens(!lensOn));
  const show = (id) => {
    st.evidence = id;
    root.querySelectorAll('[data-evidence]').forEach(button => {
      const active = button.dataset.evidence === id;
      button.setAttribute('aria-expanded', String(active));
      const detail = button.parentElement.querySelector('.voice-detail'); detail.hidden = !active;
      if (active) { const c = q.choices.find(x => x.id === id); detail.innerHTML = `<p>${esc(c.rationale)}</p>${evidenceMarkup(c.evidence)}`; }
    });
    lightSentences(q.choices.find(c => c.id === id).evidence);
    root.querySelector('.tool-feedback').textContent = `Evidence for evaluating choice ${id} is shown below that choice.`;
  };
  root.querySelectorAll('[data-evidence]').forEach(button => button.addEventListener('click', () => show(button.dataset.evidence)));
  setLens(true); show(st.evidence || st.selected);
}
const MARKS = { yes: ['✓', 'Consistent'], no: ['✕', 'Conflicts'], unknown: ['?', 'Not specified'] };
function buildPrinciple(root, q) {
  root.insertAdjacentHTML('beforeend', `<p class="hint">Use two relevant priorities from paragraph 5. Compare the actions actually described; “not specified” means the choice does not give enough information for that check.</p><div class="rule">${q.criteria.map(c => `<button type="button" data-source="${c.source}"><b>${esc(c.label)}</b><span>${esc(c.note)}</span><span class="ev-action">Read source sentence</span></button>`).join('')}</div><div id="ruleSource" aria-live="polite"></div>
    <div class="comparison-wrap"><table class="grid"><caption>How the four choices fit the passage</caption><thead><tr><th scope="col">Response</th>${q.criteria.map(c => `<th scope="col">${esc(c.label)}</th>`).join('')}</tr></thead><tbody>${q.choices.map(c => `<tr class="${c.id === q.answer ? 'pass' : ''}"><th scope="row"><button type="button" class="plan" data-plan="${c.id}" aria-pressed="false"><span class="letter">${c.id}</span><span>${esc(c.text)}<span class="ev-action">Why this fits or fails</span></span></button></th>${q.criteria.map(cr => { const key = c.checks[cr.id]; return `<td data-label="${esc(cr.label)}"><span class="mark ${key} on" aria-hidden="true">${MARKS[key][0]}</span><span class="mark-text">${MARKS[key][1]}</span></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="verdicts" id="pVerdict" aria-live="polite"></div><div class="counterfactual"><p class="eyebrow">Optional exploration · Change one condition</p><h4>What if the later layer is causing damage?</h4><div class="chips" role="group" aria-label="Condition of the later layer"><button class="chip" type="button" data-condition="stable" aria-pressed="true">Stable layer</button><button class="chip" type="button" data-condition="damage" aria-pressed="false">Damaging layer</button></div><p id="conditionResult" aria-live="polite"></p></div>`);
  root.querySelectorAll('[data-source]').forEach(button => button.addEventListener('click', () => { lightSentences([button.dataset.source]); $('ruleSource').innerHTML = evidenceMarkup([button.dataset.source]); }));
  const show = (id) => {
    const c = q.choices.find(choice => choice.id === id);
    root.querySelectorAll('[data-plan]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.plan === id)));
    $('pVerdict').innerHTML = `<div class="verdict ${id === q.answer ? 'supports' : 'undercuts'}"><div class="vhead">${id === q.answer ? `${id} best fits the stated priorities` : `Why ${id} is less well supported`}</div><p>${esc(c.rationale)}</p></div>`;
  };
  root.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => show(button.dataset.plan)));
  const changeCondition = (condition) => {
    root.querySelectorAll('[data-condition]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.condition === condition)));
    $('conditionResult').textContent = condition === 'stable'
      ? 'In the original question, the layer is stable. The author’s exception for active damage does not justify removal, so preserving the layer while showing the earlier work is best supported.'
      : 'Active damage makes the qualification in paragraph 5 relevant: treatment to protect the object can be justified. The passage does not tell us which treatment is necessary, so it would not justify automatically removing the entire later layer. The original answer above applies to the stable-layer scenario.';
    lightSentences(condition === 'stable' ? ['p5s3'] : ['p5s1', 'p5s2']);
  };
  root.querySelectorAll('[data-condition]').forEach(button => button.addEventListener('click', () => changeCondition(button.dataset.condition)));
  show(q.answer); changeCondition('stable');
}
function renderSummary() {
  $('summaryList').innerHTML = QUESTIONS.map((q, i) => {
    const st = state[i];
    const status = !st.submitted ? 'Not yet answered' : st.selected === q.answer ? `Answered ${st.selected} · Correct` : `Answered ${st.selected} · Review the evidence`;
    return `<button type="button" class="summary-item" data-review="${i}"><span class="summary-number">0${i + 1}</span><span><strong>${q.activity}</strong><span>${status}</span></span><span aria-hidden="true">→</span></button>`;
  }).join('');
  $('summaryList').querySelectorAll('[data-review]').forEach(button => button.addEventListener('click', () => go(Number(button.dataset.review))));
}
const questionHash = location.hash.match(/^#q([1-3])$/);
go(questionHash ? Number(questionHash[1]) - 1 : location.hash === '#review' ? -2 : 0, false);
