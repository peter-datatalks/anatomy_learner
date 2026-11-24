/* ANATOMIA 360° app. Content comes from content.json (built by tools/build.py). */
/* ============================== DATA ============================== */
const IC = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
  dict:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4z"/><path d="M20 5h-4a2 2 0 0 0-2 2"/><path d="M20 5v13h-6"/></svg>',
  mod:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.2"/><path d="M12 7.5v6M8 10l4 2 4-2M10 21l2-7 2 7"/></svg>',
  brain:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/></svg>',
  path:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h6"/></svg>',
  quiz:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8l1.5 1.5L12 7M8 14l1.5 1.5L12 13M14 8h3M14 14h3"/></svg>',
  plexus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h4l4 4h3M3 12h8l3-3M11 12l3 3h3M14 9l3-3h4M17 15l4 3M17 15h4"/></svg>',
  stats:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.8z"/></svg>',
  starOn:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.8z"/></svg>',
  speak:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'
};

const CAT = {
  alap:{label:'Alapfogalmak',cls:'',color:'var(--accent)'},
  csont:{label:'Csontok',cls:'bone',color:'var(--bone)'},
  izulet:{label:'Ízületek',cls:'joint',color:'var(--joint)'},
  izom:{label:'Izmok',cls:'muscle',color:'var(--muscle)'},
  ideg:{label:'Idegrendszer',cls:'nerve',color:'var(--nerve)'},
  elettan:{label:'Élettan',cls:'',color:'var(--ink-3)'}
};

// Trilingual terminology [hu, sv, la, cat, synonyms]
let TERMS;

// Muscle / joint / nerve datasheets for the shoulder module
let SHEETS;
let SHEET_ORDER;

// 12 cranial nerves
let CN;
const CN_TYPE={S:['Érző','nerve'],M:['Mozgató','muscle'],'M+P':['Mozgató + paraszimpatikus','joint'],Kevert:['Kevert','bone']};

// KI 1FY26 programme (official names & credits from KI; topics marked by source)
let KI;

// Question bank. topic: vall | agyideg | term | neuro
let Q;
let TOPICS;
const INTERVALS=[1,3,7,14,30];

/* ============================== STATE ============================== */
const store={
  get(k,d){try{const v=localStorage.getItem('a360:'+k);return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem('a360:'+k,JSON.stringify(v))}catch(e){}}
};
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d.getTime()};
const DAY=864e5;
let favs=new Set(store.get('favs',[]));
let srs=store.get('srs',{});
const saveSrs=()=>store.set('srs',srs);
const dueList=()=>Q.filter(q=>{const r=srs[q.id];return r&&r.due<=today()});
function grade(id,ok){
  const r=srs[id]||{box:0,due:0,ok:0,no:0};
  if(ok){r.ok++;r.box=Math.min(r.box+1,INTERVALS.length-1)}else{r.no++;r.box=0}
  r.due=today()+(ok?INTERVALS[r.box-1>=0?r.box-1:0]:1)*DAY;
  r.last=Date.now();srs[id]=r;saveSrs();
}

/* ============================== HELPERS ============================== */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fold=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const triRaw=(hu,sv,la)=>`<div class="tri"><div><span class="lbl">HU</span><span class="v">${hu}</span></div><div><span class="lbl">SV</span><span class="v">${sv}</span></div><div><span class="lbl">LA</span><span class="v la">${la}</span></div></div>`;
const tri=(hu,sv,la)=>triRaw(esc(hu),esc(sv),esc(la));
/* Swedish content (AI-translated, pending expert review) */




let SV={sheets:{},layers:{},lesions:{},pxRoots:[],pxBranches:[],cn:{},q:{},ki:[]};
let lang=store.get('lang','both');
const LBL_SV={'Elhelyezkedés':'Läge','Vérellátás':'Kärlförsörjning','Szinergisták':'Synergister','Antagonisták':'Antagonister','Érintett ízület':'Berörd led','Palpáció':'Palpation','Klinikai teszt':'Kliniskt test','Klinikai jelentőség':'Klinisk betydelse','Ízületi tok':'Ledkapsel','Szalagok':'Ligament','Stabilizáló struktúrák':'Stabiliserande strukturer','Mozgások':'Rörelser','Mozgató izmok':'Verkande muskler','Beidegzés':'Innervation','Funkcionális szerep':'Funktionell roll','Vizsgálati módszerek':'Undersökningsmetoder','Gyakori kompenzációk':'Vanliga kompensationer','Klinikai összefüggések':'Kliniska samband','Lefutás':'Förlopp','Vizsgálat':'Undersökning','Tipikus sérülési hely':'Typisk skadelokalisation','Kiesési tünetek':'Bortfallssymtom','Magok':'Kärnor','Agytörzsi eredés':'Utgång från hjärnstammen','Klinikai vizsgálat':'Klinisk undersökning','Sérülési tünetek':'Skadesymtom','Funkció':'Funktion','Kilépés a koponyából':'Utträde ur skallen','Beidegzett izmok, szervek':'Innerverade muskler och organ','Origo':'Ursprung · origo','Insertio':'Fäste · insertio','Innervatio':'Innervation','Actio':'Funktion · actio','Alkotó csontok':'Ingående ben','Ízülettípus':'Ledtyp','Eredés · gyökök':'Ursprung · rötter','Motoros':'Motorisk','Szenzoros':'Sensorisk','Gyök':'Rot','Dermatóma':'Dermatom','Myotóma (kulcsmozgás)':'Myotom (nyckelrörelse)','Reflex':'Reflex','Ered':'Utgår från','Ideg':'Nerv','Ellátott terület':'Försörjt område'};
// text pair -> HTML for the current language mode (values escaped)
function bi(hu,sv){
  if(lang==='hu'||!sv||sv===hu)return esc(hu);
  if(lang==='sv')return `<span lang="sv">${esc(sv)}</span>`;
  return `<span class="bi"><span class="bi-hu">${esc(hu)}</span><span class="bi-sv" lang="sv">${esc(sv)}</span></span>`;
}
// short UI label pair (inline)
const u=(hu,sv)=>lang==='sv'&&sv?sv:hu;
let CAT_SV;
let TOPICS_SV;
const CNT_SV={S:'Sensorisk',M:'Motorisk','M+P':'Motorisk + parasympatisk',Kevert:'Blandad'};
const GRP_SV={'Tanulás':'Lärande','Modulok':'Moduler','Gyakorlás':'Övning'};
let LINK_SV;
const topicName=k=>u(TOPICS[k],TOPICS_SV[k]);
const cnType=k=>u(CN_TYPE[k][0],CNT_SV[k]);
function lb(hu,sv){sv=sv||LBL_SV[hu];if(lang==='hu'||!sv)return esc(hu);if(lang==='sv')return esc(sv);return `${esc(hu)} <span class="h2-sv">· ${esc(sv)}</span>`}
function H1(hu,sv){if(lang==='hu')return `<h1>${esc(hu)}</h1>`;if(lang==='sv')return `<h1 lang="sv">${esc(sv)}</h1>`;return `<h1>${esc(hu)}</h1><p class="h1-sv" lang="sv">${esc(sv)}</p>`}
function biHtml(hu,sv){
  if(lang==='hu'||!sv)return hu;
  if(lang==='sv')return `<div lang="sv" style="display:flex;flex-direction:column;gap:12px">${sv}</div>`;
  return `<div class="bi-cols"><div><span class="lang-tag">MAGYAR</span>${hu}</div><div lang="sv"><span class="lang-tag sv">SVENSKA</span>${sv}</div></div>`;
}
const layerHtml=(mod,k)=>{const l=(MOD_LESSONS[mod]||{})[k]||{hu:'',sv:''};return biHtml(l.hu,l.sv)};
function langSwitch(){return [['hu','HU'],['both','HU + SV'],['sv','SV']].map(([k,l])=>`<button data-lang-set="${k}" aria-pressed="${lang===k}">${l}</button>`).join('')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-lang-set]');if(!b)return;lang=b.dataset.langSet;store.set('lang',lang);
  render()});
