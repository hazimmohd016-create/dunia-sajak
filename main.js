/* =========================================================
   main.js — kongsi untuk semua halaman
   - Navigasi mudah alih + tanda pautan aktif
   - Reveal semasa skrol (progressive enhancement)
   - Bunyi retro (WebAudio)
   - Sistem SYILING global (localStorage + HUD + animasi)
   - Blok ? boleh diketik (3 kali → blok "used")
   - Huruf tajuk hero melompat masuk
   - Kotak dialog typewriter
   - Mario berlari di atas tanah
   - Paip "kembali ke atas"
   - Peta level + jejak lawatan (localStorage)
   - Konfeti di halaman Rumusan
   ========================================================= */

/* ---------- Navigasi mudah alih ---------- */
function toggleNav(){
  const links = document.getElementById('navLinks');
  if(links) links.classList.toggle('open');
}

/* ---------- Nama fail halaman semasa ---------- */
const SW_PAGE = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

/* ---------- Tanda pautan halaman semasa ---------- */
(function markActive(){
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = (a.getAttribute('href') || '').toLowerCase();
    if(href === SW_PAGE || (SW_PAGE === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });
})();

/* ---------- Reveal semasa skrol (progressive enhancement) ----------
   Kandungan kelihatan secara lalai; fade-in hanya bila JS berjalan. */
document.documentElement.classList.add('js');
(function revealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  if(!('IntersectionObserver' in window)){
    items.forEach(i=>i.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  items.forEach(i=>io.observe(i));
  // Jaring keselamatan: semua kandungan pasti kelihatan selepas 2.5s
  setTimeout(()=> items.forEach(i=>i.classList.add('in')), 2500);
})();

/* ---------- Bunyi retro (WebAudio, tiada fail) ---------- */
const SFX = (function(){
  let ctx = null;
  function ac(){
    if(!ctx){
      try{ ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e){ ctx = null; }
    }
    return ctx;
  }
  function tone(freq, start, dur, type, vol){
    const a = ac(); if(!a) return;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, a.currentTime + start);
    g.gain.setValueAtTime(vol || 0.12, a.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
    o.connect(g); g.connect(a.destination);
    o.start(a.currentTime + start);
    o.stop(a.currentTime + start + dur + 0.02);
  }
  return {
    coin(){ tone(988,0,0.08,'square',0.12); tone(1319,0.07,0.18,'square',0.12); },
    correct(){ tone(659,0,0.09,'square',0.12); tone(784,0.09,0.09,'square',0.12); tone(1047,0.18,0.20,'square',0.12); },
    wrong(){ tone(196,0,0.18,'sawtooth',0.10); tone(147,0.16,0.22,'sawtooth',0.10); },
    powerup(){ tone(523,0,0.08,'square',0.1); tone(659,0.08,0.08,'square',0.1); tone(784,0.16,0.08,'square',0.1); tone(1047,0.24,0.22,'square',0.12); },
    jump(){ tone(523,0,0.06,'square',0.08); tone(784,0.06,0.12,'square',0.08); },
    blip(){ tone(1100,0,0.02,'square',0.02); }
  };
})();
window.SFX = SFX;

/* Bunyi lompat pada butang & pautan nav (blok ? ada bunyinya sendiri) */
document.addEventListener('click', (e)=>{
  const t = e.target.closest('.btn, .nav-links a');
  if(t){ try{ SFX.jump(); }catch(_){} }
});

/* =========================================================
   SISTEM SYILING GLOBAL
   ========================================================= */
const Coins = (function(){
  const KEY = 'sw_coins';
  let n = 0, el = null;
  try{ n = parseInt(localStorage.getItem(KEY) || '0', 10) || 0; }catch(e){}

  function fmt(x){ return (x < 10 ? '0' : '') + x; }
  function save(){ try{ localStorage.setItem(KEY, String(n)); }catch(e){} }

  function bindHud(){
    const mini = document.querySelector('.hud .coin-mini');
    if(!mini) return;
    const span = mini.parentElement;
    span.innerHTML = '<span class="coin-mini"></span> x <b id="coinCount">' + fmt(n) + '</b>';
    el = span.querySelector('#coinCount');
  }

  function fly(x, y){
    const c = document.createElement('span');
    c.className = 'coin-fly';
    c.style.left = (x - 13) + 'px';
    c.style.top  = (y - 13) + 'px';
    document.body.appendChild(c);
    setTimeout(()=> c.remove(), 950);
  }

  function add(amount, srcEl){
    n = Math.min(9999, n + amount); save();
    if(el){
      el.textContent = fmt(n);
      el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse');
    }
    if(srcEl && srcEl.getBoundingClientRect){
      const r = srcEl.getBoundingClientRect();
      const burst = Math.min(amount, 5);
      for(let i = 0; i < burst; i++){
        setTimeout(()=> fly(r.left + r.width/2 + (Math.random()*36 - 18), r.top), i * 90);
      }
    }
    try{ SFX.coin(); }catch(e){}
  }

  if(document.readyState !== 'loading') bindHud();
  else document.addEventListener('DOMContentLoaded', bindHud);

  return { add: add, get: ()=> n };
})();
window.Coins = Coins;

/* ---------- Blok ? boleh diketik → syiling! (3 kali → used) ---------- */
(function qblocks(){
  document.querySelectorAll('.qblock, .spr-qblock').forEach(q=>{
    q.setAttribute('role', 'button');
    q.setAttribute('tabindex', '0');
    q.title = 'Ketik untuk kumpul syiling!';
    q.dataset.hits = '0';
    function hit(){
      if(q.classList.contains('used')) return;
      const h = (+q.dataset.hits) + 1;
      q.dataset.hits = h;
      q.classList.remove('hit'); void q.offsetWidth; q.classList.add('hit');
      Coins.add(1, q);
      if(h >= 3){ q.classList.add('used'); q.textContent = ''; }
    }
    q.addEventListener('click', hit);
    q.addEventListener('keydown', e=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); hit(); } });
  });
  /* Syiling berputar pun boleh dikutip */
  document.querySelectorAll('.coin').forEach(c=>{
    c.title = 'Kutip saya!';
    c.addEventListener('click', ()=> Coins.add(1, c));
  });
})();

