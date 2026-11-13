// Gera public/turmas/dry-needling/slides.html (modo apresentação) a partir de
// docs/dry-needling-material.html — a mesma fonte do PDF/PPT do material de apoio.
// Uso: node scripts/dry-needling-slides.mjs
// A fonte não é versionada; os slides 1280×720 entram intactos e ganham um player
// (tela cheia, teclado/clique/roda/toque, transições, visão geral, link por slide).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SRC = "docs/dry-needling-material.html";
const OUT = "public/turmas/dry-needling/slides.html";

const src = readFileSync(SRC, "utf8");
const pick = (re, what) => {
  const m = src.match(re);
  if (!m) throw new Error(`não achei ${what} em ${SRC}`);
  return m[1];
};
const style = pick(/<style>([\s\S]*?)<\/style>/, "<style>");
const fonts = pick(/(<link rel="preconnect"[\s\S]*?rel="stylesheet">)/, "fontes");
const rawBody = pick(/<body>([\s\S]*?)<\/body>/, "<body>");
const total = (rawBody.match(/<section class="s/g) || []).length;
if (total < 10) throw new Error(`só ${total} slides — fonte errada?`);

// Onde está cada slide no ebook (páginas do PDF Dry-Needling-Manual-do-Curso.pdf,
// 60 págs, revisão de 13/11/2026 — a numeração impressa é igual à do PDF).
// [slide, trecho que o slide precisa conter (trava contra slides reordenados), páginas]
// Nos músculos: 1º slide → ficha + ponto a ponto; 2º slide → página ponto a ponto.
// páginas = null → o assunto não está no ebook.
const EBOOK = [
  [2, "Da teoria", "3"], [3, "Escala", "7"], [4, "Dois dias", "3"], [5, "Fundamentos científicos", "5–16"],
  [6, "O que é", "5"], [7, "Dois modelos", "5"], [8, "Hipótese integrada", "5"], [9, "Shah", "6"],
  [10, "Mecanismos", "6"], [11, "Algometria por pressão", "10–12"], [12, "PPT", "10"], [13, "Seis passos", "10"],
  [14, "confiável", "11"], [15, "ativo × latente", "11"], [16, "O PPT sobe", "12"], [17, "ficha de registro", "12"],
  [18, "Onde a evidência", "13–16"], [19, "Cervicalgia", "13, 14 e 19"], [20, "Cefaleia", "13, 14, 19, 25 e 43"], [21, "subacromial", "9, 13, 14 e 27"],
  [22, "epicondilalgia", "13, 15 e 29"], [23, "Lombar", "13, 15 e 36"], [24, "Joelho", "13, 15, 45 e 53"], [25, "temporomandibular", "13, 16 e 41"],
  [26, "Mapa da", "13"], [27, "Contra", "8"], [28, "Eventos adversos", "8–9"], [29, "Quadrante superior", "18–30"],
  [30, "Trapézio superior", "18"], [31, "Ativo ou latente", "3 e 17"], [32, "Trapézio superior", "19–20"], [33, "Trapézio superior", "20"],
  [34, "Levantador", "21–22"], [35, "Levantador", "22"], [36, "Esternocleidomastóideo", "23–24"], [37, "Esternocleidomastóideo", "24"],
  [38, "Suboccipitais", "25–26"], [39, "Suboccipitais", "26"], [40, "Infraespinal", "27–28"], [41, "Infraespinal", "28"],
  [42, "Extensores radiais", "29–30"], [43, "Extensores radiais", "30"], [44, "Coluna lombar", "31–39"], [45, "Multífidos", "31"],
  [46, "Multífidos", "32–33"], [47, "Multífidos", "33"], [48, "Quadrado lombar", "34–35"], [49, "Quadrado lombar", "35"],
  [50, "Glúteo médio", "36–37"], [51, "Glúteo médio", "37"], [52, "Glúteo mínimo", "38–39"], [53, "Glúteo mínimo", "39"],
  [54, "Quadrante inferior", "40–52"], [55, "Masseter", "40"], [56, "Masseter", "41–42"], [57, "Masseter", "42"],
  [58, "Temporal", "43–44"], [59, "Temporal", "44"], [60, "Reto femoral", "45–46"], [61, "Reto femoral", "46"],
  [62, "Poplíteo", "47–48"], [63, "Poplíteo", "48"], [64, "Gastrocnêmio", "49–50"], [65, "Gastrocnêmio", "50"],
  [66, "Sóleo", "51–52"], [67, "Sóleo", "52"], [68, "O que levar", "56"], [69, "ensaios clínicos", "57–59"],
  [70, "revisões", "59–60"], [71, "atlas de pontos-gatilho", "60"],
];
const plain = s => s.replace(/<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");
let n = 0;
const body = rawBody.replace(/<section class="s[\s\S]*?<\/section>/g, sec => {
  n++;
  const e = EBOOK.find(([k]) => k === n);
  if (!e) return sec;
  const [, must, pages] = e;
  if (!plain(sec).toLowerCase().includes(must.toLowerCase()))
    throw new Error(`slide ${n} não contém "${must}" — os slides mudaram, revise o mapa EBOOK`);
  if (!sec.includes('<span class="pg"></span>')) throw new Error(`slide ${n} sem rodapé .ft`);
  const multi = /[–,e]/.test(pages ?? "");
  const tag = pages
    ? `<span class="eref" title="Onde está no ebook do curso"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3.5c2-.8 4-.8 6 .6 2-1.4 4-1.4 6-.6V13c-2-.8-4-.8-6 .6-2-1.4-4-1.4-6-.6z M8 4.1v9.5"/></svg>Ebook · ${multi ? "págs." : "pág."} ${pages}</span>`
    : `<span class="eref none">Só nos slides · não consta no ebook</span>`;
  return sec.replace('<span class="pg"></span>', `<span class="ft-r">${tag}<span class="pg"></span></span>`);
});
if (n !== total) throw new Error("contagem de slides divergente");
const lastMapped = Math.max(...EBOOK.map(([k]) => k));
if (lastMapped >= total) throw new Error(`mapa EBOOK vai até o slide ${lastMapped}, mas só há ${total}`);

const player = String.raw`
<style>
/* nota de página do ebook no rodapé */
.ft-r{display:flex;align-items:center;gap:26px}
.eref{display:inline-flex;align-items:center;gap:7px;padding-right:26px;border-right:1px solid currentColor;border-right-color:rgba(74,82,76,.3)}
.dark .eref{border-right-color:rgba(244,198,144,.35)}
.eref svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.3;stroke-linejoin:round}
.eref.none{opacity:.65}
/* ── player ─────────────────────────────────────────── */
html,body{height:100%;overflow:hidden}
body{background:#0E1F16;margin:0;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
body.idle{cursor:none}
#stage{position:fixed;inset:0;overflow:hidden;background:
  radial-gradient(120% 90% at 50% 40%,#1A3A28 0%,#0E1F16 60%,#09140E 100%)}
#deck{position:absolute;left:50%;top:50%;width:1280px;height:720px;margin:-360px 0 0 -640px;transform:scale(var(--k,1));transform-origin:center;
  box-shadow:0 30px 80px -20px rgba(0,0,0,.6),0 0 0 1px rgba(250,247,241,.04)}
#deck>.s{position:absolute;inset:0;margin:0;visibility:hidden;opacity:0;pointer-events:none;
  transition:opacity .75s cubic-bezier(.22,.61,.36,1),transform .9s cubic-bezier(.22,.61,.36,1),filter .75s ease,visibility 0s linear .9s;
  transform:translate3d(0,0,0) scale(1.012);filter:blur(4px)}
#deck>.s.prev{transform:translate3d(-28px,0,0) scale(.985)}
#deck>.s.next{transform:translate3d(28px,0,0) scale(.985)}
#deck>.s.on{visibility:visible;opacity:1;pointer-events:auto;transform:none;filter:none;z-index:2;
  transition:opacity .75s cubic-bezier(.22,.61,.36,1) .08s,transform .9s cubic-bezier(.22,.61,.36,1) .08s,filter .6s ease .08s,visibility 0s}
/* entrada escalonada do conteúdo */
#deck>.s.on.in>*:not(.ft){animation:rise .9s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.12s + var(--i,0)*.07s)}
#deck>.s.on.in .grid>*,#deck>.s.on.in .cards>*,#deck>.s.on.in .pgs>*,#deck>.s.on.in .al3>*,#deck>.s.on.in ul.d>li,#deck>.s.on.in ul.pgl>li,#deck>.s.on.in .refs>li{
  animation:rise .8s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.32s + var(--j,0)*.06s)}
#deck>.s.on.in .ft{animation:fade 1s ease .5s both}
@keyframes rise{from{opacity:0;transform:translate3d(0,18px,0)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
/* HUD */
#hud{position:fixed;left:0;right:0;bottom:0;z-index:20;display:flex;align-items:center;gap:18px;padding:14px 22px 16px;
  color:#FAF7F1;font:500 12px Inter,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;
  background:linear-gradient(to top,rgba(9,20,14,.85),rgba(9,20,14,0));transition:opacity .5s ease,transform .5s ease}
body.idle #hud,body.clean #hud{opacity:0;transform:translateY(8px);pointer-events:none}
#hud .lbl{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#F4C690;opacity:.9}
#hud .n{font-family:Fraunces,Georgia,serif;font-style:italic;font-weight:300;font-size:20px;letter-spacing:0;text-transform:none}
#hud .n b{font-weight:400;font-style:normal;color:#FAF7F1}
#hud .n span{opacity:.55}
#hud button{all:unset;cursor:pointer;display:grid;place-items:center;width:36px;height:36px;border-radius:50%;color:#FAF7F1;
  border:1px solid rgba(250,247,241,.18);transition:background .2s,border-color .2s}
#hud button:hover,#hud button:focus-visible{background:rgba(250,247,241,.1);border-color:rgba(244,198,144,.6)}
#hud svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
#bar{position:fixed;left:0;top:0;height:3px;z-index:21;background:#E89B3C;width:0;transition:width .6s cubic-bezier(.22,.61,.36,1);
  box-shadow:0 0 12px rgba(232,155,60,.5)}
body.clean #bar{opacity:0}
/* dica inicial */
#hint{position:fixed;left:50%;top:22px;transform:translateX(-50%);z-index:22;padding:10px 18px;border-radius:999px;
  background:rgba(9,20,14,.82);backdrop-filter:blur(8px);color:#FAF7F1;font:500 12px Inter,Arial,sans-serif;letter-spacing:.06em;
  border:1px solid rgba(244,198,144,.25);transition:opacity .8s ease;white-space:nowrap}
#hint kbd{font:600 11px Inter,Arial,sans-serif;padding:2px 7px;border-radius:4px;background:rgba(250,247,241,.12);margin:0 2px}
#hint.off{opacity:0;pointer-events:none}
#hint .m{display:none}
@media (max-width:760px){#hint .d{display:none}#hint .m{display:inline}#hud{gap:10px;padding:10px 12px 12px}#hud .lbl{display:none}#hud .n{flex:1}}
/* visão geral */
#ov{position:fixed;inset:0;z-index:30;overflow:auto;padding:72px 40px 60px;background:rgba(9,20,14,.97);
  opacity:0;visibility:hidden;transition:opacity .35s ease,visibility 0s linear .35s;counter-reset:sl}
#ov.on{opacity:1;visibility:visible;transition:opacity .35s ease}
#ov>.hd{position:fixed;top:0;left:0;right:0;z-index:4;padding:24px 40px 18px;background:linear-gradient(#09140E 70%,rgba(9,20,14,0));color:#F4C690;font:600 12px Inter,Arial,sans-serif;letter-spacing:.3em;text-transform:uppercase}
#ov .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:26px 22px;max-width:1500px;margin:0 auto}
#ov .ovt{all:unset;cursor:pointer;position:relative;aspect-ratio:16/9;border-radius:3px;overflow:hidden;outline:1px solid rgba(250,247,241,.08);
  transition:transform .25s ease,outline-color .25s ease}
#ov .ovt:hover,#ov .ovt:focus-visible{transform:translateY(-3px);outline:2px solid #E89B3C}
#ov .ovt.cur{outline:2px solid #F4C690}
#ov .ovt .s{position:absolute;left:0;top:0;margin:0;transform-origin:0 0;transform:scale(var(--tk,.18));pointer-events:none}
#ov .ovt i{position:absolute;right:8px;bottom:6px;z-index:3;font:italic 300 15px Fraunces,Georgia,serif;color:#FAF7F1;
  background:rgba(9,20,14,.7);padding:1px 8px;border-radius:2px}
/* tela preta (B) */
#blk{position:fixed;inset:0;z-index:25;background:#000;opacity:0;pointer-events:none;transition:opacity .5s ease}
body.black #blk{opacity:1;pointer-events:auto}
@media (prefers-reduced-motion:reduce){
  #deck>.s,#deck>.s.on{transition:opacity .3s ease,visibility 0s;transform:none!important;filter:none!important}
  #deck>.s.on.in *{animation:none!important}
}
@media print{
  html,body{height:auto;overflow:visible;background:none}
  #stage{position:static;display:block;background:none}
  #deck{width:auto;height:auto;transform:none!important;box-shadow:none}
  #deck>.s{position:relative;visibility:visible;opacity:1;transform:none;filter:none}
  #deck>.s *{animation:none!important}
  #hud,#bar,#hint,#ov,#blk{display:none}
}
</style>`;

const shell = String.raw`
<div id="bar"></div>
<div id="hint"><span class="d"><kbd>←</kbd><kbd>→</kbd> ou clique para avançar · <kbd>F</kbd> tela cheia · <kbd>G</kbd> visão geral</span><span class="m">Deslize ou toque para avançar · gire o celular</span></div>
<div id="hud">
  <div class="n"><b id="cur">01</b> <span>/ ${String(total).padStart(2, "0")}</span></div>
  <div class="lbl" id="lbl"></div>
  <button id="bPrev" aria-label="Slide anterior"><svg viewBox="0 0 16 16"><path d="M10 3 5 8l5 5"/></svg></button>
  <button id="bNext" aria-label="Próximo slide"><svg viewBox="0 0 16 16"><path d="m6 3 5 5-5 5"/></svg></button>
  <button id="bGrid" aria-label="Visão geral (G)"><svg viewBox="0 0 16 16"><rect x="2" y="2" width="5" height="5" rx=".5"/><rect x="9" y="2" width="5" height="5" rx=".5"/><rect x="2" y="9" width="5" height="5" rx=".5"/><rect x="9" y="9" width="5" height="5" rx=".5"/></svg></button>
  <button id="bFs" aria-label="Tela cheia (F)"><svg viewBox="0 0 16 16"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"/></svg></button>
</div>
<div id="ov" aria-hidden="true"><div class="hd">Visão geral · Esc para voltar</div><div class="g"></div></div>
<div id="blk"></div>`;

const js = String.raw`
<script>
(() => {
  const deck = document.getElementById('deck');
  const S = [...deck.querySelectorAll(':scope>section.s')];
  const N = S.length, $ = id => document.getElementById(id);
  const pad = n => String(n).padStart(2, '0');
  let i = 0, lock = 0;

  // rótulo de cada slide = o "eyebrow" (.eb) dele, ou o do último que tinha
  let last = 'Dry Needling';
  const labels = S.map(s => { const e = s.querySelector('.eb') || s.querySelector('h1,h2'); if (e) last = e.textContent.replace(/\s+/g, ' ').trim(); return last; });
  labels[0] = 'Dry Needling · Material de apoio';

  // índices para a entrada escalonada
  S.forEach(s => {
    [...s.children].forEach((c, k) => c.style.setProperty('--i', k));
    s.querySelectorAll('.grid,.cards,.pgs,.al3,ul.d,ul.pgl,.refs').forEach(g =>
      [...g.children].forEach((c, k) => c.style.setProperty('--j', Math.min(k, 10))));
  });

  function fit() {
    const k = Math.min(innerWidth / 1280, innerHeight / 720);
    deck.style.setProperty('--k', k);
    document.querySelectorAll('#ov .ovt').forEach(t => t.style.setProperty('--tk', t.clientWidth / 1280));
  }

  function go(n, opts = {}) {
    n = Math.max(0, Math.min(N - 1, n));
    if (n === i && !opts.force) return;
    const fwd = n > i;
    S.forEach((s, k) => {
      s.classList.remove('prev', 'next');
      if (k !== n) s.classList.add(k < n ? 'prev' : 'next');
    });
    S[i].classList.remove('on', 'in');
    i = n;
    const s = S[i];
    s.classList.add('on');
    s.classList.remove('in'); void s.offsetWidth; s.classList.add('in');
    $('cur').textContent = pad(i + 1);
    $('lbl').textContent = labels[i];
    $('bar').style.width = ((i + 1) / N * 100) + '%';
    if (!opts.noHash) history.replaceState(null, '', '#' + (i + 1));
    document.querySelectorAll('#ov .ovt').forEach((t, k) => t.classList.toggle('cur', k === i));
  }
  const next = () => go(i + 1), prev = () => go(i - 1);

  // visão geral (miniaturas montadas na primeira abertura)
  const ov = $('ov');
  function overview(show) {
    if (show && !ov.querySelector('.ovt')) {
      const g = ov.querySelector('.g');
      S.forEach((s, k) => {
        const b = document.createElement('button');
        b.className = 'ovt'; b.setAttribute('aria-label', 'Ir para o slide ' + (k + 1));
        const c = s.cloneNode(true);
        c.className = s.className.replace(/\b(on|in|prev|next)\b/g, '').trim();
        c.removeAttribute('style');
        b.append(c);
        const tag = document.createElement('i'); tag.textContent = pad(k + 1); b.append(tag);
        b.onclick = () => { go(k); overview(false); };
        g.append(b);
      });
    }
    ov.classList.toggle('on', show);
    ov.setAttribute('aria-hidden', !show);
    if (show) { fit(); const c = ov.querySelectorAll('.ovt')[i]; c.classList.add('cur'); c.scrollIntoView({ block: 'center' }); c.focus({ preventScroll: true }); }
  }
  const ovOn = () => ov.classList.contains('on');

  function fullscreen() {
    const d = document;
    if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else { const e = d.documentElement, f = e.requestFullscreen || e.webkitRequestFullscreen; if (f) f.call(e); }
  }

  // teclado (inclui passadores de slide, que mandam PageUp/PageDown)
  let typed = '';
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (ovOn()) {
      if (k === 'Escape' || k === 'g' || k === 'G') { overview(false); e.preventDefault(); }
      return;
    }
    if (document.body.classList.contains('black') && k !== 'f' && k !== 'F') { document.body.classList.remove('black'); e.preventDefault(); return; }
    if (/^[0-9]$/.test(k)) { typed = (typed + k).slice(-3); return; }
    if (k === 'Enter' && typed) { go(+typed - 1); typed = ''; e.preventDefault(); return; }
    typed = '';
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter', 'n', 'N'].includes(k)) { e.shiftKey && k === ' ' ? prev() : next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace', 'p', 'P'].includes(k)) prev();
    else if (k === 'Home') go(0);
    else if (k === 'End') go(N - 1);
    else if (k === 'f' || k === 'F') fullscreen();
    else if (k === 'g' || k === 'G' || k === 'o' || k === 'O') overview(true);
    else if (k === 'b' || k === 'B' || k === '.') document.body.classList.toggle('black');
    else if (k === 'h' || k === 'H') document.body.classList.toggle('clean');
    else return;
    e.preventDefault(); wake();
  });

  // clique: terço esquerdo volta, resto avança
  $('stage').addEventListener('click', e => {
    if (e.target.closest('a')) return;
    (e.clientX < innerWidth / 3 ? prev : next)();
  });
  $('bPrev').onclick = e => { e.stopPropagation(); prev(); };
  $('bNext').onclick = e => { e.stopPropagation(); next(); };
  $('bGrid').onclick = e => { e.stopPropagation(); overview(true); };
  if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) $('bFs').hidden = true;
  $('bFs').onclick = e => { e.stopPropagation(); fullscreen(); };
  $('blk').onclick = () => document.body.classList.remove('black');

  // roda/trackpad: um slide por gesto (ignora a inércia)
  let acc = 0, quiet;
  addEventListener('wheel', e => {
    if (ovOn() || e.ctrlKey) return;
    e.preventDefault();
    clearTimeout(quiet); quiet = setTimeout(() => { acc = 0; lock = 0; }, 180);
    if (lock) return;
    acc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(acc) > 45) { acc > 0 ? next() : prev(); acc = 0; lock = 1; }
  }, { passive: false });

  // toque: deslizar
  let tx = 0, ty = 0;
  addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', e => {
    if (ovOn()) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 40) return;
    (Math.abs(dx) > Math.abs(dy) ? dx < 0 : dy < 0) ? next() : prev();
  }, { passive: true });

  // esconde HUD e cursor quando parado
  let idleT;
  function wake() {
    document.body.classList.remove('idle');
    clearTimeout(idleT); idleT = setTimeout(() => document.body.classList.add('idle'), 2600);
  }
  addEventListener('mousemove', wake); addEventListener('touchstart', wake, { passive: true });
  setTimeout(() => $('hint').classList.add('off'), 4500);

  addEventListener('resize', fit);
  addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1)); if (n) go(n - 1, { noHash: true }); });

  fit();
  const start = parseInt(location.hash.slice(1)) || 1;
  S.forEach(s => s.classList.add('next'));
  go(Math.max(0, Math.min(N - 1, start - 1)), { force: true, noHash: start === 1 });
  wake();
})();
</script>`;

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0E1F16">
<title>Dry Needling · Slides do curso · Matheus Fernandes</title>
<meta name="description" content="Material de apoio do curso presencial de Dry Needling (14 e 15/11/2026) em modo apresentação.">
<!-- GERADO por scripts/dry-needling-slides.mjs a partir de docs/dry-needling-material.html — não editar à mão. -->
${fonts}
<style>${style}</style>
${player}
</head>
<body>
<div id="stage"><div id="deck">
${body.replace(/<script>[\s\S]*?<\/script>/, "")}
</div></div>
${shell}
${(body.match(/<script>[\s\S]*?<\/script>/) || [""])[0]}
${js}
</body>
</html>
`;

mkdirSync("public/turmas/dry-needling", { recursive: true });
writeFileSync(OUT, html);
console.log(`${total} slides -> ${OUT} (${(html.length / 1024).toFixed(0)} KB)`);
