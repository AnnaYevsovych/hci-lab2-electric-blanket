const $=s=>document.querySelector(s);
let cur='v1',t0=0;
const f=n=>n.toFixed(1).replace('.',',');
const tick=()=>{if(!t0)t0=performance.now()};
const hLabel=h=>h===0.5?'30 хв':h+' год';
function setSt(on,a,b){$('#st').classList.toggle('on',on);$('#stt').textContent=a;$('#sts').textContent=b}
function done(t,h){
  setSt(true,'Ковдра нагрівається: '+t+' °C','Вимкнеться через '+hLabel(h));
  $('#res').textContent='Ваш час: '+f((performance.now()-t0)/1000)+' с';
  t0=0;
}
function reset(){
  t0=0;
  $('#t1').value=30;document.querySelectorAll('input[name=tm]').forEach(r=>r.checked=false);
  $('#rt').value=30;$('#rh').value=0;$('#tv').textContent='30 °C';$('#hv').textContent='0 год';
  $('#e1').textContent='';$('#undo').classList.remove('show');$('#res').textContent='';
  setSt(false,'Ковдра вимкнена','');
}
function show(v){
  cur=v;document.querySelectorAll('.panel').forEach(p=>p.hidden=p.id!==v);
  document.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-selected',t.dataset.v===v));
  reset();
}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>show(t.dataset.v));
$('#reset').onclick=reset;
$('#annot').onchange=e=>document.body.classList.toggle('annot',e.target.checked);
$('.wrap').addEventListener('pointerdown',e=>{if(e.target.closest('.panel'))tick()});
document.addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('.panel'))tick()});

// Варіант 1: форма
$('#go1').onclick=()=>{
  const t=+$('#t1').value,r=document.querySelector('input[name=tm]:checked');
  if(!(t>=30&&t<=45)){$('#e1').textContent='Введіть температуру від 30 до 45 °C';return}
  if(!r){$('#e1').textContent='Оберіть, через скільки годин вимкнути';return}
  $('#e1').textContent='';done(t,+r.value);
};
// Варіант 2: сцени
document.querySelectorAll('.card').forEach(c=>c.onclick=()=>{
  tick();
  $('#undot').textContent='Сцену «'+c.dataset.n+'» запущено';$('#undo').classList.add('show');
  done(c.dataset.t,+c.dataset.h);
});
$('#undob').onclick=()=>{$('#undo').classList.remove('show');setSt(false,'Ковдра вимкнена','Сцену скасовано');$('#res').textContent=''};
// Варіант 3: повзунки
$('#rt').oninput=e=>$('#tv').textContent=e.target.value+' °C';
$('#rh').oninput=e=>$('#hv').textContent=e.target.value+' год';
$('#go3').onclick=()=>{
  tick();
  if(+$('#rh').value===0){$('#res').textContent='Спочатку встановіть таймер';t0=0;return}
  done(+$('#rt').value,+$('#rh').value);
};
function fromHash(){const h=location.hash.slice(1);if(['v1','v2','v3'].includes(h))show(h)}
addEventListener('hashchange',fromHash);fromHash();reset();
