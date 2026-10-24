(async function () {
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)],
    esc = (s) =>
      String(s ?? '').replace(
        /[&<>"]/g,
        (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
      );
  const set = (s, h) => {
    const e = $(s);
    if (e && h) e.innerHTML = h;
  };
  const get = (f) =>
    fetch('content/' + f + '.json')
      .then((r) => {
        if (!r.ok) throw 0;
        return r.json();
      })
      .catch(() => (window.SEED || {})[f] || {});
  const [S, P, T, PR] = await Promise.all(
    ['site', 'portfolio', 'testimonials', 'pricing'].map(get),
  );
  const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const UP = 'https://www.upwork.com/freelancers/abdulkaizk',
    GH = 'https://github.com/ful1e5',
    LI = 'https://www.linkedin.com/in/ful1e5/',
    RD = 'https://www.reddit.com/user/ful1e5';
  const mail = S.email || 'hello@abdulkaiz.com';
  const UPI =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3.002-2.439-5.453-5.439-5.453z"/></svg>';
  // rating star: the fill carries the shape, the stroke rounds every point off
  // (paint-order keeps the stroke underneath, so the star grows evenly)
  const STAR =
    '<svg class="icon-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>';
  const STARS = STAR.repeat(5);
  // inline stroke icons for services and feature bullets
  const ICONS = {
    monitor:
      '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13.5l9 5 9-5"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    palette:
      '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="9.5" r="1.1"/><circle cx="15" cy="9.5" r="1.1"/><circle cx="9.5" cy="15" r="1.1"/><circle cx="15" cy="15" r="1.1"/>',
    share:
      '<circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.3 10.7l7.4-3.4M8.3 13.3l7.4 3.4"/>',
    cloud:
      '<path d="M7 18a4 4 0 0 1 .6-8 5.5 5.5 0 0 1 10.5 1.4A3.6 3.6 0 0 1 17.5 18H7z"/>',
    shield:
      '<path d="M12 3l7 3v5.5c0 4.2-2.9 8-7 9.5-4.1-1.5-7-5.3-7-9.5V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  };
  const icon = (k, cls = 'svc-icon') =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[k] || ICONS.check}</svg>`;
  // brand mark (from the supplied logo), drawn with currentColor so it adapts to the header surface
  const LOGO =
    '<svg class="logo-mark" viewBox="0 0 254 83" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M23.7578 0L5.53395 0.112179L0.101611 58.9266C-1.11269 72.073 8.69747 82.843 21.9831 82.843C29.8517 82.843 37.6346 78.9968 42.8598 72.6327L52.541 62.5107L68.7643 82.7772H94.5728L65.2691 49.1998L92.2112 21.0261C93.4875 19.4182 95.4549 18.3693 97.3336 18.4393C101.021 18.5797 103.398 21.2365 103.139 24.8026L102.998 35.7578L89.3129 35.6455L76.434 49.132L80.4411 53.6025L102.752 53.7555L102.639 58.7959C101.425 71.9449 111.24 82.5245 124.52 82.7123L143.891 83C143.891 83 156.609 82.0343 161.744 75.9471C165.122 73.6592 169.353 62.7705 169.837 59.7801L175.517 27.0764L157.303 26.9641L151.595 59.7563H151.525C150.983 61.6195 149.824 63.2273 148.302 64.365L126.687 64.5896C123 64.4492 120.624 61.7924 120.882 58.2247L121.401 24.2073C122.614 11.0601 112.801 0.290759 99.5209 0.290759C91.6503 0.290759 83.8694 4.13748 78.643 10.5013L29.2414 62.0386C27.9439 63.7173 25.9251 64.6961 24.1157 64.6255C20.4296 64.4851 18.053 61.8288 18.3101 58.2622L23.7578 0ZM180.58 0L162.353 0.112179L159.366 16.7646L177.564 16.9049L180.58 0ZM236.036 0.140344L193.143 0.280667L190.715 17.3778L233.853 17.2374C234.506 17.2935 234.841 17.4297 235.051 17.6697C235.192 17.8129 235.214 18.2592 235.268 18.6045C235.119 18.7799 234.915 18.9961 234.707 19.1799C234.678 19.1825 234.678 19.2221 234.65 19.236L189.885 44.9958L189.772 45.1081C185.946 47.6127 182.976 51.165 181.244 55.1913C180.48 56.6456 180.092 58.3696 179.709 60.2036C179.331 62.0661 179.073 63.865 179.045 65.1181C178.932 66.7878 179.284 68.4098 179.882 69.9244C181.589 77.2261 188.12 82.5296 196.253 82.4998L243.12 82.3595L245.548 65.26L198.442 65.4003C197.792 65.3442 197.445 65.2053 197.235 64.9695C197.039 64.7294 196.858 64.3365 196.896 63.6403V63.6121C196.896 63.6095 196.896 63.6095 196.896 63.5839C196.854 63.6961 196.84 63.7243 196.981 63.4716L197.065 63.3593L197.094 63.2471C197.235 61.516 197.384 61.1887 198.415 59.9123L242.721 34.4202L242.834 34.3079C246.664 31.8007 249.632 28.2424 251.362 24.2116C252.498 22.0985 253.231 19.7954 253.348 17.3864C253.46 15.7122 253.105 14.0842 252.506 12.565C250.791 5.27387 244.26 -0.0259513 236.135 0.00463765L236.036 0.140344Z"/></svg>';
  const page = location.pathname.split('/').pop() || 'index.html';
  const nav = [
    ['index.html', 'Home'],
    ['index.html#services', 'Services'],
    ['portfolio.html', 'Portfolio'],
    ['testimonials.html', 'Reviews'],
    ['about.html', 'About'],
  ];
  const A = ([h, t]) =>
    `<a href="${h}" ${h === page ? 'class="on"' : ''}>${t}</a>`;
  const soc = [
    ['GitHub', GH],
    ['LinkedIn', LI],
    ['Reddit', RD],
    ['Upwork', UP],
  ]
    .map(
      ([n, h]) =>
        `<a class="soc" href="${h}" target="_blank" rel="noopener" aria-label="${n}">${n === 'Upwork' ? UPI : ''}${n}</a>`,
    )
    .join('');
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<header class="nav-wrap"><nav class="nav" aria-label="Main"><a class="logo" href="index.html" aria-label="Abdulkaiz Khatri — home">${LOGO}</a><ul class="links">${nav.map((n) => `<li>${A(n)}</li>`).join('')}</ul><div class="nav-cta"><a class="uplink" href="${UP}" target="_blank" rel="noopener">${UPI}<span>Hire on Upwork</span></a><button class="btn btn-sm" data-contact>Let's Build</button><button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button></div></nav><div class="mobile" id="mobile">${nav.map(A).join('')}<a href="${UP}" target="_blank" rel="noopener">Hire on Upwork</a></div></header>`,
  );
  // the header sits on a dark hero only on pages that have one
  if ($('.hero.dark')) document.body.classList.add('has-hero-dark');
  document.body.insertAdjacentHTML(
    'beforeend',
    `<footer class="footer"><div class="foot-brand">${LOGO}</div><div class="foot-grid"><div><b>Abdulkaiz Khatri</b><p>Design engineer and automation specialist.</p><div class="socials">${soc}</div></div><div><b>Contact</b><p><a href="mailto:${esc(mail)}">${esc(mail)}</a></p><p>Gujarat, India</p></div><div><b>Pages</b>${[nav[2], nav[3], nav[4]].map(([h, t]) => `<p><a href="${h}">${t}</a></p>`).join('')}</div></div><p class="copy">© ${new Date().getFullYear()} Abdulkaiz Khatri. All rights reserved.</p></footer>
<div class="ov" id="ov" role="dialog" aria-modal="true" aria-label="Contact"><div class="modal"><button class="x" aria-label="Close">×</button><h2>Let's build something great</h2><p>Pick whatever is easiest for you.</p><div class="opts">
<a class="opt" style="--i:0" href="mailto:${esc(mail)}"><i>✉</i><span><b>Email</b><small>${esc(mail)}</small></span></a>
${/^https?:/.test(S.bookCall || '') ? `<a class="opt" style="--i:1" href="${esc(S.bookCall)}" target="_blank" rel="noopener"><i>◷</i><span><b>Book a call</b><small>Pick a time that suits you</small></span></a>` : ''}</div>
<p class="or">or send a quick message</p><form class="mform" style="--i:2" novalidate><input name="n" placeholder="Your name" required aria-label="Name" maxlength="100"><input name="e" type="email" placeholder="Your email" required aria-label="Email" maxlength="200"><textarea name="m" rows="3" placeholder="Your site link and one line about your goal" required aria-label="Message" maxlength="4000"></textarea><input class="hp" name="w" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn" type="submit">Send message</button><p class="fst" id="fst" role="status"></p></form></div></div>`,
  );
  const openOv = (id, f) => {
    $(id).classList.add('open');
    document.body.classList.add('lock');
    if (f)
      setTimeout(
        () => $(id).querySelector(f)?.focus({ preventScroll: true }),
        350,
      );
  };
  const closeAll = () => {
    const wasService = $('#sv')?.classList.contains('open');
    $$('.ov.open').forEach((o) => o.classList.remove('open'));
    document.body.classList.remove('lock');
    // drop the deep-link hash when leaving the service viewer
    if (wasService && /^#service-/.test(location.hash) && history.replaceState)
      history.replaceState(null, '', location.pathname + location.search);
  };
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-contact]');
    if (c) {
      e.preventDefault();
      closeAll();
      $('#mobile').classList.remove('open');
      openOv(
        '#ov',
        c.dataset.contact === 'message' ? 'textarea,input' : '.opt',
      );
    } else if (e.target.classList.contains('ov') || e.target.closest('.x'))
      closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
  // contact form -> /api/contact (stores lead + emails you); errors are shown inline
  const say = (h, err) => {
    const s = $('#fst');
    s.className = 'fst ' + (err ? 'err' : 'ok');
    s.innerHTML = h;
  };
  $('.mform').onsubmit = async (e) => {
    e.preventDefault();
    const f = e.target,
      b = f.querySelector('button.btn');
    const body = {
      name: f.n.value.trim(),
      email: f.e.value.trim(),
      message: f.m.value.trim(),
      website: f.w.value,
    };
    if (!body.name || !body.message)
      return say('Please fill in your name and message.', 1);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(body.email))
      return say('Please enter a valid email address.', 1);
    // Works on both Cloudflare Pages (api/contact) and static hosts such as GitHub Pages,
    // where the API does not exist: the visitor's mail app opens with the message ready.
    const mailto =
      `mailto:${mail}?subject=` +
      encodeURIComponent('Project enquiry from ' + body.name) +
      '&body=' +
      encodeURIComponent(
        body.message + '\n\n— ' + body.name + ' (' + body.email + ')',
      );
    b.disabled = true;
    b.textContent = 'Sending…';
    say('', 0);
    let delivered = false;
    try {
      const r = await fetch('api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || 'Something went wrong.');
      delivered = true;
      f.reset();
      say('✓ Thank you! Your message is in, and I will reply soon.', 0);
    } catch (err) {
      const msg =
        err.message && err.message !== 'Failed to fetch' ? err.message : '';
      say(
        (msg ? esc(msg) + '. ' : '') +
          `No problem — <a href="${esc(mailto)}">open this message in your email app</a> and hit send. It goes straight to ${esc(mail)}.`,
        1,
      );
    } finally {
      b.disabled = false;
      b.textContent = delivered ? 'Sent' : 'Send message';
    }
  };
  const bg = $('.burger');
  bg.onclick = () =>
    bg.setAttribute('aria-expanded', $('#mobile').classList.toggle('open'));
  $$('[data-t]').forEach((e) => {
    const v = (S.text || {})[e.dataset.t];
    if (v) e.textContent = v;
  });

  const media = (m, alt) =>
    !m
      ? ''
      : /\.(mp4|webm)(\?|$)/i.test(m)
        ? `<video src="${esc(m)}" autoplay muted loop playsinline></video>`
        : `<img src="${esc(m)}" alt="${esc(alt)}" loading="lazy">`;
  // Hero: the specialty line cycles through the list, each phrase arriving on
  // the same slide-up-and-unblur the tool tiles use — up from below, blurring
  // off as it settles, then blurring out upward as the next one comes.
  // #heroRoles carries the same words as plain text for assistive tech and for
  // anyone whose JS never arrives.
  const heroWrite = $('#heroWrite'),
    heroRoles = S.heroRoles || [];
  if (heroWrite && heroRoles.length) {
    const OUT = {
        opacity: [1, 0],
        transform: ['translateY(0)', 'translateY(-16px)'],
        filter: ['blur(0)', 'blur(8px)'],
      },
      IN = {
        opacity: [0, 1],
        transform: ['translateY(16px)', 'translateY(0)'],
        filter: ['blur(8px)', 'blur(0)'],
      };
    const HOLD = 2200; // how long a settled phrase stays up
    let i = 0;
    // one animation at a time: the previous fill would otherwise keep applying
    const play = (kf) => {
      heroWrite.getAnimations().forEach((a) => a.cancel());
      return heroWrite.animate(kf, {
        duration: reduced ? 0 : 620,
        easing: 'ease',
        fill: 'both',
      });
    };
    const cycle = () => {
      heroWrite.textContent = heroRoles[i % heroRoles.length];
      play(IN);
      setTimeout(
        () => {
          play(OUT);
          setTimeout(
            () => {
              i++;
              cycle();
            },
            reduced ? 0 : 620,
          );
        },
        (reduced ? 0 : 620) + HOLD,
      );
    };
    cycle();
  }
  // hero portrait
  if (S.photo)
    set(
      '#heroPhoto',
      `<img src="${esc(S.photo)}" alt="Portrait of Abdulkaiz Khatri">`,
    );
  const st = S.stats || [];
  // headline numbers sit directly under the hero CTA
  set(
    '#heroProof',
    st
      .slice(0, 3)
      .map(
        (s) =>
          `<div><b>${esc(String(s.n) + (s.suf || ''))}</b><span>${esc(s.label)}</span></div>`,
      )
      .join(''),
  );
  // tools: a 2-row grid cycling through the stack. Each tile changes on its own
  // random rhythm — slide up in, fade out with a blur — and never repeats a logo
  // another tile is currently showing. Art is pre-downloaded; name is kept for alt.
  const pool = (S.heroLogos || []).filter((x) => x.logo);
  const toolsGrid = $('#toolsGrid');
  if (toolsGrid && pool.length) {
    const N = Math.min(12, pool.length); // 2 rows of 6 on desktop, 2 of 4 on mobile
    toolsGrid.innerHTML = Array.from(
      { length: N },
      () => '<div class="tool"></div>',
    ).join('');
    const cells = [...toolsGrid.children];
    const OUT = {
        opacity: [1, 0],
        transform: ['translateY(0)', 'translateY(-16px)'],
        filter: ['blur(0)', 'blur(8px)'],
      },
      IN = {
        opacity: [0, 1],
        transform: ['translateY(16px)', 'translateY(0)'],
        filter: ['blur(8px)', 'blur(0)'],
      };
    const anim = (el, kf, delay = 0) =>
      el.animate(kf, { duration: 620, delay, easing: 'ease', fill: 'both' });
    const mark = (t) =>
      `<img src="${esc(t.logo)}" alt="${esc(t.name)}" loading="lazy">`;
    // spread the starting logos so nothing duplicates on first paint
    cells.forEach((c, i) => {
      c.dataset.i = String((i * Math.ceil(pool.length / N)) % pool.length);
      c.innerHTML = mark(pool[+c.dataset.i]);
    });
    if (!reduced) {
      cells.forEach((c, i) => anim(c, IN, i * 45));
      // next index that no other tile is currently showing
      const pick = (cur) => {
        const taken = new Set(cells.map((x) => +x.dataset.i));
        for (let k = 1; k <= pool.length; k++) {
          const j = (cur + k) % pool.length;
          if (!taken.has(j)) return j;
        }
        return (cur + 1) % pool.length;
      };
      cells.forEach((c, i) => {
        const cycle = () => {
          anim(c, OUT);
          setTimeout(() => {
            c.dataset.i = String(pick(+c.dataset.i));
            c.innerHTML = mark(pool[+c.dataset.i]);
            anim(c, IN);
          }, 660);
          // staggered first swap, then an independent random rhythm per tile
          setTimeout(cycle, 4200 + Math.random() * 5200);
        };
        setTimeout(cycle, 3000 + i * 320 + Math.random() * 1800);
      });
    }
  }
  // video — only rendered when a source exists, otherwise the section is dropped
  const v = S.video || {};
  if ($('#video')) {
    const ph = `<div class="vph"><div><div class="play">▶</div><b>${esc(v.title || 'Meet Abdulkaiz')}</b></div></div>`,
      yt = (v.src || '').match(/(?:youtu\.be\/|v=)([\w-]{11})/);
    if (!v.src) {
      ($('#intro') || $('#video')).remove();
    } else {
      $('#video').innerHTML = yt
        ? `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" title="${esc(v.title)}" allow="fullscreen; picture-in-picture" loading="lazy"></iframe>`
        : `<video src="${esc(v.src)}" poster="${esc(v.poster || '')}" controls preload="metadata" playsinline></video>`;
      $('#video video')?.addEventListener(
        'error',
        () => ($('#video').innerHTML = ph),
      );
    }
  }
  // region-scaled pricing — used by the service rail, panels and plan cards
  const REG = PR.regions || {};
  const country = async () => {
    try {
      const j = await (await fetch('api/region')).json();
      if (j.country) return j.country;
    } catch {}
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (/Kolkata|Calcutta/.test(tz)) return 'IN';
    return ((navigator.language || '').split('-')[1] || '').toUpperCase();
  };
  const visitorCountry = await country(),
    mult = (() => {
      for (const t of REG.tiers || [])
        if (
          (t.countries || '')
            .split(',')
            .map((x) => x.trim())
            .includes(visitorCountry)
        )
          return t.mult;
      return REG.default ?? 1;
    })();
  const fmt = (n) => {
    const s = n >= 1000 ? 50 : n >= 100 ? 10 : 5;
    return '$' + (Math.round(n / s) * s).toLocaleString('en-US');
  };
  const cheapest = (s) => {
    const a = (s.plans || []).map((p) => +p.amount).filter((n) => isFinite(n));
    return a.length ? Math.min(...a) : null;
  };
  // A plan card. In the services section each card is a tab panel behind the
  // plan switcher, so it can be given its tab ids and start hidden.
  const planCard = (p, tab) =>
    `<article class="plan ${p.popular ? 'featured-glow' : ''}"${
      tab
        ? ` role="tabpanel" id="${tab.id}" aria-labelledby="${tab.lab}"${tab.hidden ? ' hidden' : ''}`
        : ''
    }>${p.popular ? '<span class="pop-badge">Most popular</span>' : ''}<h3 class="tagp">${esc(p.name)}</h3><div class="price"><b>${fmt(p.amount * mult)}</b><small>${p.from ? 'starting at<br>' : ''}${esc(p.unit)}</small></div><p class="plan-desc">${esc(p.desc || '')}</p><p class="pnote">${esc(p.note || '')}</p><button class="btn" data-contact>Book a call</button><button class="more" data-contact="message">Send me a message</button><ul>${(p.features || []).map((f) => `<li>${icon('check', 'icon-check')}${esc(f)}</li>`).join('')}</ul></article>`;
  // "What I do" — one scroll-driven section. The rail on the left tracks which
  // service panel is in view; the active service sets the section's accent colour.
  const sv = S.services || [];
  const rail = $('#svcRail'),
    panels = $('#svcPanels'),
    svcSec = $('#services'),
    svcGlow = $('#svcGlow');
  if (rail && panels && sv.length) {
    const from = (s) => {
      const p = cheapest(s);
      return p != null ? 'from ' + fmt(p * mult) : '';
    };
    rail.innerHTML = sv
      .map(
        (s, i) =>
          `<button class="rail-item" data-rail="${i}" aria-label="${esc(s.title)}">${icon(s.icon)}<span>${esc(s.title)}</span><b>${from(s)}</b></button>`,
      )
      .join('');
    // Details on the left, one compact pricing card on the right. The card swaps
    // between plans instead of stacking them, so every service is the same height
    // and the colour change lands on an even scroll rhythm.
    panels.innerHTML = sv
      .map((s, i) => {
        const sid = esc(s.id || i),
          plans = s.plans || [];
        // one plan means there is nothing to switch between, so no control
        const switcher =
          plans.length > 1
            ? `<div class="plan-switch" role="tablist" aria-label="${esc(s.title)} plans">${plans
                .map(
                  (p, k) =>
                    `<button type="button" class="plan-tab${k ? '' : ' on'}" role="tab" id="ptab-${sid}-${k}" aria-controls="ppanel-${sid}-${k}" aria-selected="${k ? 'false' : 'true'}" tabindex="${k ? '-1' : '0'}">${esc(p.name)}</button>`,
                )
                .join('')}</div>`
            : '';
        const cards = plans
          .map((p, k) =>
            planCard(p, {
              id: `ppanel-${sid}-${k}`,
              lab: `ptab-${sid}-${k}`,
              hidden: k > 0,
            }),
          )
          .join('');
        return `<article class="svc-panel" id="service-${sid}" data-panel="${i}" style="--panel-accent:${esc(s.accent || '#4F6BFF')}">
            <div class="svc-body">
              <div class="svc-media">${
                media(s.media, s.title) ||
                `<span class="svc-glyph">${icon(s.icon)}</span>`
              }</div>
              <p class="eyebrow">${icon(s.icon, 'icon-inline')}${esc(s.title)}</p>
              <h3>${esc(s.title)}</h3>
              <p class="svc-lead">${esc(s.details || s.summary)}</p>
              <h4 class="svc-sub">What's included</h4>
              <ul class="svc-list">${(s.features || [])
                .map((f) => `<li>${icon('check', 'icon-check')}${esc(f)}</li>`)
                .join('')}</ul>
              <div class="svc-cta"><button class="btn" data-contact>${esc(s.cta || 'Start a project')}</button></div>
            </div>
            ${
              plans.length
                ? `<aside class="svc-price" aria-label="Pricing for ${esc(s.title)}">
              <h4 class="svc-sub">Pricing</h4>
              ${switcher}
              <div class="svc-plans">${cards}</div>
            </aside>`
                : ''
            }
          </article>`;
      })
      .join('');
    // plan switcher — a roving-tabindex tablist, one card visible at a time
    panels.querySelectorAll('.plan-switch').forEach((sw) => {
      const tabs = [...sw.querySelectorAll('.plan-tab')],
        cards = [...sw.parentElement.querySelectorAll('.svc-plans > .plan')],
        last = tabs.length - 1;
      const sel = (k, focus) => {
        tabs.forEach((t, j) => {
          const on = j === k;
          t.classList.toggle('on', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
        });
        cards.forEach((c, j) => (c.hidden = j !== k));
        if (focus) tabs[k].focus();
      };
      tabs.forEach((t, k) => {
        t.onclick = () => sel(k);
        t.onkeydown = (e) => {
          const to =
            e.key === 'ArrowRight'
              ? (k + 1) % tabs.length
              : e.key === 'ArrowLeft'
                ? (k - 1 + tabs.length) % tabs.length
                : e.key === 'Home'
                  ? 0
                  : e.key === 'End'
                    ? last
                    : -1;
          if (to < 0) return;
          e.preventDefault();
          sel(to, true);
        };
      });
    });
    const railItems = [...rail.children],
      els = [...panels.children];
    let current = -1;
    // `sync` is false for the initial pick: rewriting the URL with a hash on load
    // makes the browser jump to that anchor before the visitor has scrolled.
    const activate = (i, sync = true) => {
      if (i === current || !els[i]) return;
      current = i;
      railItems.forEach((b, k) => b.classList.toggle('on', k === i));
      els.forEach((e, k) => e.classList.toggle('on', k === i));
      const acc = sv[i].accent || '#4F6BFF';
      svcSec.style.setProperty('--svc-accent', acc);
      if (svcGlow) svcGlow.dataset.side = i % 2 ? 'right' : 'left';
      if (sync && history.replaceState)
        history.replaceState(null, '', '#service-' + sv[i].id);
    };
    railItems.forEach(
      (b, i) =>
        (b.onclick = () =>
          els[i].scrollIntoView({
            behavior: reduced ? 'auto' : 'smooth',
            block: 'center',
          })),
    );
    // the panel nearest the viewport centre wins
    let hold = false; // set while a deep link is settling, so scroll can't override it
    const pick = (sync = true) => {
      if (hold) return;
      const mid = innerHeight / 2;
      let best = 0,
        dist = Infinity;
      els.forEach((e, i) => {
        const r = e.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      activate(best, sync);
    };
    let ticking;
    const onScroll = () => {
      if (ticking) return;
      ticking = requestAnimationFrame(() => {
        ticking = 0;
        pick();
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    pick(false);
    // #service-<id> deep links scroll to and select that service. The jump is
    // instant and holds the scroll-driven pick off briefly, so the landing
    // position can't immediately override the service that was asked for.
    const goHash = () => {
      const m = (location.hash || '').match(/^#service-(.+)$/);
      if (!m) return;
      const i = sv.findIndex((s) => String(s.id) === m[1]);
      if (i < 0) return;
      hold = true;
      activate(i);
      els[i].scrollIntoView({ behavior: 'auto', block: 'center' });
      setTimeout(() => {
        hold = false;
      }, 500);
    };
    goHash();
    addEventListener('hashchange', goHash);
  }

  // portfolio, marquee, gallery
  const ps = P.projects || [],
    tone = (i) => ['#fff', '#111', '#e9e9e9', '#333'][i % 4],
    dark = (i) => i % 4 == 1 || i % 4 == 3;
  const tile = (p, i) =>
    `<div class="tile" style="--i:${i};background:${p.image ? `url('${esc(p.image)}') center/cover` : tone(i)};color:${dark(i) ? '#fff' : '#111'}" role="img" aria-label="${esc(p.title)}">${p.image ? '' : esc(p.title)}</div>`;
  const tt = ps.map(tile).join('');
  set('#track', tt + tt + tt);
  const lim = +$('#work-grid')?.dataset.limit || 99;
  set(
    '#work-grid',
    ps
      .slice(0, lim)
      .map((p, i) => {
        const h = `<div class="pimg ${p.image ? '' : 'ph'}" style="${p.image ? '' : `background:${tone(i)};color:${dark(i) ? '#fff' : '#111'}`}">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)} project by Abdulkaiz Khatri" loading="lazy">` : esc(p.title)}</div><div class="pbody"><h3>[ ${String(i + 1).padStart(2, '0')} ] ${esc(p.title)}</h3><p>${esc(p.summary)}</p>${p.result ? `<small>Result: ${esc(p.result)}</small>` : ''}</div>`;
        return p.url
          ? `<a class="pcard" href="${esc(p.url)}" target="_blank" rel="noopener">${h}</a>`
          : `<article class="pcard">${h}</article>`;
      })
      .join(''),
  );
  set(
    '#gallery',
    ps
      .filter((p) => p.image)
      .slice(0, 6)
      .map(
        (p) =>
          `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`,
      )
      .join(''),
  );
  set(
    '#steps',
    (S.process || [])
      .map(
        (s, i) =>
          `<div class="step"><i>${String(i + 1).padStart(2, '0')}</i><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`,
      )
      .join(''),
  );
  set(
    '#approach',
    (S.approach || [])
      .map(
        (a, i) =>
          `<article class="card"><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></article>`,
      )
      .join(''),
  );
  // FAQ — half image, half list
  set(
    '#faqList',
    (PR.faq || [])
      .map(
        (f) =>
          `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`,
      )
      .join(''),
  );
  // about text, timelines
  const paras = (t) =>
    (t || '')
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((x) => `<p>${esc(x)}</p>`)
      .join('');
  set('#story', paras(S.story));
  set('#bio', paras(S.bio));
  if (S.photo)
    set(
      '#photo',
      `<img src="${esc(S.photo)}" alt="Portrait of Abdulkaiz Khatri" loading="lazy">`,
    );
  // the work I turn down — each row marked so the list reads as a boundary
  set(
    '#ethicsList',
    (S.ethicsExcluded || [])
      .map((x) => `<li>${icon('ban', 'icon-ban')}${esc(x)}</li>`)
      .join(''),
  );
  const tl = (a) =>
    (a || [])
      .map(
        (x) =>
          `<div class="ti reveal"><h3>${esc(x.title)}</h3><div class="org">${esc(x.org)}</div><div class="when">${esc(x.when)}${x.place ? ' · ' + esc(x.place) : ''}${x.grade ? ' · Grade: ' + esc(x.grade) : ''}</div>${x.text ? `<p>${esc(x.text)}</p>` : ''}${x.skills ? `<span class="chip2">${esc(x.skills)}</span>` : ''}</div>`,
      )
      .join('');
  set('#exp', tl(S.experience));
  set('#edu', tl(S.education));
  // 5-star reviews only
  const sub = (r) =>
    [
      r.team &&
      !r.team
        .toLowerCase()
        .startsWith((r.name || '').split(' ')[0].toLowerCase())
        ? r.team
        : '',
      r.project || r.role || '',
    ]
      .filter(Boolean)
      .join(' · ');
  const rv = (T.reviews || []).filter(
    (r) => Number(r.rating) === 5 && r.show !== false,
  );
  // One card renderer feeds both walls of reviews: the home page takes the
  // newest few (data-limit), the reviews page takes all of them.
  const QUOTE_ICON =
    '<svg class="icon-quote" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 5.2C6.3 6.3 4 9.3 4 12.9v5.9h6.6v-6.6H7.2c0-2 1.1-3.6 3-4.4l-.6-2.6zm10 0c-3.3 1.1-5.6 4.1-5.6 7.7v5.9h6.6v-6.6h-3.4c0-2 1.1-3.6 3-4.4l-.6-2.6z"/></svg>';
  const rcard = (r, featured) =>
    `<article class="tcard${featured ? ' featured-glow' : ''} reveal">${
      featured
        ? `<div class="tcard-top">${QUOTE_ICON}<span class="tcard-flag">Featured review</span></div>`
        : ''
    }<div class="stars" role="img" aria-label="Rated ${Number(r.rating)} out of 5">${STARS}</div><blockquote>${esc(r.quote).replace(/\n\n/g, '<br><br>')}</blockquote><cite>${esc(r.name)}${r.website ? ` <a class="vis" href="${esc(r.website)}" target="_blank" rel="noopener" aria-label="Client website">↗</a>` : ''}<span>${esc(sub(r))}</span></cite></article>`;
  ['#reviewGrid', '#tgrid'].forEach((sel) => {
    const box = $(sel);
    if (!box || !rv.length) return;
    box.innerHTML = rv
      .slice(0, +box.dataset.limit || rv.length)
      .map((r, i) => rcard(r, i === 0))
      .join('');
  });
  // header scroll state: full-size at top, floating pill on scroll
  const navWrap = document.querySelector('.nav-wrap');
  const onScroll = () => {
    if (navWrap) navWrap.classList.toggle('scrolled', window.scrollY > 24);
  };
  // publish the unscrolled header height so the hero sits flush beneath it
  const setNavH = () => {
    if (!navWrap) return;
    navWrap.classList.remove('scrolled');
    document.documentElement.style.setProperty(
      '--nav-h',
      navWrap.offsetHeight + 'px',
    );
    onScroll();
  };
  setNavH();
  window.addEventListener('resize', setNavH, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  // motion
  const cu = (e) => {
    const T = +e.dataset.count,
      suf = e.dataset.suf || '',
      s = performance.now();
    (function f(now) {
      const p = Math.min((now - s) / 1400, 1);
      e.textContent = Math.round(T * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(f);
    })(s);
  };
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((x) => {
        if (x.isIntersecting) {
          x.target.classList.add('in');
          x.target.querySelectorAll('[data-count]').forEach(cu);
          io.unobserve(x.target);
        }
      }),
    { threshold: 0.12 },
  );
  $$('.reveal,.marquee').forEach((e) => io.observe(e));
  // reveal anything the observer can't catch: content already on screen at load,
  // and the target of a #hash deep link (the browser scrolls after this runs)
  const revealInView = () =>
    $$('.reveal:not(.in)').forEach((e) => {
      const r = e.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) e.classList.add('in');
    });
  const revealHash = () => {
    const t = location.hash ? document.querySelector(location.hash) : null;
    if (t?.classList.contains('reveal')) t.classList.add('in');
  };
  revealInView();
  revealHash();
  setTimeout(() => {
    revealInView();
    revealHash();
  }, 350);
  addEventListener('hashchange', () => {
    revealInView();
    revealHash();
  });
  // nav links carry their filename (index.html#services) so they work from any
  // page. When the target is on the page we're already on, scroll to it
  // rather than reloading.
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href*="#"]');
    if (!a || a.target === '_blank') return;
    const url = new URL(a.getAttribute('href'), location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    let t = null;
    try {
      t = document.querySelector(url.hash);
    } catch {
      t = null;
    }
    if (!t) return;
    e.preventDefault();
    history.pushState(null, '', url.hash);
    t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });
  const px = $$('.px');
  let tick;
  if (px.length && !reduced)
    addEventListener(
      'scroll',
      () => {
        if (tick) return;
        tick = requestAnimationFrame(() => {
          tick = 0;
          px.forEach((e) => {
            const r = e.getBoundingClientRect();
            e.style.setProperty(
              '--py',
              (
                (r.top + r.height / 2 - innerHeight / 2) *
                -+e.dataset.px
              ).toFixed(1) + 'px',
            );
          });
        });
      },
      { passive: true },
    );
})();
