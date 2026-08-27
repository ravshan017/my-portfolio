(() => {
  'use strict';
  const A = window.AURUM;
  const mediaHTML = c => c.img ? '<img src="' + c.img + '" alt="' + c.name + '" loading="lazy" data-fb="' + c.type + '" onerror="this.outerHTML=window.AURUM.carSVG(this.dataset.fb)">' : A.carSVG(c.type);
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const favs = () => store.get('aurum_favs', []);
  const cmp = () => store.get('aurum_cmp', []);

  const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.5-1.5 2-3.2 2-4.5A4.5 4.5 0 0 0 16.5 5c-1.8 0-3.4 1-4.5 2.6C10.9 6 9.3 5 7.5 5A4.5 4.5 0 0 0 3 9.5c0 1.3.5 3 2 4.5l7 6.5z"/></svg>';
  const ICON_TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7"/></svg>';

  const toast = (msg) => {
    let box = $('#toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#d8b46a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>${msg}`;
    box.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2600);
  };

  const modal = () => {
    if ($('#modal')) return;
    const m = document.createElement('div');
    m.id = 'modal';
    m.innerHTML = `<div class="modal-box">
      <button class="modal-x" aria-label="Закрыть">×</button>
      <h3 id="modalTitle">Заявка</h3>
      <form data-ajax>
        <div class="field"><label>Ваше имя</label><input name="name" type="text" placeholder="Александр" required></div>
        <div class="field"><label>Телефон</label><input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required></div>
        <textarea name="comment" hidden></textarea>
        <p class="form-note">Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.</p>
        <button type="submit" class="btn btn-primary btn-block">Отправить заявку</button>
      </form>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) closeModal(); });
    m.querySelector('.modal-x').addEventListener('click', closeModal);
    addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  };
  const openModal = (title, comment) => {
    modal();
    const m = $('#modal');
    $('#modalTitle').textContent = title || 'Заявка';
    const c = m.querySelector('[name=comment]');
    if (c) c.value = comment || '';
    m.classList.add('show');
    document.body.classList.add('lock');
    setTimeout(() => m.querySelector('[name=name]').focus(), 150);
  };
  const closeModal = () => {
    const m = $('#modal');
    if (m) { m.classList.remove('show'); document.body.classList.remove('lock'); }
  };

  const updateFavBadges = () => {
    const n = favs().length;
    $$('.nav-badge[data-fav-badge]').forEach(b => {
      b.textContent = n;
      b.classList.toggle('on', n > 0);
    });
  };

  const updateCmpBar = () => {
    let bar = $('#cmpBar');
    const list = cmp().map(id => A.CARS.find(c => c.id === id)).filter(Boolean);
    if (!list.length) { if (bar) bar.classList.remove('show'); return; }
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'cmpBar';
      document.body.appendChild(bar);
      bar.addEventListener('click', e => {
        const rm = e.target.closest('[data-cmp-rm]');
        if (rm) { toggleCmp(rm.dataset.cmpRm); return; }
        if (e.target.closest('#cmpGo')) {
          if (cmp().length < 2) { toast('Добавьте минимум 2 автомобиля'); return; }
          location.href = 'compare.html';
        }
        if (e.target.closest('#cmpClear')) { store.set('aurum_cmp', []); updateCmpBar(); syncCmpChecks(); }
      });
    }
      bar.innerHTML = `<div class="cmp-items">${list.map(c => `
       <div class="cmp-item"><button class="cmp-rm" data-cmp-rm="${c.id}" aria-label="Убрать">${ICON_TRASH}</button><span class="cmp-thumb" style="--p:${c.p}">${mediaHTML(c)}</span><span>${c.name}</span></div>`).join('')}</div>
      <div class="cmp-actions"><button class="btn btn-ghost" id="cmpClear">Очистить</button><button class="btn btn-primary" id="cmpGo">Сравнить (${list.length})</button></div>`;
    requestAnimationFrame(() => bar.classList.add('show'));
  };

  const toggleFav = id => {
    const f = favs();
    const i = f.indexOf(id);
    if (i > -1) { f.splice(i, 1); toast('Удалено из избранного'); }
    else { f.push(id); toast('Добавлено в избранное'); }
    store.set('aurum_favs', f);
    updateFavBadges();
    $$(`[data-fav="${id}"]`).forEach(b => b.classList.toggle('active', f.includes(id)));
  };

  const toggleCmp = id => {
    const l = cmp();
    const i = l.indexOf(id);
    if (i > -1) { l.splice(i, 1); toast('Убрано из сравнения'); }
    else {
      if (l.length >= 3) { toast('Максимум 3 автомобиля'); syncCmpChecks(); return; }
      l.push(id);
      toast('Добавлено к сравнению');
    }
    store.set('aurum_cmp', l);
    updateCmpBar();
    syncCmpChecks();
  };

  const syncCmpChecks = () => {
    const l = cmp();
    $$('[data-cmp]').forEach(ch => { ch.checked = l.includes(ch.dataset.cmp); });
  };

  const cardHTML = (c, i) => `
    <article class="card" data-id="${c.id}" style="--d:${i * 60}ms;--p:${c.p}">
      <div class="card-media" style="background:${A.GRADS[c.g]}">
        <span class="badge ${c.badge === 'В наличии' ? '' : 'order'}">${c.badge}</span>
        <button class="fav ${favs().includes(c.id) ? 'active' : ''}" data-fav="${c.id}" aria-label="В избранное">${HEART}</button>
        <div class="car-fallback">${A.carSVG(c.type)}</div>
        ${c.img ? '<img class="car-img" src="' + c.img + '" alt="' + c.name + '" loading="lazy" data-fb="' + c.type + '" onerror="this.outerHTML=window.AURUM.carSVG(this.dataset.fb)">' : ''}
        <label class="cmp-check"><input type="checkbox" data-cmp="${c.id}" ${cmp().includes(c.id) ? 'checked' : ''}><span>Сравнить</span></label>
      </div>
      <div class="card-body">
        <div class="card-title"><h3>${c.name}</h3><span>${c.year}</span></div>
        <ul class="specs">
          <li>${c.power} л.с.</li>
          <li>${String(c.acc).replace('.', ',')} с до 100</li>
          <li>${c.drive} привод</li>
        </ul>
        <div class="price"><strong>${A.fmt(c.price)}</strong>${c.old ? `<s>${A.fmt(c.old)}</s>` : ''}<em>от ${A.fmt(A.monthly(c.price))}/мес</em></div>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" data-details="${c.id}">Подробнее</button>
          <button class="btn btn-primary btn-sm" data-book="${c.name}">Заявка</button>
        </div>
      </div>
    </article>`;

  const bindTilt = scope => {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    $$('.card', scope || document).forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--ry', (x * 9) + 'deg');
        card.style.setProperty('--rx', (-y * 7) + 'deg');
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  };

  const reveal = scope => {
    const io = reveal.io || (reveal.io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12 }));
    $$('.reveal:not(.in)', scope || document).forEach(el => io.observe(el));
  };

  const initCounters = () => {
    const cio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, t = +el.dataset.count, suf = el.dataset.suffix || '', d = 1400, st = performance.now();
      const step = n => {
        const p = Math.min(1, (n - st) / d);
        el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))).toLocaleString('ru-RU') + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: .5 });
    $$('[data-count]').forEach(el => cio.observe(el));
  };

  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) { toggleFav(fav.dataset.fav); return; }
    const det = e.target.closest('[data-details]');
    if (det) { location.href = 'car.html?id=' + det.dataset.details; return; }
    const book = e.target.closest('[data-book]');
    if (book) { openModal(`Заявка на ${book.dataset.book}`, `Интересует модель: ${book.dataset.book}.`); return; }
    const ps = e.target.closest('.pswatch');
    if (ps) {
      ps.closest('.pswatch-row, .stage-tools')?.querySelectorAll('.pswatch').forEach(x => x.classList.remove('is-active'));
      ps.classList.add('is-active');
      const st = $('.stage');
      if (st) st.style.setProperty('--p', ps.dataset.hex);
      const lbl = $('#paintName');
      if (lbl) lbl.textContent = ps.dataset.name;
    }
    const accH = e.target.closest('.acc-head');
    if (accH) {
      const item = accH.parentElement;
      const open = item.classList.toggle('open');
      accH.setAttribute('aria-expanded', open);
    }
  });

  document.addEventListener('change', e => {
    const ch = e.target.closest('[data-cmp]');
    if (ch) toggleCmp(ch.dataset.cmp);
  });

  document.addEventListener('submit', e => {
    const f = e.target.closest('form[data-ajax]');
    if (!f) return;
    e.preventDefault();
    const name = f.querySelector('[name=name]');
    const phone = f.querySelector('[name=phone]');
    let bad = false;
    [name, phone].forEach(i => {
      if (i && !i.value.trim()) { i.style.borderColor = '#c0392b'; bad = true; }
      else if (i) i.style.borderColor = '';
    });
    if (bad) return;
    f.innerHTML = '<div class="form-success"><h3>Заявка отправлена</h3><p>Менеджер свяжется с вами в течение 15 минут в рабочее время.</p></div>';
    toast('Заявка успешно отправлена');
    if (f.closest('#modal')) setTimeout(closeModal, 1800);
  });

  const initChrome = () => {
    const pre = $('#preloader');
    const hidePre = () => { if (pre && !pre.classList.contains('done')) { pre.classList.add('done'); setTimeout(() => pre.remove(), 700); } };
    addEventListener('scene:ready', hidePre);
    addEventListener('scene:error', hidePre);
    setTimeout(hidePre, document.getElementById('hero-canvas') ? 3500 : 900);

    const nav = $('#nav'), burger = $('#burger'), links = $('#navLinks');
    if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 24), { passive: true });
    if (burger) burger.addEventListener('click', () => {
      links.classList.toggle('open');
      burger.classList.toggle('open');
      document.body.classList.toggle('lock');
    });
    $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.classList.remove('open');
      document.body.classList.remove('lock');
    }));

    const prog = $('#progress');
    if (prog) addEventListener('scroll', () => {
      const h = document.documentElement;
      prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100 || 0) + '%';
    }, { passive: true });

    const top = $('#toTop');
    if (top) {
      addEventListener('scroll', () => top.classList.toggle('show', scrollY > 600), { passive: true });
      top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    }

    const yr = $('#year');
    if (yr) yr.textContent = new Date().getFullYear();

    $$('[data-stagger]').forEach(w => $$(':scope > *', w).forEach((c, i) => c.style.transitionDelay = `${i * 70}ms`));
    initCounters();
    reveal();
    updateFavBadges();
    updateCmpBar();
  };

  const P = {};

  P.home = () => {
    const grid = $('#featuredGrid');
    if (grid) {
      grid.innerHTML = A.CARS.filter(c => c.featured).map((c, i) => cardHTML(c, i)).join('');
      bindTilt(grid);
    }
  };

  P.catalog = () => {
    const grid = $('#catalogGrid');
    const q = $('#q'), brand = $('#brand'), sort = $('#sort'), type = $('#type'), favOnly = $('#favOnly'), count = $('#resCount');
    const params = new URLSearchParams(location.search);
    if (params.get('fav') === '1') favOnly.checked = true;

    const brands = [...new Set(A.CARS.map(c => c.brand))].sort();
    brand.innerHTML = '<option value="">Все марки</option>' + brands.map(b => `<option>${b}</option>`).join('');
    const counts = { all: A.CARS.length };
    A.CARS.forEach(c => counts[c.type] = (counts[c.type] || 0) + 1);
    $$('#type .pill').forEach(p => {
      const k = p.dataset.filter;
      const n = counts[k];
      if (n != null) p.querySelector('.cnt').textContent = n;
    });

    const apply = () => {
      let list = [...A.CARS];
      const t = $('#type .pill.active').dataset.filter;
      if (t !== 'all') list = list.filter(c => c.type === t);
      if (brand.value) list = list.filter(c => c.brand === brand.value);
      if (q.value.trim()) {
        const s = q.value.trim().toLowerCase();
        list = list.filter(c => (c.name + ' ' + c.brand).toLowerCase().includes(s));
      }
      if (favOnly.checked) list = list.filter(c => favs().includes(c.id));
      const s = sort.value;
      if (s === 'price-asc') list.sort((a, b) => a.price - b.price);
      if (s === 'price-desc') list.sort((a, b) => b.price - a.price);
      if (s === 'power-desc') list.sort((a, b) => b.power - a.power);
      if (s === 'year-desc') list.sort((a, b) => b.year - a.year);
      count.textContent = list.length;
      const favIds = favs();
      grid.innerHTML = list.length
        ? list.map((c, i) => cardHTML(c, i)).join('')
        : `<div class="empty"><h3>Ничего не найдено</h3><p>Попробуйте изменить параметры поиска</p><button class="btn btn-ghost" id="resetBtn">Сбросить фильтры</button></div>`;
      const rb = $('#resetBtn');
      if (rb) rb.addEventListener('click', () => {
        q.value = ''; brand.value = ''; sort.value = 'price-asc'; favOnly.checked = false;
        $$('#type .pill').forEach((p, i) => p.classList.toggle('active', i === 0));
        apply();
      });
      bindTilt(grid);
      reveal(grid);
      syncCmpChecks();
    };

    $('#type').addEventListener('click', e => {
      const p = e.target.closest('.pill');
      if (!p) return;
      $$('#type .pill').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      apply();
    });
    [q, brand, sort, favOnly].forEach(el => el.addEventListener('input', apply));
    apply();
  };

  P.car = () => {
    const id = new URLSearchParams(location.search).get('id');
    const c = A.CARS.find(x => x.id === id);
    if (!c) { location.href = 'catalog.html'; return; }
    document.title = `${c.name} — AURUM MOTORS`;

    $('#crumbName').textContent = c.name;
    $('#carTitle').textContent = c.name;
    $('#carBrand').textContent = `${c.brand} · ${c.year} год`;
    $('#carDesc').textContent = c.desc;
    $('#carBadge').textContent = c.badge;
    $('#carPrice').textContent = A.fmt(c.price);
    $('#carOld').innerHTML = c.old ? `<s>${A.fmt(c.old)}</s>` : '';
    $('#carMonthly').textContent = A.fmt(A.monthly(c.price));
    $('#bookBtn').addEventListener('click', () => openModal(`Заявка на ${c.name}`, `Интересует модель: ${c.name}.`));

    const stage = $('#stage');
    const shots = { ext: (c.img ? '<img class="stage-img" src="' + c.img + '" alt="' + c.name + '" data-fb="' + c.type + '" onerror="this.outerHTML=window.AURUM.carSVG(this.dataset.fb)">' : A.carSVG(c.type)), front: '<img class="stage-img" src="images/int.jpg" alt="Салон ' + c.name + '" onerror="this.outerHTML=window.AURUM.interiorSVG()">', int: '<img class="stage-img" src="images/detail.jpg" alt="Детали ' + c.name + '" onerror="this.outerHTML=window.AURUM.frontSVG()">' };
    const setShot = k => { stage.innerHTML = shots[k]; $$('.thumb').forEach(t => t.classList.toggle('active', t.dataset.shot === k)); };
    $$('.thumb .t-prev').forEach(p => {
      const t = p.closest('.thumb');
      if (t && shots[t.dataset.shot]) p.innerHTML = shots[t.dataset.shot];
    });
    $$('.thumb').forEach(t => t.addEventListener('click', () => setShot(t.dataset.shot)));
    setShot('ext');
    stage.style.setProperty('--p', c.p);

    const row = $('#paintRow');
    row.innerHTML = A.PAINTS.map(([n, hex], i) =>
      `<button class="pswatch ${hex === c.p ? 'is-active' : ''}" style="--c:${hex}" data-hex="${hex}" data-name="${n}" aria-label="${n}"></button>`
    ).join('');
    const def = A.PAINTS.find(p => p[1] === c.p);
    $('#paintName').textContent = def ? def[0] : A.PAINTS[0][0];

    const specs = [
      ['Год выпуска', c.year], ['Пробег', 'новый'], ['Двигатель', c.engine],
      ['Мощность', `${c.power} л.с.`], ['Разгон 0–100 км/ч', `${String(c.acc).replace('.', ',')} с`],
      ['Максимальная скорость', `${c.vmax} км/ч`], ['Привод', c.drive], ['Коробка передач', c.gb],
      ['Гарантия', '24 месяца'], ['Статус', c.badge]
    ];
    $('#specGrid').innerHTML = specs.map(([k, v]) => `<div class="spec"><span>${k}</span><b>${v}</b></div>`).join('');
    $('#featList').innerHTML = A.FEATS.map(f => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>${f}</li>`).join('');

    const tabs = $('#tabs');
    tabs.addEventListener('click', e => {
      const b = e.target.closest('.tab');
      if (!b) return;
      $$('#tabs .tab').forEach(t => t.classList.remove('active'));
      b.classList.add('active');
      $$('.tab-pane').forEach(p => p.classList.toggle('active', p.id === b.dataset.tab));
    });

    const calcPrice = $('#calcPrice'), calcDown = $('#calcDown'), calcTerm = $('#calcTerm'), calcRate = $('#calcRate');
    calcPrice.value = Math.min(c.price, 35000000);
    const upd = () => {
      const P0 = +calcPrice.value, d = +calcDown.value / 100, n = +calcTerm.value, r = +calcRate.value / 100 / 12;
      const loan = P0 * (1 - d);
      const m = Math.round(loan * r / (1 - Math.pow(1 + r, -n)) / 100) * 100;
      $('#calcSum').textContent = A.fmt(loan);
      $('#calcPay').textContent = A.fmt(m);
      $('#calcTotal').textContent = A.fmt(m * n + P0 * d);
      $('#calcPriceVal').textContent = A.fmt(P0);
      $('#calcDownVal').textContent = calcDown.value + '% · ' + A.fmt(P0 * d);
      calcPrice.style.setProperty('--w', ((P0 - calcPrice.min) / (calcPrice.max - calcPrice.min) * 100) + '%');
      calcDown.style.setProperty('--w', calcDown.value + '%');
    };
    [calcPrice, calcDown, calcTerm, calcRate].forEach(el => el.addEventListener('input', upd));
    upd();

    const sim = A.CARS.filter(x => x.type === c.type && x.id !== c.id).slice(0, 3);
    $('#similarGrid').innerHTML = sim.map((x, i) => cardHTML(x, i)).join('');
    bindTilt($('#similarGrid'));

    const favBtn = $('#favBtn');
    const syncFav = () => {
      const on = favs().includes(c.id);
      favBtn.classList.toggle('active', on);
      favBtn.querySelector('span').textContent = on ? 'В избранном' : 'В избранное';
    };
    favBtn.addEventListener('click', () => { toggleFav(c.id); syncFav(); });
    syncFav();
  };

  P.services = () => {
    const price = $('#svcPrice'), down = $('#svcDown'), term = $('#svcTerm'), rate = $('#svcRate');
    const upd = () => {
      const P0 = +price.value, d = +down.value / 100, n = +term.value, r = +rate.value / 100 / 12;
      const loan = P0 * (1 - d);
      const m = Math.round(loan * r / (1 - Math.pow(1 + r, -n)) / 100) * 100;
      $('#svcSum').textContent = A.fmt(loan);
      $('#svcPay').textContent = A.fmt(m);
      $('#svcTotal').textContent = A.fmt(m * n + P0 * d);
      $('#svcPriceVal').textContent = A.fmt(P0);
      $('#svcDownVal').textContent = down.value + '% · ' + A.fmt(P0 * d);
      price.style.setProperty('--w', ((price.value - price.min) / (price.max - price.min) * 100) + '%');
      down.style.setProperty('--w', down.value + '%');
    };
    [price, down, term, rate].forEach(el => el.addEventListener('input', upd));
    upd();
  };

  P.compare = () => {
    const params = new URLSearchParams(location.search).get('ids');
    if (params) store.set('aurum_cmp', params.split(',').filter(id => A.CARS.some(c => c.id === id)).slice(0, 3));
    const wrap = $('#cmpTableWrap');
    const render = () => {
      const list = cmp().map(id => A.CARS.find(c => c.id === id)).filter(Boolean);
      if (!list.length) {
        wrap.innerHTML = '<div class="empty"><h3>Нечего сравнивать</h3><p>Добавьте автомобили из каталога</p><a class="btn btn-primary" href="catalog.html">Перейти в каталог</a></div>';
        return;
      }
      const rows = [
        ['Цена', c => A.fmt(c.price), (a, b) => a.price - b.price],
        ['Год', c => c.year],
        ['Двигатель', c => c.engine],
        ['Мощность', c => c.power + ' л.с.', (a, b) => b.power - a.power],
        ['Разгон 0–100 км/ч', c => String(c.acc).replace('.', ',') + ' с', (a, b) => a.acc - b.acc],
        ['Макс. скорость', c => c.vmax + ' км/ч', (a, b) => b.vmax - a.vmax],
        ['Привод', c => c.drive],
        ['Коробка передач', c => c.gb],
        ['Статус', c => c.badge]
      ];
       const head = `<tr><th></th>${list.map(c => `<th><div class="cmp-car"><span class="cmp-thumb big" style="--p:${c.p}">${mediaHTML(c)}</span><a href="car.html?id=${c.id}">${c.name}</a><button class="cmp-rm" data-cmp-rm="${c.id}" aria-label="Убрать">${ICON_TRASH}</button></div></th>`).join('')}</tr>`;
      const body = rows.map(([label, get, best]) => {
        let bestId = null;
        if (best) bestId = [...list].sort(best)[0].id;
        return `<tr><td>${label}</td>${list.map(c => `<td class="${best && c.id === bestId ? 'best' : ''}">${get(c)}</td>`).join('')}</tr>`;
      }).join('');
      wrap.innerHTML = `<table class="cmp-table"><thead>${head}</thead><tbody>${body}</tbody></table>
        <div class="cmp-cta">${list.map(c => `<button class="btn btn-primary" data-book="${c.name}">Оставить заявку — ${c.name.split(' ')[0]}</button>`).join('')}</div>`;
    };
    document.addEventListener('click', e => {
      const rm = e.target.closest('#cmpTableWrap [data-cmp-rm]');
      if (rm) { toggleCmp(rm.dataset.cmpRm); render(); }
    });
    render();
  };

  P.contacts = () => {};

  document.addEventListener('DOMContentLoaded', () => {
    initChrome();
    const pg = document.body.dataset.page;
    if (P[pg]) P[pg]();
  });
})();
