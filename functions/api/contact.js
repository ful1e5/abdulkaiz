const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
const EMAIL=/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const clean=(s,n)=>String(s).replace(/\s+/g,' ').trim().slice(0,n);
// Optional WhatsApp ping (best effort: a failure here never blocks the lead). Set WA_PROVIDER=meta or callmebot.
async function pingWhatsApp(env,l){
  const p=(env.WA_PROVIDER||'').toLowerCase();if(!p||!env.WA_TO)return;
  try{let r;
    if(p==='callmebot'){
      const text=`New website lead\nName: ${clean(l.name,80)}\nEmail: ${clean(l.email,120)}\n${clean(l.message,500)}`;
      r=await fetch(`https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(env.WA_TO)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(env.CALLMEBOT_KEY||'')}`);
    }else if(p==='meta'&&env.WA_TOKEN&&env.WA_PHONE_ID){
      r=await fetch(`https://graph.facebook.com/v21.0/${env.WA_PHONE_ID}/messages`,{method:'POST',headers:{Authorization:'Bearer '+env.WA_TOKEN,'Content-Type':'application/json'},
        body:JSON.stringify({messaging_product:'whatsapp',to:String(env.WA_TO).replace(/\D/g,''),type:'template',template:{name:env.WA_TEMPLATE||'new_lead',language:{code:env.WA_LANG||'en'},
        components:[{type:'body',parameters:[clean(l.name,80),clean(l.email,120),clean(l.message,400)].map(text=>({type:'text',text}))}]}})});
    }else return;
    if(!r.ok)console.error('WhatsApp ping failed',r.status,await r.text());
  }catch(e){console.error('WhatsApp ping error',e)}
}
export async function onRequestPost({request,env,waitUntil}){
  let b;try{b=await request.json()}catch{return J({ok:false,error:'Invalid request.'},400)}
  if(b.website)return J({ok:true});                      // honeypot: silently drop bots
  const name=String(b.name||'').trim().slice(0,100),email=String(b.email||'').trim().slice(0,200),message=String(b.message||'').trim().slice(0,4000);
  if(!name||!message)return J({ok:false,error:'Please fill in your name and message.'},400);
  if(!EMAIL.test(email))return J({ok:false,error:'Please enter a valid email address.'},400);
  const ip=request.headers.get('CF-Connecting-IP')||'unknown';
  if(env.LEADS&&await env.LEADS.get('rl:'+ip))return J({ok:false,error:'Please wait a minute before sending another message.'},429);
  const lead={name,email,message,ip,country:request.cf?.country||'',page:request.headers.get('Referer')||'',at:new Date().toISOString()};
  let saved=false,sent=false;
  if(env.LEADS){try{await env.LEADS.put('lead:'+lead.at+':'+crypto.randomUUID(),JSON.stringify(lead));await env.LEADS.put('rl:'+ip,'1',{expirationTtl:60});saved=true}catch(e){console.error('KV failed',e)}}
  if(env.RESEND_API_KEY&&env.TO_EMAIL){
    try{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({from:env.FROM_EMAIL||'onboarding@resend.dev',to:[env.TO_EMAIL],reply_to:email,subject:'New website enquiry from '+name,text:`Name: ${name}\nEmail: ${email}\nCountry: ${lead.country}\nPage: ${lead.page}\n\n${message}`})});
      if(r.ok)sent=true;else console.error('Resend error',r.status,await r.text())}catch(e){console.error('Resend failed',e)}}
  if(!saved&&!sent)return J({ok:false,error:'Your message could not be delivered right now.'},502);
  const ping=pingWhatsApp(env,lead);waitUntil?waitUntil(ping):await ping;
  return J({ok:true,saved,emailed:sent});
}
export const onRequest=()=>J({ok:false,error:'Method not allowed.'},405);
