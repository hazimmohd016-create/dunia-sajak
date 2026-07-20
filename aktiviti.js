/* =========================================================
   aktiviti.js — logik Aktiviti 1 (kuiz) & Aktiviti 2 (padanan)
   Menggunakan SFX daripada main.js (syiling/betul/salah)
   ========================================================= */

/* ---------------------------------------------------------
   KUIZ ANEKA PILIHAN (generik) — digunakan oleh Aktiviti 1 & 3
   Setiap .q-item ada beberapa .opt; jawapan betul: data-correct="1"
   --------------------------------------------------------- */
function initChoiceQuiz(cardId, boardId, label){
  const container = document.getElementById(cardId);
  if(!container) return;

  const items = container.querySelectorAll('.q-item');
  let answered = 0, score = 0;
  const total = items.length;

  items.forEach(item=>{
    const opts = item.querySelectorAll('.opt');
    const fb = item.querySelector('.feedback');
    opts.forEach(opt=>{
      opt.addEventListener('click', ()=>{
        if(item.dataset.done) return;          // sudah dijawab
        item.dataset.done = '1';
        answered++;
        const correct = opt.dataset.correct === '1';

        opts.forEach(o=>{
          o.classList.add('locked');
          if(o.dataset.correct === '1') o.classList.add('correct');
        });

        if(correct){
          score++;
          if(fb){ fb.textContent = '🪙 Betul! ' + (fb.dataset.ok || ''); fb.className = 'feedback ok show'; }
          try{ SFX.correct(); }catch(e){}
          try{ Coins.add(2, opt); }catch(e){}   // ganjaran syiling!
        }else{
          opt.classList.add('wrong');
          if(fb){ fb.textContent = '❌ Cuba fahami: ' + (fb.dataset.no || ''); fb.className = 'feedback no show'; }
          try{ SFX.wrong(); }catch(e){}
        }
        if(answered === total) showScore(score, total);
      });
    });
  });

  function showScore(s, t){
    const board = document.getElementById(boardId);
    if(!board) return;
    let msg = '';
    if(s === t){ msg = '🏆 SEMPURNA! Kamu wira sajak sejati!'; try{SFX.powerup();}catch(e){} }
    else if(s >= Math.ceil(t*0.6)){ msg = '🍄 Bagus! Teruskan usaha.'; }
    else { msg = '💪 Jangan putus asa — cuba baca nota semula!'; }
    board.innerHTML = 'SKOR ' + label + '<span class="big">🪙 ' + s + ' / ' + t + '</span>' + msg;
    board.classList.add('show');
    board.scrollIntoView({behavior:'smooth', block:'center'});
  }
}
initChoiceQuiz('akt1', 'score1', 'AKTIVITI 1');
initChoiceQuiz('akt3', 'score3', 'AKTIVITI 3');


/* ---------------------------------------------------------
   AKTIVITI 2 — Padankan Gaya Bahasa (Drag & Drop)
   .chip[data-key]  ->  .drop-zone[data-answer]
   Sokongan tetikus (drag) DAN sentuh (klik chip, klik zon)
   --------------------------------------------------------- */
(function activity2(){
  const wrap = document.getElementById('akt2');
  if(!wrap) return;

  const chips = wrap.querySelectorAll('.chip');
  const zones = wrap.querySelectorAll('.drop-zone');
  let selected = null;   // untuk mod sentuh/klik

  /* --- Mod DRAG (tetikus / desktop) --- */
  chips.forEach(chip=>{
    chip.setAttribute('draggable','true');
    chip.addEventListener('dragstart', e=>{
      if(chip.classList.contains('placed')){ e.preventDefault(); return; }
      chip.classList.add('dragging');
      e.dataTransfer.setData('text/plain', chip.dataset.key);
    });
    chip.addEventListener('dragend', ()=> chip.classList.remove('dragging'));

    /* --- Mod KLIK (telefon / tablet) --- */
    chip.addEventListener('click', ()=>{
      if(chip.classList.contains('placed')) return;
      if(selected === chip){ chip.classList.remove('dragging'); selected = null; return; }
      chips.forEach(c=>c.classList.remove('dragging'));
      selected = chip; chip.classList.add('dragging');
      try{ SFX.jump(); }catch(e){}
    });
  });

  zones.forEach(zone=>{
    zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', ()=> zone.classList.remove('over'));
    zone.addEventListener('drop', e=>{
      e.preventDefault(); zone.classList.remove('over');
      const key = e.dataTransfer.getData('text/plain');
      const chip = wrap.querySelector('.chip[data-key="'+key+'"]');
      placeChip(chip, zone);
    });
    /* Mod klik: klik zon selepas pilih chip */
    zone.addEventListener('click', ()=>{
      if(selected){ placeChip(selected, zone); selected = null; }
    });
  });

  function placeChip(chip, zone){
    if(!chip || chip.classList.contains('placed')) return;
    // Jika zon sudah ada chip, kembalikan chip lama ke bekas
    const bank = document.getElementById('chipBank');
    const existing = zone.querySelector('.chip');
    if(existing){ existing.classList.remove('placed'); bank.appendChild(existing); }

    zone.appendChild(chip);
    chip.classList.remove('dragging');
    chip.classList.add('placed');
    try{ SFX.coin(); }catch(e){}
  }

  const checkBtn = document.getElementById('checkAkt2');
  if(checkBtn){
    checkBtn.addEventListener('click', ()=>{
      let correct = 0;
      const total = zones.length;
      zones.forEach(zone=>{
        const chip = zone.querySelector('.chip');
        zone.classList.remove('filled-ok','filled-no');
        if(chip && chip.dataset.key === zone.dataset.answer){
          zone.classList.add('filled-ok'); correct++;
        }else{
          zone.classList.add('filled-no');
        }
      });
      const board = document.getElementById('score2');
      if(correct > 0){ try{ Coins.add(correct * 2, checkBtn); }catch(e){} }   // ganjaran syiling!
      let msg='';
      if(correct === total){ msg='🏆 HEBAT! Semua padanan tepat!'; try{SFX.powerup();}catch(e){} }
      else if(correct >= Math.ceil(total*0.5)){ msg='🍄 Hampir! Betulkan yang salah dan cuba lagi.'; try{SFX.correct();}catch(e){} }
      else{ msg='💪 Baca semula bahagian Gaya Bahasa, kemudian cuba semula!'; try{SFX.wrong();}catch(e){} }
      board.innerHTML = 'SKOR AKTIVITI 2<span class="big">⭐ ' + correct + ' / ' + total + '</span>' + msg;
      board.classList.add('show');
    });
  }

  const resetBtn = document.getElementById('resetAkt2');
  if(resetBtn){
    resetBtn.addEventListener('click', ()=>{
      const bank = document.getElementById('chipBank');
      chips.forEach(c=>{ c.classList.remove('placed','dragging'); bank.appendChild(c); });
      zones.forEach(z=> z.classList.remove('filled-ok','filled-no','over'));
      const board = document.getElementById('score2');
      board.classList.remove('show'); board.innerHTML='';
      selected = null;
    });
  }
})();
