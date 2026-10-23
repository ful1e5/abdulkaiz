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
  const STAR =
    '<svg class="icon-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45l-5.81 3.05 1.11-6.47-4.7-4.58 6.5-.95L12 2.6z"/></svg>';
  const STARS = STAR.repeat(5);
  // inline stroke icons for services and feature bullets
  const ICONS = {
    monitor:
      '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6"/>',
    layers:
      '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13.5l9 5 9-5"/>',
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
    ['#prices', 'Prices'],
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
    `<footer class="footer"><div class="foot-grid"><div><b>Abdulkaiz Khatri</b><p>Licensed design engineer and automation expert.</p><div class="socials">${soc}</div></div><div><b>Contact</b><p><a href="mailto:${esc(mail)}">${esc(mail)}</a></p><p>Gujarat, India</p></div><div><b>Pages</b>${[nav[2], nav[3], nav[5]].map(([h, t]) => `<p><a href="${h}">${t}</a></p>`).join('')}</div></div><p class="copy">© ${new Date().getFullYear()} Abdulkaiz Khatri. All rights reserved.</p></footer>
<div class="ov" id="ov" role="dialog" aria-modal="true" aria-label="Contact"><div class="modal"><button class="x" aria-label="Close">×</button><h2>Let's build something great</h2><p>Pick whatever is easiest for you.</p><div class="opts">
<a class="opt" style="--i:0" href="mailto:${esc(mail)}"><i>✉</i><span><b>Email</b><small>${esc(mail)}</small></span></a>
${/^https?:/.test(S.bookCall || '') ? `<a class="opt" style="--i:1" href="${esc(S.bookCall)}" target="_blank" rel="noopener"><i>◷</i><span><b>Book a call</b><small>Pick a time that suits you</small></span></a>` : ''}</div>
<p class="or">or send a quick message</p><form class="mform" style="--i:2" novalidate><input name="n" placeholder="Your name" required aria-label="Name" maxlength="100"><input name="e" type="email" placeholder="Your email" required aria-label="Email" maxlength="200"><textarea name="m" rows="3" placeholder="Your site link and one line about your goal" required aria-label="Message" maxlength="4000"></textarea><input class="hp" name="w" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn" type="submit">Send message</button><p class="fst" id="fst" role="status"></p></form></div></div>
<div class="ov" id="sv" role="dialog" aria-modal="true" aria-label="Service details"><div class="sview-shell"><button class="sview-nav sview-nav--side" data-sv-nav="-1" aria-label="Previous service">←</button><div class="sviewer"><button class="x" aria-label="Close">×</button><div class="sview-card" id="svb"></div><div class="sview-bar"><span class="sview-count" id="sv-count"></span><button class="sview-nav sview-nav--bar" data-sv-nav="-1" aria-label="Previous service">←</button><button class="sview-nav sview-nav--bar" data-sv-nav="1" aria-label="Next service">→</button></div></div><button class="sview-nav sview-nav--side" data-sv-nav="1" aria-label="Next service">→</button></div></div>`,
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
  // hero: photo, proof row, rotating logo slots
  const hp = S.heroPhoto || S.photo;
  if (hp)
    set(
      '#heroPhoto',
      `<img src="${esc(hp)}" alt="Portrait of Abdulkaiz Khatri">`,
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
      c.dataset.i = String(
        (i * Math.ceil(pool.length / N)) % pool.length,
      );
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
  // region-scaled pricing — used by the service cards, the viewer and #prices
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
  const planCard = (p) =>
    `<article class="plan ${p.popular ? 'featured-glow' : ''}">${
      p.popular ? '<span class="pop-badge">Most popular</span>' : ''
    }<h3 class="tagp">${esc(p.name)}</h3><div class="price"><b>${fmt(p.amount * mult)}</b><small>${p.from ? 'starting at<br>' : ''}${esc(p.unit)}</small></div><p class="plan-desc">${esc(p.desc || '')}</p><p class="pnote">${esc(p.note || '')}</p><button class="btn" data-contact>Book a call</button><button class="more" data-contact="message">Send me a message</button><ul>${(p.features || []).map((f) => `<li>${icon('check', 'icon-check')}${esc(f)}</li>`).join('')}</ul></article>`;
  // services
  const sv = S.services || [];
  set(
    '#services-grid',
    sv
      .map((s, i) => {
        const p = cheapest(s);
        return `<button class="scard" data-svc="${esc(s.id || i)}" aria-label="Open ${esc(s.title)}"><div class="smedia">${media(s.media, s.title) || icon(s.icon, 'svc-icon smedia-icon')}<span class="smedia-badge">${icon(s.icon)}</span></div><div class="sbody"><h3>${esc(s.title)}</h3><p>${esc(s.summary)}</p><div class="scard-foot">${
          p != null
            ? `<span class="scard-from">from ${fmt(p * mult)}</span>`
            : ''
        }<b>See details →</b></div></div></button>`;
      })
      .join(''),
  );

  // ---- service viewer: photo + sub-services + prices, swipeable & shareable ----
  let svIndex = 0;
  const svHash = (id) => '#service-' + id;
  const renderService = (i, dir) => {
    if (!sv.length) return;
    svIndex = (i + sv.length) % sv.length;
    const s = sv[svIndex];
    const box = $('#svb');
    box.classList.remove('swipe-next', 'swipe-prev');
    box.innerHTML = `<article class="sview-intro">
      <div class="sview-media">${
        media(s.media, s.title) ||
        `<span class="sview-glyph">${icon(s.icon)}</span>`
      }</div>
      <div class="sview-info">
        <p class="eyebrow">${icon(s.icon, 'icon-inline')}${esc(s.title)}</p>
        <h2>${esc(s.title)}</h2>
        <p class="sview-lead">${esc(s.details || s.summary)}</p>
        <h4 class="sview-sub">What's included</h4>
        <ul class="sview-list">${(s.features || [])
          .map((f) => `<li>${icon('check', 'icon-check')}${esc(f)}</li>`)
          .join('')}</ul>
      </div>
    </article>
    <article class="sview-pricing">
      <h4 class="sview-sub">Pricing</h4>
      <div class="sview-plans">${(s.plans || []).map(planCard).join('')}</div>
      <div class="sview-cta">
        <button class="btn" data-contact>${esc(s.cta || 'Start a project')}</button>
        <button class="btn btn-ghost" data-share>Copy link</button>
      </div>
    </article>`;
    if (dir) {
      void box.offsetWidth; // restart the animation
      box.classList.add(dir > 0 ? 'swipe-next' : 'swipe-prev');
    }
    const n = $('#sv-count');
    if (n) n.textContent = `${svIndex + 1} / ${sv.length}`;
    if (history.replaceState)
      history.replaceState(null, '', svHash(s.id || svIndex));
  };
  const openService = (i, dir) => {
    renderService(i, dir);
    openOv('#sv', '.sview-cta .btn');
  };
  const step = (d) => renderService(svIndex + d, d);

  // open from a card
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-svc]');
    if (!card) return;
    e.preventDefault();
    const i = sv.findIndex((s) => (s.id || '') === card.dataset.svc);
    openService(i < 0 ? +card.dataset.svc || 0 : i);
  });
  // prev / next
  $$('[data-sv-nav]').forEach(
    (b) => (b.onclick = () => step(+b.dataset.svNav)),
  );
  // keyboard
  document.addEventListener('keydown', (e) => {
    if (!$('#sv')?.classList.contains('open')) return;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  // touch / pointer swipe
  const viewer = $('.sviewer');
  if (viewer) {
    let x0 = null;
    viewer.addEventListener('pointerdown', (e) => (x0 = e.clientX));
    viewer.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
    });
  }
  // copy a shareable link to the current service
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-share]');
    if (!b) return;
    e.preventDefault();
    const url = location.href;
    const done = () => {
      b.textContent = 'Link copied ✓';
      setTimeout(() => (b.textContent = 'Copy link'), 1800);
    };
    if (navigator.clipboard?.writeText)
      navigator.clipboard.writeText(url).then(done).catch(() => {});
    else done();
  });
  // deep links: index.html#service-shopify opens straight onto that service
  const svFromHash = () => {
    const m = (location.hash || '').match(/^#service-(.+)$/);
    if (!m) return -1;
    return sv.findIndex((s) => String(s.id) === m[1]);
  };
  const openFromHash = () => {
    const i = svFromHash();
    if (i >= 0) openService(i);
  };
  addEventListener('hashchange', () => {
    const i = svFromHash();
    if (i >= 0) openService(i);
  });
  openFromHash();
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
  // home "Prices" section: every service's starting price, plus monthly plans + FAQ
  if ($('#prices')) {
    set(
      '#prices-list',
      sv
        .map((s) => {
          const p = cheapest(s);
          return `<button class="price-row" data-svc="${esc(s.id)}" aria-label="Open ${esc(s.title)}">${icon(s.icon)}<span class="price-row-name">${esc(s.title)}</span><b>${p != null ? 'from ' + fmt(p * mult) : 'On request'}</b></button>`;
        })
        .join(''),
    );
    const monthly = sv.find((s) => s.id === 'care')?.plans || [];
    set('#prices-monthly', monthly.map(planCard).join(''));
    set(
      '#faq',
      (PR.faq || [])
        .map(
          (f) =>
            `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`,
        )
        .join(''),
    );
    set('#prices-note', PR.note ? esc(PR.note) : '');
  }
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
    ),
    box = $('#review');
  let n = 0;
  if (box && rv.length) {
    const show = () => {
      const r = rv[n];
      box.innerHTML = `<div class="avatar">${r.photo ? `<img src="${esc(r.photo)}" alt="">` : esc((r.name || 'C')[0])}</div><div><div class="stars">${STARS}</div><blockquote>${esc(r.quote).replace(/\n\n/g, '<br><br>')}</blockquote><cite>${esc(r.name)}${r.website ? ` <a class="vis" href="${esc(r.website)}" target="_blank" rel="noopener" aria-label="Client website">↗</a>` : ''}<span>${esc(sub(r))}</span></cite></div>`;
    };
    const go = (k) => {
      box.classList.add('fade');
      setTimeout(() => {
        n = (n + k + rv.length) % rv.length;
        show();
        box.classList.remove('fade');
      }, 300);
    };
    show();
    $('#prev').onclick = () => go(-1);
    $('#next').onclick = () => go(1);
    if (rv.length > 1) setInterval(() => go(1), 9000);
  }
  // testimonials page: masonry of 5-star reviews, one featured
  const QUOTE_ICON =
    '<svg class="icon-quote" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 5.2C6.3 6.3 4 9.3 4 12.9v5.9h6.6v-6.6H7.2c0-2 1.1-3.6 3-4.4l-.6-2.6zm10 0c-3.3 1.1-5.6 4.1-5.6 7.7v5.9h6.6v-6.6h-3.4c0-2 1.1-3.6 3-4.4l-.6-2.6z"/></svg>';
  set(
    '#tgrid',
    rv
      .map((r, i) => {
        const featured = i === 0;
        return `<article class="tcard${featured ? ' featured-glow' : ''} reveal">${
          featured
            ? `<div class="tcard-top">${QUOTE_ICON}<span class="tcard-flag">Featured review</span></div>`
            : ''
        }<div class="stars">${STARS}</div><blockquote>${esc(r.quote).replace(/\n\n/g, '<br><br>')}</blockquote><cite>${esc(r.name)}${r.website ? ` <a class="vis" href="${esc(r.website)}" target="_blank" rel="noopener" aria-label="Client website">↗</a>` : ''}<span>${esc(sub(r))}</span></cite></article>`;
      })
      .join(''),
  );
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
