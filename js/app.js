import { PASSAGE, NODES, EDGES, QUESTIONS, ROLES, BUILD } from './content.js?v=6';

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const narrow = () => window.matchMedia('(max-width: 1000px)').matches;
const SENTENCES = Object.fromEntries(PASSAGE.flat().map((s) => [s.id, s]));
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------------------------------------------------------------- passage
const passageEl = $('passage');
passageEl.innerHTML = PASSAGE.map((para) => `<p>${para.map((s) => {
  let html = esc(s.text);
  if (s.cue) html = html.replace(esc(s.cue), `<span class="cue">${esc(s.cue)}</span>`);
  return `<span class="s" data-id="${s.id}" data-voice="${s.voice}"${s.node ? ` data-node="${s.node}"` : ''}>${html}</span>`;
}).join(' ')}</p>`).join('');

// "Lit" sentences are the app pointing at evidence (blue); the reader's own highlights stay yellow.
function lightSentences(ids, scroll = true) {
  passageEl.querySelectorAll('.s.lit').forEach((e) => e.classList.remove('lit'));
  if (!ids || !ids.length) return;
  let first = null;
  for (const id of ids) {
    passageEl.querySelectorAll(`.s[data-id="${id}"]`).forEach((e) => { e.classList.add('lit'); first = first || e; });
  }
  if (scroll && first && !narrow()) first.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
}
const nodeSentences = (node) => PASSAGE.flat().filter((s) => s.node === node).map((s) => s.id);

// Highlighter: wraps the current selection inside the passage; click a highlight to remove it.
$('hlBtn').addEventListener('mousedown', (e) => e.preventDefault());
$('hlBtn').addEventListener('click', () => {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return;
  const range = sel.getRangeAt(0);
  if (!passageEl.contains(range.commonAncestorContainer)) return;
  const mark = document.createElement('mark');
  mark.className = 'hl';
  try {
    mark.appendChild(range.extractContents());
    range.insertNode(mark);
  } catch { return; }
  sel.removeAllRanges();
});
passageEl.addEventListener('click', (e) => {
  const m = e.target.closest('mark.hl');
  if (!m) return;
  const parent = m.parentNode;
  while (m.firstChild) parent.insertBefore(m.firstChild, m);
  m.remove();
  parent.normalize();
});

// ---------------------------------------------------------------- navigation
// view -1 is the warm-up; 0..2 are the questions.
const freshQ = () => ({ selected: null, submitted: false, struck: new Set(), tool: {} });
let state = QUESTIONS.map(freshQ);
let warm = { i: 0, firstTry: 0, missed: false, done: false };
let view = -1;

function render() {
  setLens(false);
  lightSentences(null);
  const isWarm = view === -1;
  $('warmView').hidden = !isWarm;
  $('qView').hidden = isWarm;
  $('qCounter').textContent = isWarm ? 'Warm-up' : `Question ${view + 1} of ${QUESTIONS.length}`;
  $('prevQ').disabled = isWarm;
  $('nextQ').disabled = view === QUESTIONS.length - 1;
  history.replaceState(null, '', isWarm ? '#warmup' : `#q${view + 1}`);
  if (isWarm) renderWarm(); else renderQuestion();
}
const go = (i) => {
  view = Math.max(-1, Math.min(QUESTIONS.length - 1, i));
  render();
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
};
$('prevQ').addEventListener('click', () => go(view - 1));
$('nextQ').addEventListener('click', () => go(view + 1));
$('nextBtn').addEventListener('click', () => go(view + 1));
$('startQ1').addEventListener('click', () => go(0));
$('skipWarm').addEventListener('click', () => go(0));
$('restartBtn').addEventListener('click', () => {
  state = QUESTIONS.map(freshQ);
  warm = { i: 0, firstTry: 0, missed: false, done: false };
  go(-1);
});

