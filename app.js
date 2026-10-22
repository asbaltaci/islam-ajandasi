'use strict';
const KEY='islam-ajandasi-v1';
let state;try{state=JSON.parse(localStorage.getItem(KEY))||{}}catch{state={}};
state.checks ||= {};state.counts ||= {};state.goals ||= {};state.notes ||= {};state.custom ||= [];
const $=id=>document.getElementById(id), save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const localDay=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const today=localDay();let selectedDay=today;
const safe=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const baseDhikrs=[['subhan','Sübhânallah',100],['elham','Elhamdülillah',100],['allahuekber','Allahu Ekber',100],['tevhid','Lâ ilâhe illallah',100],['istigfar','Estağfirullah',100],['tevbe','Estağfirullâhe ve etûbü ileyh',100],['bihamdihi','Sübhânallâhi ve bihamdihî',100],['azim','Sübhânallâhil azîm',100],['salavat','Salavat-ı Şerife',100],['lahavle','Lâ havle ve lâ kuvvete illâ billâh',100],['hasbiyallah','Hasbiyallâhu lâ ilâhe illâ Hû',100],['hayy','Yâ Hayyü Yâ Kayyûm',100],['fettah','Yâ Fettâh',489],['rezzak','Yâ Rezzâk',100],['safi','Yâ Şâfî',100],['vedud','Yâ Vedûd',400]];
const plans=[
['hatim','Kur’an-ı Kerim Hatmi',30,'cüz','PDF s.8'],['tevhid70','Kelime-i Tevhid',70,'1.000’lik bölüm','PDF s.9'],['istigfar70','İstiğfar',70,'1.000’lik bölüm','PDF s.10'],['salavat70','Salavat',70,'1.000’lik bölüm','PDF s.11'],['mulk','Mülk Suresi',100,'okuma','PDF s.13'],['vakia','Vakıa Suresi',100,'okuma','PDF s.14'],['amme','Amme Suresi',100,'okuma','PDF s.15'],['yasin100','Yasin Suresi',100,'okuma','PDF s.16'],['fetih','Fetih Suresi',100,'okuma','PDF s.17'],['fatiha313','Fâtiha Suresi',313,'okuma','PDF s.18'],['ayet313','Âyetel Kürsî',313,'okuma','PDF s.19'],['kevser21','21 Gün · 100 Kevser Suresi',21,'gün','PDF s.20'],['ihlas40','İhlâs-ı Şerif Hatmi',40,'1.000’lik bölüm','PDF s.21'],['insirah40','İnşirah Suresi',40,'1.000’lik bölüm','PDF s.23'],['yasin41','Yasin-i Şerif Hatmi',41,'okuma','PDF s.24'],['kamp41','41 Günlük Manevi Kamp',41,'gün','PDF s.6'],['teheccud30','30 Günlük Teheccüd',30,'gün','PDF s.25'],['yunus12','Yunus Aleyhisselam Duası',12,'1.000’lik bölüm','PDF s.4']];
function check(id){return !!state.checks[id]}function setCheck(id,v){state.checks[id]=v;save()}
function show(screen){document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('hidden',e.id!==screen));document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.screen===screen));if(screen==='home')renderHome();if(screen==='dhikr')renderDhikr();if(screen==='plans')renderPlans();if(screen==='worship')renderWorship();if(screen==='more')renderMore();window.scrollTo(0,0)}
document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>show(b.dataset.screen)));
function progress(id,n){let c=0;for(let i=1;i<=n;i++)if(check(`plan:${id}:${i}`))c++;return c}
function renderHome(){const date=new Date(today+'T12:00:00');$('today').textContent=date.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});const cards=[['Günlük zikir','dhikr',`${baseDhikrs.filter(x=>(state.counts[`${today}:${x[0]}`]||0)>0).length} zikir`],['Kur’an hatmi','plans',`${progress('hatim',30)} / 30 cüz`],['41 günlük kamp','plans',`${progress('kamp41',41)} / 41 gün`],['Teheccüd','plans',`${progress('teheccud30',30)} / 30 gün`]];$('homeCards').innerHTML=cards.map(x=>`<div class="card"><h3>${x[0]}</h3><strong>${x[2]}</strong><br><button data-goto="${x[1]}">Aç →</button></div>`).join('');$('homeCards').querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>show(b.dataset.goto));$('dailyNote').value=state.notes[today]||'';renderHomeIndex()}
$('saveNote').onclick=()=>{state.notes[today]=$('dailyNote').value;save();$('noteMessage').textContent='Not kaydedildi.'};
$('dhikrDate').value=today;$('dhikrDate').onchange=e=>{selectedDay=e.target.value||today;renderDhikr()};
let editing=null;function allDhikrs(){return [...baseDhikrs,...state.custom].filter(x=>!state.checks[`hidden:${x[0]}`])}
function renderDhikr(){let list=$('dhikrList');list.replaceChildren();for(const [id,baseName,baseGoal] of allDhikrs()){let name=state.goals[`name:${id}`]||baseName,goal=Number(state.goals[id]||baseGoal),k=`${selectedDay}:${id}`,n=Number(state.counts[k]||0);let row=document.createElement('div');row.className='tracker';let info=document.createElement('div');info.className='info';let strong=document.createElement('strong');strong.textContent=name;let small=document.createElement('small');small.textContent=n>=goal?'Elhamdülillah, zikir tamamlandı.':'Hedefe '+(goal-n)+' kaldı';info.append(strong,small);let count=document.createElement('span');count.className='count';count.textContent=n+' / '+goal;let minus=document.createElement('button');minus.textContent='−';minus.setAttribute('aria-label',name+' azalt');minus.onclick=()=>{state.counts[k]=Math.max(0,n-1);save();renderDhikr()};let plus=document.createElement('button');plus.className='plus';plus.textContent='+1';plus.disabled=n>=goal;plus.onclick=()=>{state.counts[k]=Math.min(goal,n+1);save();let left=goal-state.counts[k];if(navigator.vibrate){try{navigator.vibrate(left===0?[300,100,350]:left===1?180:left===2?100:left===3?60:12)}catch{}}renderDhikr()};let edit=document.createElement('button');edit.className='edit';edit.textContent='Düzenle';edit.onclick=()=>openEdit(id,name,goal);row.append(info,count,minus,plus,edit);list.append(row)}}
function openEdit(id,name,goal){editing=id;$('editName').value=name;$('editGoal').value=goal;$('editDialog').showModal()}
$('addDhikr').onclick=()=>openEdit(null,'',100);
$('editForm').addEventListener('submit',e=>{if(e.submitter?.value!=='save')return;let name=$('editName').value.trim(),goal=Number($('editGoal').value);if(!name||!Number.isInteger(goal)||goal<1||goal>100000){e.preventDefault();alert('Geçerli ad ve hedef gir.');return}let id=editing;if(!id){id='ozel-'+Date.now();state.custom.push([id,name,goal])}state.goals[`name:${id}`]=name;state.goals[id]=goal;save();renderDhikr()});
function renderPlanInto(container,filter){container.replaceChildren();for(const [id,title,n,unit,source] of plans.filter(filter)){const c=progress(id,n),panel=document.createElement('div');panel.className='panel';panel.innerHTML=`<div class="row"><h3>${safe(title)}</h3><span class="pill">${c}/${n}</span></div><small class="hint">${safe(source)} · Her kutu 1 ${safe(unit)} temsil eder</small><div class="progress"><div style="width:${c/n*100}%"></div></div><div class="gridcells"></div>`;const grid=panel.querySelector('.gridcells');for(let i=1;i<=n;i++){let btn=document.createElement('button');btn.className='cell'+(check(`plan:${id}:${i}`)?' checked':'');btn.textContent=i;btn.setAttribute('aria-label',title+' '+i+' '+unit);btn.setAttribute('aria-pressed',check(`plan:${id}:${i}`));btn.onclick=()=>{setCheck(`plan:${id}:${i}`,!check(`plan:${id}:${i}`));renderPlanInto(container,filter)};grid.append(btn)}container.append(panel)}}
function renderPlans(){renderPlanInto($('planList'),x=>!['teheccud30','kamp41'].includes(x[0]));renderPrayerProgram()}
const prayers=['Sabah','Öğle','İkindi','Akşam','Yatsı','Vitir'];
function renderWorship(){let root=$('worshipContent');root.innerHTML='<div class="panel"><h3>Günlük namaz takibi</h3><label>Tarih<input type="date" id="prayerDate"></label><div id="prayerChecks"></div></div><div class="panel"><h3>Kaza namazları</h3><p class="hint">PDF s.28 · Her işaret bir kaza namazı kaydıdır.</p><div id="kaza"></div></div><div class="panel"><h3>Kaza oruçları</h3><p class="hint">PDF s.26 · Tamamlanan günleri işaretle.</p><label>Toplam hedef (gün)<input id="fastGoal" type="number" min="1" max="3650"></label><div id="fastGrid" class="gridcells"></div></div>';let date=$('prayerDate');date.value=today;function drawPrayers(){let box=$('prayerChecks');box.replaceChildren();prayers.forEach(p=>{let row=document.createElement('div');row.className='checkrow';let cb=document.createElement('input');cb.type='checkbox';let k=`prayer:${date.value}:${p}`;cb.checked=check(k);cb.onchange=()=>setCheck(k,cb.checked);let label=document.createElement('label');label.textContent=p+' namazı';row.append(cb,label);box.append(row)})}date.onchange=drawPrayers;drawPrayers();let kaza=$('kaza');prayers.forEach(p=>{let k=`kaza:${p}`,n=Number(state.counts[k]||0),row=document.createElement('div');row.className='tracker';row.innerHTML=`<div class="info"><strong>${p}</strong><small>Tamamlanan toplam</small></div><span class="count">${n}</span>`;let minus=document.createElement('button');minus.textContent='−';minus.onclick=()=>{state.counts[k]=Math.max(0,n-1);save();renderWorship()};let plus=document.createElement('button');plus.textContent='+1';plus.onclick=()=>{state.counts[k]=n+1;save();renderWorship()};row.append(minus,plus);kaza.append(row)});let fg=$('fastGoal');fg.value=state.goals.fast||30;fg.onchange=()=>{state.goals.fast=Math.max(1,Math.min(3650,Number(fg.value)||30));save();renderWorship()};let grid=$('fastGrid');for(let i=1;i<=Number(fg.value);i++){let b=document.createElement('button');b.className='cell'+(check('fast:'+i)?' checked':'');b.textContent=i;b.onclick=()=>{setCheck('fast:'+i,!check('fast:'+i));b.classList.toggle('checked',check('fast:'+i))};grid.append(b)}}
function renderMore(){const root=$('moreContent');root.replaceChildren();const intro=createPanel(root,'Ajanda çizelgeleri','Aşağıdaki bölüm düğmelerine dokun; her bölümde işaretlemeler otomatik kaydedilir.');const shortcuts=document.createElement('div');shortcuts.className='pageindex';[['Peygamberler haritası','prophetPanel'],['99 Esmâü’l-Hüsnâ','esmaPanel'],['21 Gün Kevser','kevserPanel'],['46 Gün Kaza Namazı','kaza46Panel'],['Nafile namazlar','nafilePanel']].forEach(([name,id])=>{let b=document.createElement('button');b.textContent=name;b.onclick=()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});shortcuts.append(b)});intro.append(shortcuts);renderExtras();const nafile=createPanel(root,'30 günlük nafile namazlar · PDF s.27','Her namaz için 30 günlük ayrı takip.');nafile.id='nafilePanel';['2 Rekât Teheccüd','2 Rekât Hacet','4 Rekât Kuşluk','2 Rekât Şükür','2 Rekât İstihare','2 Rekât Tevbe'].forEach(name=>{let panel=document.createElement('div');panel.className='compact';let h=document.createElement('h3');h.textContent=name;panel.append(h);drawChecks(panel,Array.from({length:30},(_,i)=>String(i+1)),`nafile:${name}`);nafile.append(panel)});addNafileProgress(nafile)}
$('export').onclick=()=>{let blob=new Blob([JSON.stringify({app:'İslam Ajandası',version:1,data:state},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='islam-ajandasi-yedek.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)};
$('import').onclick=()=>$('importFile').click();$('importFile').onchange=async e=>{let file=e.target.files[0];if(!file)return;try{let obj=JSON.parse(await file.text());if(obj.app!=='İslam Ajandası'||!obj.data||typeof obj.data!=='object')throw Error('Bu dosya İslam Ajandası yedeği değil');if(!confirm('Mevcut ajanda kayıtları yedekle değiştirilsin mi?'))return;state=obj.data;state.checks||={};state.counts||={};state.goals||={};state.notes||={};state.custom||=[];save();renderMore();renderHome();$('dataMsg').textContent='Yedek yüklendi.'}catch(err){$('dataMsg').textContent='Hata: '+err.message}e.target.value=''};
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));


// V2: PDF'nin önceki sürümde eksik kalan takip sayfaları.
const prophets=['Âdem','İdris','Nuh','Hûd','Sâlih','İbrahim','Lût','İsmail','İshak','Yakub','Yusuf','Eyyûb','Şuayb','Musa','Harun','Zülkifl','Davud','Süleyman','Yunus','İlyas','Elyesa','Zekeriya','Yahya','İsa','Muhammed'];
const esmaNames='Allah,Er-Rahmân,Er-Rahîm,El-Melik,El-Kuddûs,Es-Selâm,El-Mümin,El-Müheymin,El-Azîz,El-Cebbâr,El-Mütekebbir,El-Hâlık,El-Bâri,El-Musavvir,El-Gaffâr,El-Kahhâr,El-Vehhâb,Er-Rezzâk,El-Fettâh,El-Alîm,El-Kâbıd,El-Bâsıt,El-Hâfıd,Er-Râfi,El-Muizz,El-Müzill,Es-Semî,El-Basîr,El-Hakem,El-Adl,El-Latîf,El-Habîr,El-Halîm,El-Azîm,El-Gafûr,Eş-Şekûr,El-Aliyy,El-Kebîr,El-Hafîz,El-Mukît,El-Hasîb,El-Celîl,El-Kerîm,Er-Rakîb,El-Mucîb,El-Vâsi,El-Hakîm,El-Vedûd,El-Mecîd,El-Bâis,Eş-Şehîd,El-Hakk,El-Vekîl,El-Kaviyy,El-Metîn,El-Veliyy,El-Hamîd,El-Muhsî,El-Mübdi,El-Muîd,El-Muhyî,El-Mümît,El-Hayy,El-Kayyûm,El-Vâcid,El-Mâcid,El-Vâhid,Es-Samed,El-Kâdir,El-Muktedir,El-Mukaddim,El-Muahhir,El-Evvel,El-Âhir,Ez-Zâhir,El-Bâtın,El-Vâlî,El-Müteâlî,El-Berr,Et-Tevvâb,El-Müntekım,El-Afüvv,Er-Raûf,Mâlikül-Mülk,Zülcelâli vel-İkrâm,El-Muksit,El-Câmi,El-Ganiyy,El-Muğnî,El-Mâni,Ed-Dârr,En-Nâfi,En-Nûr,El-Hâdî,El-Bedî,El-Bâkî,El-Vâris,Er-Reşîd,Es-Sabûr'.split(',');
const pdfPages=[
'99 Esmâü’l-Hüsnâ','Tövbe duası','Günlük zikirler','Yunus duası · 12.000','Peygamberler haritası','41 günlük manevi kamp','Namaz sonrası zikirler','Kur’an hatmi · 30 cüz','Kelime-i Tevhid · 70.000','İstiğfar · 70.000','Salavat · 70.000','Dua ve niyet','Mülk · 100','Vakıa · 100','Amme · 100','Yasin · 100','Fetih · 100','Fâtiha · 313','Âyetel Kürsî · 313','21 gün Kevser · 100/gün','İhlâs · 40.000','Tesirli zikirler','İnşirah · 40.000','Yasin hatmi · 41','Teheccüd · 30 gün','Kaza oruçları','Nafile namazlar · 30 gün','Kaza namazları · 46 gün'];
const pageDest=['more','more','dhikr','plans','more','more','plans','plans','plans','plans','plans','more','plans','plans','plans','plans','plans','plans','plans','plans','plans','more','plans','plans','more','worship','more','worship'];
function createPanel(parent,title,subtitle){let p=document.createElement('section');p.className='panel';let h=document.createElement('h3');h.textContent=title;p.append(h);if(subtitle){let s=document.createElement('p');s.className='hint';s.textContent=subtitle;p.append(s)}parent.append(p);return p}
function drawChecks(parent,items,prefix){let grid=document.createElement('div');grid.className='gridcells';items.forEach((name,i)=>{let id=prefix+':'+(i+1),b=document.createElement('button');b.className='cell'+(check(id)?' checked':'');b.textContent=name;b.title=name;b.setAttribute('aria-pressed',String(check(id)));b.onclick=()=>{setCheck(id,!check(id));b.classList.toggle('checked',check(id));b.setAttribute('aria-pressed',String(check(id)))};grid.append(b)});parent.append(grid)}
function renderPrayerProgram(){let root=$('prayerProgram');if(!root)return;root.replaceChildren();let suras=['Haşr Suresi (son ayetler)','Vakıa ve Fetih sureleri','Vakıa ve Nebe sureleri','Vakıa ve Haşr sureleri','Mülk ve Vakıa sureleri'];['Sabah','Öğle','İkindi','Akşam','Yatsı'].forEach((p,i)=>{let panel=createPanel(root,p+' namazı sonrası',suras[i]);drawChecks(panel,['Sübhânallah 33','Elhamdülillah 33','Allahu Ekber 33','Önerilen sure'],`namaz-zikir:${today}:${p}`)})}
function renderExtras(){let root=$('extrasContent');if(!root)return;root.replaceChildren();
let esma=createPanel(root,'99 Esmâü’l-Hüsnâ · PDF s.1','Öğrendiğin veya üzerinde tefekkür ettiğin isimleri işaretle.');esma.id='esmaPanel';renderEsmaDetails(esma);addLiveProgress(esma,'esma',esmaNames.length);
let dua=createPanel(root,'Tövbe duası ve niyet · PDF s.2, 12','Allah’ım! Sen affedicisin, affetmeyi seversin, beni de affet.');dua.id='duaPanel';let arab=document.createElement('p');arab.className='arabic';arab.textContent='اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي';dua.append(arab);let note=document.createElement('textarea');note.placeholder='Bugünkü duam veya niyetim…';note.value=state.notes['niyet:'+today]||'';let saveButton=document.createElement('button');saveButton.className='primary';saveButton.textContent='Niyetimi kaydet';saveButton.onclick=()=>{state.notes['niyet:'+today]=note.value;save();saveButton.textContent='Kaydedildi ✓'};dua.append(note,saveButton);
let prophet=createPanel(root,'Peygamberler haritası · PDF s.5','Okuduğun veya hakkında öğrendiğin peygamberleri işaretle.');prophet.id='prophetPanel';renderProphetCards(prophet);addProphetProgress(prophet);
let zik=createPanel(root,'Tesirli zikirler · PDF s.22','PDF’deki öneriler; belirli sonuçlar garanti edilmez.');[['Zihin açıklığı','Yâ Fettâh'],['Zihni açmak','Yâ Nûr'],['Stresi azaltmak','Yâ Rahmân'],['Kalbi ferahlatmak','Yâ Latîf'],['Mutlu olmak','Yâ Vedûd'],['Halsizlik','Yâ Kavî'],['Kırgınlık','Yâ Cebbâr'],['Hidayet','Yâ Hâdî'],['Sıkıntı','Yâ Fettâh'],['Rızık','Yâ Rezzâk']].forEach(([label,name])=>{let p=document.createElement('p');p.className='zikir-tip';p.textContent=label+' — '+name;zik.append(p)});
let extra=createPanel(root,'21 günlük Kevser programı · PDF s.20','Her gün 100 okuma hedefi. +1 sayacıyla takip et; 100 olunca gün tamamlanır.');extra.id='kevserPanel';for(let i=1;i<=21;i++){let id=`kevser:gun:${i}`,n=Number(state.counts[id]||0),row=document.createElement('div');row.className='tracker';let info=document.createElement('div');info.className='info';let title=document.createElement('strong');title.textContent=`${i}. gün`;let sub=document.createElement('small');sub.textContent=n>=100?'Tamamlandı ✓':`${100-n} okuma kaldı`;info.append(title,sub);let count=document.createElement('span');count.className='count';count.textContent=`${n} / 100`;let minus=document.createElement('button');minus.textContent='−';minus.onclick=()=>{state.counts[id]=Math.max(0,n-1);save();renderMore()};let plus=document.createElement('button');plus.textContent='+1';plus.disabled=n>=100;plus.onclick=()=>{state.counts[id]=Math.min(100,n+1);if(state.counts[id]===100)setCheck(`plan:kevser21:${i}`,true);save();renderMore()};row.append(info,count,minus,plus);extra.append(row)}

let kaza=createPanel(root,'46 günlük kaza namazı çizelgesi · PDF s.28','Gün satırına dokunarak namaz kutularını aç.');kaza.id='kaza46Panel';for(let i=1;i<=46;i++){let details=document.createElement('details');details.className='daydetails';let summary=document.createElement('summary');summary.textContent=i+'. gün';details.append(summary);drawChecks(details,['Sabah','Öğle','İkindi','Akşam','Yatsı','Vitir'],`kaza46:${i}`);kaza.append(details)}
addLiveProgress(kaza,'kaza46',46*6,true);
}

// V3: Görünür ilerleme göstergeleri ve 28 sayfalık ajanda kısayolları.
function addLiveProgress(panel,prefix,total,matrix=false){
 const status=document.createElement('p');status.className='hint live-progress';
 function update(){let done=0;if(matrix){for(let i=1;i<=46;i++)for(let j=1;j<=6;j++)if(check(`${prefix}:${i}:${j}`))done++}
 else for(let i=1;i<=total;i++)if(check(`${prefix}:${i}`))done++;
 status.textContent=`Tamamlanan: ${done} / ${total} · %${Math.round(done/total*100)}`;
 }
 panel.insertBefore(status,panel.querySelector('.gridcells')||panel.querySelector('details')||null);
 panel.addEventListener('click',e=>{if(e.target.closest('button.cell'))queueMicrotask(update)});update();
}
const priorShow=show;
// Plan kutularına hızlı geçiş için bağlantılar, eski ekran akışını bozmadan.
function addPlanShortcuts(){
 const root=$('plans');if(!root||$('planQuickLinks'))return;
 const wrap=document.createElement('div');wrap.className='panel';wrap.id='planQuickLinks';
 const h=document.createElement('h3');h.textContent='Çizelgeye hızlı git';wrap.append(h);
 const links=document.createElement('div');links.className='pageindex';
 plans.filter(x=>!['kamp41','teheccud30'].includes(x[0])).forEach(([id,title])=>{
  const b=document.createElement('button');b.textContent=title;b.onclick=()=>{
   const panels=[...$('planList').children];const i=plans.filter(x=>!['kamp41','teheccud30'].includes(x[0])).findIndex(x=>x[0]===id);
   panels[i]?.scrollIntoView({behavior:'smooth',block:'start'});
  };links.append(b)
 });wrap.append(links);root.insertBefore(wrap,$('planList'));
}
addPlanShortcuts();


// V3.2: Başlangıç rehberi, açıklamalı Esma ve çalışan nafile çizelgeleri.
const esmaMeanings=`Tek ve gerçek ilah
Sonsuz merhamet sahibi
Çok merhametli
Mülkün mutlak sahibi
Her eksiklikten uzak
Esenlik veren
Güven veren
Gözetip koruyan
Üstün ve güçlü
Dilediğini gerçekleştiren
Büyüklükte eşsiz
Yaratan
Kusursuzca var eden
Şekil veren
Çok bağışlayan
Her şeye üstün gelen
Karşılıksız veren
Rızık veren
Hükmeden ve kapıları açan
Her şeyi bilen
Daraltan
Genişleten
Alçaltan
Yükselten
İzzet veren
Alçaltan
Her şeyi işiten
Her şeyi gören
Hükmeden
Mutlak adalet sahibi
Lütfu ince olan
Her şeyden haberdar
Yumuşak davranan
Azamet sahibi
Çok bağışlayan
Az iyiliğe çok karşılık veren
Çok yüce
Çok büyük
Koruyup gözeten
Rızık ve güç veren
Hesaba çeken
Ululuk sahibi
Cömert
Her şeyi gözeten
Dualara karşılık veren
Rahmeti ve ilmi geniş
Hikmet sahibi
Çok seven
Şanı yüce
Dirilten, gönderen
Her şeye şahit
Hakkın kendisi
Kendisine güvenilen
Çok güçlü
Sapasağlam
Dost ve yardımcı
Övülmeye layık
Her şeyi sayıp bilen
İlk defa yaratan
Yeniden yaratan
Hayat veren
Ölümü yaratan
Daima diri
Her şeyi ayakta tutan
Dilediğini bulan
Şanı yüce
Bir ve tek
Hiçbir şeye muhtaç olmayan
Her şeye gücü yeten
Kudreti sınırsız
Öne alan
Geri bırakan
Başlangıcı olmayan
Sonu olmayan
Varlığı açık olan
Mahiyeti gizli olan
Yöneten
Pek yüce
İyiliği bol
Tövbeleri kabul eden
Adaletle karşılık veren
Affı çok olan
Çok şefkatli
Mülkün gerçek sahibi
Azamet ve ikram sahibi
Adaletle hükmeden
Bir araya getiren
Hiçbir şeye muhtaç olmayan
Zenginlik veren
Engelleyen
Zararı yaratmaya da gücü yeten
Faydayı yaratan
Nurun kaynağı
Hidayet veren
Eşsiz yaratan
Ebedî kalan
Her şeyin varisi
Doğruya yönelten
Çok sabırlı`.split('\n');
// Yaygın Arapça yazılışlar. Ebced değerleri yazılış farklarına göre değişebilir.
const esmaArabic=`الله,الرحمن,الرحيم,الملك,القدوس,السلام,المؤمن,المهيمن,العزيز,الجبار,المتكبر,الخالق,البارئ,المصور,الغفار,القهار,الوهاب,الرزاق,الفتاح,العليم,القابض,الباسط,الخافض,الرافع,المعز,المذل,السميع,البصير,الحكم,العدل,اللطيف,الخبير,الحليم,العظيم,الغفور,الشكور,العلي,الكبير,الحفيظ,المقيت,الحسيب,الجليل,الكريم,الرقيب,المجيب,الواسع,الحكيم,الودود,المجيد,الباعث,الشهيد,الحق,الوكيل,القوي,المتين,الولي,الحميد,المحصي,المبدئ,المعيد,المحيي,المميت,الحي,القيوم,الواجد,الماجد,الواحد,الصمد,القادر,المقتدر,المقدم,المؤخر,الأول,الآخر,الظاهر,الباطن,الوالي,المتعالي,البر,التواب,المنتقم,العفو,الرؤوف,مالك الملك,ذو الجلال والإكرام,المقسط,الجامع,الغني,المغني,المانع,الضار,النافع,النور,الهادي,البديع,الباقي,الوارث,الرشيد,الصبور`.split(',');
const abjadMap={ا:1,أ:1,إ:1,آ:1,ء:1,ؤ:6,ئ:10,ب:2,ج:3,د:4,ه:5,ة:5,و:6,ز:7,ح:8,ط:9,ي:10,ى:10,ك:20,ل:30,م:40,ن:50,س:60,ع:70,ف:80,ص:90,ق:100,ر:200,ش:300,ت:400,ث:500,خ:600,ذ:700,ض:800,ظ:900,غ:1000};
function ebcedValue(arabic){let word=arabic.replace(/(^|\s)ال(?=[\u0621-\u064a])/g,'$1');return [...word].reduce((n,c)=>n+(abjadMap[c]||0),0)}
function renderEsmaDetails(panel){
 const help=document.createElement('p');help.className='hint';help.textContent='İsme dokun: kısa anlam ve ebced değerini gör. Yanındaki kutu ile öğrendiklerini işaretle. Ebced hesapları yaygın yazılışa göredir; farklı geleneklerde değişebilir.';panel.append(help);
 const list=document.createElement('div');list.className='esma-list';
 esmaNames.forEach((name,i)=>{const key='esma:'+(i+1),row=document.createElement('div');row.className='esma-row';
 const cb=document.createElement('input');cb.type='checkbox';cb.checked=check(key);cb.setAttribute('aria-label',name+' tamamlandı');cb.onchange=()=>{setCheck(key,cb.checked);panel.dispatchEvent(new Event('esma-update'))};
 const b=document.createElement('button');b.className='esma-name';b.type='button';b.textContent=(i+1)+'. '+name;b.setAttribute('aria-expanded','false');
 const details=document.createElement('div');details.className='esma-detail hidden';let meaning=esmaMeanings[i]||'Kısa anlam hazırlanıyor';if(i===0)meaning='Tek ve gerçek ilah';
 details.innerHTML='<strong>Anlamı:</strong> '+safe(meaning)+'<br><strong>Ebced:</strong> '+ebcedValue(esmaArabic[i]||'')+' <span class="hint">(başındaki “el/er” takısı hariç)</span>';
 b.onclick=()=>{details.classList.toggle('hidden');b.setAttribute('aria-expanded',String(!details.classList.contains('hidden')))};
 row.append(cb,b,details);list.append(row)});panel.append(list);
 panel.addEventListener('esma-update',()=>{const status=panel.querySelector('.live-progress');if(status){let done=esmaNames.filter((_,i)=>check('esma:'+(i+1))).length;status.textContent=`Tamamlanan: ${done} / ${esmaNames.length} · %${Math.round(done/esmaNames.length*100)}`}});
}
function addNafileProgress(panel){let status=document.createElement('p');status.className='hint';panel.insertBefore(status,panel.firstChild.nextSibling);const names=['2 Rekât Teheccüd','2 Rekât Hacet','4 Rekât Kuşluk','2 Rekât Şükür','2 Rekât İstihare','2 Rekât Tevbe'];function update(){let n=0;for(let name of names)for(let i=1;i<=30;i++)if(check('nafile:'+name+':'+i))n++;status.textContent=`Tamamlanan: ${n} / 180 · %${Math.round(n/180*100)}`};panel.addEventListener('click',e=>{if(e.target.closest('button.cell'))queueMicrotask(update)});update()}
function renderHomeIndex(){let root=$('homePdfIndex');if(!root)return;root.replaceChildren();const panel=createPanel(root,'PDF’nin 28 sayfalık içerik rehberi','Ajandayı açınca bütün sayfalara buradan ulaşabilirsin.');const list=document.createElement('div');list.className='pageindex';pdfPages.forEach((title,i)=>{let b=document.createElement('button');b.type='button';b.textContent=(i+1)+'. '+title;b.onclick=()=>{show(pageDest[i]);const anchors={0:'esmaPanel',1:'duaPanel',4:'prophetPanel',19:'kevserPanel',26:'nafilePanel',27:'kaza46Panel'};let target=anchors[i];if(target)requestAnimationFrame(()=>document.getElementById(target)?.scrollIntoView({behavior:'smooth',block:'start'}))};list.append(b)});panel.append(list)}


// V3.3: Peygamberlerin hayatları için ayrı üç sayfalık okuyucu.
const prophetStories = {"Âdem": ["Allah’ın yarattığı ilk insan ve peygamber olarak anılır. Kur’an’da yaratılışı, kendisine isimlerin öğretilmesi ve meleklere verilen secde emri anlatılır.", "Âdem ve eşi cennette yaşarken yasaklanan ağaca yaklaşmaları üzerine yeryüzü hayatı başlar. Kur’an, onların hatalarını fark edip Allah’a yöneldiklerini bildirir.", "Âdem kıssası insanın bilgi, sorumluluk, özgür irade ve tövbe ile ilişkisini hatırlatır. Kaynaklar: Bakara 2:30–39; A’râf 7:19–27; Tâhâ 20:115–123."], "İdris": ["Kur’an’da İdris, doğruluğuyla tanınan bir peygamber olarak zikredilir. Hayatının ayrıntıları hakkında Kur’an’da sınırlı bilgi vardır.", "Meryem suresinde onun “sıddîk” ve peygamber olduğu, yüksek bir makama yükseltildiği bildirilir. Enbiyâ suresinde sabredenler arasında sayılır.", "İdris’in kıssasında doğruluk, sabır ve Allah’a bağlılık öne çıkar. Kesin olmayan tarihî rivayetleri hayat hikâyesi gibi sunmamak gerekir. Kaynaklar: Meryem 19:56–57; Enbiyâ 21:85–86."], "Nuh": ["Nuh, kavmini uzun süre tevhid inancına çağıran peygamberdir. Kur’an’da davetinin açık ve gizli biçimlerde sürdüğü anlatılır.", "Kavminin çoğu çağrısına karşı çıkar. Allah’ın emriyle gemi hazırlanır; tufan sırasında iman edenler korunur. Oğluyla ilgili anlatım, yakınlığın tek başına kurtuluş sağlamadığını vurgular.", "Nuh kıssası sebat, tebliğ, sabır ve kişisel sorumluluk dersleri içerir. Kaynaklar: Hûd 11:25–49; Nuh 71:1–28."], "Hûd": ["Hûd, Âd kavmine gönderilen peygamberdir. Kavmi güç ve refahıyla övünürken Hûd onları Allah’a kulluğa ve ölçülü yaşamaya çağırır.", "Âd kavminin ileri gelenleri bu çağrıya karşı çıkar. Kur’an, kibir ve inkârın ardından gelen yıkıcı rüzgârdan söz eder.", "Hûd kıssası maddî gücün ahlâkî sorumluluğun yerine geçemeyeceğini anlatır. Kaynaklar: A’râf 7:65–72; Hûd 11:50–60; Ahkâf 46:21–26."], "Sâlih": ["Sâlih, Semûd kavmine gönderilen peygamberdir. Kavmini Allah’a kulluğa ve yeryüzünde bozgunculuk yapmamaya davet eder.", "Kavmine bir işaret olarak dişi deve verildiği anlatılır. Uyarılara rağmen deveyi öldüren topluluk, yaptıklarının sonucuyla karşılaşır.", "Sâlih kıssası emanet, sınır tanıma ve uyarıları ciddiye alma konularını öne çıkarır. Kaynaklar: A’râf 7:73–79; Hûd 11:61–68; Şems 91:11–15."], "İbrahim": ["İbrahim, tevhid inancının güçlü temsilcilerindendir. Kur’an’da putperestliğe karşı aklî sorgulamaları ve babasıyla konuşmaları anlatılır.", "Kavmiyle mücadelesi, ateşe atılması, hicreti ve ailesiyle ilgili sınanmaları farklı surelerde yer alır. İsmail ile Kâbe’nin temellerini yükselttikleri bildirilir.", "İbrahim kıssası tevhid, teslimiyet, misafirperverlik ve dua üzerinde düşünmeye çağırır. Kaynaklar: Enbiyâ 21:51–70; Bakara 2:124–129; Sâffât 37:99–113."], "Lût": ["Lût, ahlâkî yozlaşmanın yaygınlaştığı bir topluluğa gönderilen peygamberdir. Kavmini kötülüklerden uzaklaşmaya çağırır.", "Kur’an’da kavminin uyarıları reddettiği, misafirleriyle ilgili bir imtihan yaşandığı ve sonunda Lût ile iman edenlerin kurtarıldığı anlatılır.", "Lût kıssası ahlâk, misafir güvenliği, toplumsal sorumluluk ve zulme karşı durma açısından okunabilir. Kaynaklar: Hûd 11:77–83; Ankebût 29:28–35."], "İsmail": ["İsmail, İbrahim’in oğludur. Kur’an’da sözünde duran, ailesine namaz ve zekâtı emreden bir peygamber olarak anılır.", "İbrahim ile birlikte Kâbe’nin temellerini yükselttikleri anlatılır. Kurbanla ilgili sınanma kıssasında teslimiyet ve sabır öne çıkar.", "İsmail’in hayatı aile içinde ibadet bilinci, verilen sözü tutma ve Allah’a güvenme temalarıyla hatırlanır. Kaynaklar: Bakara 2:125–129; Meryem 19:54–55; Sâffât 37:102–107."], "İshak": ["İshak, İbrahim’e müjdelenen oğludur. Kur’an’da onun peygamberliği ve soyundan gelen hayırlı nesiller anılır.", "İbrahim’e gelen misafirlerin İshak’ı müjdelemesi farklı surelerde anlatılır. İshak’ın ayrıntılı günlük hayatı hakkında Kur’an’da geniş bir anlatım bulunmaz.", "İshak kıssası ilahî rahmet, aile duası ve nesiller arası sorumluluk temalarını düşündürür. Kaynaklar: Hûd 11:69–73; Sâffât 37:112–113."], "Yakub": ["Yakub, İshak’ın oğlu ve Yusuf’un babasıdır. Kur’an’da ailesiyle yaşadığı sınanmalar ve derin sabrı anlatılır.", "Yusuf’tan ayrı kaldığında büyük üzüntü yaşar; buna rağmen Allah’ın rahmetinden umut kesmez. Sonunda ailesiyle kavuşması anlatılır.", "Yakub’un hayatı sabrın duygusuzluk olmadığını; acı içinde de umut ve duanın sürdürülebileceğini gösterir. Kaynak: Yusuf 12:6–100."], "Yusuf": ["Yusuf, çocukluğunda gördüğü rüyayı babası Yakub’a anlatır. Kardeşlerinin kıskançlığı nedeniyle kuyuda bırakılır ve Mısır’a götürülür.", "İftiraya uğrar, hapse girer; rüya yorumlama yeteneğiyle tanınır. Sonra ülkenin kıtlık hazırlıklarında önemli görev üstlenir.", "Yusuf, güce kavuştuğunda kardeşlerini bağışlar. Kıssa sabır, iffet, adalet ve affetmeyi öne çıkarır. Kaynak: Yusuf suresi 12:1–111."], "Eyyûb": ["Eyyûb, ağır sıkıntılar karşısında sabrıyla anılan peygamberdir. Kur’an, başına gelen zararın ayrıntılarını uzun uzun saymaz.", "Eyyûb, Rabbine sıkıntısını arz eder. Allah’ın onun duasını kabul ettiği ve kendisine rahmet verdiği bildirilir.", "Eyyûb kıssası zorlukta dua, sabır ve umut dersleri içerir. Kaynaklar: Enbiyâ 21:83–84; Sâd 38:41–44."], "Şuayb": ["Şuayb, Medyen halkına gönderilen peygamberdir. Kavmini Allah’a kulluğa, ölçü ve tartıda dürüstlüğe çağırır.", "Toplumunda ekonomik haksızlık ve insanların hakkını eksiltme eleştirilir. Bir kısmı onun uyarılarını reddeder.", "Şuayb kıssası ticarette adalet, güven ve toplumsal ahlâkın önemini hatırlatır. Kaynaklar: A’râf 7:85–93; Hûd 11:84–95."], "Musa": ["Musa, İsrailoğullarına gönderilen büyük peygamberlerdendir. Firavun’un baskısı altında doğduğu ve annesinin onu korumak için nehre bıraktığı anlatılır.", "Allah’ın görevlendirmesiyle Firavun’u hakka çağırır. Harun kendisine yardımcı olur. Denizden geçiş, vahiy ve kavminin yolculuğu Kur’an’da geniş yer tutar.", "Musa kıssası özgürlük, adalet, liderlik, sabır ve vahye bağlılık temalarını işler. Kaynaklar: Kasas 28:3–46; Tâhâ 20:9–98; A’râf 7:103–160."], "Harun": ["Harun, Musa’nın kardeşi ve peygamberdir. Musa, tebliğ görevinde kendisine yardımcı olması için Harun’u ister.", "Harun, İsrailoğullarına rehberlik eder. Buzağıya yönelme olayında kavmini uyarmaya çalıştığı anlatılır.", "Harun kıssası kardeşlik, dayanışma, iletişim ve topluluk içindeki sorumluluğu hatırlatır. Kaynaklar: Tâhâ 20:29–36, 90–94; A’râf 7:142–151."], "Zülkifl": ["Zülkifl, Kur’an’da sabırlı ve iyi kimseler arasında adı geçen bir şahsiyettir. Kur’an onun hayatının ayrıntılarını açıklamaz.", "Enbiyâ ve Sâd surelerinde İsmail ve İdris gibi isimlerle birlikte anılır. Peygamberliği ve tarihî kimliği hakkında yorum farklılıkları bulunur.", "Bu nedenle kesin olmayan olayları ona ait tarihî gerçekler gibi anlatmamak gerekir. Öne çıkan ders sabır ve dürüstlüktür. Kaynaklar: Enbiyâ 21:85–86; Sâd 38:48."], "Davud": ["Davud, hem peygamber hem yönetici olarak anılır. Kur’an’da kendisine Zebur verildiği ve hikmetle desteklendiği bildirilir.", "Adaletle hükmetmesi, Allah’ı tesbihi ve demiri işleme nimeti anlatılır. Bazı kıssalarda karar verirken hakkaniyetli olma sorumluluğu vurgulanır.", "Davud kıssası güç ve yetkinin adalet, ibadet ve tevazu ile birlikte yürütülmesini öğütler. Kaynaklar: Sâd 38:17–26; Sebe 34:10–11; İsrâ 17:55."], "Süleyman": ["Süleyman, Davud’un oğlu ve peygamber-yöneticidir. Kur’an’da kendisine verilen özel imkânlar ve hikmet anlatılır.", "Karınca vadisi, Hüdhüd kuşu ve Sebe melikesiyle ilgili anlatılar onun hükümranlığı içinde yer alır. Nimeti Allah’a bağlaması vurgulanır.", "Süleyman kıssası yönetimde hikmet, şükür ve güç karşısında tevazu dersleri taşır. Kaynaklar: Neml 27:15–44; Sebe 34:12–14."], "Yunus": ["Yunus, kavmine gönderilen peygamberdir. Kur’an’da görevinden ayrılması ve ardından yaşadığı ağır sınanma anlatılır.", "Balığın içinde Allah’a dua eder: “Senden başka ilah yoktur; seni tenzih ederim. Gerçekten ben yanlış yapanlardan oldum.” Duası kabul edilir.", "Yunus kıssası hatayı kabul etme, tövbe ve Allah’ın rahmetinden umut kesmeme dersleri içerir. Kaynaklar: Enbiyâ 21:87–88; Sâffât 37:139–148."], "İlyas": ["İlyas, kavmini Allah’a kulluğa çağıran peygamberdir. Kur’an’da Ba‘l adlı ilaha yönelişi eleştirdiği anlatılır.", "Toplumunun bir bölümü uyarılarını reddeder. Kur’an onun ihlasla tebliğ eden elçilerden olduğunu belirtir.", "İlyas kıssası tevhid inancını koruma ve toplum baskısına rağmen doğruyu savunma üzerine düşündürür. Kaynak: Sâffât 37:123–132."], "Elyesa": ["Elyesa, Kur’an’da adı geçen peygamberlerdendir. Hayatının ayrıntıları Kur’an’da çok sınırlıdır.", "En‘âm suresinde hidayete erdirilenler arasında, Sâd suresinde seçkin iyi kullar arasında anılır.", "Kesin tarihî bilgi bulunmayan ayrıntılar konusunda ihtiyatlı olmak gerekir. Kaynaklar: En‘âm 6:86; Sâd 38:48."], "Zekeriya": ["Zekeriya, ibadet ve dua ile anılan peygamberdir. Meryem’in bakımını üstlendiği ve onun yanında Allah’ın ikramını gördüğü anlatılır.", "İleri yaşında kendisine hayırlı bir evlat verilmesi için dua eder. Yahya’nın doğacağı müjdelenir.", "Zekeriya kıssası dua, aile sorumluluğu ve Allah’ın rahmetinden umut kesmeme dersleri taşır. Kaynaklar: Âl-i İmrân 3:37–41; Meryem 19:2–11."], "Yahya": ["Yahya, Zekeriya’ya müjdelenen oğludur. Kur’an’da ona çocuk yaşta hikmet verildiği, temiz ve takva sahibi olduğu anlatılır.", "Anne babasına iyiliği ve insanlara karşı merhametiyle anılır. Kur’an, onun hayatının bütün tarihî ayrıntılarını anlatmaz.", "Yahya kıssası genç yaşta sorumluluk, ahlâkî duruş ve anne babaya saygı konularını öne çıkarır. Kaynak: Meryem 19:7–15."], "İsa": ["İsa, Meryem’in oğludur. Kur’an’da babasız doğumu ve Allah’ın izniyle gerçekleştirdiği mucizeler anlatılır.", "İsrailoğullarını Allah’a kulluğa çağırır. Kendisine İncil verildiği ve havarilerinin desteği zikredilir. Kur’an, onun hakkında tevhid vurgusu yapar.", "İsa kıssası merhamet, mucize karşısında Allah’ın kudretini hatırlama ve vahye sadakat dersleri içerir. Kaynaklar: Âl-i İmrân 3:45–55; Meryem 19:16–36; Mâide 5:110–118."], "Muhammed": ["Hz. Muhammed, Mekke’de doğmuş ve İslam inancına göre son peygamberdir. İlk vahiy Hira’da gelmiş; insanları Allah’ın birliğine, adalete ve güzel ahlâka çağırmıştır.", "Mekke döneminde tebliğ ve baskılar, ardından Medine’ye hicret yaşanmıştır. Medine’de ibadet, toplum düzeni, anlaşmalar ve kardeşlik hayatın merkezine yerleşmiştir.", "Hayatının temel örnekleri merhamet, emanet, sabır, adalet ve bağışlamadır. Kur’an’da “âlemlere rahmet” olarak anılır. Kaynaklar: Ahzâb 33:21, 40; Enbiyâ 21:107; Kalem 68:4. Ayrıntılı siyer için ayrıca güvenilir eserler gerekir."]};
let selectedProphet=null,prophetPage=0;
function renderProphetCards(panel){
 const list=document.createElement('div');list.className='prophet-list';
 prophets.forEach((name,i)=>{
  const row=document.createElement('div');row.className='prophet-card';
  const cb=document.createElement('input');cb.type='checkbox';cb.checked=check('peygamber:'+(i+1));cb.setAttribute('aria-label',name+' okundu');
  cb.onchange=()=>{setCheck('peygamber:'+(i+1),cb.checked);panel.dispatchEvent(new Event('prophet-update'))};
  const b=document.createElement('button');b.type='button';b.className='prophet-open';b.textContent=(i+1)+'. '+name+' — Hayatını oku →';b.onclick=()=>openProphet(name);
  row.append(cb,b);list.append(row);
 });panel.append(list);
}
function addProphetProgress(panel){const p=document.createElement('p');p.className='hint live-progress';panel.insertBefore(p,panel.querySelector('.prophet-list'));
 function update(){const done=prophets.filter((_,i)=>check('peygamber:'+(i+1))).length;p.textContent=`Okunan: ${done} / 25 · %${Math.round(done/25*100)}`};
 panel.addEventListener('prophet-update',update);update();
}
function openProphet(name){selectedProphet=name;prophetPage=0;show('prophetReader');renderProphetPage()}
function renderProphetPage(){
 if(!selectedProphet)return;const pages=prophetStories[selectedProphet];if(!pages)return;
 $('prophetReaderTitle').textContent=selectedProphet+' Peygamber';
 $('prophetReaderSubtitle').textContent='Kısa hayatı · 3 sayfalık okuma';
 const subtitles=['Hayatı ve başlangıç','Tebliği ve yaşadıkları','Dersler ve Kur’an kaynakları'];
 const root=$('prophetReaderText');root.replaceChildren();
 const h=document.createElement('h2');h.textContent=subtitles[prophetPage];
 const p=document.createElement('p');p.textContent=pages[prophetPage];root.append(h,p);
 $('prophetPageLabel').textContent=(prophetPage+1)+' / 3';
 $('prophetPrev').disabled=prophetPage===0;$('prophetNext').disabled=prophetPage===2;
 window.scrollTo(0,0);
}
$('prophetPrev').onclick=()=>{if(prophetPage>0){prophetPage--;renderProphetPage()}};
$('prophetNext').onclick=()=>{if(prophetPage<2){prophetPage++;renderProphetPage()}};
$('backProphets').onclick=()=>{show('more');requestAnimationFrame(()=>document.getElementById('prophetPanel')?.scrollIntoView({block:'start'}))};

show('home');
