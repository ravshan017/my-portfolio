(() => {
  'use strict';

  const GRADS = [
    'radial-gradient(120% 95% at 75% 0%, #2a2f3a 0%, #0c0e13 72%)',
    'radial-gradient(120% 95% at 75% 0%, #1b2738 0%, #070b12 72%)',
    'radial-gradient(120% 95% at 75% 0%, #232b3c 0%, #0a0d14 72%)',
    'radial-gradient(120% 95% at 75% 0%, #1a2630 0%, #060d11 72%)',
    'radial-gradient(120% 95% at 75% 0%, #2c2a22 0%, #0e0d08 72%)',
    'radial-gradient(120% 95% at 75% 0%, #1d2026 0%, #090a0d 72%)',
    'radial-gradient(120% 95% at 75% 0%, #16263a 0%, #05090f 72%)',
    'radial-gradient(120% 95% at 75% 0%, #2a1620 0%, #0d0610 72%)'
  ];

  const FEATS = [
    'MBUX с голосовым управлением «Hey Mercedes»',
    'Адаптивный круиз-контроль DISTRONIC',
    'Матричные MULTIBEAM LED-фары',
    'Аудиосистема Burmester® surround',
    'Панорамная крыша с электроприводом',
    'Круговые камеры обзора 360°',
    'Проекционный дисплей на лобовое стекло',
    'Пакет ассистентов парковки'
  ];

  const IMG = { 101:'s580',102:'e300',103:'gle450',104:'g580',105:'cle53',106:'sl63',107:'eqe350',108:'eqs580',109:'glc300',110:'gt63',111:'maybach',112:'eqb350' };
  const img = n => 'images/' + (IMG[n] || 's580') + '.jpg';

  const CARS = [
    { id: 's580', name: 'Mercedes-Benz S 580 4MATIC', brand: 'Mercedes-Benz', type: 'sedan', year: 2024, power: 503, acc: 4.4, vmax: 250, engine: '4.0 V8 битурбо', drive: 'Полный', gb: '9G-TRONIC', price: 14900000, badge: 'В наличии', p: '#101418', g: 0, featured: true, img: img(101), desc: 'Флагманский седан с активной подвеской и цифровой панелью MBUX второго поколения.' },
    { id: 'e300', name: 'Mercedes-Benz E 300 4MATIC', brand: 'Mercedes-Benz', type: 'sedan', year: 2024, power: 258, acc: 6.0, vmax: 250, engine: '2.0 I4 битурбо', drive: 'Полный', gb: '9G-TRONIC', price: 8900000, badge: 'В наличии', p: '#17233d', g: 1, featured: true, img: img(102), desc: 'Самый интеллектуальный бизнес-седан с технологиями флагмана в компактном кузове.' },
    { id: 'gle450', name: 'Mercedes-Benz GLE 450 4MATIC', brand: 'Mercedes-Benz', type: 'suv', year: 2024, power: 381, acc: 5.6, vmax: 250, engine: '3.0 I6 MHEV', drive: 'Полный', gb: '9G-TRONIC', price: 11200000, badge: 'В наличии', p: '#1b3a5c', g: 2, featured: true, img: img(103), desc: 'Премиальный кроссовер с мягким гибридом, пневмоподвеской и опциональным третьим рядом.' },
    { id: 'g580', name: 'Mercedes-Benz G 580', brand: 'Mercedes-Benz', type: 'suv', year: 2024, power: 585, acc: 4.5, vmax: 240, engine: '4.0 V8 битурбо', drive: 'Полный', gb: '9G-TRONIC', price: 22800000, old: 23900000, badge: 'В наличии', p: '#0b0b0d', g: 5, featured: true, img: img(104), desc: 'Икона вне времени: три блокировки, боковые выхлопы и харизма легендарного G-Class.' },
    { id: 'cle53', name: 'Mercedes-AMG CLE 53', brand: 'Mercedes-Benz', type: 'coupe', year: 2024, power: 449, acc: 4.2, vmax: 250, engine: '3.0 I6 битурбо', drive: 'Полный', gb: 'AMG SPEEDSHIFT', price: 12400000, badge: 'В наличии', p: '#1b3a6b', g: 6, featured: false, img: img(105), desc: 'Четырёхместное купе AMG с рядной «шестёркой» и электрическим компрессором.' },
    { id: 'sl63', name: 'Mercedes-AMG SL 63', brand: 'Mercedes-Benz', type: 'coupe', year: 2024, power: 585, acc: 3.9, vmax: 315, engine: '4.0 V8 битурбо', drive: 'Полный', gb: 'AMG SPEEDSHIFT', price: 18900000, badge: 'Под заказ', p: '#7c0f1e', g: 7, featured: false, img: img(106), desc: 'Родстер с жёсткой крышей, 585 л.с. и полным приводом 4MATIC+.' },
    { id: 'eqe350', name: 'Mercedes-Benz EQE 350+', brand: 'Mercedes-Benz', type: 'sedan', year: 2024, power: 292, acc: 6.4, vmax: 210, engine: 'Электро · 90,6 кВт·ч', drive: 'Задний', gb: 'Редуктор', price: 9800000, badge: 'В наличии', p: '#0f2038', g: 1, featured: true, img: img(107), desc: 'Электрический седан со стремительным силуэтом и запасом хода до 640 км.' },
    { id: 'eqs580', name: 'Mercedes-Benz EQS 580 4MATIC', brand: 'Mercedes-Benz', type: 'sedan', year: 2024, power: 523, acc: 4.3, vmax: 210, engine: 'Электро · 108,4 кВт·ч', drive: 'Полный', gb: 'Редуктор', price: 15600000, badge: 'В наличии', p: '#0e2a4a', g: 6, featured: true, img: img(108), desc: 'Флагман электрической линейки EQ с гиперэкраном MBUX и запасом до 780 км.' },
    { id: 'glc300', name: 'Mercedes-Benz GLC 300 4MATIC', brand: 'Mercedes-Benz', type: 'suv', year: 2024, power: 258, acc: 6.2, vmax: 240, engine: '2.0 I4 битурбо', drive: 'Полный', gb: '9G-TRONIC', price: 8600000, badge: 'В наличии', p: '#23262c', g: 5, featured: false, img: img(109), desc: 'Сбалансированный компактный кроссовер с просторным салоном и современным MBUX.' },
    { id: 'gt63', name: 'Mercedes-AMG GT 63 S', brand: 'Mercedes-Benz', type: 'coupe', year: 2023, power: 639, acc: 3.2, vmax: 315, engine: '4.0 V8 битурбо', drive: 'Полный', gb: 'AMG SPEEDSHIFT', price: 18400000, badge: 'Под заказ', p: '#1b3a5c', g: 2, featured: false, img: img(110), desc: 'Четырёхдверное купе Affalterbach: 639 л.с. и роскошь флагманского салона.' },
    { id: 'maybach', name: 'Mercedes-Maybach S 680', brand: 'Mercedes-Benz', type: 'sedan', year: 2024, power: 612, acc: 4.5, vmax: 250, engine: '6.0 V12 битурбо', drive: 'Полный', gb: '9G-TRONIC', price: 29900000, badge: 'Под заказ', p: '#0b0b0d', g: 5, featured: false, img: img(111), desc: 'Предельный комфорт заднего ряда, V12 и ручная отделка салона Maybach.' },
    { id: 'eqb350', name: 'Mercedes-Benz EQB 350 4MATIC', brand: 'Mercedes-Benz', type: 'suv', year: 2024, power: 292, acc: 6.0, vmax: 160, engine: 'Электро · 70,5 кВт·ч', drive: 'Полный', gb: 'Редуктор', price: 8200000, badge: 'В наличии', p: '#123a2e', g: 3, featured: false, img: img(112), desc: 'Компактный электрический кроссовер на семерых с полным приводом.' }
  ];

  const PAINTS = [
    ['Гранат', '#8f1626'],
    ['Полночь', '#17233d'],
    ['Изумруд', '#0e3a2e'],
    ['Жемчуг', '#d9dee4'],
    ['Графит', '#23262c'],
    ['Обсидиан', '#0b0b0d'],
    ['Цитрин', '#b3925f']
  ];

  const fmt = n => n.toLocaleString('ru-RU') + ' ₽';

  const monthly = price => {
    const r = 0.099 / 12, n = 60, P = price * 0.85;
    return Math.round(P * r / (1 - Math.pow(1 + r, -n)) / 100) * 100;
  };

  const wheel = (cx, cy, R) => {
    const rim = R * 0.55;
    let sp = '';
    for (let i = 0; i < 5; i++) {
      sp += `<rect class="r-spoke" x="${cx - 2}" y="${cy - rim + 3}" width="4" height="${rim - 5}" rx="2" transform="rotate(${i * 72} ${cx} ${cy})"/>`;
    }
    return `<circle class="r-tire" cx="${cx}" cy="${cy}" r="${R}"/><circle class="r-rim" cx="${cx}" cy="${cy}" r="${rim}"/>${sp}<circle class="r-hub" cx="${cx}" cy="${cy}" r="${R * 0.16}"/>`;
  };

  const carSVG = type => {
    const shadow = '<ellipse class="r-shadow" cx="200" cy="158" rx="170" ry="9"/>';
    if (type === 'coupe') {
      return `<svg class="render" viewBox="0 0 400 180" aria-hidden="true">${shadow}
<path class="r-dark" d="M28 84 L62 78 L64 86 L32 91 Z"/>
<path class="r-paint" d="M26 118 C22 100 34 92 52 88 L96 79 C118 52 150 47 186 47 L234 49 C270 51 300 62 322 76 L360 86 C374 91 380 99 380 108 L380 114 C380 121 372 123 362 123 L346 123 A31 31 0 0 0 284 123 L166 123 A31 31 0 0 0 104 123 L46 123 C32 122 27 121 26 118 Z"/>
<path class="r-hi" d="M300 66 C330 72 350 78 366 88 L358 92 C338 84 318 78 296 73 Z"/>
<path class="r-glass" d="M112 81 L142 57 C160 51 176 50 196 50 L222 51 C250 53 272 60 292 73 L252 77 Z"/>
<path class="r-split" d="M197 50 L193 77"/>
<path class="r-light" d="M354 92 L377 97 L376 104 L352 100 Z"/>
<path class="r-tail" d="M27 99 L45 97 L46 105 L28 107 Z"/>
<path class="r-dark" d="M166 117 H284 V124 H166 Z"/>
<path class="r-dark" d="M352 112 L378 114 L377 120 L351 118 Z"/>
<path class="r-line" d="M176 52 C181 72 181 96 178 120" fill="none"/>
<rect class="r-handle" x="188" y="90" width="15" height="3.5" rx="1.75"/>
${wheel(135, 123, 27)}${wheel(315, 123, 27)}</svg>`;
    }
    if (type === 'sedan') {
      return `<svg class="render" viewBox="0 0 400 180" aria-hidden="true">${shadow}
<path class="r-paint" d="M22 116 C20 104 30 96 48 92 L84 84 L126 54 C132 50 140 48 150 48 L246 50 C256 50 262 53 268 59 L298 84 L344 92 C366 96 376 102 378 110 L378 114 C378 120 370 122 360 122 L346 122 A31 31 0 0 0 284 122 L166 122 A31 31 0 0 0 104 122 L40 122 C28 121 23 119 22 116 Z"/>
<path class="r-hi" d="M290 70 C316 76 340 82 360 92 L352 96 C334 87 314 81 292 77 Z"/>
<path class="r-glass" d="M134 82 L158 58 L238 59 L262 82 Z"/>
<path class="r-split" d="M199 58 L197 82"/>
<path class="r-light" d="M352 96 L375 100 L374 107 L350 103 Z"/>
<path class="r-tail" d="M25 100 L44 98 L45 106 L26 108 Z"/>
<path class="r-dark" d="M166 116 H284 V123 H166 Z"/>
<path class="r-dark" d="M354 110 L376 112 L375 118 L353 116 Z"/>
<path class="r-line" d="M56 90 L96 82" fill="none"/>
<path class="r-line" d="M180 52 C185 72 185 96 182 120" fill="none"/>
<rect class="r-handle" x="190" y="90" width="15" height="3.5" rx="1.75"/>
${wheel(135, 122, 27)}${wheel(315, 122, 27)}</svg>`;
    }
    return `<svg class="render" viewBox="0 0 400 180" aria-hidden="true">${shadow}
<path class="r-dark" d="M98 22 L282 22 L282 28 L98 28 Z"/>
<path class="r-dark" d="M232 22 L244 14 L248 22 Z"/>
<path class="r-paint" d="M24 114 C22 84 34 72 56 68 L74 64 L96 34 C100 28 108 26 118 26 L268 26 C280 26 288 30 294 38 L314 64 L346 72 C368 77 376 88 378 102 L378 112 C378 119 370 121 360 121 L342 121 A31 31 0 0 0 280 121 L164 121 A31 31 0 0 0 102 121 L42 121 C30 120 25 118 24 114 Z"/>
<path class="r-hi" d="M300 60 C322 66 344 72 362 84 L354 88 C336 78 316 72 296 67 Z"/>
<path class="r-glass" d="M102 62 L116 40 L186 40 L186 62 Z"/>
<path class="r-glass" d="M196 40 L258 41 C266 42 272 47 278 54 L288 62 Z"/>
<path class="r-light" d="M348 78 L372 82 L371 91 L346 87 Z"/>
<path class="r-tail" d="M27 72 L40 71 L41 97 L28 98 Z"/>
<path class="r-dark" d="M164 113 H280 V122 H164 Z"/>
<path class="r-chrome" d="M348 108 L376 110 L375 118 L347 116 Z"/>
<path class="r-line" d="M192 30 C195 55 195 90 193 118" fill="none"/>
<path class="r-line" d="M258 30 C260 55 260 90 259 118" fill="none"/>
<rect class="r-handle" x="200" y="84" width="15" height="3.5" rx="1.75"/>
<rect class="r-handle" x="266" y="84" width="15" height="3.5" rx="1.75"/>
${wheel(133, 121, 28)}${wheel(311, 121, 28)}</svg>`;
  };

  const frontSVG = () => `<svg class="render" viewBox="0 0 400 250" aria-hidden="true">
<ellipse class="r-shadow" cx="200" cy="234" rx="150" ry="8"/>
<path class="r-ws" d="M118 60 L282 60 L296 96 L104 96 Z"/>
<path class="r-paint" d="M104 96 L296 96 L310 128 Q316 132 322 140 L334 208 Q336 222 320 222 L80 222 Q64 222 66 208 L78 140 Q84 132 90 128 Z"/>
<path class="r-hi" d="M96 132 L304 132 L306 138 L94 138 Z"/>
<path class="r-dark" d="M150 150 L250 150 L258 186 L142 186 Z"/>
<path class="r-chrome" d="M150 168 L258 168 L258 171 L150 171 Z"/>
<path class="r-chrome" d="M150 177 L258 177 L258 180 L150 180 Z"/>
<path class="r-light" d="M84 146 L138 140 L141 158 L86 163 Z"/>
<path class="r-light" d="M316 146 L262 140 L259 158 L314 163 Z"/>
<path class="r-dark" d="M92 208 L308 208 L310 218 L90 218 Z"/>
<rect class="r-plate" x="172" y="192" width="56" height="18" rx="3"/>
<path class="r-paint" d="M60 120 L44 128 L46 142 L62 138 Z"/>
<path class="r-paint" d="M340 120 L356 128 L354 142 L338 138 Z"/>
<path class="r-accent" d="M84 168 L138 164" fill="none"/>
<path class="r-accent" d="M316 168 L262 164" fill="none"/>
<circle class="r-badge" cx="200" cy="162" r="7"/></svg>`;

  const interiorSVG = () => `<svg class="render" viewBox="0 0 400 250" aria-hidden="true">
<rect class="r-int-bg" width="400" height="250"/>
<path class="r-ws2" d="M0 0 H400 V78 Q200 52 0 78 Z"/>
<path class="r-dash" d="M0 78 Q200 52 400 78 L400 128 Q330 108 200 106 Q70 108 0 128 Z"/>
<path class="r-strip" d="M8 96 Q200 70 392 96" fill="none"/>
<rect class="r-screen" x="238" y="96" width="118" height="60" rx="8"/>
<rect class="r-ui" x="248" y="106" width="70" height="7" rx="3.5"/>
<rect class="r-ui dim" x="248" y="119" width="98" height="6" rx="3"/>
<rect class="r-ui dim" x="248" y="131" width="84" height="6" rx="3"/>
<circle class="r-knob" cx="342" cy="146" r="6"/><circle class="r-knob" cx="322" cy="146" r="6"/>
<circle cx="128" cy="150" r="52" fill="none" stroke="#262b33" stroke-width="15"/>
<circle cx="128" cy="150" r="52" fill="none" stroke="var(--p)" stroke-width="3" opacity=".55" stroke-dasharray="46 999"/>
<path d="M128 104 L128 150" stroke="#262b33" stroke-width="10"/>
<circle class="r-hub" cx="128" cy="150" r="14"/>
<path class="r-seat" d="M20 250 L34 190 Q38 178 52 180 L64 184 L58 250 Z"/>
<path class="r-seat" d="M380 250 L366 190 Q362 178 348 180 L336 184 L342 250 Z"/>
<rect class="r-console" x="176" y="180" width="48" height="70" rx="8"/>
<path class="r-stitch" d="M60 210 H150" fill="none"/><path class="r-stitch" d="M250 210 H340" fill="none"/></svg>`;

  window.AURUM = { CARS, GRADS, FEATS, PAINTS, fmt, monthly, carSVG, frontSVG, interiorSVG };
})();
