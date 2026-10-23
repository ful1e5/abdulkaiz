(async function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const set=(s,h)=>{const e=$(s);if(e&&h)e.innerHTML=h};
const get=f=>fetch('content/'+f+'.json').then(r=>{if(!r.ok)throw 0;return r.json()}).catch(()=>(window.SEED||{})[f]||{});
const [S,P,T,PR]=await Promise.all(['site','portfolio','testimonials','pricing'].map(get));
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const UP='https://www.upwork.com/freelancers/abdulkaizk',GH='https://github.com/ful1e5',LI='https://www.linkedin.com/in/ful1e5/',RD='https://www.reddit.com/user/ful1e5';
const mail=S.email||'hello@abdulkaiz.com',WA=S.whatsapp||'https://wa.me/qr/23T2H7T6KPADN1';
const UPI='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3.002-2.439-5.453-5.439-5.453z"/></svg>';
const page=location.pathname.split('/').pop()||'index.html';
const nav=[['index.html','Home'],['index.html#services','Services'],['portfolio.html','Portfolio'],['pricing.html','Pricing'],['index.html#reviews','Reviews'],['about.html','About']];
const A=([h,t])=>`<a href="${h}" ${h===page?'class="on"':''}>${t}</a>`;
const soc=[['GitHub',GH],['LinkedIn',LI],['Reddit',RD],['Upwork',UP],['WhatsApp',WA]].map(([n,h])=>`<a class="soc" href="${h}" target="_blank" rel="noopener" aria-label="${n}">${n==='Upwork'?UPI:''}${n}</a>`).join('');
document.body.insertAdjacentHTML('afterbegin',`<header class="nav-wrap"><nav class="nav" aria-label="Main"><a class="logo" href="index.html">Abdulkaiz Khatri</a><ul class="links">${nav.map(n=>`<li>${A(n)}</li>`).join('')}</ul><div class="nav-cta"><a class="uplink" href="${UP}" target="_blank" rel="noopener">${UPI}<span>Hire on Upwork</span></a><button class="btn btn-sm" data-contact>Let's Build</button><button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button></div></nav><div class="mobile" id="mobile">${nav.map(A).join('')}<a href="${UP}" target="_blank" rel="noopener">Hire on Upwork</a></div></header>`);
document.body.insertAdjacentHTML('beforeend',`<footer class="footer"><div class="wa-band"><div class="wa-in"><div><b>Prefer WhatsApp?</b><p>Message me "Hi" and I'll reply personally.</p></div><a class="btn" href="${WA}" target="_blank" rel="noopener">Chat on WhatsApp</a></div></div><div class="foot-grid"><div><b>Abdulkaiz Khatri</b><p>Licensed design engineer and automation expert.</p><div class="socials">${soc}</div></div><div><b>Contact</b><p><a href="mailto:${esc(mail)}">${esc(mail)}</a></p><p>Gujarat, India</p></div><div><b>Pages</b>${[nav[2],nav[3],nav[5]].map(([h,t])=>`<p><a href="${h}">${t}</a></p>`).join('')}</div></div><p class="copy">© ${new Date().getFullYear()} Abdulkaiz Khatri. All rights reserved.</p></footer>
<div class="ov" id="ov" role="dialog" aria-modal="true" aria-label="Contact"><div class="modal"><button class="x" aria-label="Close">×</button><h2>Let's build something great</h2><p>Pick whatever is easiest for you.</p><div class="opts">
<a class="opt" style="--i:0" href="${WA}" target="_blank" rel="noopener"><i>◉</i><span><b>WhatsApp</b><small>Message me "Hi."</small></span></a>
<a class="opt" style="--i:1" href="mailto:${esc(mail)}"><i>✉</i><span><b>Email</b><small>${esc(mail)}</small></span></a>
${/^https?:/.test(S.bookCall||'')?`<a class="opt" style="--i:2" href="${esc(S.bookCall)}" target="_blank" rel="noopener"><i>◷</i><span><b>Book a call</b><small>Pick a time that suits you</small></span></a>`:''}</div>
<p class="or">or send a quick message</p><form class="mform" style="--i:4" novalidate><input name="n" placeholder="Your name" required aria-label="Name" maxlength="100"><input name="e" type="email" placeholder="Your email" required aria-label="Email" maxlength="200"><textarea name="m" rows="3" placeholder="Your site link and one line about your goal" required aria-label="Message" maxlength="4000"></textarea><input class="hp" name="w" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn" type="submit">Send message</button><p class="fst" id="fst" role="status"></p></form></div></div>
<div class="ov" id="sv" role="dialog" aria-modal="true" aria-label="Service details"><div class="modal wide"><button class="x" aria-label="Close">×</button><div id="svb" style="display:contents"></div></div></div>`);
const openOv=(id,f)=>{$(id).classList.add('open');document.body.classList.add('lock');if(f)setTimeout(()=>$(id).querySelector(f)?.focus(),350)};
const closeAll=()=>{$$('.ov.open').forEach(o=>o.classList.remove('open'));document.body.classList.remove('lock')};
document.addEventListener('click',e=>{const c=e.target.closest('[data-contact]');
 if(c){e.preventDefault();closeAll();$('#mobile').classList.remove('open');openOv('#ov',c.dataset.contact==='message'?'textarea,input':'.opt')}
 else if(e.target.classList.contains('ov')||e.target.closest('.x'))closeAll()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
// contact form -> /api/contact (stores lead + emails you); errors are shown inline
const say=(h,err)=>{const s=$('#fst');s.className='fst '+(err?'err':'ok');s.innerHTML=h};
$('.mform').onsubmit=async e=>{e.preventDefault();const f=e.target,b=f.querySelector('button.btn');
 const body={name:f.n.value.trim(),email:f.e.value.trim(),message:f.m.value.trim(),website:f.w.value};
 if(!body.name||!body.message)return say('Please fill in your name and message.',1);
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(body.email))return say('Please enter a valid email address.',1);
 b.disabled=true;b.textContent='Sending…';say('',0);
 try{const r=await fetch('api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.ok)throw new Error(j.error||'Something went wrong.');
  f.reset();say('✓ Thank you! Your message is in, and I will reply soon.',0)}
 catch(err){say(esc(err.message||'Could not send.')+` You can also email <a href="mailto:${esc(mail)}">${esc(mail)}</a>.`,1)}
 finally{b.disabled=false;b.textContent='Send message'}};
const bg=$('.burger');bg.onclick=()=>bg.setAttribute('aria-expanded',$('#mobile').classList.toggle('open'));
$$('.wa-link').forEach(a=>a.href=WA);
$$('[data-t]').forEach(e=>{const v=(S.text||{})[e.dataset.t];if(v)e.textContent=v});

const media=(m,alt)=>!m?'':/\.(mp4|webm)(\?|$)/i.test(m)?`<video src="${esc(m)}" autoplay muted loop playsinline></video>`:`<img src="${esc(m)}" alt="${esc(alt)}" loading="lazy">`;
// hero: photo, chips, rotating logo slots
const hp=S.heroPhoto||S.photo;if(hp)set('#heroPhoto',`<img src="${esc(hp)}" alt="Portrait of Abdulkaiz Khatri">`);
const st=S.stats||[];[[0,'c1'],[2,'c2']].forEach(([i,k])=>{if(st[i]){$('#'+k+'n').textContent=st[i].n+(st[i].suf||'');$('#'+k+'l').textContent=st[i].label}});
const pool=(S.heroLogos||[]).filter(x=>x.logo),sl=$('#slots');
if(sl&&pool.length){const N=14,k=Array(N).fill(0);
 sl.innerHTML=Array.from({length:N},(_,i)=>`<div class="slot"><img src="${esc(pool[i%pool.length].logo)}" alt="${esc(pool[i%pool.length].name)}"></div>`).join('');
 if(pool.length>1&&!reduced){const out=[{opacity:1,transform:'none',filter:'blur(0)'},{opacity:0,transform:'translateY(-26px)',filter:'blur(10px)'}],inn=[{opacity:0,transform:'translateY(26px)',filter:'blur(10px)'},{opacity:1,transform:'none',filter:'blur(0)'}];
  $$('.slot img').forEach((im,i)=>{const run=async()=>{const a=im.animate(out,{duration:700,easing:'ease-in',fill:'forwards'});await a.finished;k[i]++;const p=pool[(i+k[i])%pool.length];im.src=p.logo;im.alt=p.name;const b=im.animate(inn,{duration:700,easing:'ease-out'});a.cancel();await b.finished;setTimeout(run,3200)};setTimeout(run,1800+i*320)})}}
set('#stats',st.map(s=>`<div><b data-count="${s.n}" data-suf="${esc(s.suf||'')}">0</b><span>${esc(s.label)}</span></div>`).join(''));
// video
const v=S.video||{};if($('#video')){const ph=`<div class="vph"><div><div class="play">▶</div><b>${esc(v.title||'Meet Abdulkaiz')}</b></div></div>`,yt=(v.src||'').match(/(?:youtu\.be\/|v=)([\w-]{11})/);
 $('#video').innerHTML=!v.src?ph:yt?`<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" title="${esc(v.title)}" allow="fullscreen; picture-in-picture" loading="lazy"></iframe>`:`<video src="${esc(v.src)}" poster="${esc(v.poster||'')}" controls preload="metadata" playsinline></video>`;
 $('#video video')?.addEventListener('error',()=>$('#video').innerHTML=ph)}
// services
const sv=S.services||[];
set('#services-grid',sv.map((s,i)=>`<button class="scard" data-svc="${i}" aria-label="${esc(s.title)} details"><div class="smedia">${media(s.media,s.title)||String(i+1).padStart(2,'0')}</div><div class="sbody"><h3>${esc(s.title)}</h3><p>${esc(s.summary)}</p><b>Explore →</b></div></button>`).join(''));
$$('.scard').forEach(c=>c.onclick=()=>{const s=sv[c.dataset.svc];set('#svb',`<div class="smedia">${media(s.media,s.title)||'✦'}</div><div class="svt"><p class="eyebrow">✦ Service</p><h2>${esc(s.title)}</h2><p>${esc(s.details||s.summary)}</p><ul>${(s.features||[]).map(f=>`<li>${esc(f)}</li>`).join('')}</ul><button class="btn" data-contact>Plan My Project</button></div>`);openOv('#sv','.btn')});
// portfolio, marquee, gallery
const ps=P.projects||[],tone=i=>['#fff','#111','#e9e9e9','#333'][i%4],dark=i=>i%4==1||i%4==3;
const tile=(p,i)=>`<div class="tile" style="--i:${i};background:${p.image?`url('${esc(p.image)}') center/cover`:tone(i)};color:${dark(i)?'#fff':'#111'}" role="img" aria-label="${esc(p.title)}">${p.image?'':esc(p.title)}</div>`;
const tt=ps.map(tile).join('');set('#track',tt+tt+tt);
const lim=+($('#work-grid')?.dataset.limit)||99;
set('#work-grid',ps.slice(0,lim).map((p,i)=>{const h=`<div class="pimg ${p.image?'':'ph'}" style="${p.image?'':`background:${tone(i)};color:${dark(i)?'#fff':'#111'}`}">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.title)} project by Abdulkaiz Khatri" loading="lazy">`:esc(p.title)}</div><div class="pbody"><h3>[ ${String(i+1).padStart(2,'0')} ] ${esc(p.title)}</h3><p>${esc(p.summary)}</p>${p.result?`<small>Result: ${esc(p.result)}</small>`:''}</div>`;return p.url?`<a class="pcard" href="${esc(p.url)}" target="_blank" rel="noopener">${h}</a>`:`<article class="pcard">${h}</article>`}).join(''));
set('#gallery',ps.filter(p=>p.image).slice(0,6).map(p=>`<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`).join(''));
set('#steps',(S.process||[]).map((s,i)=>`<div class="step"><i>${String(i+1).padStart(2,'0')}</i><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join(''));
set('#approach',(S.approach||[]).map((a,i)=>`<article class="card"><span class="num">${String(i+1).padStart(2,'0')}</span><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></article>`).join(''));
// pricing: amounts are stored in dollars and adjusted to the visitor's region (no currency label shown)
if($('#plans-web')){
 const REG=PR.regions||{};
 const country=async()=>{try{const j=await (await fetch('api/region')).json();if(j.country)return j.country}catch{}
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';if(/Kolkata|Calcutta/.test(tz))return'IN';return((navigator.language||'').split('-')[1]||'').toUpperCase()};
 const c=await country(),mult=(()=>{for(const t of REG.tiers||[])if((t.countries||'').split(',').map(x=>x.trim()).includes(c))return t.mult;return REG.default??1})();
 const fmt=n=>{const s=n>=1000?50:n>=100?10:5;return '$'+(Math.round(n/s)*s).toLocaleString('en-US')};
 const IC=['<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>','<circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="7" cy="17" r="3"/><path d="M17 14v6M14 17h6"/>','<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z"/>','<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>','<path d="M4 20L16 8M14 4l2 2M18 8l2 2M6 6l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>'];
 const CK='<path d="M5 12.5l4.5 4.5L19 7"/>';
 const plan=p=>`<article class="plan ${p.popular?'pop':''}"><span class="tagp">${esc(p.name)}</span><div class="price"><b>${fmt(p.amount*mult)}</b><small>${p.from?'starting at<br>':''}${esc(p.unit)}</small></div><p class="pnote">${esc(p.note||'')}</p><button class="btn ${p.popular?'':'btn-soft'}" data-contact>Book a Call</button><button class="more" data-contact="message">Send Me a Message</button><ul>${(p.features||[]).map((f,i)=>`<li><svg viewBox="0 0 24 24" aria-hidden="true">${p.popular?IC[i%IC.length]:CK}</svg>${esc(f)}</li>`).join('')}</ul></article>`;
 set('#plans-web',(PR.websites||[]).map(plan).join(''));set('#plans-ret',(PR.retainers||[]).map(plan).join(''));
 set('#wnote',esc(PR.websiteNote||''));set('#rnote',esc(PR.retainerNote||''))}
// about text, timelines
const paras=t=>(t||'').split(/\n\s*\n/).filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join('');
set('#story',paras(S.story));set('#bio',paras(S.bio));
if(S.photo)set('#photo',`<img src="${esc(S.photo)}" alt="Portrait of Abdulkaiz Khatri" loading="lazy">`);
const tl=a=>(a||[]).map(x=>`<div class="ti reveal"><h3>${esc(x.title)}</h3><div class="org">${esc(x.org)}</div><div class="when">${esc(x.when)}${x.place?' · '+esc(x.place):''}${x.grade?' · Grade: '+esc(x.grade):''}</div>${x.text?`<p>${esc(x.text)}</p>`:''}${x.skills?`<span class="chip2">${esc(x.skills)}</span>`:''}</div>`).join('');
set('#exp',tl(S.experience));set('#edu',tl(S.education));
// 5-star reviews only
const sub=r=>[r.team&&!r.team.toLowerCase().startsWith((r.name||'').split(' ')[0].toLowerCase())?r.team:'',r.project||r.role||''].filter(Boolean).join(' · ');
const rv=(T.reviews||[]).filter(r=>Number(r.rating)===5&&r.show!==false),stars='★★★★★',box=$('#review');let n=0;
if(box&&rv.length){const show=()=>{const r=rv[n];box.innerHTML=`<div class="avatar">${r.photo?`<img src="${esc(r.photo)}" alt="">`:esc((r.name||'C')[0])}</div><div><div class="stars">${stars}</div><blockquote>${esc(r.quote).replace(/\n\n/g,'<br><br>')}</blockquote><cite>${esc(r.name)}${r.website?` <a class="vis" href="${esc(r.website)}" target="_blank" rel="noopener" aria-label="Client website">↗</a>`:''}<span>${esc(sub(r))}</span></cite></div>`};
 const go=k=>{box.classList.add('fade');setTimeout(()=>{n=(n+k+rv.length)%rv.length;show();box.classList.remove('fade')},300)};
 show();$('#prev').onclick=()=>go(-1);$('#next').onclick=()=>go(1);if(rv.length>1)setInterval(()=>go(1),9000)}
// motion
const cu=e=>{const T=+e.dataset.count,suf=e.dataset.suf||'',s=performance.now();(function f(now){const p=Math.min((now-s)/1400,1);e.textContent=Math.round(T*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(f)})(s)};
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');x.target.querySelectorAll('[data-count]').forEach(cu);io.unobserve(x.target)}}),{threshold:.12});
$$('.reveal,.marquee').forEach(e=>io.observe(e));
const px=$$('.px');let tick;if(px.length&&!reduced)addEventListener('scroll',()=>{if(tick)return;tick=requestAnimationFrame(()=>{tick=0;px.forEach(e=>{const r=e.getBoundingClientRect();e.style.setProperty('--py',((r.top+r.height/2-innerHeight/2)*-(+e.dataset.px)).toFixed(1)+'px')})})},{passive:true});
})();