// ---------------------------------------------------------------- argument map (shared)
function mapMarkup() {
  return `
    <div class="map">
      <svg viewBox="0 0 640 380" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#8f98a7"/></marker>
          <marker id="arrowRed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#b3283a"/></marker>
        </defs>
        ${EDGES.map((e) => `<path class="edge ${e.kind}" d="${e.d}" marker-end="url(#${e.kind === 'rejects' ? 'arrowRed' : 'arrow'})"/>${e.label ? `<text class="edge-label" x="${e.lx}" y="${e.ly}">${e.label}</text>` : ''}`).join('')}
      </svg>
      ${Object.entries(NODES).map(([k, n]) => `
        <button type="button" class="node ${k}" data-node="${k}"
          style="left:${(n.x / 640) * 100}%; top:${(n.y / 380) * 100}%; width:${(n.w / 640) * 100}%; height:${(n.h / 380) * 100}%">
          <span class="kind">${n.kind}, ${n.where}</span><span>${esc(n.text)}</span><span class="badges"></span>
        </button>`).join('')}
    </div>`;
}
function wireMap(mapEl) {
  mapEl.querySelectorAll('.node').forEach((n) => {
    n.addEventListener('click', () => {
      mapEl.querySelectorAll('.node.lit').forEach((x) => x.classList.remove('lit'));
      n.classList.add('lit');
      lightSentences(nodeSentences(n.dataset.node));
    });
  });
}

// ---------------------------------------------------------------- warm-up: sort sentences by role
function renderWarm() {
  const root = $('warmTool');
  if (warm.done) {
    $('skipWarm').hidden = true;
    $('startQ1').hidden = false;
    root.innerHTML = `
      <p class="bscore">You placed ${warm.firstTry} of ${BUILD.length} on the first try.</p>
      <p class="hint">Here is the whole argument. Select any box to find it in the passage. Question 1’s explanation uses this same map.</p>
      ${mapMarkup()}`;
    wireMap(root.querySelector('.map'));
    return;
  }
  $('skipWarm').hidden = false;
  $('startQ1').hidden = true;
  root.innerHTML = `
    <div class="builder">
      <p class="bcount" id="bCount"></p>
      <blockquote class="bquote" id="bQuote"></blockquote>
      <p class="bask">What job does this sentence do in the passage?</p>
      <div class="roles" id="bRoles">${ROLES.map((r) => `<button type="button" class="role" data-role="${r}">${r}</button>`).join('')}</div>
      <div class="bfeedback" id="bFb" aria-live="polite"></div>
      <button type="button" class="primary" id="bNext" hidden>Next sentence</button>
    </div>`;
  const show = () => {
    const item = BUILD[warm.i];
    warm.missed = false;
    root.querySelector('#bCount').textContent = `Sentence ${warm.i + 1} of ${BUILD.length}`;
    root.querySelector('#bQuote').textContent = SENTENCES[item.id].text;
    root.querySelector('#bFb').innerHTML = '';
    root.querySelector('#bNext').hidden = true;
    root.querySelectorAll('.role').forEach((b) => { b.disabled = false; b.className = 'role'; });
    lightSentences([item.id]);
  };
  root.querySelector('#bRoles').addEventListener('click', (e) => {
    const b = e.target.closest('.role');
    if (!b || b.disabled) return;
    const item = BUILD[warm.i];
    const fb = root.querySelector('#bFb');
    if (b.dataset.role === item.role) {
      if (!warm.missed) warm.firstTry++;
      b.classList.add('right');
      root.querySelectorAll('.role').forEach((x) => { x.disabled = true; });
      fb.innerHTML = `<p class="ok"><b>Yes: ${esc(item.role.charAt(0).toLowerCase() + item.role.slice(1))}.</b> ${esc(item.why)}</p>`;
      const next = root.querySelector('#bNext');
      next.hidden = false;
      next.textContent = warm.i === BUILD.length - 1 ? 'See the whole argument' : 'Next sentence';
      next.focus();
    } else {
      warm.missed = true;
      b.classList.add('wrong');
      b.disabled = true;
      fb.innerHTML = '<p class="no"><b>Not quite.</b> Look for signal words, and ask what job this sentence does in the passage’s argument.</p>';
    }
  });
  root.querySelector('#bNext').addEventListener('click', () => {
    if (warm.i < BUILD.length - 1) { warm.i++; show(); return; }
    warm.done = true;
    lightSentences(null);
    renderWarm();
  });
  show();
}