/* ---------- Huruf tajuk hero melompat masuk ---------- */
(function heroLetters(){
  const t = document.querySelector('.hero-title');
  if(!t) return;
  let i = 0;
  function wrap(node){
    if(node.nodeType === 3){
      const frag = document.createDocumentFragment();
      node.textContent.split('').forEach(ch=>{
        if(ch.trim() === ''){ frag.appendChild(document.createTextNode(' ')); return; }
        const s = document.createElement('span');
        s.className = 'ch';
        s.style.setProperty('--i', i++);
        s.textContent = ch;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    } else if(node.nodeType === 1){
      Array.from(node.childNodes).forEach(wrap);
    }
  }
  Array.from(t.childNodes).forEach(wrap);
})();

/* ---------- Kotak dialog typewriter ---------- */
(function typewriter(){
  const els = document.querySelectorAll('.typewriter');
  if(!els.length) return;
  function type(el){
    const txt = el.dataset.text || el.textContent;
    el.textContent = '';
    const cur = document.createElement('span');
    cur.className = 'cursor-blink';
    cur.textContent = '▮';
    el.appendChild(cur);
    let i = 0;
    (function step(){
      if(i < txt.length){
        cur.insertAdjacentText('beforebegin', txt[i]);
        i++;
        if(i % 2 === 0){ try{ SFX.blip(); }catch(e){} }
        const ch = txt[i-1];
        setTimeout(step, (ch === '.' || ch === ',' || ch === '!' || ch === '?') ? 240 : 32);
      } else {
        cur.textContent = '▼';
      }
    })();
  }
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){ io.unobserve(e.target); type(e.target); }
    }), { threshold: .4 });
    els.forEach(el=> io.observe(el));
  } else {
    els.forEach(type);
  }
})();

/* ---------- Mario berlari + paip "kembali ke atas" ---------- */
(function decor(){
  const ground = document.querySelector('.ground-strip, .scenery');
  if(ground){
    const m = document.createElement('span');
    m.className = 'mario-run';
    m.setAttribute('aria-hidden', 'true');
    ground.appendChild(m);
  }
  const p = document.createElement('button');
  p.id = 'pipeTop'; p.type = 'button';
  p.setAttribute('aria-label', 'Kembali ke atas');
  p.innerHTML = '<span class="arrow">▲</span><span class="pt"></span><span class="pb"></span>';
  document.body.appendChild(p);
  p.addEventListener('click', ()=>{
    try{ SFX.jump(); }catch(e){}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', ()=>{
    p.classList.toggle('show', window.scrollY > 480);
  }, { passive: true });
})();