const K=(lbl,v,c)=>`<div class="fact" style="--c:var(--${c})"><span class="eyebrow">${lbl}</span><p>${esc(v)}</p></div>`;
function arcPath(cx,cy,r,a0,a1){const pt=a=>{const t=(a-90)*Math.PI/180;return [cx+r*Math.cos(t),cy+r*Math.sin(t)]};
  const [x0,y0]=pt(a0),[x1,y1]=pt(a1);return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1-a0>180?1:0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`}
const PILLAR_COLORS=['muscle','nerve','accent','joint','bone'];
function pillarProgress(){
  const frac=(qs,min)=>qs.length?qs.filter(q=>srs[q.id]&&srs[q.id].box>=min).length/qs.length:0;
  return [
    [u('Anatómia és fiziológia','Anatomi och fysiologi'),frac(Q.filter(q=>q.topic==='term'||(MODS[q.topic]&&MODS[q.topic].region!=='nervous')),2)],
    [u('Neuroanatómia','Neuroanatomi'),frac(Q.filter(q=>['agyideg','plexus','neuro'].includes(q.topic)),1)],
    [u('KI-útvonal (tartalommal)','KI-studieväg (med innehåll)'),KI.filter(c=>c.links).length/KI.length],
    [u('Konduktori, rehab.','Konduktiv pedagogik, rehab.'),0],
    [u('Interaktív (látott kérdés)','Interaktivt (sedda frågor)'),frac(Q,0)]
  ];
}
function heroDial(due){
  const P=pillarProgress();let g='';
  P.forEach(([l,f],i)=>{const a0=i*72+5,a1=a0+62,c=PILLAR_COLORS[i];
    g+=`<path d="${arcPath(100,100,78,a0,a1)}" fill="none" stroke="var(--surface-2)" stroke-width="16"/>`;
    if(f>0)g+=`<path d="${arcPath(100,100,78,a0,a0+Math.max(2,62*f))}" fill="none" stroke="var(--${c})" stroke-width="16"/>`;});
  return `<div class="dialcard"><svg viewBox="0 0 200 200" role="img" aria-label="${u('Haladás az öt pillérben','Framsteg i de fem pelarna')}; ${due} ${u('esedékes kérdés','frågor att repetera')}">${g}
    <text x="100" y="104" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800" font-size="46" fill="var(--ink)">${due}</text>
    <text x="100" y="126" text-anchor="middle" font-size="12" fill="var(--ink-3)">${u('esedékes ma','att repetera idag')}</text></svg>
    <div class="dial-legend">${P.map(([l,f],i)=>`<div><i style="background:var(--${PILLAR_COLORS[i]})"></i><span>${l}</span><b class="tnum">${Math.round(f*100)}%</b></div>`).join('')}</div></div>`;
}
(function(){const m=document.getElementById('mark');if(!m)return;let g='';
  PILLAR_COLORS.forEach((c,i)=>{g+=`<path d="${arcPath(19,19,14,i*72+8,i*72+64)}" fill="none" stroke="var(--${c})" stroke-width="5" stroke-linecap="round"/>`});
  m.innerHTML=`<svg viewBox="0 0 38 38" width="38" height="38">${g}</svg>`})();

// Capabilities (optional; page works without them)
let sampleFn=null, ttsApi=null;
if(window.claude&&window.claude.use){
  window.claude.use('sample').then(s=>{sampleFn=s;document.querySelectorAll('[data-needs-ai]').forEach(el=>el.hidden=!s);document.querySelectorAll('[data-no-ai]').forEach(el=>el.hidden=!!s)}).catch(()=>{});
  window.claude.use('tts').then(t=>{ttsApi=t}).catch(()=>{});
}
function speak(text,lang){
  if(ttsApi){ttsApi.speak(text,{language:lang}).catch(()=>fallbackSpeak(text,lang));return}
  fallbackSpeak(text,lang);
}
function fallbackSpeak(text,lang){
  try{const u=new SpeechSynthesisUtterance(text);u.lang=lang==='sv'?'sv-SE':'hu-HU';speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}
}

/* ============================== NAV ============================== */
// [route, label hu, icon, group heading {hu,sv} or null, label sv]
function navRoutes(){
  const r=[
    ['attekintes','Áttekintés',IC.home,{hu:'Tanulás',sv:'Lärande'},'Översikt'],
    ['szotar','Szótár',IC.dict,null,'Ordlista'],
    ['ki-utvonal','KI-útvonal',IC.path,null,'KI-studieväg']];
  Object.entries(REGIONS).forEach(([rid,reg])=>{
    const mods=Object.values(MODS).filter(m=>m.region===rid).sort((a,b)=>a.order-b.order);
    const items=mods.map(m=>[moduleRoute(m.id),(m.navLabel||m.title).hu,rid==='nervous'?IC.plexus:IC.mod,null,(m.navLabel||m.title).sv]);
    if(rid==='nervous')items.push(['agyidegek','Agyidegek',IC.brain,null,'Kranialnerver']);
    if(items.length){items[0][3]=reg;r.push(...items)}
  });
  r.push(['kviz','Kvíz',IC.quiz,{hu:'Gyakorlás',sv:'Övning'},'Quiz'],['statisztika','Statisztika',IC.stats,null,'Statistik']);
  return r;
}
const TABBAR=[['attekintes','Áttekintés',IC.home,'Översikt'],['szotar','Szótár',IC.dict,'Ordlista'],['modulok','Modulok',IC.mod,'Moduler'],['kviz','Kvíz',IC.quiz,'Quiz'],['ki-utvonal','KI',IC.path,'KI']];
function renderNav(cur){
  const due=dueList().length;
  $('#langRail').innerHTML=langSwitch();
  $('#railFoot').textContent=u('Prototípus · oktatási célú tartalom, nem helyettesíti a klinikai döntést. A HU/SV fordítások szakmai ellenőrzésre várnak.','Prototyp · innehåll för utbildning, ersätter inte klinisk bedömning. HU/SV-översättningarna väntar på fackgranskning.');
  $('#nav').innerHTML=navRoutes().map(([id,label,ic,grp,sv])=>(grp?`<div class="grp">${esc(u(grp.hu,grp.sv))}</div>`:'')+
    `<a href="#${id}" ${cur===id?'aria-current="page"':''}>${ic}<span class="lbl">${lang==='sv'?sv:label}${lang==='both'&&sv!==label?`<span class="sv">${sv}</span>`:''}</span>${id==='kviz'&&due?`<span class="due-pill tnum">${due}</span>`:''}</a>`).join('');
  const inModules=cur==='modulok'||cur==='agyidegek'||cur.startsWith('modul-')||Object.keys(CUSTOM_MODULE_VIEWS).includes(cur);
  $('#tabbar').innerHTML=TABBAR.map(([id,label,ic,sv])=>
    `<a href="#${id}" ${cur===id||(id==='modulok'&&inModules)?'aria-current="page"':''}>${ic}<span>${lang==='sv'?sv:label}</span>${id==='kviz'&&due?`<span class="due-pill tnum">${due}</span>`:''}</a>`).join('');
}

/* ============================== VIEWS ============================== */
function viewHome(){
  const due=dueList().length;
  const answered=Object.values(srs).filter(r=>r&&r.ok!=null);
  const ok=answered.reduce((a,r)=>a+r.ok,0),no=answered.reduce((a,r)=>a+r.no,0);
  const acc=ok+no?Math.round(ok/(ok+no)*100):0;
  const mastered=Q.filter(q=>srs[q.id]&&srs[q.id].box>=2).length;
  return `
  <section class="hero">
    <div class="lead plate" data-wm="corpus humanum">
      <span class="eyebrow">${u('Gyógytorna · konduktor · rehabilitáció','Fysioterapi · konduktiv pedagogik · rehabilitering')}</span>
      ${H1('Az emberi test magyarul, svédül és latinul','Människokroppen på ungerska, svenska och latin')}
      <div class="muted">${bi('Anatómia, élettan és mozgástudomány a Karolinska Institutet fizioterapeuta-programjához igazítva. Minden fogalom három nyelven, minden feladat után magyarázattal.','Anatomi, fysiologi och rörelsevetenskap anpassade till fysioterapeutprogrammet vid Karolinska Institutet. Varje begrepp på tre språk, varje uppgift med förklaring.')}</div>
      <div class="row"><a class="btn primary" href="#plexus">${u('Új modul: Plexus brachialis','Ny modul: Plexus brachialis')}</a><a class="btn" href="#kviz">${u('Ismétlés','Repetition')} (${due})</a></div>
    </div>
    <div class="card stack dialcard-wrap">
      <span class="eyebrow">${u('Haladás és mai ismétlés','Framsteg och dagens repetition')}</span>
      ${heroDial(due)}
      <p class="small muted">${u('Ismétlési ütemezés: helyes válasz után 1, 3, 7, 14, majd 30 nap múlva jön vissza a kérdés; hibás válasz után másnap.','Repetitionsschema: efter rätt svar kommer frågan tillbaka efter 1, 3, 7, 14 och sedan 30 dagar; efter fel svar nästa dag.')}${srs._example?u(' A számok példaadatok, az első válaszod után a sajátjaid látszanak.',' Siffrorna är exempeldata; efter ditt första svar visas dina egna.'):''}</p>
    </div>
  </section>
  <section class="stack">
    <h2>${lb('Az öt pillér','De fem pelarna')}</h2>
    <div class="pillars">
      <a class="pillar" href="#modulok"><span class="n">1</span><h3>${u('Anatómia és fiziológia','Anatomi och fysiologi')}</h3><p class="small muted">${(()=>{const ms=Object.values(MODS).filter(m=>m.region!=='nervous');const n=ms.reduce((a,m)=>a+m.structures.length,0);return u(`Elérhető: ${ms.length} modul, ${n} adatlap`,`Tillgängligt: ${ms.length} moduler, ${n} faktablad`)})()}</p><div class="bar"><i style="width:${Math.round(mastered/Q.length*100)}%"></i></div></a>
      <a class="pillar" href="#agyidegek"><span class="n">2</span><h3>${u('Neuroanatómia és mozgástudomány','Neuroanatomi och rörelsevetenskap')}</h3><p class="small muted">${u('Elérhető: plexus brachialis, a 12 agyideg','Tillgängligt: plexus brachialis, de 12 kranialnerverna')}</p><div class="bar"><i style="width:${Math.round(Q.filter(q=>(q.topic==='agyideg'||q.topic==='plexus')&&srs[q.id]&&srs[q.id].box>=1).length/Q.filter(q=>q.topic==='agyideg'||q.topic==='plexus').length*100)}%"></i></div></a>
      <a class="pillar" href="#ki-utvonal"><span class="n">3</span><h3>KI Fysioterapeutprogrammet</h3><p class="small muted">${u('6 félév, 22 kurzus, 180 hp','6 terminer, 22 kurser, 180 hp')}</p></a>
      <div class="pillar soon"><span class="n">4</span><h3>${u('Konduktori és rehabilitációs tudás','Konduktiv pedagogik och rehabilitering')}</h3><p class="small muted">${u('Tervezett: CP, stroke, Parkinson-kór, MS','Planerat: CP, stroke, Parkinsons sjukdom, MS')}</p></div>
      <a class="pillar" href="#kviz"><span class="n">5</span><h3>${u('Interaktív tanulás','Interaktivt lärande')}</h3><p class="small muted">${Q.length} ${u('kérdés','frågor')}, ${TERMS.length} ${u('szótári fogalom','begrepp i ordlistan')}, ${u('AI-tanár','AI-lärare')}</p></a>
    </div>
  </section>
  <section class="grid g2">
    <div class="card stack"><span class="eyebrow">${u('Pontosság','Träffsäkerhet')}</span><b style="font-family:var(--f-display);font-size:1.8rem" class="tnum">${acc}%</b><p class="small muted">${ok+no} ${u('megválaszolt kérdés alapján','besvarade frågor')}</p><a class="small" href="#statisztika" style="color:var(--accent);font-weight:600">${u('Részletes statisztika','Detaljerad statistik')}</a></div>
    <div class="card stack"><span class="eyebrow">${u('Kedvenc és nehéz fogalmak','Favoriter och svåra begrepp')}</span><b style="font-family:var(--f-display);font-size:1.8rem" class="tnum">${favs.size}</b><p class="small muted">${u('Jelölj meg fogalmakat a szótárban a csillaggal.','Markera begrepp i ordlistan med stjärnan.')}</p><a class="small" href="#szotar" style="color:var(--accent);font-weight:600">${u('Szótár megnyitása','Öppna ordlistan')}</a></div>
  </section>`;
}

let dictState={q:'',cat:'all',fav:false};
function viewDict(){
  return `
  <div class="mod-head plate" data-wm="terminologia"><span class="eyebrow">${u('8. fejezet · Háromnyelvű terminológia','Kapitel 8 · Trespråkig terminologi')}</span>${H1('Szótár','Ordlista')}
  <p class="muted">${u('Keress bármelyik nyelven; a találat mindhárom alakot mutatja.','Sök på valfritt språk; träffen visar alla tre formerna.')} ${TERMS.length} ${u('fogalom','begrepp')}.</p></div>
  <label class="search" for="dq">${IC.search}<input id="dq" type="search" placeholder="${u('pl. axelled, deltaizom, cerebellum','t.ex. axelled, deltaizom, cerebellum')}" value="${esc(dictState.q)}" autocomplete="off"></label>
  <div class="row">
    <div class="seg" id="dcat">${[['all',u('Mind','Alla')],...Object.entries(CAT).map(([k,v])=>[k,u(v.label,CAT_SV[k])])].map(([k,l])=>`<button data-c="${k}" aria-pressed="${dictState.cat===k}">${l}</button>`).join('')}</div>
    <button class="btn ${dictState.fav?'primary':''}" id="dfav" aria-pressed="${dictState.fav}">${IC.starOn.replace('<svg','<svg width="16" height="16"')} ${u('Kedvencek','Favoriter')}</button>
  </div>
  <div class="terms" id="dlist"></div>
  <p class="note">${u('A latin alakok a Terminologia Anatomica szerintiek. A svéd és magyar megfelelőket szakmai lektorálás előtt ellenőrizni kell (15. fejezet).','De latinska formerna följer Terminologia Anatomica. De svenska och ungerska motsvarigheterna ska kontrolleras vid fackgranskning (kapitel 15).')}</p>`;
}
function hl(text,q){
  if(!q)return esc(text);
  const f=fold(text),fq=fold(q),i=f.indexOf(fq);
  if(i<0)return esc(text);
  return esc(text.slice(0,i))+'<mark>'+esc(text.slice(i,i+q.length))+'</mark>'+esc(text.slice(i+q.length));
}
function renderDictList(){
  const q=dictState.q.trim(),fq=fold(q);
  const rows=TERMS.filter(t=>(dictState.cat==='all'||t[3]===dictState.cat)&&(!dictState.fav||favs.has(t.id))&&(!fq||[t[0],t[1],t[2],t[4]].some(x=>fold(x).includes(fq))));
  $('#dlist').innerHTML=rows.length?rows.map(t=>`
    <div class="term"><span class="stripe" style="background:${CAT[t[3]].color}"></span>
      <div style="min-width:0">${triRaw(hl(t[0],q),hl(t[1],q),hl(t[2],q))}
        ${t[4]&&lang!=='sv'?`<div class="syn">${u('Szinonima, rövidítés:','Synonym, förkortning:')} ${hl(t[4],q)}</div>`:''}</div>
      <div class="acts">
        <button class="icon-btn" data-say="${esc(t[0])}" data-lang="hu" title="${u('Magyar kiejtés','Ungerskt uttal')}" aria-label="${esc(t[0])} ${u('kiejtése magyarul','uttal på ungerska')}">${IC.speak}<span class="small" style="font-weight:700">HU</span></button>
        <button class="icon-btn" data-say="${esc(t[1])}" data-lang="sv" title="${u('Svéd kiejtés','Svenskt uttal')}" aria-label="${esc(t[1])} ${u('kiejtése svédül','uttal på svenska')}">${IC.speak}<span class="small" style="font-weight:700">SV</span></button>
        <button class="icon-btn ${favs.has(t.id)?'on':''}" data-fav="${t.id}" aria-pressed="${favs.has(t.id)}" aria-label="${u('Kedvencekhez','Lägg till i favoriter')}">${favs.has(t.id)?IC.starOn:IC.star}</button>
      </div></div>`).join(''):`<div class="term"><span></span><p class="muted">${u('Nincs találat erre:','Inga träffar för:')} „${esc(q)}”. ${u('Próbáld a latin vagy a svéd alakot.','Prova den latinska eller ungerska formen.')}</p><span></span></div>`;
}
function bindDict(){
  renderDictList();
  $('#dq').addEventListener('input',e=>{dictState.q=e.target.value;renderDictList()});
  $('#dcat').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;dictState.cat=b.dataset.c;
    document.querySelectorAll('#dcat button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderDictList()});
  $('#dfav').addEventListener('click',e=>{dictState.fav=!dictState.fav;e.currentTarget.classList.toggle('primary',dictState.fav);e.currentTarget.setAttribute('aria-pressed',dictState.fav);renderDictList()});
  $('#dlist').addEventListener('click',e=>{
    const s=e.target.closest('[data-say]');if(s){speak(s.dataset.say,s.dataset.lang);return}
    const f=e.target.closest('[data-fav]');if(f){const id=f.dataset.fav;favs.has(id)?favs.delete(id):favs.add(id);store.set('favs',[...favs]);renderDictList()}
  });
}

/* --- Shoulder module --- */
let modState={layer:'alap',sheet:'m.deltoideus'};
let LAYERS;
function viewShoulder(){
  return `
  <div class="mod-head plate muscle" data-wm="cingulum pectorale"><span class="eyebrow">1FY053 Anatomi · 1FY055 Rörelsevetenskap · ${u('Pillér','Pelare')} 1</span>
    ${H1('Vállöv és vállízület','Skuldergördel och axelled')}${tri('vállöv','skuldergördel','cingulum pectorale')}</div>
  <section class="card stack">
    <div class="row" style="justify-content:space-between"><h2>${lb('Tananyag','Kursinnehåll')}</h2>
      <div class="seg" id="layers">${[['alap',u('Kezdő','Grund')],['egyetem',u('Egyetemi','Universitet')],['klinika',u('Klinikai','Klinik')]].map(([k,l])=>`<button data-l="${k}" aria-pressed="${modState.layer===k}">${l}</button>`).join('')}</div></div>
    <div class="layer-body" id="layerBody">${layerHtml('vall',modState.layer)}</div>
  </section>
  <section class="stack">
    <h2>${lb('Adatlapok','Faktablad')}</h2>
    <div class="sheets" id="sheetBtns">${SHEET_ORDER.map(k=>{const s=SHEETS[k];return `<button class="sheet-btn" data-s="${k}" aria-pressed="${modState.sheet===k}"><span class="chip ${CAT[s.kind].cls}"><span class="dot" style="background:${CAT[s.kind].color}"></span>${s.kind==='izom'?u('Izom','Muskel'):s.kind==='ideg'?u('Ideg','Nerv'):u('Ízület','Led')}</span><span class="la">${esc(s.la)}</span><span class="small muted">${esc(s.hu)} · ${esc(s.sv)}</span></button>`}).join('')}</div>
    <div class="card" id="sheet"></div>
  </section>`;
}
function romSvg(label,deg){
  // half-dial: 0° at the left horizontal, 180° at the right; arc drawn to scale
  const r=56,cx=70,cy=70,a=Math.PI*(1-deg/180);
  const x=cx+r*Math.cos(a),y=cy-r*Math.sin(a);
  const large=0;
  return `<figure><svg viewBox="0 0 140 92" role="img" aria-label="${esc(label)}: 0–${deg}°">
    <path d="M14 70 A56 56 0 0 1 126 70" fill="none" stroke="var(--surface-2)" stroke-width="10" stroke-linecap="round"/>
    <path d="M14 70 A56 56 0 ${large} 1 ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="var(--joint)" stroke-width="10" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--ink-2)" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="var(--ink)"/>
    <text x="${cx}" y="86" text-anchor="middle" font-size="16" font-weight="700" fill="var(--ink)" font-family="Archivo, sans-serif">${deg}°</text>
    <text x="8" y="86" font-size="9" fill="var(--ink-3)">0°</text><text x="114" y="86" font-size="9" fill="var(--ink-3)">180°</text>
  </svg><figcaption>${esc(label)}</figcaption></figure>`;
}
function renderSheet(){renderSheetInto($('#sheet'),modState.sheet)}
function renderSheetInto(el,key){
  const s=SHEETS[key];
  const sv=SV.sheets[key]||{};
  const F=(dt,k)=>s[k]?`<dt>${lb(dt)}</dt><dd>${bi(s[k],sv[k])}</dd>`:'';
  const KF=(l,k,c)=>`<div class="fact" style="--c:var(--${c})"><span class="eyebrow">${lb(l)}</span><p>${bi(s[k],sv[k])}</p></div>`;
  let body='';
  if(s.kind==='izom') body=`<div class="facts" style="--n:2">${KF('Origo','origo','bone')}${KF('Insertio','insertio','bone')}${KF('Innervatio','innervatio','nerve')}${KF('Actio','actio','muscle')}</div><dl class="fields">${F('Elhelyezkedés','loc')}${F('Vérellátás','ver')}${F('Szinergisták','syn')}${F('Antagonisták','ant')}${F('Érintett ízület','izulet')}${F('Palpáció','palp')}${F('Klinikai teszt','teszt')}${F('Klinikai jelentőség','klin')}</dl>`;
  if(s.kind==='izulet') body=`<div class="facts" style="--n:2">${KF('Alkotó csontok','csontok','bone')}${KF('Ízülettípus','tipus','joint')}</div><dl class="fields">${F('Ízületi tok','tok')}${F('Szalagok','szalag')}${F('Stabilizáló struktúrák','stab')}${F('Mozgások','mozgas')}</dl>
    <div class="stack"><h3>${lb('Mozgásterjedelem (aktív ROM, tájékoztató normálértékek)','Rörelseomfång (aktivt ROM, ungefärliga normalvärden)')}</h3><div class="rom">${s.rom.map(([l,d],i)=>romSvg(lang==='sv'&&sv.rom?sv.rom[i]:(lang==='both'&&sv.rom?l+' · '+sv.rom[i]:l),d)).join('')}</div><p class="small muted">${u('A normálértékek forrásonként eltérnek (pl. AAOS); goniometriás mérésnél mindig az ép oldallal hasonlíts.','Normalvärdena skiljer sig mellan källor (t.ex. AAOS); jämför alltid med den friska sidan vid goniometri.')}</p></div>
    <dl class="fields">${F('Mozgató izmok','izmok')}${F('Beidegzés','beidegzes')}${F('Funkcionális szerep','funkcio')}${F('Vizsgálati módszerek','vizsg')}${F('Gyakori kompenzációk','komp')}${F('Klinikai összefüggések','klin')}</dl>`;
  if(s.kind==='ideg') body=`<div class="facts">${KF('Eredés · gyökök','eredes','nerve')}${KF('Motoros','motor','muscle')}${KF('Szenzoros','szenz','joint')}</div><dl class="fields">${F('Lefutás','lefutas')}${F('Vizsgálat','vizsg')}${F('Tipikus sérülési hely','serules')}${F('Kiesési tünetek','tunetek')}</dl>`;
  const qs=Q.filter(q=>q.link&&q.link[1]===key);
  el.innerHTML=`<div class="sheet">${reviewBadge(key)}${tri(s.hu,s.sv,s.la)}${v3dHtml(key)}${body}
    ${qs.length?`<div class="row"><span class="small muted">${u('Kapcsolódó kérdések','Relaterade frågor')}: ${qs.length}</span><button class="btn" id="sheetQuiz">${u('Gyakorold ezt az adatlapot','Öva på detta faktablad')}</button></div>`:''}
    ${tutorHtml(s.la)}</div>`;
  if(qs.length)$('#sheetQuiz').onclick=()=>{quizState=newQuiz(qs.map(q=>q.id),'gyak');location.hash='kviz'};
  bindTutor(()=>`Adatlap: ${s.la} (${s.hu} / ${s.sv}). Tartalom: ${JSON.stringify(s)}`);
  mount3d(el,key);
}
function bindShoulder(){
  renderSheet();
  $('#layers').onclick=e=>{const b=e.target.closest('button');if(!b)return;modState.layer=b.dataset.l;
    document.querySelectorAll('#layers button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#layerBody').innerHTML=layerHtml('vall',modState.layer)};
  $('#sheetBtns').onclick=e=>{const b=e.target.closest('button');if(!b)return;modState.sheet=b.dataset.s;
    document.querySelectorAll('#sheetBtns button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderSheet()};
}

/* --- Generic module page (any module without a custom view) --- */
const CUSTOM_MODULE_VIEWS={vall:'vall',plexus:'plexus'};
const moduleRoute=id=>CUSTOM_MODULE_VIEWS[id]||'modul-'+id;
const genState={};
function modStateFor(id){return genState[id]||(genState[id]={layer:'alap',sheet:MODS[id].structures[0]})}
const REGION_TINT={'upper-limb':'muscle','lower-limb':'bone','trunk':'joint','head-neck':'joint',nervous:'nerve'};
function sheetBtn(k,pressed){const s=SHEETS[k];return `<button class="sheet-btn" data-s="${k}" aria-pressed="${pressed}"><span class="chip ${CAT[s.kind].cls}"><span class="dot" style="background:${CAT[s.kind].color}"></span>${s.kind==='izom'?u('Izom','Muskel'):s.kind==='ideg'?u('Ideg','Nerv'):u('Ízület','Led')}</span><span class="la">${esc(s.la)}</span><span class="small muted">${esc(s.hu)} · ${esc(s.sv)}</span></button>`}
function viewModule(id){
  const m=MODS[id],st=modStateFor(id),reg=REGIONS[m.region]||{hu:'',sv:''};
  const qn=Q.filter(q=>q.topic===id).length;
  const groups=m.structureGroups&&m.structureGroups.length?m.structureGroups:[{title:{hu:'Adatlapok',sv:'Faktablad'},structures:m.structures}];
  return `
  <div class="mod-head plate ${REGION_TINT[m.region]||''}" data-wm="${esc(m.latin)}"><span class="eyebrow">${esc(m.kiCourses.join(' · '))} · ${esc(u(reg.hu,reg.sv))}</span>
    ${H1(m.title.hu,m.title.sv)}${tri(m.termName.hu,m.termName.sv,m.termName.la)}</div>
  <section class="card stack">
    <div class="row" style="justify-content:space-between"><h2>${lb('Tananyag','Kursinnehåll')}</h2>
      <div class="seg" id="genLayers">${[['alap',u('Kezdő','Grund')],['egyetem',u('Egyetemi','Universitet')],['klinika',u('Klinikai','Klinik')]].map(([k,l])=>`<button data-l="${k}" aria-pressed="${st.layer===k}">${l}</button>`).join('')}</div></div>
    <div class="layer-body" id="genLayerBody">${layerHtml(id,st.layer)}</div>
  </section>
  <section class="stack">
    <div class="row" style="justify-content:space-between"><h2>${lb('Adatlapok','Faktablad')}</h2>${qn?`<button class="btn" id="modQuiz">${u('A modul gyakorlása','Öva på modulen')} (${qn})</button>`:''}</div>
    <div class="stack" id="genBtns">${groups.map(g=>`<div class="stack" style="gap:8px"><h3 class="eyebrow">${lb(g.title.hu,g.title.sv)}</h3><div class="sheets">${g.structures.map(k=>sheetBtn(k,st.sheet===k)).join('')}</div></div>`).join('')}</div>
    <div class="card" id="genSheet"></div>
  </section>`;
}
function bindModule(id){
  const st=modStateFor(id);
  renderSheetInto($('#genSheet'),st.sheet);
  $('#genLayers').onclick=e=>{const b=e.target.closest('button');if(!b)return;st.layer=b.dataset.l;
    document.querySelectorAll('#genLayers button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#genLayerBody').innerHTML=layerHtml(id,st.layer)};
  $('#genBtns').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;st.sheet=b.dataset.s;
    document.querySelectorAll('#genBtns [data-s]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderSheetInto($('#genSheet'),st.sheet);
    if(window.innerWidth<820)$('#genSheet').scrollIntoView({behavior:'smooth',block:'start'})};
  const mq=$('#modQuiz');if(mq)mq.onclick=()=>{quizState=newQuiz(shuffle(Q.filter(q=>q.topic===id)).map(q=>q.id),'gyak');location.hash='kviz'};
}
function viewHub(){
  const card=(href,title,latin,nStruct,qs,tint)=>{const seen=qs.filter(q=>srs[q.id]).length;
    return `<a class="pillar" href="#${href}" style="--pc:var(--${tint});--pcs:var(--${tint}-soft)"><span class="la muted">${esc(latin)}</span><h3>${esc(title)}</h3>
      <p class="small muted">${nStruct} ${u('adatlap','faktablad')} · ${qs.length} ${u('kérdés','frågor')}</p><div class="bar"><i style="width:${qs.length?Math.round(seen/qs.length*100):0}%"></i></div></a>`};
  return `<div class="mod-head plate" data-wm="corpus humanum"><span class="eyebrow">${u('Pillér 1–2 · Testtájak szerint','Pelare 1–2 · Efter kroppsregion')}</span>${H1('Modulok','Moduler')}
    <p class="muted">${u('A sáv azt mutatja, a modul kérdéseiből mennyit láttál már.','Stapeln visar hur stor del av modulens frågor du redan har sett.')}</p></div>
  ${Object.entries(REGIONS).map(([rid,reg])=>{
    const mods=Object.values(MODS).filter(m=>m.region===rid).sort((a,b)=>a.order-b.order);
    const cards=mods.map(m=>card(moduleRoute(m.id),u(m.title.hu,m.title.sv),m.latin,m.structures.length,Q.filter(q=>q.topic===m.id),REGION_TINT[rid]||'accent'));
    if(rid==='nervous')cards.push(card('agyidegek',u('A 12 agyideg','De tolv kranialnerverna'),'nervi craniales',CN.length,Q.filter(q=>q.topic==='agyideg'),'nerve'));
    return cards.length?`<section class="stack"><h2>${lb(reg.hu,reg.sv)}</h2><div class="hub-grid">${cards.join('')}</div></section>`:'';
  }).join('')}`;
}

/* --- Plexus brachialis --- */
let plexSel='n.medianus', plexLesion=null;
const PX={
  root:{C5:[70,82],C6:[70,142],C7:[70,202],C8:[70,262],T1:[70,322]},
  trunk:{sup:[210,112],mid:[210,202],inf:[210,292]},
  div:{supA:[335,92],supP:[335,132],midA:[335,184],midP:[335,220],infA:[335,274],infP:[335,312]},
  cord:{lat:[475,122],med:[475,252],post:[475,338]},
  term:{'n.musculocutaneus':[640,82],'n.medianus':[640,187],'n.ulnaris':[640,262],'n.axillaris':[640,322],'n.radialis':[640,372]}
};
const PX_TRUNK_ROOTS={sup:['C5','C6'],mid:['C7'],inf:['C8','T1']};
const PX_CORD_DIVS={lat:['supA','midA'],med:['infA'],post:['supP','midP','infP']};
const PX_LEVELS={'n.musculocutaneus':['C5','C6','C7'],'n.axillaris':['C5','C6'],'n.radialis':['C5','C6','C7','C8','T1'],'n.medianus':['C6','C7','C8','T1'],'n.ulnaris':['C8','T1']};
const PX_CORDS={'n.musculocutaneus':['lat'],'n.medianus':['lat','med'],'n.ulnaris':['med'],'n.axillaris':['post'],'n.radialis':['post']};
const PX_EDGES=[
  ...Object.entries(PX_TRUNK_ROOTS).flatMap(([t,rs])=>rs.map(r=>['root',r,'trunk',t])),
  ...['sup','mid','inf'].flatMap(t=>[['trunk',t,'div',t+'A'],['trunk',t,'div',t+'P']]),
  ...Object.entries(PX_CORD_DIVS).flatMap(([c,ds])=>ds.map(d=>['div',d,'cord',c])),
  ['cord','lat','term','n.musculocutaneus'],['cord','lat','term','n.medianus'],['cord','med','term','n.medianus'],['cord','med','term','n.ulnaris'],['cord','post','term','n.axillaris'],['cord','post','term','n.radialis']
];
let PX_LESIONS;
function pxPath(a,b){const [x1,y1]=a,[x2,y2]=b,m=(x1+x2)/2;return `M${x1} ${y1} C${m} ${y1} ${m} ${y2} ${x2} ${y2}`}
function pxActive(){
  const on={root:new Set(),trunk:new Set(),div:new Set(),cord:new Set(),term:new Set()};
  if(plexLesion){const L=PX_LESIONS[plexLesion];L.roots.forEach(r=>on.root.add(r));L.trunks.forEach(t=>on.trunk.add(t));return on}
  const t=plexSel;if(!PX_LEVELS[t])return on;
  on.term.add(t);PX_LEVELS[t].forEach(r=>on.root.add(r));
  PX_CORDS[t].forEach(c=>{on.cord.add(c);PX_CORD_DIVS[c].forEach(d=>{const tr=d.slice(0,3);if(PX_TRUNK_ROOTS[tr].some(r=>on.root.has(r))){on.div.add(d);on.trunk.add(tr)}})});
  return on;
}
function plexusSvg(){
  const on=pxActive(),cls=plexLesion?'les':'on';
  const edgeOn=(ka,a,kb,b)=>{
    if(plexLesion)return (ka==='root'&&on.root.has(a)&&on.trunk.has(b))||(ka==='trunk'&&on.trunk.has(a));
    return on[ka].has(a)&&on[kb].has(b);
  };
  const heads=[['RADICES',70],['TRUNCI',210],['DIVISIONES',335],['FASCICULI',475],['RAMI TERMINALES',640]];
  const TL={sup:'superior',mid:'medius',inf:'inferior'},CL={lat:'lateralis',med:'medialis',post:'posterior'};
  let g='';
  heads.forEach(([h,x])=>g+=`<text class="px-head" x="${x}" y="34" text-anchor="${x===640?'start':'middle'}" dx="${x===640?-6:0}">${h}</text>`);
  PX_EDGES.forEach(([ka,a,kb,b])=>{const post=(ka==='div'&&a.endsWith('P'))||(kb==='div'&&b.endsWith('P'));
    g+=`<path class="px-edge${post?' post':''}${edgeOn(ka,a,kb,b)?' '+cls:''}" d="${pxPath(PX[ka][a],PX[kb][b])}"/>`});
  Object.entries(PX.root).forEach(([k,[x,y]])=>g+=`<circle class="px-node${on.root.has(k)?' '+cls:''}" cx="${x}" cy="${y}" r="7"/><text class="px-lbl" x="${x-16}" y="${y+4}" text-anchor="end" style="font-weight:700">${k}</text>`);
  Object.entries(PX.trunk).forEach(([k,[x,y]])=>g+=`<circle class="px-node${on.trunk.has(k)?' '+cls:''}" cx="${x}" cy="${y}" r="7"/><text class="px-lbl" x="${x}" y="${y-13}" text-anchor="middle">${TL[k]}</text>`);
  Object.entries(PX.div).forEach(([k,[x,y]])=>g+=`<circle class="px-node${on.div.has(k)?' '+cls:''}" cx="${x}" cy="${y}" r="4.5"/>`);
  Object.entries(PX.cord).forEach(([k,[x,y]])=>g+=`<circle class="px-node${on.cord.has(k)?' '+cls:''}" cx="${x}" cy="${y}" r="7"/><text class="px-lbl" x="${x}" y="${y-13}" text-anchor="middle">${CL[k]}</text>`);
  Object.entries(PX.term).forEach(([k,[x,y]])=>g+=`<g class="px-term${on.term.has(k)?' on':''}" data-t="${k}" role="button" tabindex="0" aria-label="${esc(SHEETS[k].la)}"><rect x="${x-10}" y="${y-14}" width="160" height="28" fill="transparent"/><circle class="px-node${on.term.has(k)?' on':''}" cx="${x}" cy="${y}" r="7"/><text x="${x+14}" y="${y+5}">${esc(SHEETS[k].la)}</text></g>`);
  return `<svg viewBox="0 0 800 400" role="img" aria-label="${u('A plexus brachialis vázlata: gyökök, törzsek, divisiók, kötegek és végágak','Schema över plexus brachialis: rötter, primärsträngar, divisioner, sekundärsträngar och ändgrenar')}">${g}</svg>`;
}
let PX_ROOTS;
let PX_BRANCHES;
let PX_LAYERS;
let plexLayer='alap';
function viewPlexus(){
  return `
  <div class="mod-head plate nerve" data-wm="plexus brachialis"><span class="eyebrow">1FY053 Anatomi · 1FY056 Undersökningsmetodik · ${u('Pillér','Pelare')} 2</span>
    ${H1('Plexus brachialis','Plexus brachialis · armplexus')}${tri('karfonat','armplexus','plexus brachialis')}</div>
  <section class="card stack">
    <div class="row" style="justify-content:space-between"><h2>${lb('Szerkezet','Struktur')}</h2>
      <div class="seg" id="pxMode"><button data-m="" aria-pressed="${!plexLesion}">${u('Végágak','Ändgrenar')}</button>${Object.entries(PX_LESIONS).map(([k,l])=>`<button data-m="${k}" aria-pressed="${plexLesion===k}">${u(l.label,(SV.lesions[k]||{}).label)}</button>`).join('')}</div></div>
    <p class="small muted" id="pxHint"></p>
    <div class="diagram" id="pxSvg"></div>
    <div class="legend"><span><svg viewBox="0 0 32 8"><path d="M0 4h32" stroke="var(--nerve)" stroke-width="3"/></svg> ${u('elülső osztódás (hajlítók)','främre division (flexorer)')}</span><span><svg viewBox="0 0 32 8"><path d="M0 4h32" stroke="var(--nerve)" stroke-width="3" stroke-dasharray="6 4"/></svg> ${u('hátsó osztódás (feszítők)','bakre division (extensorer)')}</span></div>
    <div id="pxLesion"></div>
  </section>
  <section class="card stack">
    <div class="row" style="justify-content:space-between"><h2>${lb('Tananyag','Kursinnehåll')}</h2>
      <div class="seg" id="pxLayers">${[['alap',u('Kezdő','Grund')],['egyetem',u('Egyetemi','Universitet')],['klinika',u('Klinikai','Klinik')]].map(([k,l])=>`<button data-l="${k}" aria-pressed="${plexLayer===k}">${l}</button>`).join('')}</div></div>
    <div class="layer-body" id="pxLayerBody">${layerHtml('plexus',plexLayer)}</div>
  </section>
  <section class="stack">
    <h2>${lb('Végágak adatlapjai','Faktablad för ändgrenarna')}</h2>
    <div class="sheets" id="pxBtns">${Object.keys(PX.term).map(k=>{const s=SHEETS[k];return `<button class="sheet-btn" data-s="${k}" aria-pressed="${plexSel===k}"><span class="chip nerve"><span class="dot" style="background:var(--nerve)"></span>${u('Ideg','Nerv')}</span><span class="la">${esc(s.la)}</span><span class="small muted">${esc(s.hu)} · ${esc(s.sv)}</span></button>`}).join('')}</div>
    <div class="card" id="pxSheet"></div>
  </section>
  <section class="card stack"><h2>${lb('Gyökvizsgálat: dermatóma, myotóma, reflex','Rotundersökning: dermatom, myotom, reflex')}</h2>
    <div class="tbl"><table><thead><tr><th>${lb('Gyök')}</th><th>${lb('Dermatóma')}</th><th>${lb('Myotóma (kulcsmozgás)')}</th><th>${lb('Reflex')}</th></tr></thead><tbody>${PX_ROOTS.map((r,i)=>`<tr>${r.map((c,j)=>`<td>${j?bi(c,(SV.pxRoots[i]||[])[j]):esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <p class="small muted">${u('A dermatóma-térképek forrásonként eltérnek, és a szomszédos szelvények átfednek. Mindig az ép oldallal hasonlíts.','Dermatomkartor skiljer sig mellan källor, och angränsande segment överlappar. Jämför alltid med den friska sidan.')}</p></section>
  <section class="card stack"><h2>${lb('Proximális ágak','Proximala grenar')}</h2>
    <div class="tbl"><table><thead><tr><th>${lb('Ered')}</th><th>${lb('Ideg')}</th><th>${lb('Ellátott terület')}</th></tr></thead><tbody>${PX_BRANCHES.map((r,i)=>{const v=SV.pxBranches[i]||[];return `<tr><td>${bi(r[0],v[0])}</td><td class="la">${esc(r[1])}</td><td>${bi(r[2],v[2])}</td></tr>`}).join('')}</tbody></table></div></section>`;
}
function renderPlexusDiagram(){
  $('#pxSvg').innerHTML=plexusSvg();
  $('#pxHint').textContent=plexLesion?u('A pirossal jelölt gyökök és törzs sérült.','De rödmarkerade rötterna och primärsträngen är skadade.'):u('Kattints egy végágra: kiemelődik az útja a gyököktől, és megnyílik az adatlapja.','Klicka på en ändgren: dess väg från rötterna markeras och faktabladet öppnas.');
  $('#pxLesion').innerHTML=plexLesion?`<div class="lesion"><h3>${bi(PX_LESIONS[plexLesion].label,(SV.lesions[plexLesion]||{}).label)}</h3><div>${bi(PX_LESIONS[plexLesion].text,(SV.lesions[plexLesion]||{}).text)}</div></div>`:'';
  document.querySelectorAll('#pxMode button').forEach(b=>b.setAttribute('aria-pressed',(b.dataset.m||null)===plexLesion));
}
function selectPlexusNerve(k,scroll){
  plexSel=k;plexLesion=null;renderPlexusDiagram();
  document.querySelectorAll('#pxBtns button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.s===k));
  renderSheetInto($('#pxSheet'),k);
  if(scroll)$('#pxSheet').scrollIntoView({behavior:'smooth',block:'start'});
}
function bindPlexus(){
  renderPlexusDiagram();renderSheetInto($('#pxSheet'),plexSel);
  $('#pxSvg').addEventListener('click',e=>{const g=e.target.closest('[data-t]');if(g)selectPlexusNerve(g.dataset.t,true)});
  $('#pxSvg').addEventListener('keydown',e=>{const g=e.target.closest('[data-t]');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selectPlexusNerve(g.dataset.t,true)}});
  $('#pxMode').onclick=e=>{const b=e.target.closest('button');if(!b)return;plexLesion=b.dataset.m||null;renderPlexusDiagram()};
  $('#pxBtns').onclick=e=>{const b=e.target.closest('button');if(b)selectPlexusNerve(b.dataset.s,false)};
  $('#pxLayers').onclick=e=>{const b=e.target.closest('button');if(!b)return;plexLayer=b.dataset.l;
    document.querySelectorAll('#pxLayers button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#pxLayerBody').innerHTML=layerHtml('plexus',plexLayer)};
}

/* --- AI tutor --- */
function tutorHtml(topic){
  return `<div class="tutor"><div class="row" style="justify-content:space-between"><h3>${u('AI-tanár','AI-lärare')}</h3><span class="chip">${esc(topic)}</span></div>
   <div data-needs-ai ${sampleFn?'':'hidden'} class="stack">
    <div class="suggest-q">${(lang==='sv'?['Förklara enkelt','Ge ett kliniskt fall','Förhör mig','Vad heter det på ungerska?']:['Magyarázd el egyszerűen','Adj egy klinikai esetet','Kérdezz ki belőle','Hogyan mondják ezt svédül a klinikán?']).map(s=>`<button type="button" data-sq="${esc(s)}">${esc(s)}</button>`).join('')}</div>
    <form id="tutorForm"><input id="tutorIn" placeholder="${u('Kérdezz erről a témáról…','Fråga om det här ämnet…')}" autocomplete="off"><button class="btn primary" type="submit">${u('Kérdezem','Fråga')}</button></form>
    <div class="ans" id="tutorAns" hidden></div></div>
   <p data-no-ai ${sampleFn?'hidden':''} class="small muted">${u('Az AI-tanár ebben a változatban még nem érhető el; a fejlesztési terv 7. szakaszában kerül be.','AI-läraren finns inte i den här versionen än; den kommer i fas 7 av utvecklingsplanen.')}</p></div>`;
}
let tutorAbort=null;
function bindTutor(ctx){
  const form=$('#tutorForm');if(!form)return;
  const ask=async(question)=>{
    if(!sampleFn||!question.trim())return;
    const out=$('#tutorAns');out.hidden=false;out.textContent=u('Gondolkodom…','Tänker…');
    if(tutorAbort)tutorAbort.abort();tutorAbort=new AbortController();
    const prompt=`Te egy türelmes anatómia- és fizioterápia-oktató vagy egy gyógytornász-hallgató számára, aki a Karolinska Institutet programjára készül. ${lang==='sv'?'Válaszolj svédül':lang==='both'?'Válaszolj magyarul, majd ugyanezt svédül is':'Válaszolj magyarul'}, tömören (nyelvenként legfeljebb 180 szó), sima szövegként (markdown nélkül). Az anatómiai kifejezéseknél add meg a latin és a svéd alakot is zárójelben. Ha klinikai kérdésről van szó, jelezd, hogy oktatási célú a válasz. Ha a hallgató kikérdezést kér, tegyél fel 3 kérdést, a válaszokat ne áruld el.\n\nKontextus:\n${ctx()}\n\nA hallgató kérdése: ${question}`;
    try{
      const r=await sampleFn(prompt,{signal:tutorAbort.signal,modelTier:'default',cache:false,onText:({text})=>{out.textContent=text}});
      out.textContent=r.text;
    }catch(e){
      if(e&&e.name==='AbortError')return;
      out.textContent=e&&e.code==='rate_limited'?u('Most túl sok a kérés. Próbáld újra egy perc múlva.','För många frågor just nu. Försök igen om en minut.'):e&&e.code==='not_granted'?u('Az AI-tanár nincs engedélyezve ezen az oldalon.','AI-läraren är inte tillåten på den här sidan.'):u('Nem sikerült választ kapni. Próbáld újra.','Kunde inte få något svar. Försök igen.');
    }
  };
  form.onsubmit=e=>{e.preventDefault();ask($('#tutorIn').value)};
  document.querySelectorAll('[data-sq]').forEach(b=>b.onclick=()=>{$('#tutorIn').value=b.dataset.sq;ask(b.dataset.sq)});
}

/* --- Cranial nerves --- */
let cnSel='VII';
function viewCN(){
  return `
  <div class="mod-head plate nerve" data-wm="nervi craniales"><span class="eyebrow">${u('5.3 · Neuroanatómia','5.3 · Neuroanatomi')} · ${u('Pillér','Pelare')} 2</span>${H1('A 12 agyideg','De tolv kranialnerverna')}
  <p class="muted">${u('Minden agyideghez ugyanaz a sablon: név három nyelven, magok, eredés, kilépés, funkció, beidegzett struktúrák, vizsgálat és kiesési tünetek.','Samma mall för varje kranialnerv: namn på tre språk, kärnor, utgång, utträde, funktion, innerverade strukturer, undersökning och bortfallssymtom.')}</p>
  <div class="typekey">${Object.entries(CN_TYPE).map(([k,[l,c]])=>`<span class="chip ${c}">${cnType(k)}</span>`).join('')}</div></div>
  <div class="cn-list" id="cnList">${CN.map(c=>`<button class="cn" data-n="${c.n}" style="--c:var(--${CN_TYPE[c.type][1]});--cs:var(--${CN_TYPE[c.type][1]}-soft)" aria-pressed="${cnSel===c.n}"><span class="row" style="justify-content:space-between"><span class="num">${c.n}</span><span class="chip ${CN_TYPE[c.type][1]}">${cnType(c.type).split(' ')[0]}</span></span><span class="la">${esc(c.la)}</span><span class="small muted">${lang==='sv'?esc(c.sv):lang==='both'?esc(c.hu)+' · '+esc(c.sv):esc(c.hu)}</span></button>`).join('')}</div>
  <div class="card" id="cnSheet"></div>`;
}
function renderCN(){
  const c=CN.find(x=>x.n===cnSel);
  const sv=SV.cn[c.n]||{};
  const F=(dt,k)=>`<dt>${lb(dt)}</dt><dd>${bi(c[k],sv[k])}</dd>`;
  const KF=(l,k,col)=>`<div class="fact" style="--c:var(--${col})"><span class="eyebrow">${lb(l)}</span><p>${bi(c[k],sv[k])}</p></div>`;
  const qs=Q.filter(q=>q.link&&q.link[0]==='#agyidegek'&&q.link[1]===c.n);
  $('#cnSheet').innerHTML=`<div class="sheet"><div class="row" style="justify-content:space-between"><h2>${lb(c.n+'. agyideg','Kranialnerv '+c.n)}</h2><span class="chip ${CN_TYPE[c.type][1]}">${cnType(c.type)}</span></div>
   ${reviewBadge('cn.'+c.n)}${tri(c.hu,c.sv,c.la)}
   <div class="facts">${KF('Funkció','fn','nerve')}${KF('Kilépés a koponyából','kilep','bone')}${KF('Beidegzett izmok, szervek','izom','muscle')}</div><dl class="fields">${F('Magok','nuc')}${F('Agytörzsi eredés','ered')}${F('Klinikai vizsgálat','teszt')}${F('Sérülési tünetek','lez')}</dl>
   ${qs.length?`<div class="row"><span class="small muted">${u('Kapcsolódó kérdések','Relaterade frågor')}: ${qs.length}</span><button class="btn" id="cnQuiz">${u('Gyakorold','Öva')}</button></div>`:''}
   ${tutorHtml(c.la)}</div>`;
  if(qs.length)$('#cnQuiz').onclick=()=>{quizState=newQuiz(qs.map(q=>q.id),'gyak');location.hash='kviz'};
  bindTutor(()=>`Agyideg ${c.n}: ${c.la}. Adatok: ${JSON.stringify(c)}`);
}
function bindCN(){
  renderCN();
  $('#cnList').onclick=e=>{const b=e.target.closest('button');if(!b)return;cnSel=b.dataset.n;
    document.querySelectorAll('#cnList button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderCN();
    if(window.innerWidth<820)$('#cnSheet').scrollIntoView({behavior:'smooth',block:'start'})};
}

/* --- KI path --- */
function viewKI(){
  const sems=[1,2,3,4,5,6];
  return `
  <div class="mod-head plate joint" data-wm="180 hp"><span class="eyebrow">${u('12. fejezet','Kapitel 12')} · ${u('Pillér','Pelare')} 3</span>${H1('KI Fysioterapeutprogrammet','Fysioterapeutprogrammet vid Karolinska Institutet')}
  <p class="muted">${u('1FY26 tantervi változat, 2026 őszétől (HT26). 180 hp, hat félév. A kurzusnevek és kreditek a KI hivatalos adatai; a témalisták jelölése mutatja, melyik származik kursplanból és melyik az app saját javaslata.','Studieplanversion 1FY26, från hösten 2026 (HT26). 180 hp, sex terminer. Kursnamn och högskolepoäng är KI:s officiella uppgifter; märkningen visar vilka ämneslistor som kommer från kursplanen och vilka som är appens egna förslag.')}</p>
  <div class="row"><span class="chip official">${u('KI kursplan alapján','Enligt KI:s kursplan')}</span><span class="chip suggest">${u('App-javaslat, kursplan még nem jelent meg','Appens förslag, kursplanen är inte publicerad än')}</span></div></div>
  <div class="card">${sems.map(s=>{const cs=KI.filter(c=>c.s===s);const hp=cs.reduce((a,c)=>a+c.hp,0);
    return `<div class="sem"><div class="sem-h"><span class="eyebrow">${u('Félév','Termin')}</span><b>${s}</b><span class="small muted tnum">${String(hp).replace('.',',')} hp</span></div>
    <div class="stack">${cs.map(c=>`<div class="course"><div class="top"><div style="min-width:0"><span class="code">${c.code||u('kód később','kod senare')}</span><h3>${esc(c.name)}</h3></div><span class="tnum" style="font-weight:700">${String(c.hp).replace('.',',')} hp</span></div>
      <div class="row"><span class="chip ${c.src==='ki'?'official':'suggest'}">${c.src==='ki'?u('KI kursplan alapján','Enligt KI:s kursplan'):u('App-javaslat','Appens förslag')}</span></div>
      <ul>${c.topics.map((t,j)=>`<li>${bi(t,(SV.ki[KI.indexOf(c)]||[])[j])}</li>`).join('')}</ul>
      ${c.links?`<div class="row">${c.links.map(([h,l])=>`<a href="${h}">${esc(u(l,LINK_SV[l]))} →</a>`).join('')}</div>`:''}</div>`).join('')}</div></div>`}).join('')}</div>
  <p class="small muted">${u('Hivatalos kiindulópont:','Officiell utgångspunkt:')} <a href="https://utbildning.ki.se/bli-student/program-och-kurser/fysioterapeutprogrammet" style="color:var(--accent)">utbildning.ki.se – Fysioterapeutprogrammet</a>. ${u('A KI a kurzusterveket fokozatosan teszi közzé; megjelenésükkor a javasolt témákat frissíteni kell.','KI publicerar kursplanerna successivt; när de kommer ska de föreslagna ämnena uppdateras.')}</p>`;
}

/* --- Quiz --- */
let quizState=null;
function newQuiz(ids,mode){
  return {ids,mode,i:0,res:[],answered:false,start:Date.now(),limit:mode==='vizsga'?ids.length*45:0,order:null,matchOpts:null};
}
function viewQuiz(){
  if(!quizState)return quizStart();
  if(quizState.i>=quizState.ids.length)return quizDone();
  return `<div class="mod-head"><span class="eyebrow">${quizState.mode==='vizsga'?u('Vizsgaszimuláció','Tentasimulering'):quizState.mode==='ism'?u('Ismétlés','Repetition'):u('Gyakorlás','Övning')}</span>
    <div class="row" style="justify-content:space-between"><h1>${u('Kérdés','Fråga')} ${quizState.i+1} / ${quizState.ids.length}</h1>${quizState.limit?`<span class="timer" id="timer"></span>`:''}</div>
    <div class="progress">${quizState.ids.map((_,k)=>`<i class="${k<quizState.res.length?(quizState.res[k]?'ok':'no'):k===quizState.i?'cur':''}"></i>`).join('')}</div></div>
    <div class="card q-card" id="qcard"></div>`;
}
function quizStart(){
  const due=dueList();
  const cnt=t=>Q.filter(q=>q.topic===t).length;
  return `<div class="mod-head plate bone" data-wm="examen"><span class="eyebrow">${u('9. fejezet · Munkafüzet és kvíz','Kapitel 9 · Arbetsbok och quiz')}</span>${H1('Kvíz','Quiz')}
   <p class="muted">${u('Feleletválasztás, igaz–hamis, háromnyelvű párosítás és sorrendbe rendezés. Minden válasz után megtudod, miért helyes, miért hibásak a többi lehetőségek, és melyik adatlaphoz kapcsolódik.','Flerval, sant–falskt, trespråkig matchning och ordningsföljd. Efter varje svar får du veta varför det är rätt, varför de andra alternativen är fel och vilket faktablad frågan hör till.')}</p></div>
   <div class="grid g3">
    <div class="card stack"><span class="eyebrow">${u('Ismétlés','Repetition')}</span><h3>${u('Mai esedékes kérdések','Dagens frågor att repetera')}</h3><p class="small muted">${u('A hibázott és a lejárt kérdések, az ismétlési ütemezés szerint.','Felbesvarade och förfallna frågor enligt repetitionsschemat.')}</p><b style="font-family:var(--f-display);font-size:2rem" class="tnum">${due.length}</b><button class="btn primary" data-start="ism" ${due.length?'':'disabled'}>${u('Ismétlés indítása','Starta repetition')}</button></div>
    <div class="card stack"><span class="eyebrow">${u('Gyakorlás','Övning')}</span><h3>${u('Témakör szerint','Per ämne')}</h3>
      <div class="stack">${Object.entries(TOPICS).map(([k,l])=>`<button class="btn" data-start="gyak" data-topic="${k}">${topicName(k)} <span class="muted tnum" style="margin-left:auto">${cnt(k)}</span></button>`).join('')}</div></div>
    <div class="card stack"><span class="eyebrow">${u('Vizsgaszimuláció','Tentasimulering')}</span><h3>${u('10 kérdés, időre','10 frågor på tid')}</h3><p class="small muted">${u('45 másodperc jut egy kérdésre. A magyarázatokat a végén látod.','45 sekunder per fråga. Förklaringarna visas i slutet.')}</p><button class="btn" data-start="vizsga">${u('Vizsga indítása','Starta tentan')}</button></div>
   </div>`;
}
function bindQuizStart(){
  document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{
    const m=b.dataset.start;let ids;
    if(m==='ism')ids=dueList().map(q=>q.id);
    else if(m==='vizsga')ids=shuffle(Q).slice(0,10).map(q=>q.id);
    else ids=shuffle(Q.filter(q=>q.topic===b.dataset.topic)).map(q=>q.id);
    quizState=newQuiz(ids,m);render();
  });
}
let timerInt=null;
function bindQuiz(){
  if(!quizState){bindQuizStart();return}
  if(quizState.i>=quizState.ids.length){bindDone();return}
  renderQ();
  clearInterval(timerInt);
  if(quizState.limit){
    const tick=()=>{const left=quizState.limit-Math.floor((Date.now()-quizState.start)/1000);const el=$('#timer');if(!el){clearInterval(timerInt);return}
      if(left<=0){clearInterval(timerInt);while(quizState.res.length<quizState.ids.length){grade(quizState.ids[quizState.res.length],false);quizState.res.push(false)}quizState.i=quizState.ids.length;render();return}
      el.textContent=`${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`};
    tick();timerInt=setInterval(tick,1000);
  }
}
function renderQ(){
  const q=Q.find(x=>x.id===quizState.ids[quizState.i]);
  const exam=quizState.mode==='vizsga';
  const svq=SV.q[q.id]||{};
  let body='';
  if(q.type==='mc'){
    if(!quizState.order)quizState.order=shuffle(q.opts.map((_,k)=>k));
    body=`<div class="opts" id="opts">${quizState.order.map((k,n)=>`<button class="opt" data-k="${k}"><span class="k">${'ABCD'[n]}</span><span>${bi(q.opts[k][0],((svq.opts||[])[k]||[])[0])}<span class="why" hidden></span></span></button>`).join('')}</div>`;
  }else if(q.type==='tf'){
    body=`<div class="opts" id="opts"><button class="opt" data-k="true"><span class="k">I</span><span>${bi('Igaz','Sant')}</span></button><button class="opt" data-k="false"><span class="k">H</span><span>${bi('Hamis','Falskt')}</span></button></div>`;
  }else if(q.type==='match'){
    if(!quizState.matchOpts)quizState.matchOpts=[shuffle([...new Set(q.rows.map(r=>r[1]))]),shuffle([...new Set(q.rows.map(r=>r[2]))])];
    const heads=lang==='sv'?(svq.heads||(q.topic==='agyideg'?['NUMMER','UNGERSKA','SVENSKA']:['UNGERSKA','SVENSKA','LATIN'])):(q.heads||(q.topic==='agyideg'?['SORSZÁM','MAGYAR','SVENSKA']:['MAGYAR','SVENSKA','LATINA']));
    body=`<div class="match" id="match"><span class="head">${heads[0]}</span><span class="head">${heads[1]}</span><span class="head c3">${heads[2]}</span>
      ${q.rows.map((r,ri)=>`<div class="fixed">${esc(r[0])}</div>
        <select id="m${ri}a" aria-label="${esc(r[0])} – ${heads[1]}"><option value="">${u('Válassz…','Välj…')}</option>${quizState.matchOpts[0].map(o=>`<option>${esc(o)}</option>`).join('')}</select>
        <select id="m${ri}b" class="c3" aria-label="${esc(r[0])} – ${heads[2]}"><option value="">${u('Válassz…','Välj…')}</option>${quizState.matchOpts[1].map(o=>`<option>${esc(o)}</option>`).join('')}</select>`).join('')}</div>
      <div class="row"><button class="btn primary" id="check">${u('Ellenőrzés','Kontrollera')}</button></div>`;
  }else if(q.type==='order'){
    if(!quizState.order){do{quizState.order=shuffle(q.items.map((_,k)=>k))}while(quizState.order.every((v,k)=>v===k))}
    body=`<div class="order"><ol id="olist">${quizState.order.map((k,n)=>`<li data-k="${k}"><span class="lab">${bi(q.items[k],(svq.items||[])[k])}</span><button class="icon-btn" data-mv="-1" aria-label="${u('Fel','Upp')}" ${n===0?'disabled':''}>${IC.up}</button><button class="icon-btn" data-mv="1" aria-label="${u('Le','Ned')}" ${n===q.items.length-1?'disabled':''}>${IC.down}</button></li>`).join('')}</ol></div>
      <div class="row"><button class="btn primary" id="check">${u('Ellenőrzés','Kontrollera')}</button></div>`;
  }
  const tl=(lang==='sv'?{mc:'Flerval',tf:'Sant eller falskt',match:'Matchning',order:'Ordningsföljd'}:{mc:'Feleletválasztás',tf:'Igaz vagy hamis',match:'Párosítás',order:'Sorrend'})[q.type];
  $('#qcard').innerHTML=`<div class="q-meta"><span class="chip">${topicName(q.topic)}</span><span class="row" style="gap:6px">${reviewBadge(q.id)}<span class="small muted">${tl}</span></span></div>
    <div class="q-text">${bi(q.q,svq.q)}</div>${body}<div id="fb"></div>`;

  const finish=(ok)=>{
    quizState.answered=true;grade(q.id,ok);quizState.res.push(ok);
    if(exam){next();return}
    const lk=q.link;
    $('#fb').innerHTML=`<div class="feedback ${ok?'ok':'no'}"><h3>${ok?lb('Helyes válasz','Rätt svar'):lb('Nem ez a helyes válasz','Inte rätt svar')}</h3><div>${bi(q.exp,svq.exp)}</div>
      <div class="row" style="justify-content:space-between"><span class="small muted">${ok?u('Következő ismétlés: ','Nästa repetition om ')+INTERVALS[Math.max(srs[q.id].box-1,0)]+u(' nap múlva',' dagar'):u('Holnap újra előkerül.','Kommer tillbaka i morgon.')}</span>
      <div class="row">${lk?`<a class="btn ghost" href="${lk[0]}" data-open="${lk[1]}">${u('Tananyag megnyitása','Öppna kursinnehållet')}</a>`:''}<button class="btn primary" id="nextQ">${quizState.i+1<quizState.ids.length?u('Következő kérdés','Nästa fråga'):u('Eredmény','Resultat')}</button></div></div>
      ${!ok?`<div data-needs-ai ${sampleFn?'':'hidden'}><button class="btn" id="explain">${u('Magyarázd el másképp (AI-tanár)','Förklara på ett annat sätt (AI-lärare)')}</button><div class="ans tutor" id="explainOut" hidden style="white-space:pre-wrap"></div></div>`:''}</div>`;
    $('#nextQ').onclick=next;$('#nextQ').focus();
    const op=document.querySelector('[data-open]');if(op)op.onclick=()=>{if(lk[0].startsWith('#modul-')&&SHEETS[lk[1]])modStateFor(lk[0].slice(7)).sheet=lk[1];if(lk[0]==='#vall'&&SHEETS[lk[1]])modState.sheet=lk[1];if(lk[0]==='#agyidegek'&&lk[1])cnSel=lk[1];if(lk[0]==='#plexus'&&SHEETS[lk[1]])plexSel=lk[1]};
    const ex=$('#explain');if(ex)ex.onclick=async()=>{
      const out=$('#explainOut');out.hidden=false;out.textContent=u('Gondolkodom…','Tänker…');ex.disabled=true;
      try{const r=await sampleFn(`Egy gyógytornász-hallgató hibásan válaszolt erre a kérdésre. Magyarázd el másképp, ${lang==='sv'?'svédül':lang==='both'?'magyarul, majd svédül is':'magyarul'}, nyelvenként legfeljebb 120 szóban, sima szövegként, egy szemléletes hasonlattal vagy emlékeztetővel. Add meg a kulcsfogalmak latin és svéd alakját.\nKérdés: ${q.q}\nHelyes magyarázat: ${q.exp}`,{modelTier:'quick',onText:({text})=>{out.textContent=text}});out.textContent=r.text}
      catch(e){out.textContent=u('Nem sikerült választ kapni. Próbáld újra később.','Kunde inte få något svar. Försök igen senare.');ex.disabled=false}};
  };

  if(q.type==='mc'||q.type==='tf'){
    $('#opts').onclick=e=>{const b=e.target.closest('.opt');if(!b||quizState.answered)return;
      const pick=b.dataset.k;const right=q.type==='mc'?String(q.a):String(q.a);
      document.querySelectorAll('#opts .opt').forEach(o=>{o.disabled=true;
        if(o.dataset.k===right)o.classList.add('right');else if(o===b)o.classList.add('wrong');
        if(q.type==='mc'&&!exam){const w=q.opts[+o.dataset.k][1];const why=o.querySelector('.why');if(w&&(o===b||o.dataset.k!==right)){why.innerHTML=lb('Miért nem:','Varför inte:')+' '+bi(w,((svq.opts||[])[+o.dataset.k]||[])[1]);why.hidden=false}}});
      finish(pick===right)};
  }else if(q.type==='match'){
    $('#check').onclick=()=>{let ok=true;q.rows.forEach((r,ri)=>{[['a',1],['b',2]].forEach(([s,c])=>{const el=$('#m'+ri+s);const good=el.value===r[c];ok=ok&&good;el.classList.add(good?'right':'wrong');el.disabled=true;
        if(!good&&!exam){const o=[...el.options].find(x=>x.value===r[c]);if(o){el.value=r[c];el.title='Helyes: '+r[c]}}})});
      $('#check').remove();finish(ok)};
  }else if(q.type==='order'){
    $('#olist').onclick=e=>{const b=e.target.closest('[data-mv]');if(!b)return;const li=b.closest('li');const idx=[...li.parentNode.children].indexOf(li);const j=idx+(+b.dataset.mv);
      const o=quizState.order;[o[idx],o[j]]=[o[j],o[idx]];renderQ()};
    $('#check').onclick=()=>{let ok=true;[...$('#olist').children].forEach((li,n)=>{const g=+li.dataset.k===n;ok=ok&&g;li.classList.add(g?'right':'wrong');li.querySelectorAll('button').forEach(x=>x.disabled=true)});
      if(!ok&&!exam){const p=document.createElement('p');p.className='small';p.textContent='Helyes sorrend: '+q.items.map(x=>x.split(' (')[0]).join(' → ');$('#olist').after(p)}
      $('#check').remove();finish(ok)};
  }
}
function next(){quizState.i++;quizState.answered=false;quizState.order=null;quizState.matchOpts=null;render()}
function quizDone(){
  clearInterval(timerInt);
  const n=quizState.res.length,ok=quizState.res.filter(Boolean).length,pct=n?Math.round(ok/n*100):0;
  const wrong=quizState.ids.filter((_,k)=>!quizState.res[k]).map(id=>Q.find(q=>q.id===id));
  return `<div class="mod-head"><span class="eyebrow">${quizState.mode==='vizsga'?u('Vizsgaszimuláció','Tentasimulering'):u('Kör vége','Omgången klar')}</span><h1>${ok} / ${n} ${u('helyes','rätt')} · ${pct}%</h1>
    <p class="muted">${pct>=80?u('Erős eredmény. A helyes kérdések hosszabb időközzel jönnek vissza.','Starkt resultat. Rätt besvarade frågor kommer tillbaka med längre mellanrum.'):pct>=50?u('Jó alap. A hibázott kérdések holnap újra előkerülnek.','Bra grund. Felbesvarade frågor kommer tillbaka i morgon.'):u('Érdemes visszamenni a tananyaghoz, mielőtt újra próbálod.','Gå gärna tillbaka till kursinnehållet innan du försöker igen.')}</p></div>
    ${wrong.length?`<section class="stack"><h2>${lb('Átnézendő','Att gå igenom')}</h2>${wrong.map(q=>`<div class="card stack"><span class="chip">${topicName(q.topic)}</span><b>${bi(q.q,(SV.q[q.id]||{}).q)}</b><div class="small">${bi(q.exp,(SV.q[q.id]||{}).exp)}</div></div>`).join('')}</section>`:''}
    <div class="row"><button class="btn primary" id="again">${u('Új kör','Ny omgång')}</button><a class="btn" href="#statisztika">${u('Statisztika','Statistik')}</a></div>`;
}
function bindDone(){$('#again').onclick=()=>{quizState=null;render()}}

/* --- Stats --- */
function viewStats(){
  const rs=Q.map(q=>[q,srs[q.id]]).filter(x=>x[1]);
  const ok=rs.reduce((a,[,r])=>a+r.ok,0),no=rs.reduce((a,[,r])=>a+r.no,0);
  const topic=Object.entries(TOPICS).map(([k,l])=>{const t=rs.filter(([q])=>q.topic===k);const o=t.reduce((a,[,r])=>a+r.ok,0),w=t.reduce((a,[,r])=>a+r.no,0);return [topicName(k),o+w?Math.round(o/(o+w)*100):null,t.length,Q.filter(q=>q.topic===k).length]});
  const ranked=topic.filter(t=>t[1]!=null).sort((a,b)=>a[1]-b[1]);
  return `<div class="mod-head plate" data-wm="progressus"><span class="eyebrow">${u('11. fejezet · Személyre szabott tanulás','Kapitel 11 · Personligt lärande')}</span>${H1('Statisztika','Statistik')}
   ${srs._example?`<p class="note">${u('Példaadatok láthatók. Az első megválaszolt kérdés után a saját eredményeid jelennek meg.','Exempeldata visas. Efter din första besvarade fråga visas dina egna resultat.')}</p>`:''}</div>
   <div class="kpis">
    <div class="kpi"><span class="eyebrow">${u('Pontosság','Träffsäkerhet')}</span><b>${ok+no?Math.round(ok/(ok+no)*100):0}%</b><span class="small muted">${ok} ${u('helyes','rätt')}, ${no} ${u('hibás','fel')}</span></div>
    <div class="kpi"><span class="eyebrow">${u('Látott kérdések','Sedda frågor')}</span><b>${rs.length}<span class="muted" style="font-size:1rem"> / ${Q.length}</span></b></div>
    <div class="kpi"><span class="eyebrow">${u('Megszilárdult','Befästa')}</span><b>${rs.filter(([,r])=>r.box>=2).length}</b><span class="small muted">${u('legalább 3 napos szinten','minst på 3-dagarsnivå')}</span></div>
    <div class="kpi"><span class="eyebrow">${u('Ma esedékes','Att repetera idag')}</span><b>${dueList().length}</b></div>
   </div>
   <section class="card stack"><h2>${lb('Témakörök','Ämnen')}</h2><div>${topic.map(([l,p,s,t])=>`<div class="topic-row"><span>${l}<br><span class="small muted">${s}/${t} ${u('kérdés látva','frågor sedda')}</span></span><div class="bar"><i style="width:${p??0}%;background:${p==null?'var(--surface-2)':p>=75?'var(--good)':p>=50?'var(--nerve)':'var(--bad)'}"></i></div><span class="tnum" style="text-align:right;font-weight:700">${p==null?'–':p+'%'}</span></div>`).join('')}</div>
    ${ranked.length?`<p class="small muted">${u('Fejlesztendő:','Att förbättra:')} <b>${ranked[0][0]}</b>${ranked.length>1?` · ${u('Legerősebb:','Starkast:')} <b>${ranked[ranked.length-1][0]}</b>`:''}</p>`:''}</section>
   <section class="card stack"><h2>${lb('Ismétlési dobozok','Repetitionsnivåer')}</h2><div class="sched">${INTERVALS.map((d,i)=>`<div><b>${rs.filter(([,r])=>r.box===i).length}</b><span class="small muted">${i===0?u('új / hibás','ny / fel'):d+u(' nap',' dagar')}</span></div>`).join('')}</div></section>
   ${transferHtml()}
   <div class="row"><button class="btn" id="reset">${u('Előrehaladás törlése','Radera framsteg')}</button><span class="small muted" id="resetMsg"></span></div>`;
}
function bindStats(){
  bindTransfer();
  const b=$('#reset');let armed=false;
  b.onclick=()=>{if(!armed){armed=true;b.textContent=u('Biztosan törlöd? Kattints újra','Är du säker? Klicka igen');$('#resetMsg').textContent=u('Ez a kvízeredményeket és a kedvenceket is törli ebben a böngészőben.','Detta raderar även quizresultat och favoriter i den här webbläsaren.');return}
    srs={};saveSrs();favs=new Set();store.set('favs',[]);render()};
}

/* ============================== ROUTER ============================== */
const VIEWS={modulok:[viewHub],attekintes:[viewHome],szotar:[viewDict,bindDict],vall:[viewShoulder,bindShoulder],plexus:[viewPlexus,bindPlexus],agyidegek:[viewCN,bindCN],'ki-utvonal':[viewKI],kviz:[viewQuiz,bindQuiz],statisztika:[viewStats,bindStats]};
function render(){
  const id=(location.hash||'').slice(1);
  const modId=id.startsWith('modul-')?id.slice(6):null;
  const key=VIEWS[id]?id:(modId&&MODS[modId]&&!CUSTOM_MODULE_VIEWS[modId]?id:'attekintes');
  const view=VIEWS[key]||[()=>viewModule(modId),()=>bindModule(modId)];
  if(key!=='kviz')clearInterval(timerInt);
  // an answered question is finished: move on instead of showing it locked
  if(key==='kviz'&&quizState&&quizState.answered){quizState.i++;quizState.answered=false;quizState.order=null;quizState.matchOpts=null}
  renderNav(key);
  $('#view').innerHTML=`<div class="lang-mobile"><div class="seg">${langSwitch()}</div></div>`+view[0]();
  if(view[1])view[1]();
}
window.addEventListener('hashchange',()=>{if(TERMS){render();window.scrollTo(0,0)}});

/* ============================== CONTENT LOADING ==============================
   content.json is built from content/*.json by tools/build.py. The views below were
   written against the prototype's in-memory shapes, so hydrate() maps the content
   model onto those shapes. New views should read BUNDLE directly. */
const STRUCT_MODULE={};
let BUNDLE=null,MODS={},MOD_LESSONS={},REGIONS={},MODELS3D=[],MODEL_OF={};
const REVIEW={};
const CAT_KEY={basics:'alap',bones:'csont',joints:'izulet',muscles:'izom',nervous:'ideg',physiology:'elettan'};
const KIND={muscle:'izom',joint:'izulet',nerve:'ideg'};
const FIELD_KEYS={
  muscle:{location:'loc',origin:'origo',insertion:'insertio',innervation:'innervatio',bloodSupply:'ver',action:'actio',synergists:'syn',antagonists:'ant',joints:'izulet',palpation:'palp',clinicalTests:'teszt',clinicalRelevance:'klin'},
  joint:{bones:'csontok',jointType:'tipus',capsule:'tok',ligaments:'szalag',stabilizers:'stab',movements:'mozgas',muscles:'izmok',innervation:'beidegzes',function:'funkcio',examination:'vizsg',compensations:'komp',clinicalRelevance:'klin'},
  nerve:{origin:'eredes',course:'lefutas',motor:'motor',sensory:'szenz',examination:'vizsg',injurySites:'serules',deficits:'tunetek'}
};
const CN_KEYS={nuclei:'nuc',brainstemOrigin:'ered',skullExit:'kilep',function:'fn',innervates:'izom',examination:'teszt',lesion:'lez'};
const MODALITY_KEY={sensory:'S',motor:'M','motor+parasympathetic':'M+P',mixed:'Kevert'};
const LESSON_KEY={basic:'alap',university:'egyetem',clinical:'klinika'};

function hydrate(b){
  BUNDLE=b;
  const sv={sheets:{},layers:{},lesions:{},pxRoots:[],pxBranches:[],cn:{},q:{},ki:[]};
  const rv=(id,r)=>{REVIEW[id]=r||{status:'draft'}};
  // taxonomy
  CAT_SV={};Object.entries(b.taxonomy.termCategories).forEach(([k,v])=>{const o=CAT_KEY[k];if(CAT[o]){CAT[o].label=v.hu;CAT_SV[o]=v.sv}});
  TOPICS={};TOPICS_SV={};Object.entries(b.taxonomy.quizTopics).forEach(([k,v])=>{TOPICS[k]=v.hu;TOPICS_SV[k]=v.sv});
  // terms
  TERMS=b.terms.map(t=>{const a=[t.name.hu,t.name.sv,t.name.la,CAT_KEY[t.category],t.synonymsHu||''];a.id=t.id;rv(t.id,t.review);return a});
  // structures
  SHEETS={};
  b.structures.forEach(s=>{
    const o={kind:KIND[s.type],hu:s.name.hu,sv:s.name.sv,la:s.name.la},v={};
    Object.entries(s.fields).forEach(([k,p])=>{const ok=FIELD_KEYS[s.type][k];o[ok]=p.hu;v[ok]=p.sv});
    if(s.rom){o.rom=s.rom.map(r=>[r.movement.hu,r.degrees]);v.rom=s.rom.map(r=>r.movement.sv)}
    SHEETS[s.id]=o;sv.sheets[s.id]=v;rv(s.id,s.review);STRUCT_MODULE[s.id]=s.module;
  });
  // modules
  MODS={};MOD_LESSONS={};
  b.modules.forEach(m=>{MODS[m.id]=m;MOD_LESSONS[m.id]={};Object.entries(m.lessons||{}).forEach(([k,p])=>{MOD_LESSONS[m.id][LESSON_KEY[k]]=p})});
  REGIONS=b.taxonomy.regions||{};
  const mod=id=>b.modules.find(m=>m.id===id)||{};
  const vall=mod('vall'),plex=mod('plexus');
  SHEET_ORDER=vall.structures||[];
  LAYERS={};PX_LAYERS={};
  [['vall',vall,LAYERS],['plexus',plex,PX_LAYERS]].forEach(([id,m,target])=>{sv.layers[id]={};
    Object.entries(m.lessons||{}).forEach(([k,p])=>{target[LESSON_KEY[k]]=p.hu;sv.layers[id][LESSON_KEY[k]]=p.sv})});
  PX_LESIONS={};(plex.lesions||[]).forEach(l=>{PX_LESIONS[l.id]={label:l.label.hu,roots:l.roots,trunks:l.trunks,text:l.text.hu};sv.lesions[l.id]={label:l.label.sv,text:l.text.sv}});
  PX_ROOTS=(plex.rootExam||[]).map(r=>[r.root,r.dermatome.hu,r.myotome.hu,r.reflex.hu]);
  sv.pxRoots=(plex.rootExam||[]).map(r=>[r.root,r.dermatome.sv,r.myotome.sv,r.reflex.sv]);
  PX_BRANCHES=(plex.proximalBranches||[]).map(r=>[r.origin.hu,r.nerve,r.area.hu]);
  sv.pxBranches=(plex.proximalBranches||[]).map(r=>[r.origin.sv,r.nerve,r.area.sv]);
  // cranial nerves
  CN=b.cranialNerves.map(c=>{const o={n:c.number,la:c.name.la,hu:c.name.hu,sv:c.name.sv,type:MODALITY_KEY[c.modality]},v={};
    Object.entries(c.fields).forEach(([k,p])=>{o[CN_KEYS[k]]=p.hu;v[CN_KEYS[k]]=p.sv});sv.cn[c.number]=v;rv(c.id,c.review);return o});
  // KI programme
  LINK_SV={};
  KI=b.ki.courses.map((c,i)=>{sv.ki[i]=c.topics.map(t=>t.sv);
    (c.links||[]).forEach(l=>{LINK_SV[l.label.hu]=l.label.sv});
    return {s:c.semester,code:c.code||'',name:c.name,hp:c.credits,src:c.topicSource==='kursplan'?'ki':'app',topics:c.topics.map(t=>t.hu),
      links:c.links?c.links.map(l=>['#'+l.view,l.label.hu]):undefined}});
  // questions
  Q=b.questions.map(q=>{
    const o={id:q.id,topic:q.topic,type:q.type,q:q.prompt.hu,exp:q.explanation.hu},v={q:q.prompt.sv,exp:q.explanation.sv};
    if(q.type==='mc'){o.opts=q.options.map(x=>[x.text.hu,x.whyWrong?x.whyWrong.hu:'']);v.opts=q.options.map(x=>[x.text.sv,x.whyWrong?x.whyWrong.sv:'']);o.a=q.answer}
    if(q.type==='tf')o.a=q.answer;
    if(q.type==='match'){o.rows=q.rows;if(q.heads){o.heads=q.heads.hu;v.heads=q.heads.sv}}
    if(q.type==='order'){o.items=q.items.map(x=>x.hu);v.items=q.items.map(x=>x.sv)}
    const it=q.link&&q.link.item;
    o.link=['#'+q.link.view,it?(it.startsWith('cn.')?it.slice(3):it):''];
    sv.q[q.id]=v;rv(q.id,q.review);return o});
  MODELS3D=b.models3d||[];MODEL_OF={};MODELS3D.forEach(m=>m.structures.forEach(id=>{MODEL_OF[id]=m}));
  SV=sv;
}

function reviewBadge(id){
  const r=REVIEW[id];
  if(r&&r.status==='reviewed')return `<span class="chip reviewed" title="${esc(r.by||'')} · ${esc(r.date||'')}">✓ ${lang==='sv'?'Granskat':lang==='both'?'Ellenőrizve · Granskat':'Ellenőrizve'}</span>`;
  return `<span class="chip draft" title="${esc(u('Szakmai ellenőrzésre vár. Oktatási célú vázlat.','Väntar på fackgranskning. Utkast för utbildning.'))}">${lang==='sv'?'Utkast':lang==='both'?'Vázlat · Utkast':'Vázlat'}</span>`;
}

async function boot(){
  $('#view').innerHTML=`<p class="muted" style="padding:24px 0">${u('Tananyag betöltése…','Läser in kursinnehåll…')}</p>`;
  try{
    const v=(document.querySelector('meta[name=build]')||{}).content||'dev';
    const r=await fetch('content.json?v='+encodeURIComponent(v));
    if(!r.ok)throw new Error('HTTP '+r.status);
    hydrate(await r.json());
    render();
  }catch(e){
    $('#view').innerHTML=`<div class="card stack"><h2>${u('A tananyag nem töltődött be','Kursinnehållet kunde inte läsas in')}</h2><p class="muted">${u('Ellenőrizd az internetkapcsolatot, majd töltsd újra az oldalt. Ha az alkalmazás már egyszer betöltődött, offline is működik.','Kontrollera internetanslutningen och ladda om sidan. Om appen har laddats en gång fungerar den även offline.')}</p><p class="small muted">${esc(String(e.message||e))}</p></div>`;
  }
  if('serviceWorker' in navigator&&location.protocol!=='file:'){navigator.serviceWorker.register('sw.js').catch(()=>{})}
}

/* ============================== 3D VIEWER ==============================
   The viewer module (and three.js) load only when the student asks for 3D once;
   after that the choice is remembered and every datasheet opens with its 3D view. */
const BONE_LA={scapula:'scapula',clavicle:'clavicula',humerus:'humerus',radius:'radius',ulna:'ulna',scaphoid:'os scaphoideum',lunate:'os lunatum',triquetral:'os triquetrum',pisiform:'os pisiforme',trapezium:'os trapezium',trapezoid:'os trapezoideum',capitate:'os capitatum',hamate:'os hamatum',
  mcfirst:'os metacarpi I',mcsecond:'os metacarpi II',mcthird:'os metacarpi III',mcfourth:'os metacarpi IV',mcfifth:'os metacarpi V'};
const FINGER_LA={thumb:'pollicis',index:'indicis',middle:'digiti medii',ring:'digiti anularis',little:'digiti minimi'};
function boneLatin(k){
  if(BONE_LA[k])return BONE_LA[k];
  const [ph,f]=k.split('-');return `phalanx ${({proximal:'proximalis',middle:'media',distal:'distalis'})[ph]} ${FINGER_LA[f]||''}`;
}
let viewer=null,viewerMod=null,viewerToken=0;
function v3dHtml(key){
  const m=MODEL_OF[key];
  if(!m){
    return SHEETS[key]&&SHEETS[key].kind==='ideg'?`<p class="small muted">${u('Az idegek 3D-modellje még nem érhető el: a jelenlegi forrás (BodyParts3D) nem tartalmaz perifériás idegeket.','3D-modell för nerver finns inte än: den nuvarande källan (BodyParts3D) innehåller inga perifera nerver.')}</p>`:'';
  }
  return `<section class="v3d-panel">
    <div class="row" style="justify-content:space-between"><h3>${lb('3D nézet','3D-vy')}</h3>
      <div class="row v3d-tools" hidden>
        <label><input type="checkbox" data-layer="bone" checked> ${u('Csontok','Skelett')}</label>
        <label><input type="checkbox" data-layer="muscle" checked> ${u('Izmok','Muskler')}</label>
        <button class="btn ghost" type="button" data-v3d-reset>${u('Nézet visszaállítása','Återställ vy')}</button></div></div>
    <div class="v3d"></div>
    <p class="small muted v3d-pick" role="status">${u('Forgatás: húzás · Nagyítás: görgetés vagy csippentés · Koppints egy részre a nevéért.','Rotera: dra · Zooma: scrolla eller nyp · Tryck på en del för att se namnet.')}</p>
    <p class="small muted">3D: <a href="${esc(m.sourceUrl)}" target="_blank" rel="noopener">${esc(m.sourceName)}</a> · ${esc(m.attribution)} · <a href="${esc(m.licenseUrl)}" target="_blank" rel="noopener">${esc(m.license)}</a> · ${u('módosítva','bearbetad')}</p>
  </section>`;
}
async function mount3d(root,key){
  const box=root.querySelector('.v3d');
  if(viewer){viewer.dispose();viewer=null}
  if(!box)return;
  const token=++viewerToken,m=MODEL_OF[key];
  if(!store.get('v3d',false)){
    box.innerHTML=`<div class="v3d-intro"><button class="btn primary" type="button">${u('3D nézet betöltése','Läs in 3D-vy')}</button><span class="small muted">${u(`Egyszeri letöltés, kb. ${m.sizeMB} MB; utána offline is működik.`,`Engångsnedladdning, cirka ${m.sizeMB} MB; sedan fungerar den även offline.`)}</span></div>`;
    box.querySelector('button').onclick=()=>{store.set('v3d',true);mount3d(root,key)};
    return;
  }
  box.innerHTML=`<p class="muted small v3d-intro">${u('3D-modell betöltése…','Läser in 3D-modell…')}</p>`;
  try{
    viewerMod=viewerMod||await import(new URL('js/viewer3d.js',document.baseURI).href);
    if(token!==viewerToken||!document.body.contains(box))return;
    const v=await viewerMod.mountViewer(box,{modelId:m.id,structure:key});
    if(token!==viewerToken){v.dispose();return}
    viewer=v;
    const panel=box.closest('.v3d-panel'),tools=panel.querySelector('.v3d-tools');tools.hidden=false;
    tools.querySelectorAll('[data-layer]').forEach(c=>c.onchange=()=>viewer.setLayer(c.dataset.layer,c.checked));
    tools.querySelector('[data-v3d-reset]').onclick=()=>viewer.resetView();
    box.addEventListener('v3d-pick',e=>{
      const d=e.detail,out=panel.querySelector('.v3d-pick');
      if(!d){out.textContent=u('Nincs kijelölt rész.','Ingen del vald.');return}
      if(d.kind==='muscle'&&SHEETS[d.key]){const t=SHEETS[d.key];out.innerHTML=`<b class="la">${esc(t.la)}</b> · ${esc(lang==='sv'?t.sv:t.hu)}${d.key!==key?` · <a href="#${moduleRoute(STRUCT_MODULE[d.key])}" data-open-sheet="${esc(d.key)}">${u('Adatlap','Faktablad')}</a>`:''}`;
        const a=out.querySelector('[data-open-sheet]');if(a)a.onclick=()=>openSheet(d.key);}
      else out.innerHTML=`<b class="la">${esc(boneLatin(d.key))}</b>`;
    });
  }catch(err){
    if(token!==viewerToken)return;
    box.innerHTML=`<p class="small muted v3d-intro">${u('A 3D nézet nem tölthető be ezen az eszközön (WebGL szükséges), vagy nincs internetkapcsolat az első letöltéshez.','3D-vyn kan inte läsas in på den här enheten (WebGL krävs), eller så saknas internet för den första nedladdningen.')}</p>`;
  }
}
// open a structure's datasheet in whichever module page shows it
function openSheet(id){
  const mid=STRUCT_MODULE[id];
  if(mid==='vall')modState.sheet=id;else if(mid==='plexus')plexSel=id;else modStateFor(mid).sheet=id;
}

/* ============================== PROGRESS TRANSFER ==============================
   Moves quiz progress and favourites between devices as a JSON file until
   account-based sync exists. Import merges: per question it keeps the record
   with more answers (ties: the later due date). */
function exportProgress(){
  const data={app:'anatomia360',format:1,exportedAt:new Date().toISOString(),srs,favs:[...favs],lang};
  const blob=new Blob([JSON.stringify(data,null,1)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=`anatomia360-progress-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function mergeProgress(data){
  if(!data||data.app!=='anatomia360'||data.format!==1||typeof data.srs!=='object')throw new Error('format');
  let added=0,updated=0;
  Object.entries(data.srs).forEach(([id,r])=>{
    if(!r||typeof r.box!=='number'||typeof r.due!=='number')return;
    const cur=srs[id];
    if(!cur){srs[id]=r;added++;return}
    const n=x=>(x.ok||0)+(x.no||0);
    if(n(r)>n(cur)||(n(r)===n(cur)&&r.due>cur.due)){srs[id]=r;updated++}
  });
  (data.favs||[]).forEach(f=>{if(typeof f==='string')favs.add(f)});
  saveSrs();store.set('favs',[...favs]);
  return {added,updated};
}
function transferHtml(){
  return `<section class="card stack"><h2>${lb('Haladás átvitele másik eszközre','Flytta framsteg till en annan enhet')}</h2>
    <p class="muted small">${u('Mentsd el a haladásodat fájlba ezen az eszközön, majd töltsd be a másikon. A betöltés összefésüli a két eszköz eredményeit, semmit nem töröl.','Spara dina framsteg som en fil på den här enheten och läs in den på den andra. Inläsningen slår ihop resultaten från båda enheterna och raderar ingenting.')}</p>
    <div class="row"><button class="btn" id="exportBtn">${u('Mentés fájlba','Spara till fil')}</button>
      <label class="btn" for="importFile" style="cursor:pointer">${u('Betöltés fájlból','Läs in från fil')}</label><input type="file" id="importFile" accept="application/json,.json" hidden>
      <span class="small muted" id="transferMsg" role="status"></span></div></section>`;
}
function bindTransfer(){
  $('#exportBtn').onclick=()=>{exportProgress();$('#transferMsg').textContent=u('Fájl elmentve.','Filen är sparad.')};
  $('#importFile').onchange=async e=>{
    const f=e.target.files[0];if(!f)return;
    try{const {added,updated}=mergeProgress(JSON.parse(await f.text()));
      $('#transferMsg').textContent=u(`Betöltve: ${added} új, ${updated} frissített kérdés.`,`Inläst: ${added} nya, ${updated} uppdaterade frågor.`);
      setTimeout(render,1500);
    }catch(err){$('#transferMsg').textContent=u('Ez nem egy ANATOMIA 360° haladás-fájl.','Det här är ingen framstegsfil från ANATOMIA 360°.')}
    e.target.value='';
  };
}

boot();