// ---------------------------------------------------------------- questions
const strikeIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 4.5c.5-1.3 1.7-2 3.2-2 1.8 0 3 .9 3.3 2.2M5 11.3c.4 1.4 1.6 2.2 3.4 2.2 1.9 0 3.1-1 3.1-2.4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';

function renderQuestion() {
  const q = QUESTIONS[view], st = state[view];
  $('skill').textContent = `CARS skill: ${q.skill}`;
  $('stem').textContent = q.stem;
  const choicesEl = $('choices');
  choicesEl.classList.toggle('locked', st.submitted);
  choicesEl.innerHTML = q.choices.map((c) => {
    const cls = ['choice'];
    if (st.struck.has(c.id)) cls.push('struck');
    if (st.submitted && c.id === q.answer) cls.push('correct');
    if (st.submitted && c.id === st.selected && c.id !== q.answer) cls.push('wrong');
    return `<label class="${cls.join(' ')}" data-id="${c.id}">
      <input type="radio" name="q" value="${c.id}" ${st.selected === c.id ? 'checked' : ''} ${st.submitted ? 'disabled' : ''}>
      <span class="letter">${c.id}</span><span class="ctext">${esc(c.text)}</span>
      <button type="button" class="strike" data-strike="${c.id}" aria-label="Cross out choice ${c.id}" title="Cross out">${strikeIcon}</button>
    </label>`;
  }).join('');
  $('submitBtn').hidden = st.submitted;
  $('submitBtn').disabled = !st.selected;
  $('explain').hidden = !st.submitted;
  if (st.submitted) renderExplanation();
}

$('choices').addEventListener('click', (e) => {
  const b = e.target.closest('[data-strike]');
  if (!b) return;
  e.preventDefault();
  const st = state[view];
  const id = b.dataset.strike;
  if (st.struck.has(id)) st.struck.delete(id); else st.struck.add(id);
  b.closest('.choice').classList.toggle('struck', st.struck.has(id));
});
$('choices').addEventListener('change', (e) => {
  state[view].selected = e.target.value;
  $('submitBtn').disabled = false;
});
$('submitBtn').addEventListener('click', () => {
  const st = state[view];
  if (!st.selected) return;
  st.submitted = true;
  render();
  $('explain').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
});

// Every explanation has the same order: result, why the answer is right,
// a tool tied to this question, then the educational objective.
function renderExplanation() {
  const q = QUESTIONS[view], st = state[view];
  const ok = st.selected === q.answer;
  const res = $('result');
  res.className = `result ${ok ? 'ok' : 'no'}`;
  res.textContent = ok ? 'Correct.' : `Incorrect. You chose ${st.selected}; the answer is ${q.answer}.`;
  $('whyHead').textContent = `Why ${q.answer} is correct`;
  $('explanation').textContent = q.explanation;
  $('takeaway').textContent = q.takeaway;
  const last = view === QUESTIONS.length - 1;
  $('nextBtn').hidden = last;
  $('restartBtn').hidden = !last;
  const tool = $('tool');
  tool.innerHTML = `<h3>${esc(q.toolHead)}</h3>`;
  ({ map: buildMap, voice: buildVoice, principle: buildPrinciple })[q.tool](tool, q, st);
}
const yourPick = (q, st, id) => id === st.selected && id !== q.answer;

// ---------------------------------------------------------------- Q1 tool: test each choice against the map
// The answer choices sit right under the map, each with its full text. Testing one sends its
// letter to the part of the argument it affects, and the result appears in the same card.
const EFFECT_TEXT = {
  undercuts: (n) => `Undercuts ${n}`,
  supports: (n) => `Supports ${n}`,
  fits: (n) => `Fits ${n}`,
  misses: () => 'Doesn’t connect to any part of the argument',
};
const nodeName = (k) => {
  const article = { R1: 'the first reason', R2: 'the second reason', C: 'the limit the author grants', T: 'the author’s main claim', Rec: 'the recommendation', OV: 'the view the author rejects' }[k];
  return `${article} (${NODES[k].where})`;
};

