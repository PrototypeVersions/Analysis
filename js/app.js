import { PASSAGE, NODES, EDGES, QUESTIONS, ROLES, BUILD } from './content.js?v=2';

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

// ---------------------------------------------------------------- question state
const state = QUESTIONS.map(() => ({ selected: null, submitted: false, struck: new Set(), tool: {} }));
let qi = 0;

const strikeIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 4.5c.5-1.3 1.7-2 3.2-2 1.8 0 3 .9 3.3 2.2M5 11.3c.4 1.4 1.6 2.2 3.4 2.2 1.9 0 3.1-1 3.1-2.4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';

function render() {
  const q = QUESTIONS[qi], st = state[qi];
  $('qCounter').textContent = `Question ${qi + 1} of ${QUESTIONS.length}`;
  $('prevQ').disabled = qi === 0;
  $('nextQ').disabled = qi === QUESTIONS.length - 1;
  $('skill').textContent = q.skill;
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
  setLens(false);
  lightSentences(null);
  if (st.submitted) renderExplanation();
  $('nextBtn').hidden = qi === QUESTIONS.length - 1;
  history.replaceState(null, '', `#q${qi + 1}`);
}

$('choices').addEventListener('click', (e) => {
  const b = e.target.closest('[data-strike]');
  if (!b) return;
  e.preventDefault();
  const st = state[qi];
  const id = b.dataset.strike;
  if (st.struck.has(id)) st.struck.delete(id); else st.struck.add(id);
  b.closest('.choice').classList.toggle('struck', st.struck.has(id));
});
$('choices').addEventListener('change', (e) => {
  state[qi].selected = e.target.value;
  $('submitBtn').disabled = false;
});
$('submitBtn').addEventListener('click', () => {
  const st = state[qi];
  if (!st.selected) return;
  st.submitted = true;
  render();
  $('explain').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
});
const go = (i) => { qi = Math.max(0, Math.min(QUESTIONS.length - 1, i)); render(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); };
$('prevQ').addEventListener('click', () => go(qi - 1));
$('nextQ').addEventListener('click', () => go(qi + 1));
$('nextBtn').addEventListener('click', () => go(qi + 1));

function renderExplanation() {
  const q = QUESTIONS[qi], st = state[qi];
  const ok = st.selected === q.answer;
  const res = $('result');
  res.className = `result ${ok ? 'ok' : 'no'}`;
  res.textContent = ok ? 'Correct.' : `Incorrect. The answer is ${q.answer}.`;
  $('explanation').textContent = q.explanation;
  $('takeaway').textContent = q.takeaway;
  const tool = $('tool');
  tool.innerHTML = '';
  ({ map: buildMap, voice: buildVoice, principle: buildPrinciple })[q.tool](tool, q, st);
}

// ---------------------------------------------------------------- tool 1: argument map
const EFFECT_TEXT = {
  undercuts: (n) => `undercuts ${n}`,
  supports: (n) => `supports ${n}`,
  fits: (n) => `fits ${n}`,
  misses: () => 'doesn’t connect to the argument',
};
const nodeName = (k) => {
  const n = NODES[k];
  const article = { Reason: k === 'R1' ? 'the first reason' : 'the second reason', Concession: 'the concession', Thesis: 'the thesis', Recommendation: 'the recommendation', 'Opposing view': 'the opposing view' }[n.kind];
  return `${article} (${n.where})`;
};

