/* =========================================================
   pentaksiran.js — Kuiz KBAT (hantar semua, kemudian skor)
   Setiap .q-item: pilih satu .opt (data-correct="1" = betul)
   ========================================================= */
(function pentaksiran(){
  const form = document.getElementById('assess');
  if(!form) return;

  const items = form.querySelectorAll('.q-item');
  let submitted = false;

  // Pemilihan jawapan (satu sahaja setiap soalan)
  items.forEach(item=>{
    const opts = item.querySelectorAll('.opt');
    opts.forEach(opt=>{
      opt.addEventListener('click', ()=>{
        if(submitted) return;
        opts.forEach(o=>o.classList.remove('selected-opt'));
        opt.classList.add('selected-opt');
        item.dataset.picked = '1';
        try{ SFX.jump(); }catch(e){}
      });
    });
  });

  const submitBtn = document.getElementById('submitAssess');
  submitBtn.addEventListener('click', ()=>{
    if(submitted) return;

    // Semak semua telah dijawab
    let unanswered = 0;
    items.forEach(it=>{ if(!it.dataset.picked) unanswered++; });
    if(unanswered > 0){
      const warn = document.getElementById('assessWarn');
      warn.textContent = '⚠️ Sila jawab semua ' + items.length + ' soalan dahulu! (Tinggal ' + unanswered + ')';
      warn.style.display = 'block';
      try{ SFX.wrong(); }catch(e){}
      warn.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }
    document.getElementById('assessWarn').style.display = 'none';

    submitted = true;
    let score = 0;
    const total = items.length;

    items.forEach(item=>{
      const opts = item.querySelectorAll('.opt');
      const fb = item.querySelector('.feedback');
      let picked = null;
      opts.forEach(o=>{
        o.classList.add('locked');
        if(o.classList.contains('selected-opt')) picked = o;
        if(o.dataset.correct === '1') o.classList.add('correct');
      });
      if(picked && picked.dataset.correct === '1'){
        score++;
        if(fb) fb.className = 'feedback ok show';
      }else{
        if(picked) picked.classList.add('wrong');
        if(fb) fb.className = 'feedback no show';
      }
    });

    // Papan skor + bintang
    const board = document.getElementById('assessScore');
    if(score > 0){ try{ Coins.add(score * 3, submitBtn); }catch(e){} }   // ganjaran syiling!
    const pct = Math.round(score/total*100);
    let stars = '★★★★★';
    let msg = '';
    if(score === total){ stars='⭐⭐⭐⭐⭐'; msg='🏆 CEMERLANG! Pemikiran KBAT kamu hebat!'; try{SFX.powerup();}catch(e){} }
    else if(score >= 4){ stars='⭐⭐⭐⭐'; msg='🍄 Sangat baik! Sedikit lagi menuju sempurna.'; try{SFX.correct();}catch(e){} }
    else if(score >= 3){ stars='⭐⭐⭐'; msg='👍 Baik! Ulang kaji bahagian yang salah.'; }
    else if(score >= 2){ stars='⭐⭐'; msg='💪 Teruskan berusaha — baca semula nota sajak.'; }
    else { stars='⭐'; msg='📖 Jangan putus asa! Cuba fahami nota sekali lagi.'; }

    board.innerHTML =
      'KEPUTUSAN PENTAKSIRAN' +
      '<span class="big">🎯 ' + score + ' / ' + total + '  (' + pct + '%)</span>' +
      '<div style="font-size:30px;margin:6px 0">' + stars + '</div>' +
      msg;
    board.classList.add('show');
    submitBtn.style.display = 'none';
    document.getElementById('retryAssess').style.display = 'inline-flex';
    board.scrollIntoView({behavior:'smooth', block:'center'});
  });

  const retry = document.getElementById('retryAssess');
  if(retry){
    retry.addEventListener('click', ()=> location.reload());
  }
})();