function buildMap(root, q, st) {
  root.insertAdjacentHTML('beforeend', `
    <p class="hint">The map shows the passage’s whole argument${warm.done ? ', the same one you built in the warm-up' : ''}. The question asks about paragraph 4, the marked box. Test each answer choice below to see which part of the argument it affects, and how. You can also select any box to find it in the passage.</p>
    ${mapMarkup()}
    <div class="testhead">
      <h4>Answer choices</h4>
      <button type="button" class="chip-all" id="testAll">Test all four</button>
    </div>
    <div class="testlist" id="testList">
      ${q.choices.map((c) => `
        <div class="tcard" data-id="${c.id}">
          <div class="trow">
            <span class="letter">${c.id}</span>
            <span class="ttext">${esc(c.text)}${yourPick(q, st, c.id) ? '<span class="yours">Your answer</span>' : ''}</span>
            <button type="button" class="tbtn" data-choice="${c.id}">Test choice ${c.id}</button>
          </div>
          <div class="tresult" aria-live="polite" hidden></div>
        </div>`).join('')}
    </div>`);

  const mapEl = root.querySelector('.map');
  const list = root.querySelector('#testList');
  wireMap(mapEl);
  if (q.focusNode) {
    mapEl.querySelector(`.node[data-node="${q.focusNode}"]`)?.classList.add('focus');
    lightSentences(nodeSentences(q.focusNode));
  }
  st.tool.tested = st.tool.tested || [];
  const tested = new Set();
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-choice]');
    if (b) { test(b.dataset.choice); return; }
    // Selecting a tested card points at its part of the argument again.
    const card = e.target.closest('.tcard.tested');
    if (card) {
      const c = q.choices.find((x) => x.id === card.dataset.id);
      if (c.target) pointAt(c.target);
    }
  });
  root.querySelector('#testAll').addEventListener('click', () => {
    q.choices.forEach((c, i) => setTimeout(() => test(c.id), reduceMotion ? 0 : i * 750));
  });
  // Restore earlier results instantly when revisiting the question.
  st.tool.tested.forEach((id) => test(id, true));

  function pointAt(nodeKey) {
    mapEl.querySelectorAll('.node.lit').forEach((x) => x.classList.remove('lit'));
    mapEl.querySelector(`.node[data-node="${nodeKey}"]`)?.classList.add('lit');
    lightSentences(nodeSentences(nodeKey));
  }

  function test(id, instant = false) {
    if (tested.has(id)) return;
    tested.add(id);
    if (!st.tool.tested.includes(id)) st.tool.tested.push(id);
    const c = q.choices.find((x) => x.id === id);
    const card = list.querySelector(`.tcard[data-id="${id}"]`);
    const btn = card.querySelector('.tbtn');
    btn.disabled = true;
    const target = c.target ? mapEl.querySelector(`.node[data-node="${c.target}"]`) : null;
    const land = () => {
      if (target) {
        target.classList.remove('hit-supports', 'hit-undercuts', 'hit-fits');
        target.classList.add(`hit-${c.effect}`);
        target.querySelector('.badges').insertAdjacentHTML('beforeend', `<span class="badge ${c.effect}" title="Choice ${id}">${id}</span>`);
        if (c.effect === 'undercuts') {
          target.classList.add('cracked');
          if (!instant && !reduceMotion) { target.classList.add('shake'); setTimeout(() => target.classList.remove('shake'), 500); }
        }
        if (!instant) pointAt(c.target);
      }
      showResult(c, card);
    };
    if (instant || reduceMotion) { land(); return; }
    // The choice's letter travels from its card to the part of the map it affects.
    const from = card.querySelector('.letter').getBoundingClientRect();
    const flyer = document.createElement('div');
    flyer.className = 'flyer';
    flyer.textContent = id;
    flyer.style.left = `${from.left + from.width / 2 - 17}px`;
    flyer.style.top = `${from.top + from.height / 2 - 17}px`;
    document.body.appendChild(flyer);
    const to = (target || mapEl).getBoundingClientRect();
    const tx = (target ? to.right - 12 : to.left + to.width / 2) - (from.left + from.width / 2);
    const ty = (target ? to.top - 4 : to.top + to.height * 0.55) - (from.top + from.height / 2);
    const frames = target
      ? [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${tx * 0.55}px, ${ty * 0.55 - 60}px) scale(1.15)`, offset: 0.55 }, { transform: `translate(${tx}px, ${ty}px) scale(.8)` }]
      : [{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${tx}px, ${ty}px)`, opacity: 1, offset: 0.6 }, { transform: `translate(${tx + 80}px, ${ty + 40}px) rotate(25deg)`, opacity: 0 }];
    flyer.animate(frames, { duration: target ? 700 : 1100, easing: 'cubic-bezier(.45,.05,.35,1)' }).onfinish = () => { flyer.remove(); land(); };
  }

  function showResult(c, card) {
    let head = `${EFFECT_TEXT[c.effect](c.target ? nodeName(c.target) : '')}.`;
    if (c.id === q.answer) head += ' This is the answer.';
    card.classList.add('tested', c.effect);
    card.querySelector('.tbtn').hidden = true;
    const res = card.querySelector('.tresult');
    res.hidden = false;
    res.innerHTML = `<div class="vhead">${esc(head)}</div><p>${esc(c.rationale)}</p>`;
  }
}