// First, an optional sorting step: place key sentences in their roles.
function buildMap(root, q, st) {
  if (st.tool.built) { buildMapInner(root, q, st); return; }
  let i = 0, firstTry = 0, missed = false;
  root.innerHTML = `
    <h3>Map the argument yourself</h3>
    <p class="hint">Before seeing the finished map, sort six key sentences into their roles. <button type="button" class="chip-all" id="skipBuild">Skip to the finished map</button></p>
    <div class="builder">
      <p class="bcount" id="bCount"></p>
      <blockquote class="bquote" id="bQuote"></blockquote>
      <div class="roles" id="bRoles">${ROLES.map((r) => `<button type="button" class="role" data-role="${r}">${r}</button>`).join('')}</div>
      <div class="bfeedback" id="bFb" aria-live="polite"></div>
      <button type="button" class="primary" id="bNext" hidden>Next sentence</button>
    </div>`;
  const show = () => {
    const item = BUILD[i];
    missed = false;
    root.querySelector('#bCount').textContent = `Sentence ${i + 1} of ${BUILD.length}`;
    root.querySelector('#bQuote').textContent = SENTENCES[item.id].text;
    root.querySelector('#bFb').innerHTML = '';
    root.querySelector('#bNext').hidden = true;
    root.querySelectorAll('.role').forEach((b) => { b.disabled = false; b.className = 'role'; });
    lightSentences([item.id]);
  };
  const finish = () => { st.tool.built = true; root.innerHTML = ''; buildMapInner(root, q, st, firstTry); };
  root.querySelector('#bRoles').addEventListener('click', (e) => {
    const b = e.target.closest('.role');
    if (!b || b.disabled) return;
    const item = BUILD[i];
    const fb = root.querySelector('#bFb');
    if (b.dataset.role === item.role) {
      if (!missed) firstTry++;
      b.classList.add('right');
      root.querySelectorAll('.role').forEach((x) => { x.disabled = true; });
      fb.innerHTML = `<p class="ok"><b>Yes, ${item.role.toLowerCase()}.</b> ${esc(item.why)}</p>`;
      const next = root.querySelector('#bNext');
      next.hidden = false;
      next.textContent = i === BUILD.length - 1 ? 'See the finished map' : 'Next sentence';
      next.focus();
    } else {
      missed = true;
      b.classList.add('wrong');
      b.disabled = true;
      fb.innerHTML = `<p class="no"><b>Not ${b.dataset.role.toLowerCase()}.</b> Look for signal words, and ask what job the sentence does in the argument.</p>`;
    }
  });
  root.querySelector('#bNext').addEventListener('click', () => { if (i < BUILD.length - 1) { i++; show(); } else finish(); });
  root.querySelector('#skipBuild').addEventListener('click', finish);
  show();
}

function buildMapInner(root, q, st, score) {
  if (score !== undefined) root.insertAdjacentHTML('beforeend', `<p class="bscore">You placed ${score} of ${BUILD.length} on the first try. Here is the whole argument.</p>`);
  root.insertAdjacentHTML('beforeend', `
    <h3>Drop each choice into the argument</h3>
    <p class="hint">This is the passage’s argument. Select a box to find it in the passage, then drop a choice in to see what it does.</p>
    <div class="map" id="map">
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
    </div>
    <div class="chips" id="chips">
      ${q.choices.map((c) => `<button type="button" class="chip" data-choice="${c.id}">Drop in ${c.id}</button>`).join('')}
      <button type="button" class="chip-all" id="dropAll">Drop in all four</button>
    </div>
    <div class="verdicts" id="verdicts" aria-live="polite"></div>`);

  const mapEl = root.querySelector('#map');
  mapEl.querySelectorAll('.node').forEach((n) => {
    n.addEventListener('click', () => {
      mapEl.querySelectorAll('.node.lit').forEach((x) => x.classList.remove('lit'));
      n.classList.add('lit');
      lightSentences(nodeSentences(n.dataset.node));
    });
  });
  st.tool.dropped = st.tool.dropped || [];
  const dropped = new Set();
  const chips = root.querySelector('#chips');
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-choice]');
    if (b) drop(b.dataset.choice);
  });
  root.querySelector('#dropAll').addEventListener('click', () => {
    q.choices.forEach((c, i) => setTimeout(() => drop(c.id), reduceMotion ? 0 : i * 750));
  });
  // Restore previously dropped choices instantly when revisiting the question.
  st.tool.dropped.forEach((id) => drop(id, true));

  function drop(id, instant = false) {
    if (dropped.has(id)) return;
    dropped.add(id);
    if (!st.tool.dropped.includes(id)) st.tool.dropped.push(id);
    const c = q.choices.find((x) => x.id === id);
    const chip = chips.querySelector(`[data-choice="${id}"]`);
    chip.classList.add('used');
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
        if (!instant) lightSentences(nodeSentences(c.target));
      }
      addVerdict(c);
    };
    if (instant || reduceMotion) { land(); return; }
    const from = chip.getBoundingClientRect();
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

  function addVerdict(c) {
    const v = root.querySelector('#verdicts');
    const head = `${c.id} ${EFFECT_TEXT[c.effect](c.target ? nodeName(c.target) : '')}${c.id === q.answer ? '. This is the answer.' : '.'}`;
    const el = document.createElement('div');
    el.className = `verdict ${c.effect}`;
    el.dataset.id = c.id;
    el.innerHTML = `<div class="vhead">${head.charAt(0).toUpperCase() + head.slice(1)}</div><p>${esc(c.rationale)}</p>`;
    // keep verdicts in letter order
    const after = [...v.children].find((x) => x.dataset.id > c.id);
    v.insertBefore(el, after || null);
  }
}