/* ---------- Jejak lawatan + Peta Level ---------- */
(function progress(){
  const KEY = 'sw_visited';
  let v = [];
  try{ v = JSON.parse(localStorage.getItem(KEY) || '[]'); }catch(e){}
  if(!v.includes(SW_PAGE)){
    v.push(SW_PAGE);
    try{ localStorage.setItem(KEY, JSON.stringify(v)); }catch(e){}
  }
  const map = document.getElementById('worldMap');
  if(map){
    map.querySelectorAll('a[data-page]').forEach(a=>{
      const pg = (a.dataset.page || '').toLowerCase();
      if(pg === SW_PAGE) a.parentElement.classList.add('here');
      else if(v.includes(pg)) a.parentElement.classList.add('done');
    });
  }
})();

/* ---------- Konfeti di halaman Rumusan ---------- */
(function confetti(){
  if(SW_PAGE !== 'rumusan.html') return;
  const colors = ['#e52521', '#fbd000', '#43b047', '#2a7de1', '#b455d6', '#ffffff'];
  for(let i = 0; i < 70; i++){
    const c = document.createElement('span');
    c.className = 'confetti';
    const size = 6 + Math.random() * 8;
    c.style.left = (Math.random() * 100) + 'vw';
    c.style.width = size + 'px';
    c.style.height = size + 'px';
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = (3 + Math.random() * 3) + 's';
    c.style.animationDelay = (Math.random() * 1.6) + 's';
    document.body.appendChild(c);
    setTimeout(()=> c.remove(), 8500);
  }
})();

/* =========================================================
   EDISI ULTRA — HUD interaktif, mod Underground,
   bar kemajuan Mario, goomba pijak, piranha
   ========================================================= */

/* ---------- Suis bunyi (mute) — balut kaedah SFX ---------- */
(function soundToggle(){
  const orig = { coin:SFX.coin, correct:SFX.correct, wrong:SFX.wrong,
                 powerup:SFX.powerup, jump:SFX.jump, blip:SFX.blip };
  let muted = false;
  try{ muted = localStorage.getItem('sw_muted') === '1'; }catch(e){}
  Object.keys(orig).forEach(k=>{
    SFX[k] = function(){ if(!muted) orig[k](); };
  });
  SFX.isMuted = ()=> muted;
  SFX.setMuted = v=>{
    muted = !!v;
    try{ localStorage.setItem('sw_muted', muted ? '1' : '0'); }catch(e){}
  };
})();

/* ---------- Star Power: kilauan pelangi setiap 20 syiling ---------- */
(function starPower(){
  const origAdd = Coins.add;
  let last = Coins.get();
  Coins.add = function(n, el){
    origAdd(n, el);
    const now = Coins.get();
    if(Math.floor(now / 20) > Math.floor(last / 20)){
      document.body.classList.remove('star-power');
      void document.body.offsetWidth;
      document.body.classList.add('star-power');
      try{ SFX.powerup(); }catch(e){}
      setTimeout(()=> document.body.classList.remove('star-power'), 2000);
    }
    last = now;
  };
})();

/* ---------- Mod Underground (dunia bawah tanah) ---------- */
(function underground(){
  let ug = false;
  try{ ug = localStorage.getItem('sw_ug') === '1'; }catch(e){}
  if(ug) document.documentElement.classList.add('ug');
  window.SW_toggleUG = function(btn){
    ug = !ug;
    document.documentElement.classList.toggle('ug', ug);
    try{ localStorage.setItem('sw_ug', ug ? '1' : '0'); }catch(e){}
    if(btn){ btn.textContent = ug ? '☀️' : '🌙'; btn.setAttribute('aria-pressed', ug); }
    try{ SFX.powerup(); }catch(e){}
  };
  window.SW_isUG = ()=> ug;
})();

