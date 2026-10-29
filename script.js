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
  // Content ships as four small JSON files. content/seed.js carries the same
  // data, but it is 38 KB and was previously loaded on every page *and* then
  // superseded by these fetches. It is now fetched only if one of them fails.
  const loadSeed = () =>
    new Promise((resolve) => {
      if (window.SEED) return resolve(window.SEED);
      const s = document.createElement('script');
      s.src = 'content/seed.js';
      s.onload = () => resolve(window.SEED || {});
      s.onerror = () => resolve({});
      document.head.appendChild(s);
    });
  const get = (f) =>
    fetch('content/' + f + '.json')
      .then((r) => {
        if (!r.ok) throw 0;
        return r.json();
      })
      .catch(() => loadSeed().then((seed) => seed[f] || {}));
  const [S, P, T, PR] = await Promise.all(
    ['site', 'portfolio', 'testimonials', 'pricing'].map(get),
  );
  const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const UP = 'https://www.upwork.com/freelancers/~015f3c5097705a3287',
    LI = 'https://www.linkedin.com/in/ful1e5/';
  const mail = S.email || 'hello@abdulkaiz.com';
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
    // the contact dialog's marks
    mail: '<rect x="2.5" y="4.75" width="19" height="14.5" rx="3"/><path d="M3.2 7.4l7.5 5.2a2.4 2.4 0 0 0 2.6 0l7.5-5.2"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    chevron: '<path d="M6 9.5l6 6 6-6"/>',
  };
  const icon = (k, cls = 'svc-icon') =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[k] || ICONS.check}</svg>`;
  // the header sits on a dark hero only on pages that have one
  if ($('.hero.dark')) document.body.classList.add('has-hero-dark');
  // The dialog is a ladder of effort: scan my LinkedIn and see who you'd be
  // hiring, email, book a call or hire through Upwork, and — folded away, since
  // it is the least formal of the four — a WhatsApp QR for a quick message. The
  // code is a link as well as a code: whoever is on a phone is holding the thing
  // that would otherwise read it.
  const wa = /^https?:/.test(S.whatsapp || '') ? S.whatsapp : '',
    liHandle = (LI.match(/\/in\/[^/]+/) || [''])[0];
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="ov" id="ov" role="dialog" aria-modal="true" aria-label="Contact"><div class="modal"><button class="x" aria-label="Close">×</button><h2>Let's build something great</h2><p>Pick whatever is easiest for you.</p><div class="opts">
<a class="opt opt-qr" style="--i:0" href="${esc(LI)}" target="_blank" rel="noopener"><img src="assets/uploads/qr-linkedin.svg" alt="" width="120" height="120"><span><b>LinkedIn</b>${
      liHandle ? `<small>${esc(liHandle)}</small>` : ''
    }</span></a>
<a class="opt" style="--i:1" href="mailto:${esc(mail)}"><i>${icon('mail', 'opt-icon')}</i><span><b>Email</b><small>${esc(mail)}</small></span></a>
${
  /^https?:/.test(S.bookCall || '')
    ? `<div class="pair" style="--i:2"><a class="btn" href="${esc(S.bookCall)}" target="_blank" rel="noopener">${icon('calendar', 'btn-icon')}Book a call</a><a class="btn btn-ghost" href="${UP}" target="_blank" rel="noopener">Hire me on Upwork</a></div>`
    : ''
}
</div>
${
  wa
    ? `<p class="quick" style="--i:3"><button type="button" class="quick-toggle" aria-expanded="false" aria-controls="waBlock">or send me a quick message${icon('chevron', 'quick-caret')}</button></p><div class="qr" id="waBlock" hidden><a class="qr-card" href="${esc(wa)}" target="_blank" rel="noopener" aria-label="Open WhatsApp to send a quick message"><img src="assets/uploads/qr-whatsapp.svg" alt="" width="164" height="164" loading="lazy"></a><p class="qr-note">Scan to message me on WhatsApp. On a phone, just tap the code.</p></div>`
    : ''
}
</div></div>`,
  );
  // the quick-message line is a disclosure, not a second contact list: it opens
  // the WhatsApp code and folds it away again
  const waToggle = $('.quick-toggle'),
    waBlock = $('#waBlock');
  waToggle.onclick = () => {
    const open = waToggle.getAttribute('aria-expanded') === 'true';
    waToggle.setAttribute('aria-expanded', String(!open));
    waBlock.hidden = open;
  };
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
        // "send me a message" points at the email row; everything else at the
        // booking button, which is the strongest way in
        c.dataset.contact === 'message'
          ? '.opt[href^="mailto:"]'
          : '.modal .btn',
      );
    } else if (e.target.classList.contains('ov') || e.target.closest('.x'))
      closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
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
  // The hero portrait is not built here. It is the LCP element, so it lives in
  // the markup (see the <!--#photo-hero--> region) where the preload scanner
  // reaches it immediately; injecting it here meant waiting for this file to
  // parse and for four content fetches to resolve before the browser even knew
  // the image existed.
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
    // The region endpoint exists only where the Pages Functions in
    // functions/api/ are deployed. On a static host it 404s, and Chrome logs
    // the failed request — which fails Lighthouse's errors-in-console audit
    // and was the sole cause of Best Practices reading 96 instead of 100.
    if (document.documentElement.dataset.functions === 'yes') {
      try {
        const j = await (await fetch('api/region')).json();
        if (j.country) return j.country;
      } catch {}
    }
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
  // A plan card: what the plan costs, what it covers, and what is in it. The
  // actions live in the contact dialog, so the cards stay a price comparison
  // and nothing here competes with the panel's own way in.
  // The description, the note and the checklist are each optional — an add-on
  // carries less than a package — so an absent one is left out rather than
  // rendered empty and leaving its margin behind.
  const planCard = (p, tab) =>
    `<article class="plan ${p.popular ? 'featured-glow' : ''}"${
      tab
        ? ` role="tabpanel" id="${tab.id}" aria-labelledby="${tab.lab}"${tab.hidden ? ' hidden' : ''}`
        : ''
    }>${p.popular ? '<span class="pop-badge">Most popular</span>' : ''}<h3 class="tagp">${esc(p.name)}</h3><div class="price"><b>${fmt(p.amount * mult)}</b><small>${p.from ? 'starting at<br>' : ''}${esc(p.unit)}</small></div>${
      p.desc ? `<p class="plan-desc">${esc(p.desc)}</p>` : ''
    }${p.note ? `<p class="pnote">${esc(p.note)}</p>` : ''}${
      (p.features || []).length
        ? `<ul>${p.features
            .map((f) => `<li>${icon('check', 'icon-check')}${esc(f)}</li>`)
            .join('')}</ul>`
        : ''
    }</article>`;
  // "What I do" — one scroll-driven section. The rail on the left tracks which
  // service panel is in view; the active service sets the section's accent colour.
  const sv = S.services || [];
  const rail = $('#svcRail'),
    panels = $('#svcPanels'),
    svcSec = $('#services'),
    svcGlow = $('#svcGlow');
  if (rail && panels && sv.length) {
    // The rail is the section's contents, not a price list: a service is picked
    // by name, and the panel it opens carries a way to see what it costs.
    rail.innerHTML = sv
      .map(
        (s, i) =>
          `<button class="rail-item" data-rail="${i}" aria-label="${esc(s.title)}">${icon(s.icon)}<span>${esc(s.title)}</span></button>`,
      )
      .join('');
    // Details on the left, the checklist of what is included on the right.
    // Pricing used to hold that column; it now opens from the call to action
    // instead, so the two are never competing for the same space.
    panels.innerHTML = sv
      .map((s, i) => {
        const sid = esc(s.id || i),
          priced = (s.plans || []).length > 0;
        return `<article class="svc-panel" id="service-${sid}" data-panel="${i}" style="--panel-accent:${esc(s.accent || '#4F6BFF')}">
            <div class="svc-body">
              <div class="svc-media">${
                media(s.media, s.title) ||
                `<span class="svc-glyph">${icon(s.icon)}</span>`
              }</div>
              <p class="eyebrow">${icon(s.icon, 'icon-inline')}${esc(s.title)}</p>
              <h3>${esc(s.title)}</h3>
              <p class="svc-lead">${esc(s.details || s.summary)}</p>
              <div class="svc-cta"><button class="btn" ${
                priced
                  ? `data-price="${i}" aria-haspopup="dialog"`
                  : 'data-contact'
              }>${esc(s.cta || 'See pricing')}</button></div>
            </div>
            <div class="svc-list">
              <h4 class="svc-sub">What's included</h4>
              <ul>${(s.features || [])
                .map((f) => `<li>${icon('check', 'icon-check')}${esc(f)}</li>`)
                .join('')}</ul>
            </div>
          </article>`;
      })
      .join('');
    // The pricing sheet. One dialog serves every service — its plans are written
    // in when it opens, so the markup exists once rather than once per panel.
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div class="ov" id="svcPrice" role="dialog" aria-modal="true" aria-labelledby="svcPriceTitle"><div class="modal svc-price"><button class="x" aria-label="Close">×</button><h2 id="svcPriceTitle"></h2><div class="svc-price-body"></div></div></div>`,
    );
    const priceOv = $('#svcPrice'),
      priceTitle = $('#svcPriceTitle'),
      priceModal = priceOv.querySelector('.modal'),
      priceBody = priceOv.querySelector('.svc-price-body');
    // Whether the sheet can lay its plans out in a row. A row is worth having —
    // every plan is on screen and comparable — but only while the cards are
    // still comfortable: 380px each, plus 64px of dialog padding and 32px of
    // overlay, and the gaps come out of the same budget. Under that the plans go
    // back behind the switcher and stay one card at a time.
    // script.js owns this rather than a media query, because the markup has to
    // agree with it: hiding a tablist in CSS would still leave tabpanel roles on
    // cards whose tabs nobody can see and a one-card grid taking a third of the
    // dialog. The flag it writes is what the stylesheet keys off.
    const rowFits = (n) => innerWidth >= n * 380 + 96;
    // Some services carry plans that are not alternatives to each other: a logo,
    // a brochure and a pitch deck are different jobs at different prices, and so
    // are Care and its add-ons. Those are grouped, and a group is a heading
    // rather than a tab — the switcher asks which one you want, which is the
    // wrong question to put to a menu of print work.
    const isGrouped = (s) => (s.plans || []).some((p) => p.group);
    const groupMarkup = (s) => {
      const plans = s.plans || [],
        order = [...new Set(plans.map((p) => p.group || ''))];
      return `<div class="svc-plans">${order
        .map(
          (g) =>
            `<div class="price-group">${
              g ? `<div class="price-group-head"><h3>${esc(g)}</h3></div>` : ''
            }<div class="pgrid">${plans
              .filter((p) => (p.group || '') === g)
              .map((p) => planCard(p))
              .join('')}</div></div>`,
        )
        .join('')}</div>`;
    };
    // a service's plans, as a row of cards or as a switcher over them
    const priceMarkup = (s, row, sid) => {
      const plans = s.plans || [];
      // a grouped service is always its groups, whatever the viewport
      if (isGrouped(s)) return groupMarkup(s);
      // one plan means there is nothing to switch between, so no control
      const tabs = plans.length > 1 && !row;
      const switcher = tabs
        ? `<div class="plan-switch" role="tablist" aria-label="${esc(s.title)} plans">${plans
            .map(
              (p, k) =>
                `<button type="button" class="plan-tab${k ? '' : ' on'}" role="tab" id="ptab-${sid}-${k}" aria-controls="ppanel-${sid}-${k}" aria-selected="${k ? 'false' : 'true'}" tabindex="${k ? '-1' : '0'}">${esc(p.name)}</button>`,
            )
            .join('')}</div>`
        : '';
      const cards = plans
        .map((p, k) =>
          planCard(
            p,
            tabs
              ? {
                  id: `ppanel-${sid}-${k}`,
                  lab: `ptab-${sid}-${k}`,
                  hidden: k > 0,
                }
              : null,
          ),
        )
        .join('');
      return switcher + `<div class="svc-plans">${cards}</div>`;
    };
    // plan switcher — a roving-tabindex tablist, one card visible at a time.
    // Still wired rather than baked in: the sheet rebuilds its tablist per open.
    const wireSwitcher = (sw) => {
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
    };
    // Closing the sheet hands focus back to the button that opened it, so a
    // keyboard visitor is not dropped at the top of the page. Watching the class
    // catches every way out — Escape, the backdrop and the close button all
    // funnel through closeAll, which is shared with the contact dialog.
    let opener = null;
    new MutationObserver(() => {
      if (opener && !priceOv.classList.contains('open')) {
        const o = opener;
        opener = null;
        o.focus({ preventScroll: true });
      }
    }).observe(priceOv, { attributes: true, attributeFilter: ['class'] });
    // Which service is on screen, so the sheet can be laid out again when the
    // viewport changes the row into a switcher or back.
    let showing = null;
    const fillSheet = (i) => {
      const s = sv[i];
      if (!s) return null;
      const plans = s.plans || [],
        grouped = isGrouped(s),
        row = !grouped && rowFits(plans.length);
      priceTitle.textContent = s.title;
      priceOv.style.setProperty('--svc-accent', s.accent || '#4F6BFF');
      priceOv.style.setProperty('--plans', plans.length || 1);
      priceBody.innerHTML = priceMarkup(s, row, esc(s.id || i));
      priceModal.toggleAttribute('data-row', row);
      priceModal.toggleAttribute('data-grouped', grouped);
      const sw = priceBody.querySelector('.plan-switch');
      if (sw) wireSwitcher(sw);
      return sw;
    };
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-price]');
      if (!b) return;
      e.preventDefault();
      const s = sv[+b.dataset.price];
      if (!s) return;
      closeAll();
      $('#mobile').classList.remove('open');
      const sw = fillSheet(+b.dataset.price);
      showing = +b.dataset.price;
      opener = b;
      // the plans are a price comparison now, so the only control in the sheet
      // is its close button — focus that rather than leave it on nothing
      openOv('#svcPrice', sw ? '.plan-tab' : '.x');
    });
    // A resize can turn the row into a switcher and back, so the open sheet is
    // rebuilt — but only when the layout actually has to change, not on every
    // resize. The rebuild drops whatever had focus, which on the way down is a
    // plan tab, so focus is handed to the equivalent control.
    addEventListener(
      'resize',
      () => {
        if (showing === null || !priceOv.classList.contains('open')) return;
        const open = sv[showing] || {},
          plans = open.plans || [];
        // a grouped sheet is laid out the same at every width, so a resize has
        // nothing to re-decide and rebuilding would only drop the focus
        if (
          isGrouped(open) ||
          rowFits(plans.length) === priceModal.hasAttribute('data-row')
        )
          return;
        const sw = fillSheet(showing);
        (sw
          ? sw.querySelector('.plan-tab')
          : priceOv.querySelector('.x')
        )?.focus({ preventScroll: true });
      },
      { passive: true },
    );
    const railItems = [...rail.children],
      els = [...panels.children];
    let current = -1;
    // Whether the rail is on screen. The URL only mirrors the active service
    // while it is: a visitor who simply scrolls past the section should not be
    // left carrying a #service-… anchor, because refreshing on one drops them
    // into the rail instead of at the top of the page.
    const inView = () => {
      const r = svcSec.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight;
    };
    const clearHash = () => {
      if (history.replaceState && /^#service-/.test(location.hash || ''))
        history.replaceState(null, '', location.pathname + location.search);
    };
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
      // On a phone the rail is a sideways scroller and the active pill has just
      // been pulled to its front, so the rail returns to its start — otherwise
      // the row would stay scrolled to wherever it was and the pill that moved
      // would be off the edge.
      if (rail.scrollWidth > rail.clientWidth) rail.scrollLeft = 0;
      if (sync && inView() && history.replaceState)
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
    let hold = false; // set while a deep link is settling, so scroll can't override it
    // Which panel is being read. Stacked, that is the one nearest the middle of
    // the viewport. Sideways — which is what the panels become on a phone — it is
    // the one nearest the middle of their scroller, because every panel sits at
    // the same height and the viewport test would pick the same one forever.
    const sideways = () => panels.scrollWidth > panels.clientWidth + 1;
    const pick = (sync = true) => {
      if (hold) return;
      const across = sideways(),
        mid = across
          ? panels.getBoundingClientRect().left + panels.clientWidth / 2
          : innerHeight / 2;
      let best = 0,
        dist = Infinity;
      els.forEach((e, i) => {
        const r = e.getBoundingClientRect();
        const d = Math.abs(
          (across ? r.left + r.width / 2 : r.top + r.height / 2) - mid,
        );
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
        // once the section is behind or ahead of the viewport the mirror is
        // stale, so drop it rather than leave it to hijack a refresh
        if (!hold && !inView()) clearHash();
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    // the panels' own sideways scroll does not bubble, so it is listened for
    // where it happens
    panels.addEventListener('scroll', onScroll, { passive: true });
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
  // the About portrait is markup, like the hero one — see the note there
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
  // Which platform a review was left on. The mark goes in the card's
  // bottom-right corner; a review with no known platform simply goes without.
  const source = (r) => {
    const k = String(r.source || '')
      .toLowerCase()
      .trim();
    if (k.includes('upwork')) return { file: 'upwork', label: 'Upwork' };
    if (k.includes('linkedin')) return { file: 'linkedin', label: 'LinkedIn' };
    if (k.includes('twitter') || k === 'x') return { file: 'x', label: 'X' };
    return null;
  };
  // One card renderer feeds both walls of reviews: the home page takes the
  // newest few (data-limit), the reviews page takes all of them.
  const QUOTE_ICON =
    '<svg class="icon-quote" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 5.2C6.3 6.3 4 9.3 4 12.9v5.9h6.6v-6.6H7.2c0-2 1.1-3.6 3-4.4l-.6-2.6zm10 0c-3.3 1.1-5.6 4.1-5.6 7.7v5.9h6.6v-6.6h-3.4c0-2 1.1-3.6 3-4.4l-.6-2.6z"/></svg>';
  const rcard = (r, featured) => {
    const s = source(r);
    return `<article class="tcard${featured ? ' featured-glow' : ''} reveal">${
      featured
        ? `<div class="tcard-top">${QUOTE_ICON}<span class="tcard-flag">Featured review</span></div>`
        : ''
    }<div class="stars" role="img" aria-label="Rated ${Number(r.rating)} out of 5">${STARS}</div><blockquote class="clamp">${esc(r.quote).replace(/\n\n/g, '<br><br>')}</blockquote><button class="tcard-more" type="button" aria-expanded="false">Read more</button><div class="tcard-foot"><cite>${esc(r.name)}${r.website ? ` <a class="vis" href="${esc(r.website)}" target="_blank" rel="noopener" aria-label="Client website">↗</a>` : ''}<span>${esc(sub(r))}</span></cite>${
      s
        ? `<span class="tsrc" role="img" title="Posted on ${s.label}" aria-label="Review posted on ${s.label}"><img src="assets/logos/${s.file}.svg" alt=""></span>`
        : ''
    }</div></article>`;
  };
  // Whether a review is "long" is a question about layout, not about character
  // count: it turns on the column width and on which font has arrived. So every
  // card ships clamped, and keeps its clamp only where the text really does
  // overflow — re-checked when the webfonts land and when the columns reflow.
  const layout = (box) =>
    [...box.querySelectorAll('.tcard')].forEach((c) => {
      const bq = c.querySelector('blockquote'),
        btn = c.querySelector('.tcard-more');
      if (!bq || !btn) return;
      const over = bq.scrollHeight > bq.clientHeight + 1;
      bq.classList.toggle('clamp', over);
      btn.hidden = !over;
      btn.textContent = over ? 'Read more' : 'Show less';
      btn.setAttribute('aria-expanded', String(!over));
      btn.onclick = () => {
        const open = bq.classList.toggle('clamp') === false;
        btn.textContent = open ? 'Show less' : 'Read more';
        btn.setAttribute('aria-expanded', String(open));
      };
    });
  const grids = ['#reviewGrid', '#tgrid']
    .map((s) => $(s))
    .filter((b) => b && rv.length);
  grids.forEach((box) => {
    box.innerHTML = rv
      .slice(0, +box.dataset.limit || rv.length)
      .map((r, i) => rcard(r, i === 0))
      .join('');
  });
  const relayout = () => grids.forEach(layout);
  relayout();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(relayout);
  }
  let refit;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(refit);
      refit = setTimeout(relayout, 150);
    },
    { passive: true },
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
  // nav links carry their filename (index.html#services) so they work from any
  // page. When the target is on the page we're already on, scroll to it
  // rather than reloading.
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href*="#"]');
    if (!a || a.target === '_blank') return;
    // document.baseURI, not location.href: every page carries a <base> so
    // that one link markup works from any depth, and resolving against
    // location.href here would defeat it on the sub-pages.
    const url = new URL(a.getAttribute('href'), document.baseURI);
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

  // The page's own scrollbar, drawn instead of styled — .sb in the stylesheet,
  // because Chromium runs no transition and no animation on scrollbar parts and
  // this one has to move. It rides the whole document, so it belongs to every
  // page; a coarse pointer keeps its platform bar and gets nothing here.
  if (matchMedia('(pointer: fine)').matches) {
    const bar = document.createElement('div'),
      thumb = document.createElement('div');
    bar.className = reduced ? 'sb reduced' : 'sb';
    bar.setAttribute('aria-hidden', 'true');
    thumb.className = 'sb-thumb';
    bar.append(thumb);
    document.body.append(bar);
    // height of the whole bar, how far the page can travel, height of the pill
    let track = 0,
      max = 0,
      h = 48,
      idle = 0,
      frame = 0;
    const measure = () => {
      const d = document.documentElement;
      max = d.scrollHeight - innerHeight;
      // A dialog holds the page still — and it holds it by clipping the body,
      // which leaves the document just as tall as it was, so scrollHeight alone
      // would keep offering a bar for a page that cannot move.
      bar.hidden = max <= 0 || document.body.classList.contains('lock');
      if (bar.hidden) return;
      track = bar.clientHeight;
      paint();
    };
    const paint = () => {
      if (bar.hidden) return;
      const next = Math.max(
        48,
        Math.round((track * innerHeight) / (innerHeight + max)),
      );
      // height and offset only go to the DOM when they have actually changed;
      // this runs on every frame of a scroll
      if (next !== h) thumb.style.height = (h = next) + 'px';
      thumb.style.transform = `translateY(${Math.round((scrollY / max) * (track - h))}px)`;
    };
    const wake = () => {
      bar.classList.add('on');
      clearTimeout(idle);
      idle = setTimeout(() => bar.classList.remove('on'), 1100);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        paint();
        wake();
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    // the page grows under the bar: fonts land, images decode, the shell fetches
    // its content, a dialog locks it
    new ResizeObserver(measure).observe(document.body);
    new MutationObserver(measure).observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
    addEventListener('resize', measure, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    measure();
    if (max > 0) wake();

    // Resting on the bar keeps it out — otherwise the idle timer would pull it
    // from under the pointer that is about to grab it.
    bar.addEventListener('pointerenter', () => clearTimeout(idle));
    bar.addEventListener('pointerleave', wake);
    // Grabbing anywhere on the strip drags the page: the strip is what is easy
    // to hit, and a drag that starts above or below the pill is what a scrollbar
    // feels like anyway.
    bar.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const from = e.clientY,
        at = scrollY,
        travel = track - h || 1;
      thumb.classList.add('drag');
      clearTimeout(idle);
      bar.setPointerCapture(e.pointerId);
      const move = (ev) => {
        // The pill's own travel is shorter than the page's, so a pixel of drag
        // is worth more than a pixel of scroll. Instant, or the stylesheet's
        // smooth scrolling would chase the pointer instead of following it. The
        // scroll this causes is what repaints the bar.
        scrollTo({
          top: at + ((ev.clientY - from) * max) / travel,
          behavior: 'instant',
        });
      };
      const up = () => {
        thumb.classList.remove('drag');
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', up);
        bar.removeEventListener('pointercancel', up);
        wake();
      };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
      bar.addEventListener('pointercancel', up);
    });
  }
})();