// ---------------------------------------------------------------- Q2 tool: voice lens
const legend = $('voiceLegend');
let lensOn = false;
function setLens(on) {
  lensOn = on;
  passageEl.classList.toggle('voice-on', on);
  legend.hidden = !on;
  document.querySelectorAll('.lens-toggle').forEach((b) => b.setAttribute('aria-checked', String(on)));
}

function buildVoice(root, q, st) {
  root.insertAdjacentHTML('beforeend', `
    <p class="hint">The passage is now colored by who is speaking in each sentence: the author, the restorers, the critics, or background. Select a choice to outline its evidence in blue and see whose words it rests on.</p>
    <button type="button" class="lens-toggle" role="switch" aria-checked="false" id="lensBtn"><span class="switch" aria-hidden="true"></span>Color the passage by speaker</button>
    <div class="evidence-list" id="evList">
      ${q.choices.map((c) => `
        <button type="button" class="ev ${c.id === q.answer ? 'right' : ''}" data-id="${c.id}" aria-pressed="false">
          <span class="letter">${c.id}</span>
          <span><span class="evtitle">${esc(c.text)}${yourPick(q, st, c.id) ? '<span class="yours">Your answer</span>' : ''}</span><p>${esc(c.rationale)}</p><span class="quotes"></span></span>
        </button>`).join('')}
    </div>`);
  root.querySelector('#lensBtn').addEventListener('click', () => setLens(!lensOn));
  const list = root.querySelector('#evList');
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.ev');
    if (!b) return;
    const was = b.getAttribute('aria-pressed') === 'true';
    list.querySelectorAll('.ev').forEach((x) => { x.setAttribute('aria-pressed', 'false'); x.querySelector('.quotes').innerHTML = ''; });
    if (was) { lightSentences(null); return; }
    b.setAttribute('aria-pressed', 'true');
    const c = q.choices.find((x) => x.id === b.dataset.id);
    lightSentences(c.evidence);
    if (narrow()) {
      // On small screens the passage is out of view, so quote the evidence inline.
      b.querySelector('.quotes').innerHTML = c.evidence.map((id) => `<p class="inline-quote">“${esc(SENTENCES[id].text)}”</p>`).join('');
    }
  });
  setLens(true);
}