/* ---------- HUD interaktif: nama pemain, bintang, butang ---------- */
(function hudPro(){
  const hud = document.querySelector('.hud');
  if(!hud) return;

  /* Nama pemain (klik untuk tukar, disimpan) */
  const nameEl = hud.querySelector('.mario-mini');
  if(nameEl){
    nameEl.classList.add('hud-name');
    let stored = '';
    try{ stored = localStorage.getItem('sw_name') || ''; }catch(e){}
    const fallback = (nameEl.textContent.replace(/[^\wÀ-ÿ' -]/g, '').trim() || 'MARIO').toUpperCase();
    function show(nm){ nameEl.innerHTML = '🍄 ' + nm; }
    show(stored || fallback);
    nameEl.title = 'Klik untuk tukar nama pemain!';
    nameEl.addEventListener('click', function(){
      if(nameEl.querySelector('input')) return;
      const cur = (stored || fallback);
      nameEl.innerHTML = '🍄 ';
      const inp = document.createElement('input');
      inp.maxLength = 8;
      inp.value = cur;
      nameEl.appendChild(inp);
      inp.focus(); inp.select();
      function save(){
        const nm = (inp.value.trim() || cur).toUpperCase().slice(0, 8);
        stored = nm;
        try{ localStorage.setItem('sw_name', nm); }catch(e){}
        show(nm);
        try{ SFX.powerup(); }catch(e){}
      }
      inp.addEventListener('blur', save);
      inp.addEventListener('keydown', e=>{ if(e.key === 'Enter') inp.blur(); });
    });
  }

  /* Kiraan bintang = bilangan world yang dilawati */
  let visited = [];
  try{ visited = JSON.parse(localStorage.getItem('sw_visited') || '[]'); }catch(e){}
  const stars = document.createElement('span');
  stars.className = 'hud-stars';
  stars.title = 'World yang telah kamu lawati';
  stars.textContent = '★ x ' + (visited.length < 10 ? '0' : '') + visited.length;
  const coinSpan = hud.querySelector('.coin-mini');
  if(coinSpan && coinSpan.parentElement.nextSibling){
    coinSpan.parentElement.after(stars);
  } else {
    hud.appendChild(stars);
  }

  /* Butang bunyi 🔊/🔇 */
  const snd = document.createElement('span');
  snd.className = 'hud-btn';
  snd.setAttribute('role', 'button');
  snd.title = 'Bunyi hidup/mati';
  snd.textContent = SFX.isMuted() ? '🔇' : '🔊';
  snd.addEventListener('click', ()=>{
    SFX.setMuted(!SFX.isMuted());
    snd.textContent = SFX.isMuted() ? '🔇' : '🔊';
    if(!SFX.isMuted()){ try{ SFX.coin(); }catch(e){} }
  });
  hud.appendChild(snd);

  /* Butang mod Underground 🌙/☀️ */
  const ugBtn = document.createElement('span');
  ugBtn.className = 'hud-btn';
  ugBtn.setAttribute('role', 'button');
  ugBtn.title = 'Mod dunia bawah tanah!';
  ugBtn.textContent = window.SW_isUG() ? '☀️' : '🌙';
  ugBtn.addEventListener('click', ()=> window.SW_toggleUG(ugBtn));
  hud.appendChild(ugBtn);
})();

/* ---------- Bar kemajuan skrol: Mario lari ke bendera ---------- */
(function scrollQuest(){
  const bar = document.createElement('div');
  bar.id = 'scrollQuest';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<div class="sq-track"></div><span class="sq-mario"></span><span class="sq-flag">🚩</span>';
  document.body.appendChild(bar);
  const mario = bar.querySelector('.sq-mario');
  const nav = document.querySelector('.navbar');
  function update(){
    /* Duduk rapi di bawah navbar melekit — tidak bertindih */
    bar.style.top = (nav ? nav.offsetHeight : 0) + 'px';
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.classList.toggle('show', window.scrollY > 160);
    /* 60px = lebar Mario + ruang bendera di hujung kanan */
    mario.style.left = 'calc(' + (pct * 100) + '% - ' + Math.round(pct * 60) + 'px)';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

/* ---------- Goomba boleh dipijak! ---------- */
(function goomba(){
  document.querySelectorAll('.ls-goomba').forEach(g=>{
    g.title = 'Pijak saya!';
    g.addEventListener('click', ()=>{
      if(g.classList.contains('squish')) return;
      g.classList.add('squish');
      try{ SFX.jump(); }catch(e){}
      Coins.add(3, g);
      setTimeout(()=>{ g.classList.remove('squish'); }, 6000);
    });
  });
})();

/* ---------- Pokok Piranha muncul dari paip ---------- */
(function piranha(){
  document.querySelectorAll('.ls-pipe').forEach(p=>{
    /* Lengkapkan badan paip jika belum ada (elemen kosong dalam HTML) */
    if(!p.querySelector('.pt')){
      const pt = document.createElement('span'); pt.className = 'pt';
      const pb = document.createElement('span'); pb.className = 'pb';
      p.appendChild(pt); p.appendChild(pb);
    }
    const pl = document.createElement('span');
    pl.className = 'piranha';
    pl.setAttribute('aria-hidden', 'true');
    p.insertBefore(pl, p.firstChild);
  });
})();

/* =========================================================
   MUZIK LATAR 8-BIT (melodi asli) + KOOPA TERBANG
   ========================================================= */

/* ---------- Muzik latar: melodi chiptune asli, gelung ---------- */
const Music = (function(){
  let ctx = null, on = false, timer = null;
  const BEAT = 0.17;
  /* Melodi asli yang ceria (bukan lagu tema Mario) — [frekuensi, bilangan detik] */
  const MEL = [
    [523,1],[659,1],[784,2],  [659,1],[587,1],[523,2],
    [440,1],[523,1],[659,2],  [587,1],[494,1],[523,2],
    [392,1],[523,1],[659,1],[784,1],[880,2],[784,1],[659,1],
    [587,1],[659,1],[523,3],  [0,1]
  ];
  function ac(){
    if(!ctx){
      try{ ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e){ ctx = null; }
    }
    return ctx;
  }
  function note(f, t, d){
    const a = ctx;
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = f;
    g.gain.setValueAtTime(0.04, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + d + 0.02);
    /* lapisan bes lembut satu oktaf ke bawah */
    const o2 = a.createOscillator(), g2 = a.createGain();
    o2.type = 'triangle'; o2.frequency.value = f / 2;
    g2.gain.setValueAtTime(0.05, t);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o2.connect(g2); g2.connect(a.destination);
    o2.start(t); o2.stop(t + d + 0.02);
  }
  function loop(){
    if(!on) return;
    const a = ac(); if(!a) return;
    if(a.state === 'suspended'){ a.resume(); }
    let t = a.currentTime + 0.08;
    MEL.forEach(n=>{
      if(n[0]) note(n[0], t, n[1] * BEAT * 0.9);
      t += n[1] * BEAT;
    });
    timer = setTimeout(loop, (t - a.currentTime - 0.06) * 1000);
  }
  return {
    isOn: ()=> on,
    toggle(){
      on = !on;
      try{ localStorage.setItem('sw_music', on ? '1' : '0'); }catch(e){}
      if(on) loop(); else clearTimeout(timer);
      return on;
    },
    init(){
      let want = false;
      try{ want = localStorage.getItem('sw_music') === '1'; }catch(e){}
      if(want){
        /* pelayar perlukan gerak isyarat pengguna dahulu */
        const h = ()=>{ document.removeEventListener('click', h); on = true; loop(); syncBtn(); };
        document.addEventListener('click', h);
      }
    }
  };
  function syncBtn(){
    const b = document.getElementById('musicBtn');
    if(b) b.classList.toggle('off', !on);
  }
})();
window.Music = Music;
Music.init();

/* Butang muzik 🎵 dalam HUD */
(function musicBtn(){
  const hud = document.querySelector('.hud');
  if(!hud) return;
  const b = document.createElement('span');
  b.className = 'hud-btn' + (Music.isOn() ? '' : ' off');
  b.id = 'musicBtn';
  b.setAttribute('role', 'button');
  b.title = 'Muzik latar hidup/mati';
  b.textContent = '🎵';
  b.addEventListener('click', ()=>{
    const on = Music.toggle();
    b.classList.toggle('off', !on);
  });
  hud.appendChild(b);
})();

/* ---------- Koopa Paratroopa terbang — klik untuk +5 syiling! ---------- */
(function skyFlyer(){
  const f = document.createElement('div');
  f.id = 'skyFlyer';
  f.title = 'Tangkap saya untuk syiling bonus!';
  document.body.appendChild(f);
  let flying = false;

  function launch(){
    if(flying) return;
    flying = true;
    f.style.top = (10 + Math.random() * 30) + 'vh';
    f.style.setProperty('--fdur', (12 + Math.random() * 8) + 's');
    f.classList.toggle('rtl', Math.random() < 0.5);
    f.classList.remove('caught');
    f.classList.add('fly');
    /* tamat penerbangan → sorok & jadualkan seterusnya */
    const t = setTimeout(end, 22000);
    f.onanimationend = (e)=>{ if(e.animationName === 'flyAcross'){ clearTimeout(t); end(); } };
  }
  function end(){
    f.classList.remove('fly');
    flying = false;
    schedule();
  }
  function schedule(){
    setTimeout(launch, 14000 + Math.random() * 18000);
  }
  f.addEventListener('click', ()=>{
    if(!flying || f.classList.contains('caught')) return;
    Coins.add(5, f);
    try{ SFX.powerup(); }catch(e){}
    f.classList.add('caught');
    setTimeout(end, 750);
  });
  /* penerbangan pertama tidak lama selepas halaman dibuka */
  setTimeout(launch, 7000);
})();