// ---------------------------------------------------------------- tool 2: voice lens
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
    <button type="button" class="lens-toggle" role="switch" aria-checked="false" id="lensBtn"><span class="switch" aria-hidden="true"></span>Show who is speaking in each sentence</button>
    <h3>Check where each choice’s evidence comes from</h3>
    <div class="evidence-list" id="evList">
      ${q.choices.map((c) => `
        <button type="button" class="ev ${c.id === q.answer ? 'right' : ''}" data-id="${c.id}" aria-pressed="false">
          <span class="letter">${c.id}</span>
          <span><span class="evtitle">${esc(c.text)}</span><p>${esc(c.rationale)}</p><span class="quotes"></span></span>
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
      b.querySelector('.quotes').innerHTML = c.evidence.map((id) => `<p style="margin-top:8px;font-family:var(--serif);color:var(--ink)">“${esc(SENTENCES[id].text)}”</p>`).join('');
    }
  });
  setLens(true);
}

// ---------------------------------------------------------------- tool 3: principle test
const MARK = { yes: '✓', no: '✕', na: '–' };
const MARK_LABEL = { yes: 'meets', no: 'fails', na: 'not relevant' };

function buildPrinciple(root, q, st) {
  root.insertAdjacentHTML('beforeend', `
    <h3>The author’s rule, from ${q.ruleSource || 'the passage'}</h3>
    <div class="rule">
      ${q.criteria.map((c) => `<button type="button" data-src="${c.source}"><b>${esc(c.label)}</b><span>${esc(c.note)}</span></button>`).join('')}
    </div>
    <button type="button" class="primary run" id="runTest">${st.tool.ran ? 'Run the test again' : 'Run the test'}</button>
    <table class="grid">
      <thead><tr><th scope="col">Plan</th>${q.criteria.map((c) => `<th scope="col">${esc(c.label)}</th>`).join('')}</tr></thead>
      <tbody>
        ${q.choices.map((c) => `<tr class="row" data-id="${c.id}" tabindex="0" aria-selected="false">
          <td><span class="plan"><span class="letter">${c.id}</span><span>${esc(c.text)}</span></span></td>
          ${q.criteria.map((cr) => `<td><span class="mark ${c.checks[cr.id]}" aria-label="${MARK_LABEL[c.checks[cr.id]]}">${MARK[c.checks[cr.id]]}</span></td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
    <div class="verdicts" id="pVerdict" aria-live="polite"></div>`);

  root.querySelectorAll('.rule button').forEach((b) => b.addEventListener('click', () => lightSentences([b.dataset.src])));
  const rows = [...root.querySelectorAll('tr.row')];
  const show = (id) => {
    rows.forEach((r) => r.setAttribute('aria-selected', String(r.dataset.id === id)));
    const c = q.choices.find((x) => x.id === id);
    const passes = Object.values(c.checks).every((v) => v !== 'no');
    root.querySelector('#pVerdict').innerHTML = `<div class="verdict ${passes ? 'supports' : 'undercuts'}"><div class="vhead">${id} ${passes ? 'passes every part of the rule. This is the answer.' : 'fails part of the rule.'}</div><p>${esc(c.rationale)}</p></div>`;
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
if (m) qi = Number(m[1]) - 1;
render();
window.__analysis = { state, go };