// ---------------------------------------------------------------- Q3 tool: principle test
const MARK = { yes: '✓', no: '✕', na: '–' };
const MARK_LABEL = { yes: 'meets this part', no: 'breaks this part', na: 'doesn’t apply' };

function buildPrinciple(root, q, st) {
  root.insertAdjacentHTML('beforeend', `
    <p class="hint">The author’s position, from ${q.ruleSource || 'the passage'}, works as a three-part rule. Select a part to see where it comes from in the passage, then run the test to check each response against all three parts.</p>
    <div class="rule">
      ${q.criteria.map((c) => `<button type="button" data-src="${c.source}"><b>${esc(c.label)}</b><span>${esc(c.note)}</span></button>`).join('')}
    </div>
    <button type="button" class="primary run" id="runTest">${st.tool.ran ? 'Run the test again' : 'Run the test'}</button>
    <table class="grid">
      <thead><tr><th scope="col">Response</th>${q.criteria.map((c) => `<th scope="col">${esc(c.label)}</th>`).join('')}</tr></thead>
      <tbody>
        ${q.choices.map((c) => `<tr class="row" data-id="${c.id}" tabindex="0" aria-selected="false">
          <td><span class="plan"><span class="letter">${c.id}</span><span>${esc(c.text)}${yourPick(q, st, c.id) ? '<span class="yours">Your answer</span>' : ''}</span></span></td>
          ${q.criteria.map((cr) => `<td><span class="mark ${c.checks[cr.id]}" aria-label="${MARK_LABEL[c.checks[cr.id]]}">${MARK[c.checks[cr.id]]}</span></td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
    <p class="markkey" aria-hidden="true">
      <span><span class="mark yes on">✓</span>meets this part</span>
      <span><span class="mark no on">✕</span>breaks it</span>
      <span><span class="mark na on">–</span>doesn’t apply</span>
    </p>
    <div class="verdicts" id="pVerdict" aria-live="polite"></div>`);

  root.querySelectorAll('.rule button').forEach((b) => b.addEventListener('click', () => lightSentences([b.dataset.src])));
  const rows = [...root.querySelectorAll('tr.row')];
  const show = (id) => {
    rows.forEach((r) => r.setAttribute('aria-selected', String(r.dataset.id === id)));
    const c = q.choices.find((x) => x.id === id);
    const passes = Object.values(c.checks).every((v) => v !== 'no');
    let head = `${id} ${passes ? 'meets every part of the rule. This is the answer.' : 'breaks part of the rule.'}`;
    if (yourPick(q, st, id)) head += ' You chose this one.';
    root.querySelector('#pVerdict').innerHTML = `<div class="verdict ${passes ? 'supports' : 'undercuts'}"><div class="vhead">${esc(head)}</div><p>${esc(c.rationale)}</p></div>`;
  };
  rows.forEach((r) => {
    r.addEventListener('click', () => show(r.dataset.id));
    r.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(r.dataset.id); } });
  });

  const reveal = (instant) => {
    rows.forEach((r) => r.classList.remove('pass'));
    const marks = rows.flatMap((r) => [...r.querySelectorAll('.mark')]);
    marks.forEach((m) => m.classList.remove('on'));
    const finish = () => {
      rows.forEach((r) => { if (r.dataset.id === q.answer) r.classList.add('pass'); });
      show(q.answer);
    };
    if (instant || reduceMotion) { marks.forEach((m) => m.classList.add('on')); finish(); return; }
    marks.forEach((m, i) => setTimeout(() => m.classList.add('on'), 140 * i + 100));
    setTimeout(finish, 140 * marks.length + 300);
  };
  root.querySelector('#runTest').addEventListener('click', (e) => {
    st.tool.ran = true;
    e.currentTarget.textContent = 'Run the test again';
    reveal(false);
  });
  if (st.tool.ran) reveal(true);
}

// ---------------------------------------------------------------- start
const m = location.hash.match(/^#q([1-3])$/);
view = m ? Number(m[1]) - 1 : -1;
render();
window.__analysis = { get state() { return state; }, get warm() { return warm; }, go };
