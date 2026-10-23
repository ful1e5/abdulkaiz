export const onRequestGet=({request})=>new Response(JSON.stringify({country:request.cf?.country||''}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
