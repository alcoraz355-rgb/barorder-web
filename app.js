/* ══════════════════════════════════════════════════════════════
   BarOrder — Web companion (vanilla JS)
   ══════════════════════════════════════════════════════════════ */

'use strict';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const BASE_CATEGORIES = ['Todos', 'Cerveza', 'Vino', 'Cóctel', 'Spirits', 'Licores', 'Sin alcohol', 'Aperitivos'];
const CATEGORIES = BASE_CATEGORIES;

// Devuelve las categorías presentes en el catálogo activo (admin default o bar).
// Mantiene el orden estándar y añade extras (ej. "Tapas", "Café") al final.
function getCurrentCategories(drinks) {
  const src = drinks || (typeof getAllDrinks === 'function' ? getAllDrinks() : []);
  const presentes = [...new Set(src.map((d) => d.category).filter(Boolean))];
  const orden = BASE_CATEGORIES.filter((c) => c === 'Todos' || presentes.includes(c));
  const extras = presentes.filter((c) => !BASE_CATEGORIES.includes(c));
  return [...orden, ...extras];
}

const DRINKS = [
  // ── Cerveza ──────────────────────────────────────────────────────────────
  { id: 'c1', name: 'Cerveza', emoji: '🍺', category: 'Cerveza', defaultPrice: 2.50,
    brands: ['Mahou', 'Cruzcampo', 'Estrella Damm', 'Estrella Galicia', 'San Miguel', 'Amstel', 'Voll-Damm', 'Alhambra', '1906', 'Moritz', 'Heineken', 'Ámbar', 'Otro'],
    mixers: ['Caña', 'Tercio', 'Tubo', 'Botellín'],
    step1Label: 'Elige la marca', step2Label: 'Elige el tamaño', sep: ' ' },
  { id: 'c2', name: 'Cerveza sin', emoji: '🍺', category: 'Cerveza', defaultPrice: 2.50,
    brands: ['Mahou', 'Cruzcampo', 'Estrella Damm', 'Estrella Galicia', 'San Miguel', 'Amstel', 'Heineken', 'Otro'],
    mixers: ['Caña', 'Tercio', 'Tubo'],
    step1Label: 'Elige la marca', step2Label: 'Elige el tamaño', sep: ' ' },
  { id: 'c3', name: 'Clara', emoji: '🍋', category: 'Cerveza', defaultPrice: 2.50,
    brands: ['Mahou', 'Cruzcampo', 'Estrella Damm', 'San Miguel', 'Amstel', 'Heineken', 'Otro'],
    mixers: ['Caña', 'Tercio', 'Tubo'],
    step1Label: 'Elige la marca', step2Label: 'Elige el tamaño', sep: ' ' },
  { id: 'c4', name: 'Jarra',     emoji: '🍻', category: 'Cerveza', defaultPrice: 5.00 },
  { id: 'c5', name: '0,0 limón', emoji: '🍋', category: 'Cerveza', defaultPrice: 2.00 },
  { id: 'c6', name: 'IPA',       emoji: '🍺', category: 'Cerveza', defaultPrice: 3.50 },
  { id: 'c7', name: 'Tostada',   emoji: '🍺', category: 'Cerveza', defaultPrice: 2.50 },
  { id: 'c8', name: 'Trigo',     emoji: '🍺', category: 'Cerveza', defaultPrice: 3.00 },
  { id: 'c9', name: 'Radler',    emoji: '🍋', category: 'Cerveza', defaultPrice: 2.50 },

  // ── Vino ─────────────────────────────────────────────────────────────────
  { id: 'v1', name: 'Vino tinto', emoji: '🍷', category: 'Vino', defaultPrice: 3.00,
    regions: ['Rioja', 'Ribera del Duero', 'Cariñena', 'Priorat', 'Toro', 'Somontano'],
    agings: ['Joven', 'Crianza', 'Reserva', 'Gran Reserva'] },
  { id: 'v2', name: 'Vino blanco', emoji: '🥂', category: 'Vino', defaultPrice: 3.00,
    regions: ['Albariño', 'Verdejo', 'Rueda', 'Chardonnay', 'Somontano'],
    agings: ['Joven', 'Crianza'] },
  { id: 'v3', name: 'Vino rosado', emoji: '🍾', category: 'Vino', defaultPrice: 3.00,
    regions: ['Navarra', 'Rioja', 'Cigales'],
    agings: ['Joven', 'Crianza'] },
  { id: 'v4',  name: 'Sangría',    emoji: '🍷', category: 'Vino', defaultPrice: 3.50 },
  { id: 'v5',  name: 'Cava',       emoji: '🥂', category: 'Vino', defaultPrice: 4.00 },
  { id: 'v6',  name: 'Vermut',     emoji: '🍸', category: 'Vino', defaultPrice: 2.50 },
  { id: 'v7',  name: 'Fino',       emoji: '🥂', category: 'Vino', defaultPrice: 2.50 },
  { id: 'v8',  name: 'Manzanilla', emoji: '🥂', category: 'Vino', defaultPrice: 2.50 },
  { id: 'v9',  name: 'Lambrusco',  emoji: '🍷', category: 'Vino', defaultPrice: 3.00 },
  { id: 'v10', name: 'Prosecco',   emoji: '🥂', category: 'Vino', defaultPrice: 4.00 },

  // ── Cóctel ───────────────────────────────────────────────────────────────
  { id: 'k1',  name: 'Mojito',           emoji: '🍃', category: 'Cóctel', defaultPrice: 8.00 },
  { id: 'k2',  name: 'Gin tonic',        emoji: '🫧', category: 'Cóctel', defaultPrice: 8.00 },
  { id: 'k3',  name: 'Daiquiri',         emoji: '🍓', category: 'Cóctel', defaultPrice: 7.00 },
  { id: 'k4',  name: 'Margarita',        emoji: '🍋', category: 'Cóctel', defaultPrice: 8.00 },
  { id: 'k5',  name: 'Piña colada',      emoji: '🍍', category: 'Cóctel', defaultPrice: 8.00 },
  { id: 'k6',  name: 'Aperol Spritz',    emoji: '🍊', category: 'Cóctel', defaultPrice: 7.00 },
  { id: 'k7',  name: 'Negroni',          emoji: '🍸', category: 'Cóctel', defaultPrice: 8.00 },
  { id: 'k8',  name: 'Cuba libre',       emoji: '🥃', category: 'Cóctel', defaultPrice: 6.00 },
  { id: 'k9',  name: 'Tinto de verano',  emoji: '🍷', category: 'Cóctel', defaultPrice: 3.50 },
  { id: 'k10', name: 'Rebujito',         emoji: '🥂', category: 'Cóctel', defaultPrice: 3.50 },
  { id: 'k11', name: 'Bloody Mary',      emoji: '🍅', category: 'Cóctel', defaultPrice: 7.00 },
  { id: 'k12', name: 'Cosmopolitan',     emoji: '🍸', category: 'Cóctel', defaultPrice: 8.00 },
  { id: 'k13', name: 'Caipirinha',       emoji: '🍈', category: 'Cóctel', defaultPrice: 8.00 },
  { id: 'k14', name: 'Sex on the Beach', emoji: '🍑', category: 'Cóctel', defaultPrice: 8.00 },
  { id: 'k15', name: 'Moscow Mule',      emoji: '🫚', category: 'Cóctel', defaultPrice: 8.00 },
  { id: 'k16', name: 'Old Fashioned',    emoji: '🥃', category: 'Cóctel', defaultPrice: 9.00 },
  { id: 'k17', name: 'Whisky Sour',      emoji: '🍋', category: 'Cóctel', defaultPrice: 8.00 },

  // ── Spirits ──────────────────────────────────────────────────────────────
  { id: 's1', name: 'Whisky', emoji: '🥃', category: 'Spirits', isSpirit: true, defaultPrice: 6.00,
    brands: ['JB', "Ballantine's", "Jack Daniel's", 'J. Walker Rojo', 'J. Walker Negro', 'Jameson', 'DYC', 'Bourbon', 'Escocés', 'Otro'],
    mixers: ['Solo', 'Con cola', 'Con cola zero', 'Con agua con gas'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's2', name: 'Ron', emoji: '🥃', category: 'Spirits', isSpirit: true, defaultPrice: 6.00,
    brands: ['Barceló', 'Brugal', 'Bacardí', 'Havana Club', 'Captain Morgan', 'Otro'],
    mixers: ['Solo', 'Con cola', 'Con cola zero', 'Con naranja'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's3', name: 'Vodka', emoji: '🍸', category: 'Spirits', isSpirit: true, defaultPrice: 6.00,
    brands: ['Absolut', 'Smirnoff', 'Grey Goose', 'Belvedere', 'Otro'],
    mixers: ['Solo', 'Con tónica', 'Con naranja', 'Con lima'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's4', name: 'Ginebra', emoji: '🌿', category: 'Spirits', isSpirit: true, defaultPrice: 7.00,
    brands: ['Tanqueray', 'Bombay Sapphire', "Hendrick's", 'Beefeater', 'Puerto de Indias', 'Nordés', 'Otro'],
    mixers: ['Solo', 'Con tónica premium', 'Con tónica normal'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's5', name: 'Tequila', emoji: '🥃', category: 'Spirits', isSpirit: true, defaultPrice: 6.00,
    brands: ['José Cuervo', 'Patrón', 'Blanco', 'Reposado', 'Otro'],
    mixers: ['Solo', 'Con lima', 'Con naranja'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's6', name: 'Brandy', emoji: '🥃', category: 'Spirits', isSpirit: true, defaultPrice: 5.00,
    brands: ['Soberano', 'Veterano', 'Magno', 'Torres 10', 'Torres 20', 'Carlos I', 'Cardenal Mendoza', 'Lepanto', 'Otro'],
    mixers: ['Solo', 'Con cola'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's7', name: 'Chupito', emoji: '🥃', category: 'Spirits', defaultPrice: 2.00 },

  // ── Licores ──────────────────────────────────────────────────────────────
  { id: 'l1', name: 'Baileys',      emoji: '🥛', category: 'Licores', defaultPrice: 4.00 },
  { id: 'l2', name: 'Jägermeister', emoji: '🦌', category: 'Licores', defaultPrice: 3.00 },
  { id: 'l3', name: 'Licor café',   emoji: '☕', category: 'Licores', defaultPrice: 3.00 },
  { id: 'l4', name: 'Pacharán',     emoji: '🫐', category: 'Licores', defaultPrice: 3.00 },
  { id: 'l5', name: 'Orujo',        emoji: '🍇', category: 'Licores', defaultPrice: 3.00 },
  { id: 'l6', name: 'Amaretto',     emoji: '🥜', category: 'Licores', defaultPrice: 4.00 },
  { id: 'l7', name: 'Frangelico',   emoji: '🌰', category: 'Licores', defaultPrice: 4.00 },
  { id: 'l8', name: 'Cointreau',    emoji: '🍊', category: 'Licores', defaultPrice: 4.00 },

  // ── Sin alcohol ──────────────────────────────────────────────────────────
  { id: 'n1',  name: 'Agua',             emoji: '💧', category: 'Sin alcohol', defaultPrice: 1.50 },
  { id: 'n13', name: 'Agua con gas',     emoji: '🫧', category: 'Sin alcohol', defaultPrice: 2.00 },
  { id: 'n2',  name: 'Coca-Cola',        emoji: '🥤', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n3',  name: 'Cola light',       emoji: '🥤', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n14', name: 'Cola zero',        emoji: '🥤', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n4',  name: 'Fanta naranja',    emoji: '🍊', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n5',  name: 'Fanta limón',      emoji: '🍋', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n12', name: 'Tónica',           emoji: '🫧', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n15', name: 'Gaseosa',          emoji: '🫧', category: 'Sin alcohol', defaultPrice: 1.50 },
  { id: 'n16', name: 'Bitter',           emoji: '🍹', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n17', name: 'Aquarius limón',   emoji: '🍋', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n18', name: 'Aquarius naranja', emoji: '🍊', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n9',  name: 'Zumo naranja',     emoji: '🍊', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n19', name: 'Zumo melocotón',   emoji: '🍑', category: 'Sin alcohol', defaultPrice: 2.00 },
  { id: 'n20', name: 'Zumo piña',        emoji: '🍍', category: 'Sin alcohol', defaultPrice: 2.00 },
  { id: 'n21', name: 'Zumo tomate',      emoji: '🍅', category: 'Sin alcohol', defaultPrice: 2.00 },
  { id: 'n22', name: 'Zumo manzana',     emoji: '🍏', category: 'Sin alcohol', defaultPrice: 2.00 },
  { id: 'n23', name: 'Mosto tinto',      emoji: '🍇', category: 'Sin alcohol', defaultPrice: 2.00 },
  { id: 'n24', name: 'Mosto blanco',     emoji: '🍇', category: 'Sin alcohol', defaultPrice: 2.00 },
  { id: 'n7',  name: 'Limonada',         emoji: '🍋', category: 'Sin alcohol', defaultPrice: 3.00 },
  { id: 'n25', name: 'Horchata',         emoji: '🥛', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n8',  name: 'Red Bull',         emoji: '⚡', category: 'Sin alcohol', defaultPrice: 4.00 },
  { id: 'n26', name: 'Monster',          emoji: '⚡', category: 'Sin alcohol', defaultPrice: 4.00 },
  { id: 'n27', name: 'Nestea',           emoji: '🧊', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n6',  name: 'Té frío',          emoji: '🧋', category: 'Sin alcohol', defaultPrice: 2.50 },
  { id: 'n10', name: 'Café', emoji: '☕', category: 'Sin alcohol', defaultPrice: 1.80,
    steps: [
      { label: 'Tipo de café', options: ['Café con leche', 'Café solo', 'Cortado', 'Americano', 'Capuccino', 'Bombón', 'Carajillo'] },
      { label: 'Cafeína',      options: ['Normal', 'Descafeinado'] },
      { label: 'Endulzante',   options: ['Con azúcar', 'Con sacarina', 'Sin azúcar'] },
      { label: 'Leche',        options: ['Leche fría', 'Leche caliente'] },
    ] },
  { id: 'n11', name: 'Té',           emoji: '🍵', category: 'Sin alcohol', defaultPrice: 2.00 },
  { id: 'n32', name: 'Manzanilla',   emoji: '🍵', category: 'Sin alcohol', defaultPrice: 2.00 },
  { id: 'n33', name: 'Poleo menta',  emoji: '🍵', category: 'Sin alcohol', defaultPrice: 2.00 },
  { id: 'n34', name: 'Tila',         emoji: '🍵', category: 'Sin alcohol', defaultPrice: 2.00 },
  { id: 'n35', name: 'Batido chocolate', emoji: '🍫', category: 'Sin alcohol', defaultPrice: 3.50 },
  { id: 'n36', name: 'Batido fresa',    emoji: '🍓', category: 'Sin alcohol', defaultPrice: 3.50 },
  { id: 'n37', name: 'Batido vainilla', emoji: '🍦', category: 'Sin alcohol', defaultPrice: 3.50 },
  { id: 'n38', name: 'Granizado limón', emoji: '🍧', category: 'Sin alcohol', defaultPrice: 3.00 },
  { id: 'n39', name: 'Granizado café',  emoji: '🍧', category: 'Sin alcohol', defaultPrice: 3.00 },

  // ── Aperitivos ───────────────────────────────────────────────────────────
  { id: 'ap1',  name: 'Patatas fritas',    emoji: '🍟', category: 'Aperitivos', defaultPrice: 3.00 },
  { id: 'ap2',  name: 'Olivas',            emoji: '🫒', category: 'Aperitivos', defaultPrice: 2.50 },
  { id: 'ap3',  name: 'Pepinillos',        emoji: '🥒', category: 'Aperitivos', defaultPrice: 2.50 },
  { id: 'ap4',  name: 'Revuelto',          emoji: '🍳', category: 'Aperitivos', defaultPrice: 7.00 },
  { id: 'ap5',  name: 'Gambas rebozadas',  emoji: '🍤', category: 'Aperitivos', defaultPrice: 8.00 },
  { id: 'ap6',  name: 'Calamares',         emoji: '🦑', category: 'Aperitivos', defaultPrice: 8.00 },
  { id: 'ap7',  name: 'Tostadas',          emoji: '🍞', category: 'Aperitivos', defaultPrice: 3.00 },
  { id: 'ap8',  name: 'Tapas',             emoji: '🍽️', category: 'Aperitivos', defaultPrice: 4.00 },
  { id: 'ap9',  name: 'Nachos',            emoji: '🧀', category: 'Aperitivos', defaultPrice: 5.00 },
  { id: 'ap10', name: 'Croquetas',         emoji: '🟤', category: 'Aperitivos', defaultPrice: 6.00 },
  { id: 'ap11', name: 'Jamón ibérico',     emoji: '🥓', category: 'Aperitivos', defaultPrice: 12.00 },
  { id: 'ap12', name: 'Queso curado',      emoji: '🧀', category: 'Aperitivos', defaultPrice: 8.00 },
  { id: 'ap13', name: 'Ensaladilla rusa',  emoji: '🥗', category: 'Aperitivos', defaultPrice: 5.00 },
  { id: 'ap14', name: 'Pimientos padrón',  emoji: '🌶️', category: 'Aperitivos', defaultPrice: 5.00 },
  { id: 'ap15', name: 'Boquerones',        emoji: '🐟', category: 'Aperitivos', defaultPrice: 7.00 },
  { id: 'ap16', name: 'Montaditos',        emoji: '🥖', category: 'Aperitivos', defaultPrice: 5.00 },
  { id: 'ap17', name: 'Tabla embutidos',   emoji: '🥩', category: 'Aperitivos', defaultPrice: 14.00 },
  { id: 'ap18', name: 'Alitas de pollo',   emoji: '🍗', category: 'Aperitivos', defaultPrice: 8.00 },
  { id: 'ap19', name: 'Aros de cebolla',   emoji: '🧅', category: 'Aperitivos', defaultPrice: 5.00 },
  { id: 'ap20', name: 'Pan con tomate',    emoji: '🍅', category: 'Aperitivos', defaultPrice: 3.00 },
  { id: 'ap21', name: 'Tortilla española', emoji: '🥚', category: 'Aperitivos', defaultPrice: 5.00 },
  { id: 'ap22', name: 'Mejillones',        emoji: '🦪', category: 'Aperitivos', defaultPrice: 6.00 },
  { id: 'ap23', name: 'Pulpo',             emoji: '🐙', category: 'Aperitivos', defaultPrice: 12.00 },
  { id: 'ap24', name: 'Anchoas',           emoji: '🐟', category: 'Aperitivos', defaultPrice: 7.00 },
  { id: 'ap25', name: 'Frutos secos',      emoji: '🥜', category: 'Aperitivos', defaultPrice: 2.50 },
];

const state = {
  mesa:             null,
  miembro:          null,
  nombre:           null,
  quantities:       {},   // { baseId: number }
  brandSelections:  {},   // { baseId: string[] } — una selección por unidad
  customDrinks:     [],
  prices:           {},   // { drinkId: number } — precios del admin
  selectedCategory: 'Todos',
  channel:          null,
  chatChannel:      null,
  chatMensajes:     [],
  hasUnread:        false,
};

const SESSION_KEY = 'barorder_web_session';

const $ = (id) => document.getElementById(id);

function showScreen(name) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  $(`screen-${name}`).classList.add('active');
  // Voz: solo visible en pantalla de pedidos
  const voiceBubble = $('voice-bubble');
  if (voiceBubble) voiceBubble.style.display = 'none';
  if (name !== 'order' && _voz.active) { _voz.active = false; try { _voz.recorder?.stop(); } catch(_){} _voz.stream?.getTracks().forEach(t=>t.stop()); }
  // Chat global: ocultar en order (botón integrado) y en home (botón inline "Chat 💬")
  const chatFab = $('chat-fab');
  if (chatFab) chatFab.style.display = (name === 'order' || name === 'home') ? 'none' : '';
}

function showClosedByAdmin() {
  const el = $('screen-closed');
  if (el) {
    const title = el.querySelector('.closed-title');
    const sub = el.querySelector('.closed-sub');
    const emoji = el.querySelector('.closed-emoji');
    if (title) title.textContent = '¡El grupo ha finalizado!';
    if (sub) sub.textContent = 'El administrador ha cerrado el grupo. ¡Gracias por venir! 🍻';
    if (emoji) emoji.textContent = '🎉';
  }
  const fab = $('chat-fab');
  if (fab) fab.style.display = 'none';
  document.body.classList.remove('amigo-mode');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0D0D0D');
  showScreen('closed');
  setTimeout(() => {
    localStorage.removeItem(SESSION_KEY);
  }, 2000);
}

function getAllDrinks() {
  if (!state.customDrinks || state.customDrinks.length === 0) return DRINKS;
  // Merge: el catálogo custom solo guarda id/name/emoji/category/price.
  // Recuperamos brands/regions/mixers/agings/steps del catálogo base para
  // que el selector de marca/región siga funcionando.
  return state.customDrinks.map((cd) => {
    const base = DRINKS.find((d) => d.id === cd.id);
    return base ? { ...base, ...cd } : cd;
  });
}

// ─── Modal de selección de marca/región ───────────────────────────────────────
function buildStepsWeb(drink) {
  if (drink.steps) return drink.steps;
  const steps = [];
  const opts1 = drink.brands || drink.regions || [];
  const opts2 = drink.mixers || drink.agings || [];
  if (opts1.length) steps.push({ label: drink.step1Label || (drink.brands ? 'Elige el tipo' : 'Elige la región'), options: opts1 });
  if (opts2.length) steps.push({ label: drink.step2Label || (drink.mixers ? 'Elige el refresco' : 'Elige la crianza'), options: opts2 });
  return steps;
}

function getWebSep(drink) {
  if (drink.sep !== undefined) return drink.sep;
  if (drink.steps) return ' · ';
  return drink.mixers ? ' + ' : ' ';
}

// Estado del modal de marca expuesto para la voz
let _brandModalState = null;

function openBrandModal(drink, onSelect) {
  const modal = $('brand-modal');
  const steps = buildStepsWeb(drink);
  const sep = getWebSep(drink);

  let stepIndex = 0;
  let stepValues = [];

  function renderStep() {
    const current = steps[stepIndex];
    $('modal-drink-title').textContent = `${drink.emoji}  ${drink.name}`;
    $('modal-label').textContent = current.label;

    // Exponer opciones actuales para el reconocimiento de voz
    _brandModalState = { options: current.options, selectOption };

    const backEl = $('modal-back');
    if (stepIndex > 0) {
      backEl.style.display = 'flex';
      $('modal-step1-value').textContent = stepValues.join(sep);
      backEl.onclick = () => { stepValues = stepValues.slice(0, -1); stepIndex--; renderStep(); };
    } else {
      backEl.style.display = 'none';
    }

    const optionsEl = $('modal-options');
    optionsEl.innerHTML = '';
    current.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'modal-option';
      btn.innerHTML = `<span>${opt}</span><span class="modal-option-arrow">›</span>`;
      btn.onclick = () => selectOption(opt);
      optionsEl.appendChild(btn);
    });
  }

  function selectOption(opt) {
    const newValues = [...stepValues, opt];
    if (stepIndex < steps.length - 1) {
      stepValues = newValues;
      stepIndex++;
      renderStep();
    } else {
      closeModal();
      onSelect(newValues.join(sep));
    }
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.onclick = null;
    $('modal-cancel').onclick = null;
    _brandModalState = null;
  }

  $('modal-cancel').onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  renderStep();
  modal.style.display = 'flex';
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  // Bloquear navegación atrás/adelante del navegador: cualquier popstate vuelve a empujar
  // el estado actual, atrapando al usuario dentro de la app hasta que cierre la pestaña.
  try {
    history.pushState({ barorder: true }, '', location.href);
    window.addEventListener('popstate', () => {
      history.pushState({ barorder: true }, '', location.href);
    });
  } catch (_) {}

  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const mesaCodigo = (pathParts[0] || '').toUpperCase();

  if (!mesaCodigo || (!mesaCodigo.startsWith('GR-') && !mesaCodigo.startsWith('MESA-'))) {
    showScreen('closed');
    $('screen-closed').querySelector('.closed-title').textContent = 'Enlace inválido';
    $('screen-closed').querySelector('.closed-sub').textContent = 'Pide al organizador que te comparta el enlace correcto.';
    return;
  }

  let mesa;
  try {
    const { data, error } = await sb.from('mesas').select('*').eq('codigo', mesaCodigo).single();
    if (error || !data) throw new Error('Mesa no encontrada');
    mesa = data;
    state.mesa = mesa;
    state.customDrinks = mesa.custom_drinks || [];
    state.prices = mesa.custom_prices || {};
  } catch {
    showScreen('closed');
    $('screen-closed').querySelector('.closed-title').textContent = 'Mesa no encontrada';
    $('screen-closed').querySelector('.closed-sub').textContent = 'El enlace ha expirado o es incorrecto.';
    return;
  }

  if (mesa.estado === 'cerrada') { showScreen('closed'); return; }

  const saved = loadSession(mesaCodigo);

  if (saved) {
    const { data: miembro } = await sb.from('miembros').select('*').eq('id', saved.miembroId).single();
    if (miembro && !miembro.nombre.startsWith('[SALIDO] ')) {
      state.miembro = miembro;
      state.nombre  = miembro.nombre;
      document.body.classList.add('amigo-mode');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0D0D0D');
      await cargarPedidosExistentes();
      subscribeRealtime();
      startPollingEliminacion();
      await initChat();
      // Si la mesa está lanzada, ir al home directamente (el reparto solo se muestra por realtime)
      renderHomeScreen();
      showScreen('home');
      return;
    }
    // Sesión antigua con miembro eliminado o salido → limpiar y mostrar pantalla de unirse
    localStorage.removeItem(SESSION_KEY);
  }

  // Grupo bloqueado por el admin (no admite nuevos miembros)
  if (mesa.bloqueada) {
    const el = $('screen-closed');
    if (el) {
      const emoji = el.querySelector('.closed-emoji');
      const title = el.querySelector('.closed-title');
      const sub   = el.querySelector('.closed-sub');
      if (emoji) emoji.textContent = '🔒';
      if (title) title.textContent = 'Sin acceso';
      if (sub)   sub.textContent   = 'No tienes acceso a este grupo.';
    }
    showScreen('closed');
    setTimeout(() => { window.location.href = '/'; }, 2000);
    return;
  }

  const nombreGrupo = mesa.nombre || mesaCodigo;
  $('join-mesa-text').textContent = `"${nombreGrupo}" — ¿Cuál es tu nombre?`;
  $('btn-join').addEventListener('click', () => handleJoin());
  $('input-nombre').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleJoin(); });
  showScreen('join');
}

// ─── Cargar pedidos existentes del miembro ────────────────────────────────────
async function cargarPedidosExistentes() {
  if (!state.miembro || !state.mesa) return;
  const { data: pedidos } = await sb.from('pedidos')
    .select('*')
    .eq('miembro_id', state.miembro.id)
    .eq('mesa_id', state.mesa.id)
    .eq('estado', 'confirmado');

  state.quantities = {};
  state.brandSelections = {};

  (pedidos || []).forEach((p) => {
    const baseId = p.drink_id.split('|')[0];
    state.quantities[baseId] = (state.quantities[baseId] || 0) + p.cantidad;
    const sel = p.marca || '';
    if (!state.brandSelections[baseId]) state.brandSelections[baseId] = [];
    for (let i = 0; i < p.cantidad; i++) state.brandSelections[baseId].push(sel);
  });
}

// ─── Unirse a la mesa ─────────────────────────────────────────────────────────
async function handleJoin() {
  const nombre = $('input-nombre').value.trim();
  if (!nombre) { $('input-nombre').focus(); return; }

  $('btn-join').disabled = true;
  $('btn-join').textContent = '...';

  try {
    // Comprobar que el grupo sigue abierto al momento de unirse
    const { data: mesaCheck } = await sb.from('mesas').select('bloqueada, estado').eq('id', state.mesa.id).single();
    if (mesaCheck?.bloqueada) {
      $('btn-join').disabled = false;
      $('btn-join').textContent = 'Entrar a la mesa →';
      alert('El administrador ha bloqueado el acceso al grupo. Pídele que lo vuelva a abrir.');
      return;
    }
    if (mesaCheck?.estado === 'cerrada') {
      $('btn-join').disabled = false;
      $('btn-join').textContent = 'Entrar a la mesa →';
      alert('Esta mesa ya está cerrada.');
      return;
    }

    // Comprobar que el nombre no existe ya en el grupo (activo o salido)
    const { data: existing } = await sb.from('miembros').select('nombre').eq('mesa_id', state.mesa.id);
    const nombresBloqueados = (existing || []).map((m) => m.nombre.replace(/^\[SALIDO\] /, '').toLowerCase());
    if (nombresBloqueados.includes(nombre.toLowerCase())) {
      $('btn-join').disabled = false;
      $('btn-join').textContent = 'Entrar a la mesa →';
      alert(`El nombre "${nombre}" ya está en uso en este grupo. Elige otro nombre.`);
      return;
    }

    const { data: miembro, error } = await sb
      .from('miembros')
      .insert({ mesa_id: state.mesa.id, nombre, es_admin: false })
      .select().single();
    if (error) throw error;

    state.miembro = miembro;
    state.nombre  = nombre;
    saveSession(state.mesa.codigo, miembro.id, nombre);
    document.body.classList.add('amigo-mode');

    subscribeRealtime();
    await initChat();
    renderHomeScreen();
    showScreen('home');
  } catch (e) {
    $('btn-join').disabled = false;
    $('btn-join').textContent = 'Entrar a la mesa →';
    const msg = e.message || '';
    if (msg.includes('network') || msg.includes('fetch')) alert('Sin conexión. Comprueba tu internet e inténtalo de nuevo.');
    else if (msg.includes('not found') || msg.includes('no rows')) alert('Código de mesa no encontrado. Comprueba el enlace.');
    else if (msg.includes('cerrada')) alert('Esta mesa ya está cerrada.');
    else alert('No se pudo entrar a la mesa. Inténtalo de nuevo.');
  }
}

// ─── Pantalla Home (amigo) ────────────────────────────────────────────────────
function renderHomeScreen() {
  const mesa = state.mesa;
  const ronda = mesa.ronda ?? 1;
  const abierta = mesa.estado === 'abierta';
  // La ronda solo se considera "iniciada" cuando el admin ha elegido el pagador
  // (en ese momento orden_pagadores se llena). Antes, el amigo no puede pedir.
  const ordenIds = Array.isArray(mesa.orden_pagadores) ? mesa.orden_pagadores : [];
  const rondaIniciada = abierta && ordenIds.length > 0;

  // Fecha
  const fechaEl = $('home-fecha');
  if (fechaEl) {
    fechaEl.textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Código / nombre de grupo
  const groupNameEl = $('home-group-name');
  const codeEl = $('home-code');
  const amigoNameEl = $('home-amigo-name');
  if (groupNameEl) {
    if (mesa.nombre) { groupNameEl.textContent = mesa.nombre; groupNameEl.style.display = 'block'; }
    else groupNameEl.style.display = 'none';
  }
  if (codeEl) codeEl.textContent = mesa.codigo;
  if (amigoNameEl) amigoNameEl.textContent = `👤 ${state.nombre}`;

  // Ronda
  const rondaBoxEl = $('home-ronda-box');
  const rondaLabelEl = $('home-ronda-label');
  const rondaNumEl = $('home-ronda-num');
  if (rondaBoxEl) {
    rondaBoxEl.classList.toggle('abierta', rondaIniciada);
    rondaBoxEl.classList.toggle('estado-lanzada', mesa.estado === 'lanzada');
    rondaBoxEl.classList.toggle('estado-esperando', !rondaIniciada && abierta);
  }
  if (rondaLabelEl) {
    if (!rondaIniciada && abierta) rondaLabelEl.textContent = 'Esperando a que el admin inicie la RONDA';
    else if (rondaIniciada) rondaLabelEl.textContent = 'Se está pidiendo en la RONDA';
    else rondaLabelEl.textContent = 'Pedidos cerrados para la RONDA';
  }
  if (rondaNumEl) rondaNumEl.textContent = ronda;

  // Aviso de "orden entregada al camarero" — visible solo mientras estado='lanzada'.
  // Desaparece al abrir una nueva ronda (estado pasa a 'abierta' otra vez).
  const ordenEntregadaEl = $('home-orden-entregada');
  if (ordenEntregadaEl) {
    ordenEntregadaEl.style.display = mesa.estado === 'lanzada' ? 'block' : 'none';
  }

  // Pagador de esta ronda y la siguiente (solo si la ronda está iniciada)
  const pagadorLinesEl = $('home-pagador-lines');
  if (pagadorLinesEl && !rondaIniciada) {
    pagadorLinesEl.style.display = 'none';
  }
  if (pagadorLinesEl && rondaIniciada) {
    sb.from('miembros').select('id, nombre').eq('mesa_id', mesa.id).order('created_at', { ascending: true })
      .then(({ data }) => {
        const activos = (data || []).filter((m) => !m.nombre.startsWith('[SALIDO] '));
        if (activos.length === 0) return;
        // orden_pagadores siempre está lleno aquí (rondaIniciada garantiza length > 0)
        const mapa = {}; activos.forEach((m) => { mapa[m.id] = m; });
        const ordenados = ordenIds.map((id) => mapa[id]).filter(Boolean);
        activos.forEach((m) => { if (!ordenIds.includes(m.id)) ordenados.push(m); });
        const pagador = ordenados[0];
        const sigPagador = ordenados[1] || ordenados[0];
        const sigRonda = ronda + 1;
        const textEl = $('home-pagador-text');
        if (textEl && pagador && sigPagador) {
          textEl.textContent = `Pago RONDAS ${ronda}/${sigRonda}: ${pagador.nombre} / ${sigPagador.nombre}`;
        }
        pagadorLinesEl.style.display = 'block';
      });
  }

  // Botón salir
  const btnSalir = $('btn-home-salir');
  if (btnSalir) {
    btnSalir.onclick = async () => {
      if (!confirm('¿Seguro que quieres salir del grupo? Tus pedidos quedan registrados.')) return;
      stopPollingEliminacion();
      if (state.channel) { state.channel.unsubscribe(); state.channel = null; }
      if (state.chatChannel) { state.chatChannel.unsubscribe(); state.chatChannel = null; }
      // Marcar miembro como salido (preserva pedidos y datos de rondas)
      if (state.miembro?.id) {
        await sb.from('miembros').update({ nombre: '[SALIDO] ' + state.nombre }).eq('id', state.miembro.id);
      }
      // Limpiar sesión
      localStorage.removeItem(SESSION_KEY);
      document.body.classList.remove('amigo-mode');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0D0D0D');
      const fab = $('chat-fab');
      if (fab) fab.style.display = 'none';
      // Pantalla de despedida
      const el = $('screen-closed');
      if (el) {
        const title = el.querySelector('.closed-title');
        const sub = el.querySelector('.closed-sub');
        const emoji = el.querySelector('.closed-emoji');
        if (title) title.textContent = '¡Hasta la próxima!';
        if (sub) sub.textContent = 'Has salido del grupo. ¡Que aproveche! 🍻';
        if (emoji) emoji.textContent = '👋';
      }
      showScreen('closed');
      setTimeout(() => {
        // Intentar cerrar la pestaña; si el navegador no lo permite, dejar la pantalla vacía
        try { window.close(); } catch (_) {}
        document.body.innerHTML = '';
        document.body.style.background = '#0D0D0D';
      }, 2000);
    };
  }

  // Botón pedidos
  // Botón pedidos — muestra nombre del bar si hay uno activo y recarga catálogo al abrir
  const btnPedidos = $('btn-home-pedidos');
  if (btnPedidos) {
    const tienePedido = Object.values(state.quantities || {}).some((q) => q > 0);
    const nombreBarPedidos = (mesa.nombre_bar || '').trim();
    const tituloBar = nombreBarPedidos
      ? (/^(bar|restaurante)\b/i.test(nombreBarPedidos) ? nombreBarPedidos : `Bar ${nombreBarPedidos}`).toUpperCase()
      : '';
    const labelEl = $('btn-home-pedidos-label');
    let labelText;
    if (!rondaIniciada) labelText = '⏳  ESPERANDO APERTURA RONDA';
    else if (tienePedido) labelText = tituloBar ? `✏️  MODIFICAR PEDIDO — ${tituloBar}` : '✏️  MODIFICAR PEDIDO';
    else labelText = tituloBar ? `🍺  NUEVO PEDIDO — ${tituloBar}` : '🍺  NUEVO PEDIDO';
    if (labelEl) labelEl.textContent = labelText;
    else btnPedidos.textContent = labelText;
    btnPedidos.disabled = !rondaIniciada;
    btnPedidos.onclick = async () => {
      // Cargar catálogo activo más reciente antes de abrir la pantalla de pedido
      try {
        const { data: mesaFresh } = await sb.from('mesas').select('custom_drinks, nombre_bar').eq('id', state.mesa.id).single();
        if (mesaFresh) {
          if (Array.isArray(mesaFresh.custom_drinks)) state.customDrinks = mesaFresh.custom_drinks;
          if ('nombre_bar' in mesaFresh) state.mesa.nombre_bar = mesaFresh.nombre_bar;
        }
      } catch {}
      renderOrderScreen();
      showScreen('order');
    };
  }

  // Botón historial
  const btnHistorial = $('btn-home-historial');
  if (btnHistorial) {
    btnHistorial.onclick = showResumenScreen;
  }

  // Botón catálogo — carga datos frescos y muestra el catálogo activo del admin.
  // Si el admin tiene un bar cargado, el botón muestra el nombre del bar en vez de "CATÁLOGO".
  const btnCatalogo = $('btn-home-catalogo');
  if (btnCatalogo) {
    const nombreBar = (mesa.nombre_bar || '').trim();
    const catLabelEl = $('btn-home-catalogo-label');
    let catLabel;
    if (nombreBar) {
      const empiezaConBar = /^(bar|restaurante)\b/i.test(nombreBar);
      const titulo = (empiezaConBar ? nombreBar : `Bar ${nombreBar}`).toUpperCase();
      catLabel = `🍹 ${titulo}`;
    } else {
      catLabel = '🍹 CATÁLOGO';
    }
    if (catLabelEl) catLabelEl.textContent = catLabel;
    else btnCatalogo.textContent = catLabel;
    btnCatalogo.onclick = async () => {
      try {
        const { data: mesaFresh } = await sb.from('mesas').select('custom_drinks, nombre_bar').eq('id', state.mesa.id).single();
        if (mesaFresh?.custom_drinks?.length) {
          state.customDrinks = mesaFresh.custom_drinks;
        }
        if (mesaFresh && 'nombre_bar' in mesaFresh) {
          state.mesa.nombre_bar = mesaFresh.nombre_bar;
        }
      } catch {}
      const tituloPantalla = (state.mesa.nombre_bar && state.mesa.nombre_bar.trim())
        ? (/^(bar|restaurante)\b/i.test(state.mesa.nombre_bar.trim()) ? state.mesa.nombre_bar.trim() : `Bar ${state.mesa.nombre_bar.trim()}`)
        : 'Precios del bar';
      // Usar directamente los precios que vienen en custom_drinks del admin
      const drinks = (state.customDrinks && state.customDrinks.length > 0)
        ? state.customDrinks.map((d) => ({ ...d, price: d.price ?? d.defaultPrice ?? 0 }))
        : DRINKS.map((d) => ({ ...d, price: d.defaultPrice ?? 0 }));
      showCatalogoScreen(drinks, tituloPantalla);
    };
  }
}

// ─── Catálogo selector (dos opciones: por defecto / del bar) ─────────────────
function showCatalogoSelector() {
  const hasBarCatalog = state.customDrinks && state.customDrinks.length > 0;
  const adminMode = state.mesa?.catalog_mode || 'default'; // 'default' o 'bar'
  const modal = $('catalogo-modal');
  const list = $('catalogo-list');
  const catsEl = $('catalogo-cats');
  if (!modal) return;

  if (catsEl) catsEl.innerHTML = '';
  if (list) {
    list.innerHTML = '';

    // Etiqueta del catálogo activo del admin
    const activoEl = document.createElement('div');
    activoEl.style.cssText = 'color:#9090FF;font-size:13px;font-weight:700;text-align:center;margin-bottom:12px;letter-spacing:1px;';
    activoEl.textContent = adminMode === 'bar' ? '✅ El bar usa: Catálogo del Bar' : '✅ El bar usa: Catálogo por defecto';
    list.appendChild(activoEl);

    // Opción 1: catálogo por defecto
    const btn1 = document.createElement('button');
    const isDefaultActive = adminMode === 'default';
    btn1.style.cssText = `width:100%;padding:16px;border-radius:14px;border:2px solid ${isDefaultActive ? '#9090FF' : 'var(--gold)'};background:${isDefaultActive ? '#0D0D1F' : '#000'};color:${isDefaultActive ? '#9090FF' : 'var(--gold)'};font-size:16px;font-weight:800;cursor:pointer;margin-bottom:10px;`;
    btn1.textContent = (isDefaultActive ? '✅ ' : '📋  ') + 'Catálogo por defecto';
    btn1.onclick = () => {
      modal.style.display = 'none';
      // Construir mapa de precios desde el catálogo sincronizado por el admin
      const preciosAdmin = {};
      (state.customDrinks || []).forEach((d) => {
        if (d.price !== undefined) preciosAdmin[d.id] = d.price;
      });
      const drinksConPrecios = DRINKS.map((d) => ({
        ...d,
        price: state.prices[d.id] !== undefined ? state.prices[d.id]
              : preciosAdmin[d.id] !== undefined ? preciosAdmin[d.id]
              : 0,
      }));
      showCatalogoScreen(drinksConPrecios, 'Catálogo por defecto');
    };
    list.appendChild(btn1);

    // Opción 2: catálogo del bar
    const btn2 = document.createElement('button');
    const barDrinks = hasBarCatalog ? state.customDrinks : null;
    const isBarActive = adminMode === 'bar';
    btn2.style.cssText = `width:100%;padding:16px;border-radius:14px;border:2px solid ${isBarActive ? '#9090FF' : 'var(--gold)'};background:${isBarActive ? '#0D0D1F' : '#000'};color:${isBarActive ? '#9090FF' : 'var(--gold)'};font-size:16px;font-weight:800;cursor:pointer;margin-bottom:10px;opacity:${barDrinks ? 1 : 0.4};`;
    btn2.textContent = (isBarActive ? '✅ ' : '🍺  ') + 'Catálogo del Bar';
    btn2.disabled = !barDrinks;
    btn2.onclick = () => {
      if (barDrinks) {
        modal.style.display = 'none';
        // Aplicar precios personalizados del admin sobre el catálogo del bar
        const barConPrecios = barDrinks.map((d) => ({
          ...d,
          price: state.prices[d.id] !== undefined ? state.prices[d.id] : (d.price ?? d.defaultPrice ?? 0),
        }));
        showCatalogoScreen(barConPrecios, 'Catálogo del Bar');
      }
    };
    list.appendChild(btn2);

    if (!barDrinks) {
      const note = document.createElement('div');
      note.style.cssText = 'color:#555;font-size:12px;text-align:center;margin-top:4px;';
      note.textContent = 'El bar no ha configurado su catálogo aún';
      list.appendChild(note);
    }
  }

  $('btn-catalogo-close').onclick = () => { modal.style.display = 'none'; };
  modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
  modal.style.display = 'flex';
}

function showCatalogoScreen(drinks, titulo, selectedCat = 'Todos') {
  const categories = getCurrentCategories(drinks);
  if (!categories.includes(selectedCat)) selectedCat = 'Todos';
  const catsEl = $('catalogo-screen-cats');
  const list = $('catalogo-screen-list');

  // Título
  const titleEl = document.querySelector('#screen-catalogo .logo-title h1');
  if (titleEl) titleEl.textContent = titulo;

  // Pills
  if (catsEl) {
    catsEl.innerHTML = '';
    categories.forEach((cat) => {
      const pill = document.createElement('button');
      pill.className = 'cat-pill' + (cat === selectedCat ? ' active' : '');
      pill.textContent = cat;
      pill.onclick = () => showCatalogoScreen(drinks, titulo, cat);
      catsEl.appendChild(pill);
    });
  }

  // Lista
  if (list) {
    list.innerHTML = '';
    const filtered = selectedCat === 'Todos'
      ? categories.filter((c) => c !== 'Todos')
      : [selectedCat];

    filtered.forEach((cat) => {
      const catDrinks = drinks.filter((d) => d.category === cat);
      if (!catDrinks.length) return;

      if (selectedCat === 'Todos') {
        const header = document.createElement('div');
        header.style.cssText = 'color:var(--gold);font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:14px 0 6px;';
        header.textContent = cat;
        list.appendChild(header);
      }

      catDrinks.forEach((drink) => {
        const price = drink.price ?? drink.defaultPrice ?? 0;
        const item = document.createElement('div');
        item.className = 'catalogo-item';
        item.innerHTML = `
          <span class="catalogo-item-emoji">${drink.emoji}</span>
          <span class="catalogo-item-name">${drink.name}</span>
          <span class="catalogo-item-price">${price.toFixed(2).replace('.', ',')} €</span>
        `;
        list.appendChild(item);
      });
    });

    const note = document.createElement('div');
    note.style.cssText = 'color:#555;text-align:center;font-size:12px;margin-top:16px;';
    note.textContent = '* Precios orientativos';
    list.appendChild(note);
  }

  $('btn-catalogo-volver').onclick = () => showScreen('home');
  showScreen('catalogo');
}

async function showResumenScreen() {
  const list = $('resumen-content');
  if (!list) return;

  list.innerHTML = '<div style="color:#666;text-align:center;padding:40px">Cargando...</div>';
  $('btn-resumen-volver').onclick = () => showScreen('home');
  showScreen('resumen');

  try {
    const allDrinks = getAllDrinks();
    function getPrice(drinkId) {
      const base = drinkId.split('|')[0];
      return allDrinks.find((x) => x.id === base)?.price || 0;
    }

    // Cargar ronda actual de BD
    const { data: pedidosActuales } = await sb
      .from('pedidos').select('*')
      .eq('mesa_id', state.mesa.id)
      .eq('miembro_id', state.miembro.id)
      .eq('estado', 'confirmado');

    // Cargar historial de rondas anteriores desde localStorage
    const historialLocal = cargarHistorialLocal();

    // Construir mapa por ronda: historial local + ronda actual
    // Cada entrada: { pedidos, bar }
    const porRonda = {};
    historialLocal.forEach(({ rondaNum, pedidos, bar }) => {
      porRonda[rondaNum] = { pedidos, bar: bar || null };
    });
    // La ronda actual de BD sobreescribe si ya existia guardada
    const rondaActual = state.mesa.ronda ?? 1;
    if (pedidosActuales && pedidosActuales.length) {
      porRonda[rondaActual] = {
        pedidos: pedidosActuales,
        bar: (state.mesa.nombre_bar || '').trim() || (porRonda[rondaActual]?.bar || null),
      };
    }

    list.innerHTML = '';

    if (Object.keys(porRonda).length === 0) {
      list.innerHTML = '<div style="color:#666;text-align:center;padding:20px">No tienes pedidos confirmados aún</div>';
      return;
    }

    // Total consumido (todas las rondas)
    let consumido = 0;
    Object.values(porRonda).forEach((entry) => {
      (entry.pedidos || []).forEach((p) => { consumido += getPrice(p.drink_id) * p.cantidad; });
    });

    const totalBox = document.createElement('div');
    totalBox.style.cssText = 'display:flex;gap:8px;margin-bottom:14px;';
    totalBox.innerHTML = `
      <div style="flex:1;background:#1A1200;border:1px solid var(--gold);border-radius:12px;padding:12px;text-align:center">
        <div style="color:#999;font-size:10px;font-weight:700;letter-spacing:1px;margin-bottom:4px">TOTAL CONSUMIDO</div>
        <div style="color:var(--gold);font-size:22px;font-weight:900">${consumido.toFixed(2)} €</div>
      </div>
      <div style="flex:1;background:#0D1200;border:1px solid #9090FF;border-radius:12px;padding:12px;text-align:center">
        <div style="color:#999;font-size:10px;font-weight:700;letter-spacing:1px;margin-bottom:4px">RONDAS</div>
        <div style="color:#9090FF;font-size:22px;font-weight:900">${Object.keys(porRonda).length}</div>
      </div>
    `;
    list.appendChild(totalBox);

    // Mostrar cada ronda
    Object.entries(porRonda).sort(([a], [b]) => Number(a) - Number(b)).forEach(([rondaNum, entry]) => {
      const rPeds = entry.pedidos || [];
      const bar = entry.bar || null;
      const header = document.createElement('div');
      header.style.cssText = 'display:flex;align-items:center;gap:8px;margin:12px 0 6px;flex-wrap:wrap';
      let modsKey = 'barorder_ronda_modificada_' + state.mesa.id;
      let mods = []; try { mods = JSON.parse(localStorage.getItem(modsKey) || '[]'); } catch(_){}
      const modTag = mods.includes(Number(rondaNum)) ? ' <span style="color:#D4A843;font-size:12px">(Modificada por admin)</span>' : '';
      const barTag = bar
        ? ` <span style="color:#27AE60;font-family:Georgia,\\'Times New Roman\\',serif;font-style:italic;font-weight:700;font-size:17px">— ${bar}</span>`
        : '';
      header.innerHTML = `<span style="color:#9090FF;font-size:19px;font-weight:900">Ronda Nº ${rondaNum}</span>${barTag}${modTag}
        <div style="flex:1;height:1px;background:#9090FF;opacity:0.4"></div>`;
      list.appendChild(header);

      let totalRonda = 0;
      rPeds.forEach((p) => {
        const precio = getPrice(p.drink_id) * p.cantidad;
        totalRonda += precio;
        const row = document.createElement('div');
        row.className = 'historial-drink-row';
        row.innerHTML = `
          <span style="font-size:22px">${p.drink_emoji}</span>
          <span style="flex:1;font-size:17px">${p.drink_name}${p.marca ? ' · ' + p.marca : ''}</span>
          <span style="color:#999;font-size:16px">×${p.cantidad}</span>
          <span style="color:var(--gold);margin-left:8px;font-size:16px;font-weight:700">${precio.toFixed(2)} €</span>
        `;
        list.appendChild(row);
      });

      const totalRondaEl = document.createElement('div');
      totalRondaEl.style.cssText = 'text-align:right;color:#666;font-size:13px;margin-top:4px;padding-right:2px;';
      totalRondaEl.textContent = `Subtotal ronda: ${totalRonda.toFixed(2)} €`;
      list.appendChild(totalRondaEl);
    });

    const note = document.createElement('div');
    note.style.cssText = 'color:#555;text-align:center;font-size:12px;margin-top:16px;';
    note.textContent = '* Precios orientativos';
    list.appendChild(note);

  } catch (e) {
    list.innerHTML = '<div style="color:#666;text-align:center;padding:20px">Error al cargar</div>';
  }
}

// ─── Pantalla de pedido ───────────────────────────────────────────────────────
function renderOrderScreen() {
  const nombreLabel = $('order-nombre-label');
  if (nombreLabel) {
    const rawBar = (state.mesa.nombre_bar || '').trim();
    if (rawBar) {
      const empiezaConBar = /^(bar|restaurante)\b/i.test(rawBar);
      const nombreBarLabel = (empiezaConBar ? rawBar : `Bar ${rawBar}`).toUpperCase();
      nombreLabel.innerHTML = '<span style="color:#FF3333">' + nombreBarLabel + '</span>';
    } else if (state.nombre) {
      nombreLabel.innerHTML = 'Pedido de <span style="color:#FF3333;text-transform:uppercase">' + state.nombre + '</span>';
    }
  }
  const grupoLabel = $('order-grupo-label');
  if (grupoLabel) { grupoLabel.innerHTML = ''; grupoLabel.style.display = 'none'; }
  renderCategories();
  renderDrinks();

  $('btn-confirmar').disabled = false;
  $('btn-confirmar').textContent = '✓  Confirmar pedido';
  $('btn-confirmar').onclick = handleConfirmar;
  $('btn-eliminar-seleccion').onclick = handleEliminarSeleccion;
  initVoiceFab();
  const btnOrderVolver = $('btn-order-volver');
  if (btnOrderVolver) btnOrderVolver.onclick = () => { renderHomeScreen(); showScreen('home'); };

  // Etiqueta de ronda
  const ronda = state.mesa.ronda ?? 1;
  const rondaTopEl = document.getElementById('order-ronda-badge-top');
  if (rondaTopEl) rondaTopEl.textContent = `🔄 Ronda ${ronda}`;

  // Nombre del pagador de esta ronda
  const pagadorEl = document.getElementById('order-pagador-badge');
  if (pagadorEl) {
    sb.from('miembros').select('id, nombre').eq('mesa_id', state.mesa.id).order('created_at', { ascending: true })
      .then(({ data }) => {
        const activos = (data || []).filter((m) => !m.nombre.startsWith('[SALIDO] '));
        if (activos.length === 0) return;
        const ordenIds = Array.isArray(state.mesa.orden_pagadores) ? state.mesa.orden_pagadores : [];
        let pagador;
        if (ordenIds.length > 0) {
          const mapa = {}; activos.forEach((m) => { mapa[m.id] = m; });
          pagador = (ordenIds.map((id) => mapa[id]).filter(Boolean))[0] || activos[0];
        } else {
          pagador = activos[(ronda - 1) % activos.length];
        }
        if (pagador) {
          pagadorEl.innerHTML = `<span style="color:#fff">Paga: </span><span style="color:#9090FF">${pagador.nombre}</span>`;
          pagadorEl.style.display = 'inline';
        }
      });
  }
}

function renderCategories() {
  const el = $('cat-filter');
  el.innerHTML = '';
  const cats = getCurrentCategories();
  // Si la categoría seleccionada ya no existe en el catálogo actual, reset a 'Todos'
  if (!cats.includes(state.selectedCategory)) state.selectedCategory = 'Todos';
  cats.forEach((cat) => {
    const pill = document.createElement('button');
    pill.className = 'cat-pill' + (cat === state.selectedCategory ? ' active' : '');
    pill.textContent = cat;
    pill.onclick = () => {
      state.selectedCategory = cat;
      renderCategories();
      renderDrinks();
    };
    el.appendChild(pill);
  });

}

function renderDrinks(searchQuery) {
  const grid = $('drinks-grid');
  grid.innerHTML = '';
  grid.scrollTop = 0;
  const allDrinks = getAllDrinks();
  const query = searchQuery !== undefined ? searchQuery : ($('search-input')?.value.trim().toLowerCase() || '');

  if (query) {
    const results = allDrinks.filter((d) => d.name.toLowerCase().includes(query));
    if (!results.length) {
      const empty = document.createElement('div');
      empty.style.cssText = 'color:#666;text-align:center;margin-top:40px;font-size:15px;';
      empty.textContent = 'Sin resultados';
      grid.appendChild(empty);
    } else {
      results.forEach((drink) => grid.appendChild(makeDrinkCard(drink)));
    }
    return;
  }

  if (state.selectedCategory === 'Todos') {
    getCurrentCategories(allDrinks).filter((c) => c !== 'Todos').forEach((cat) => {
      const catDrinks = allDrinks.filter((d) => d.category === cat);
      if (!catDrinks.length) return;
      const headerWrap = document.createElement('div');
      headerWrap.className = 'section-header-wrap';
      const header = document.createElement('div');
      header.className = 'section-header';
      header.textContent = cat;
      const headerLine = document.createElement('div');
      headerLine.className = 'section-line';
      headerWrap.appendChild(header);
      headerWrap.appendChild(headerLine);
      grid.appendChild(headerWrap);
      catDrinks.forEach((drink) => grid.appendChild(makeDrinkCard(drink)));
    });
  } else {
    allDrinks.filter((d) => d.category === state.selectedCategory)
      .forEach((drink) => grid.appendChild(makeDrinkCard(drink)));
  }
}

function makeDrinkCard(drink) {
  const qty = state.quantities[drink.id] || 0;
  const active = qty > 0;
  const selections = state.brandSelections[drink.id] || [];
  const hasOptions = drink.brands || drink.regions || drink.steps;

  const card = document.createElement('div');
  card.className = 'drink-card' + (active ? ' active' : '');
  card.id = `card-${drink.id}`;

  const price = drink.price ?? 0;
  function fmtPrice(p) { return Number.isInteger(p) ? p + ',00' : Number(p).toFixed(2).replace('.', ','); }
  let inner = '';
  if (active) inner += `<div class="qty-badge">${qty}</div>`;
  inner += `<div class="price-badge">${fmtPrice(price)}€</div>`;
  inner += `<div class="drink-emoji">${drink.emoji}</div>`;
  inner += `<div class="drink-name">${drink.name}</div>`;
  inner += `<div class="drink-controls">`;
  if (active) inner += `<button class="btn-minus" data-id="${drink.id}">−</button>`;
  inner += `<button class="btn-plus" data-id="${drink.id}">+</button>`;
  inner += `</div>`;

  if (active && selections.length > 0) {
    // Agrupar selecciones iguales: "Mahou Tercio ×2" en vez de dos tags
    const grouped = {};
    selections.forEach((sel) => {
      const key = sel || '';
      if (key) grouped[key] = (grouped[key] || 0) + 1;
    });
    const keys = Object.keys(grouped);
    if (keys.length > 0) {
      inner += `<div class="selection-tags">`;
      keys.forEach((sel) => {
        const cnt = grouped[sel];
        inner += `<div class="sel-tag">${sel}${cnt > 1 ? ' ×' + cnt : ''}</div>`;
      });
      inner += `</div>`;
    }
  }

  card.innerHTML = inner;

  card.querySelector('.btn-plus')?.addEventListener('click', () => {
    if (hasOptions) {
      openBrandModal(drink, (selection) => {
        state.quantities[drink.id] = (state.quantities[drink.id] || 0) + 1;
        if (!state.brandSelections[drink.id]) state.brandSelections[drink.id] = [];
        state.brandSelections[drink.id].push(selection);
        refreshDrinkCard(drink);
      });
    } else {
      state.quantities[drink.id] = (state.quantities[drink.id] || 0) + 1;
      refreshDrinkCard(drink);
    }
  });

  card.querySelector('.btn-minus')?.addEventListener('click', () => {
    const newQty = Math.max(0, (state.quantities[drink.id] || 0) - 1);
    if (newQty === 0) {
      delete state.quantities[drink.id];
      delete state.brandSelections[drink.id];
    } else {
      state.quantities[drink.id] = newQty;
      if (state.brandSelections[drink.id]) {
        state.brandSelections[drink.id] = state.brandSelections[drink.id].slice(0, -1);
      }
    }
    refreshDrinkCard(drink);
  });

  return card;
}

function refreshDrinkCard(drink) {
  const old = $(`card-${drink.id}`);
  if (old) old.replaceWith(makeDrinkCard(drink));
}

// ─── Construir pedidos ────────────────────────────────────────────────────────
function buildPedidos() {
  const allDrinks = getAllDrinks();
  const pedidos = [];

  Object.entries(state.quantities).filter(([, q]) => q > 0).forEach(([drinkId, cantidad]) => {
    const drink = allDrinks.find((d) => d.id === drinkId);
    if (!drink) return;

    if (drink.brands || drink.regions || drink.steps) {
      const sels = state.brandSelections[drinkId] || [];
      const map = {};
      for (let i = 0; i < cantidad; i++) {
        const sel = (sels[i] || '').trim();
        map[sel] = (map[sel] || 0) + 1;
      }
      Object.entries(map).forEach(([sel, cnt]) => {
        pedidos.push({
          drinkId: sel ? `${drinkId}|${sel}` : drinkId,
          drinkName: drink.name,
          drinkEmoji: drink.emoji,
          cantidad: cnt,
          marca: sel || null,
        });
      });
    } else {
      pedidos.push({ drinkId, drinkName: drink.name, drinkEmoji: drink.emoji, cantidad, marca: null });
    }
  });

  return pedidos;
}

// ─── Confirmar pedido ─────────────────────────────────────────────────────────
async function handleConfirmar() {
  if (_voz.active) { _voz.active = false; try { _voz.recorder?.stop(); } catch(_){} _voz.stream?.getTracks().forEach(t=>t.stop()); }
  const pedidosSeleccionados = buildPedidos();
  if (!pedidosSeleccionados.length) {
    alert('Selecciona al menos una bebida');
    return;
  }

  $('btn-confirmar').disabled = true;
  $('btn-confirmar').textContent = '...';

  try {
    await sb.from('pedidos').delete()
      .eq('miembro_id', state.miembro.id)
      .eq('mesa_id', state.mesa.id);

    const rows = pedidosSeleccionados.map((p) => ({
      miembro_id:  state.miembro.id,
      mesa_id:     state.mesa.id,
      drink_id:    p.drinkId,
      drink_name:  p.drinkName,
      drink_emoji: p.drinkEmoji,
      cantidad:    p.cantidad,
      marca:       p.marca || null,
      estado:      'confirmado',
    }));

    const { error } = await sb.from('pedidos').insert(rows);
    if (error) throw error;

    // Notificar al admin en tiempo real
    try {
      const payload = { type: 'broadcast', event: 'pedido_confirmado', payload: { miembroId: state.miembro.id } };
      if (state.channel && state.channel.state === 'joined') {
        await state.channel.send(payload);
      } else {
        const tmpCh = sb.channel(`web_mesa_${state.mesa.id}`, { config: { broadcast: { self: false, ack: false } } });
        await new Promise((res, rej) => {
          const t = setTimeout(() => rej(new Error('timeout')), 4000);
          tmpCh.subscribe((s) => { if (s === 'SUBSCRIBED') { clearTimeout(t); res(); } });
        });
        await tmpCh.send(payload);
        setTimeout(() => tmpCh.unsubscribe(), 500);
      }
    } catch (_) {}

    // Guardar en historial local en el momento de confirmar
    const pedidosParaHistorial = rows.map((r) => ({
      drink_id: r.drink_id, drink_name: r.drink_name,
      drink_emoji: r.drink_emoji, cantidad: r.cantidad, marca: r.marca,
    }));
    guardarHistorialRonda(pedidosParaHistorial, state.mesa.ronda ?? 1);

    // Si la mesa estaba lanzada, volver a abrirla para indicar nuevos pedidos
    if (state.mesa.estado === 'lanzada') {
      await sb.from('mesas').update({ estado: 'abierta' }).eq('id', state.mesa.id);
      state.mesa.estado = 'abierta';
    }

    renderConfirmed();
    showScreen('confirmed');
    window.scrollTo(0, 0);
  } catch (e) {
    const msgConf = e.message || '';
    if (msgConf.includes('network') || msgConf.includes('fetch')) alert('Sin conexión. Comprueba tu internet e inténtalo de nuevo.');
    else alert('No se pudo confirmar el pedido. Inténtalo de nuevo.');
    $('btn-confirmar').disabled = false;
    $('btn-confirmar').textContent = '✓  Confirmar pedido';
  }
}

// ─── Pantalla confirmado ──────────────────────────────────────────────────────
function renderConfirmed() {
  $('conf-mesa-code').textContent = state.mesa.nombre || state.mesa.codigo;
  const rawBar = (state.mesa.nombre_bar || '').trim();
  if (rawBar) {
    const empiezaConBar = /^(bar|restaurante)\b/i.test(rawBar);
    $('conf-user-name').textContent = (empiezaConBar ? rawBar : `Bar ${rawBar}`).toUpperCase();
  } else {
    $('conf-user-name').textContent = `Pedido de ${state.nombre}`;
  }
  const confRonda = document.getElementById('conf-ronda-badge');
  if (confRonda) confRonda.textContent = `🔄 Ronda ${state.mesa.ronda ?? 1}`;

  const allDrinks = getAllDrinks();
  const list = $('confirmed-drinks-list');
  list.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'confirmed-drinks-card';
  const titleRow = document.createElement('div');
  titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:12px';
  const title = document.createElement('div');
  title.className = 'confirmed-drinks-title';
  title.style.marginBottom = '0';
  title.textContent = 'MI PEDIDO';
  const rondaTitle = document.createElement('div');
  rondaTitle.className = 'confirmed-ronda';
  rondaTitle.textContent = `RONDA Nº ${state.mesa.ronda ?? 1}`;
  titleRow.appendChild(title);
  titleRow.appendChild(rondaTitle);
  card.appendChild(titleRow);

  Object.entries(state.quantities).forEach(([drinkId, qty]) => {
    const drink = allDrinks.find((d) => d.id === drinkId);
    if (!drink) return;

    if (drink.brands || drink.regions) {
      const sels = state.brandSelections[drinkId] || [];
      const map = {};
      for (let i = 0; i < qty; i++) {
        const sel = (sels[i] || '').trim();
        map[sel] = (map[sel] || 0) + 1;
      }
      Object.entries(map).forEach(([sel, cnt]) => {
        const row = document.createElement('div');
        row.className = 'confirmed-drink-row';
        row.innerHTML = `
          <span class="confirmed-drink-emoji">${drink.emoji}</span>
          <span class="confirmed-drink-name">${drink.name}${sel ? ' — ' + sel : ''}</span>
          <span class="confirmed-drink-qty">×${cnt}</span>
        `;
        card.appendChild(row);
      });
    } else {
      const row = document.createElement('div');
      row.className = 'confirmed-drink-row';
      row.innerHTML = `
        <span class="confirmed-drink-emoji">${drink.emoji}</span>
        <span class="confirmed-drink-name">${drink.name}</span>
        <span class="confirmed-drink-qty">×${qty}</span>
      `;
      card.appendChild(row);
    }
  });

  // Total aproximado
  let total = 0;
  Object.entries(state.quantities).forEach(([drinkId, qty]) => {
    const base = drinkId.split('|')[0];
    const drink = allDrinks.find((d) => d.id === base);
    if (drink) total += (drink.price || 0) * qty;
  });
  const totalEl = document.createElement('div');
  totalEl.className = 'confirmed-total';
  totalEl.textContent = `Coste aproximado: ${total.toFixed(2)} €`;
  card.appendChild(totalEl);

  list.appendChild(card);

  const btnConfirmedHome = $('btn-confirmed-home');
  if (btnConfirmedHome) btnConfirmedHome.onclick = () => { renderHomeScreen(); showScreen('home'); };
  $('btn-borrar').onclick = handleBorrar;
  $('btn-modificar').onclick = handleModificar;
}

async function handleModificar() {
  renderOrderScreen();
  showScreen('order');
}

async function handleBorrar() {
  if (!confirm('¿Seguro que quieres borrar tu pedido?')) return;

  await sb.from('pedidos')
    .update({ estado: 'modificando' })
    .eq('miembro_id', state.miembro.id)
    .eq('mesa_id', state.mesa.id);

  await sb.from('pedidos').delete()
    .eq('miembro_id', state.miembro.id)
    .eq('mesa_id', state.mesa.id);

  state.quantities = {};
  state.brandSelections = {};
  renderOrderScreen();
  showScreen('order');
}

function handleEliminarSeleccion() {
  if (!confirm('¿Seguro que quieres eliminar toda tu selección actual?')) return;
  state.quantities = {};
  state.brandSelections = {};
  renderOrderScreen();
  showScreen('order');
}

// ─── Historial local (localStorage) ──────────────────────────────────────────
function _historialKey() {
  return `@barorder_historial_${state.mesa.id}_${state.miembro.id}`;
}
function guardarHistorialRonda(pedidos, rondaNum) {
  if (!state.miembro || !state.mesa || !pedidos || !pedidos.length) return;
  let historial = [];
  try { historial = JSON.parse(localStorage.getItem(_historialKey()) || '[]'); } catch {}
  const idx = historial.findIndex((r) => r.rondaNum === rondaNum);
  const bar = (state.mesa.nombre_bar || '').trim() || null;
  const entry = { rondaNum, pedidos, bar };
  if (idx >= 0) historial[idx] = entry;
  else historial.push(entry);
  localStorage.setItem(_historialKey(), JSON.stringify(historial));
}
function cargarHistorialLocal() {
  try { return JSON.parse(localStorage.getItem(_historialKey()) || '[]'); } catch { return []; }
}

// ─── Vista de reparto ─────────────────────────────────────────────────────────
async function renderReparto() {
  const rondaTagEl = document.getElementById('reparto-ronda-tag');
  if (rondaTagEl) rondaTagEl.textContent = `RONDA Nº ${state.mesa.ronda ?? 1}`;

  const { data: pedidos } = await sb
    .from('pedidos')
    .select('*, miembros(nombre)')
    .eq('mesa_id', state.mesa.id)
    .eq('estado', 'confirmado')
    .eq('miembro_id', state.miembro.id);

  // Guardar en historial local antes de que el admin pueda borrarlos con nueva ronda
  if (pedidos && pedidos.length) {
    guardarHistorialRonda(pedidos, state.mesa.ronda ?? 1);
  }

  const container = $('reparto-lines');
  container.innerHTML = '';

  const SIN_ALCOHOL = ['n1','n2','n3','n4','n5','n6','n7','n8','n9','n10','n11','n12','n13','n14','n15','n16','n17','n18','n19','n20','n21','n22','n23','n24','n25','n26','n27','n32','n33','n34','n35','n36','n37','n38','n39'];
  let tieneAlcohol = false;

  if (pedidos && pedidos.length) {
    pedidos.forEach((p) => {
      const base = p.drink_id.split('|')[0];
      if (!SIN_ALCOHOL.includes(base)) tieneAlcohol = true;
      const label = p.drink_name + (p.marca ? ` ${p.marca}` : '');
      const div = document.createElement('div');
      div.className = 'order-line';
      div.innerHTML = `
        <div class="order-line-top">
          <span class="order-line-emoji">${p.drink_emoji}</span>
          <span class="order-line-name">${label}</span>
          <span class="order-line-qty">×${p.cantidad}</span>
        </div>
      `;
      container.appendChild(div);
    });

    // Coste aproximado
    const allDrinks = getAllDrinks();
    let total = 0;
    pedidos.forEach((p) => {
      const base = p.drink_id.split('|')[0];
      const drink = allDrinks.find((d) => d.id === base);
      total += (drink?.price || 0) * p.cantidad;
    });
    const totalEl = document.createElement('div');
    totalEl.className = 'reparto-total';
    totalEl.textContent = `Coste aproximado: ${total.toFixed(2)} €`;
    container.appendChild(totalEl);
  }

  const conducirEl = $('reparto-conducir');
  if (conducirEl) conducirEl.style.display = '';

  // Volver al home automáticamente tras 3 segundos (solo si reparto está visible)
  clearTimeout(window._repartoTimer);
  window._repartoTimer = setTimeout(() => {
    const activeScreen = document.querySelector('.screen.active')?.id;
    if (activeScreen === 'screen-reparto') {
      renderHomeScreen();
      showScreen('home');
    }
  }, 3000);
}

// ─── Realtime ─────────────────────────────────────────────────────────────────
function subscribePresence() {}

// Polling QR comanda
let _qrPollTimer = null;
function startQrPoll() {
  if (_qrPollTimer) return;
  _qrPollTimer = setInterval(async () => {
    if (!state.mesa?.id || !state.miembro?.id) return;
    try {
      const { data } = await sb.from('mesas').select('qr_target').eq('id', state.mesa.id).single();
      if (!data?.qr_target || document.getElementById('qr-amigo-overlay')) return;
      const qr = typeof data.qr_target === 'string' ? JSON.parse(data.qr_target) : data.qr_target;
      if (qr.miembroId !== state.miembro.id) return;
      const url = qr.url || '';
      const overlay = document.createElement('div');
      overlay.id = 'qr-amigo-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center';
      overlay.innerHTML = '<div style="background:#fff;border-radius:20px;padding:28px;text-align:center;max-width:320px">' +
        '<div style="font-size:16px;font-weight:700;color:#000;margin-bottom:12px">📷 Muestra este QR al camarero</div>' +
        '<img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' + encodeURIComponent(url) + '" style="width:240px;height:240px;border-radius:8px" />' +
        '<div style="margin-top:16px"><button id="qr-amigo-close" style="background:#CC3333;color:#fff;border:none;border-radius:10px;padding:12px 32px;font-size:15px;font-weight:700;cursor:pointer">✕ Cerrar</button></div></div>';
      document.body.appendChild(overlay);
      overlay.querySelector('#qr-amigo-close').onclick = () => overlay.remove();
      overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    } catch (_) {}
  }, 3000);
}

function subscribeRealtime() {
  subscribePresence();
  startQrPoll();
  if (state.channel) return;

  state.channel = sb.channel(`web_mesa_${state.mesa.id}`, { config: { broadcast: { self: false, ack: false } } })
    .on('broadcast', { event: 'kick' }, (payload) => {
      if (payload.payload?.miembroId === state.miembro?.id) _mostrarDespedida();
    })
    .on('broadcast', { event: 'pedido_modificado_admin' }, (payload) => {
      if (payload.payload?.miembroId !== state.miembro?.id) return;
      const rondaNum = payload.payload?.ronda || (state.mesa.ronda ?? 1);
      // Guardar marca en historial local
      try {
        const key = 'barorder_ronda_modificada_' + state.mesa.id;
        const mods = JSON.parse(localStorage.getItem(key) || '[]');
        if (!mods.includes(rondaNum)) { mods.push(rondaNum); localStorage.setItem(key, JSON.stringify(mods)); }
      } catch (_) {}
      // Mostrar aviso 2 segundos
      const aviso = document.createElement('div');
      aviso.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1A1A1A;border:2px solid #D4A843;border-radius:16px;padding:24px 32px;z-index:9999;text-align:center;color:#fff;font-size:16px;font-weight:700;box-shadow:0 8px 32px rgba(0,0,0,0.8)';
      aviso.innerHTML = '⚠️<br>El admin ha modificado<br>tu pedido';
      document.body.appendChild(aviso);
      setTimeout(() => aviso.remove(), 2000);
    })
    .on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'miembros',
      filter: `mesa_id=eq.${state.mesa.id}`,
    }, (payload) => {
      if (payload.new?.id !== state.miembro?.id) return;
      const nuevoNombre = payload.new?.nombre || '';
      if (nuevoNombre.startsWith('[SALIDO] ')) _mostrarDespedida();
    })
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'mesas',
      filter: `id=eq.${state.mesa.id}`,
    }, async (payload) => {
      const newMesa = payload.new;
      if (!newMesa) return;

      const rondaAnterior = state.mesa.ronda ?? 1;
      const estadoAnterior = state.mesa.estado;

      // Recargar mesa completa desde BD para asegurar todos los campos (ronda, etc.)
      const { data: mesaFresh } = await sb.from('mesas').select('*').eq('id', state.mesa.id).single();
      if (mesaFresh) state.mesa = { ...state.mesa, ...mesaFresh };
      else state.mesa = { ...state.mesa, ...newMesa };

      // Si cambió la ronda, resetear pedido local (es una nueva ronda)
      if ((state.mesa.ronda ?? 1) !== rondaAnterior) {
        state.quantities = {};
        state.brandSelections = {};
      }

      // QR enviado por el admin a este amigo
      const qrRaw = newMesa.qr_target || mesaFresh?.qr_target;
      if (qrRaw) {
        try {
          const qr = typeof qrRaw === 'string' ? JSON.parse(qrRaw) : qrRaw;
          if (qr.miembroId === state.miembro?.id && !document.getElementById('qr-amigo-overlay')) {
            const url = qr.url || '';
            const overlay = document.createElement('div');
            overlay.id = 'qr-amigo-overlay';
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center';
            overlay.innerHTML = '<div style="background:#fff;border-radius:20px;padding:28px;text-align:center;max-width:320px">' +
              '<div style="font-size:16px;font-weight:700;color:#000;margin-bottom:12px">📷 Muestra este QR al camarero</div>' +
              '<img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' + encodeURIComponent(url) + '" style="width:240px;height:240px;border-radius:8px" />' +
              '<div style="margin-top:16px"><button id="qr-amigo-close" style="background:#CC3333;color:#fff;border:none;border-radius:10px;padding:12px 32px;font-size:15px;font-weight:700;cursor:pointer">✕ Cerrar</button></div></div>';
            document.body.appendChild(overlay);
            overlay.querySelector('#qr-amigo-close').onclick = () => overlay.remove();
            overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
          }
        } catch (_) {}
      }

      // Actualizar catálogo si cambió y refrescar pantalla de pedidos
      if (state.mesa.custom_drinks) {
        const changed = JSON.stringify(state.customDrinks) !== JSON.stringify(state.mesa.custom_drinks);
        state.customDrinks = state.mesa.custom_drinks;
        if (changed && document.querySelector('.screen.active')?.id === 'screen-order') {
          renderDrinks();
        }
      }

      // Notificar si el admin acaba de bloquear la mesa
      if (state.mesa.bloqueada && !mesaFresh?.bloqueada === false) {
        const currentScreen = document.querySelector('.screen.active')?.id;
        if (currentScreen === 'screen-home') {
          const banner = document.createElement('div');
          banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#D4A843;color:#000;text-align:center;padding:10px;font-weight:700;z-index:9999;font-size:14px;';
          banner.textContent = '🔒 El admin ha bloqueado el acceso al grupo';
          document.body.appendChild(banner);
          setTimeout(() => banner.remove(), 4000);
        }
      }

      if (state.mesa.estado === 'cerrada') {
        showClosedByAdmin();
      } else if (state.mesa.estado === 'lanzada' && estadoAnterior !== 'lanzada') {
        // Orden lanzada: cerrar modales y mostrar home con el aviso "orden entregada al camarero"
        document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
        renderHomeScreen();
        showScreen('home');
      } else if (state.mesa.estado === 'abierta') {
        const currentScreenId = document.querySelector('.screen.active')?.id;
        if (currentScreenId === 'screen-home') {
          renderHomeScreen();
          showScreen('home');
        } else if (currentScreenId === 'screen-order' || currentScreenId === 'screen-confirmed') {
          renderHomeScreen();
          showScreen('home');
        } else {
          renderHomeScreen();
          showScreen('home');
        }
      }
    })
    .subscribe();

  // Avisar si el usuario intenta recargar/cerrar con items sin confirmar
  window.removeEventListener('beforeunload', _warnUnsaved);
  window.addEventListener('beforeunload', _warnUnsaved);

  // iOS suspende tabs en background → al volver, comprobar si el miembro fue eliminado
  document.removeEventListener('visibilitychange', _checkEliminado);
  window.removeEventListener('pageshow', _checkEliminado);
  window.removeEventListener('focus', _checkEliminado);
  document.addEventListener('visibilitychange', _checkEliminado);
  window.addEventListener('pageshow', _checkEliminado);
  window.addEventListener('focus', _checkEliminado);
}

function _warnUnsaved(e) {
  const hasItems = state.quantities && Object.values(state.quantities).some((q) => q > 0);
  const currentScreen = document.querySelector('.screen.active')?.id;
  if (hasItems && currentScreen === 'screen-order') {
    e.preventDefault();
    e.returnValue = '';
  }
}

function _mostrarDespedida() {
  if (!state.miembro) return;
  state.miembro = null; // evitar doble disparo
  stopPollingEliminacion();
  if (state.channel) { state.channel.unsubscribe(); state.channel = null; }
  if (state.chatChannel) { state.chatChannel.unsubscribe(); state.chatChannel = null; }
  localStorage.removeItem(SESSION_KEY);
  document.body.classList.remove('amigo-mode');
  document.removeEventListener('visibilitychange', _checkEliminado);
  window.removeEventListener('pageshow', _checkEliminado);
  window.removeEventListener('focus', _checkEliminado);
  window.removeEventListener('beforeunload', _warnUnsaved);
  const el = $('screen-closed');
  if (el) {
    const emoji = el.querySelector('.closed-emoji');
    const title = el.querySelector('.closed-title');
    const sub   = el.querySelector('.closed-sub');
    if (emoji) emoji.textContent = '👋';
    if (title) title.textContent = '¡Hasta la próxima!';
    if (sub)   sub.textContent   = 'Has salido del grupo. ¡Que aproveche! 🍻';
  }
  showScreen('closed');
  setTimeout(() => { window.location.reload(); }, 2000);
}

async function _checkEliminado() {
  if (document.visibilityState !== 'visible') return;
  if (!state.miembro?.id || !state.mesa?.id) return;

  // Comprobar si fue eliminado
  const { data: m } = await sb.from('miembros').select('nombre').eq('id', state.miembro.id).single();
  if (!m || m.nombre.startsWith('[SALIDO] ')) { _mostrarDespedida(); return; }

  // Recargar estado de la mesa por si se perdieron eventos realtime (ej. iOS suspendió el tab)
  const { data: mesaFresh } = await sb.from('mesas').select('*').eq('id', state.mesa.id).single();
  if (!mesaFresh) return;
  state.mesa = { ...state.mesa, ...mesaFresh };

  const currentScreenId = document.querySelector('.screen.active')?.id;

  if (state.mesa.estado === 'cerrada') {
    showClosedByAdmin();
  } else if (state.mesa.estado === 'lanzada') {
    if (currentScreenId !== 'screen-home') { renderHomeScreen(); showScreen('home'); }
    else renderHomeScreen();
  } else if (state.mesa.estado === 'abierta') {
    if (currentScreenId === 'screen-loading') {
      renderHomeScreen(); showScreen('home');
    } else if (currentScreenId === 'screen-home') {
      renderHomeScreen();
    }
  }
}

let _pollingInterval = null;
function startPollingEliminacion() {
  if (_pollingInterval) return;
  _pollingInterval = setInterval(async () => {
    if (!state.miembro?.id) { stopPollingEliminacion(); return; }
    const { data: m } = await sb.from('miembros').select('nombre').eq('id', state.miembro.id).single();
    if (!m || m.nombre.startsWith('[SALIDO] ')) {
      stopPollingEliminacion();
      _mostrarDespedida();
    }
  }, 5000);
}
function stopPollingEliminacion() {
  if (_pollingInterval) { clearInterval(_pollingInterval); _pollingInterval = null; }
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

const CHAT_KEY = (mesaId) => `barorder_chat_lastread_${mesaId}`;

async function initChat() {
  if (!state.mesa || !state.miembro) return;

  // Cargar mensajes existentes
  const lastReadRaw = localStorage.getItem(CHAT_KEY(state.mesa.id));
  const lastReadTime = lastReadRaw ? new Date(lastReadRaw) : new Date(0);
  const { data: msgs } = await sb.from('mensajes').select('*').eq('mesa_id', state.mesa.id).order('created_at', { ascending: true });
  state.chatMensajes = msgs || [];
  const hayNuevos = state.chatMensajes.some((m) => m.miembro_id !== state.miembro.id && new Date(m.created_at) > lastReadTime);
  setUnread(hayNuevos);

  // Mostrar FAB (y su equivalente inline en home)
  const fab = $('chat-fab');
  if (fab) { fab.style.display = 'flex'; fab.onclick = openChat; }
  const btnHomeChat = $('btn-home-chat');
  if (btnHomeChat) btnHomeChat.onclick = openChat;

  // Canal realtime — broadcast para velocidad máxima + postgres_changes como respaldo
  if (state.chatChannel) state.chatChannel.unsubscribe();
  state.chatChannel = sb.channel(`chat_room_${state.mesa.id}`, { config: { broadcast: { self: false } } })
    .on('broadcast', { event: 'nuevo_mensaje' }, ({ payload }) => {
      if (!payload || state.chatMensajes.find((m) => m.id === payload.id)) return;
      state.chatMensajes.push(payload);
      setUnread(true);
      if ($('chat-modal').style.display !== 'none') {
        appendMessage(payload);
        setUnread(false);
        localStorage.setItem(CHAT_KEY(state.mesa.id), new Date().toISOString());
      }
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes', filter: `mesa_id=eq.${state.mesa.id}` }, (payload) => {
      const nuevo = payload.new;
      if (nuevo.miembro_id === state.miembro.id) return;
      if (state.chatMensajes.find((m) => m.id === nuevo.id)) return;
      state.chatMensajes.push(nuevo);
      setUnread(true);
      if ($('chat-modal').style.display !== 'none') {
        appendMessage(nuevo);
        setUnread(false);
        localStorage.setItem(CHAT_KEY(state.mesa.id), new Date().toISOString());
      }
    })
    .subscribe();
}

function setUnread(val) {
  state.hasUnread = val;
  const fab = $('chat-fab');
  if (fab) fab.classList.toggle('unread', val);
}

function openChat() {
  const modal = $('chat-modal');
  modal.style.display = 'flex';

  const titleEl = modal.querySelector('.chat-title');
  if (titleEl) titleEl.textContent = `💬  Chat — ${state.mesa.nombre || state.mesa.codigo}`;

  const container = $('chat-messages');
  container.innerHTML = '';
  if (state.chatMensajes.length === 0) {
    container.innerHTML = '<div class="chat-empty">Sin mensajes aún. ¡Empieza la conversación!</div>';
  } else {
    state.chatMensajes.forEach((m) => appendMessage(m));
  }
  setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);

  setUnread(false);
  localStorage.setItem(CHAT_KEY(state.mesa.id), new Date().toISOString());

  modal.onclick = (e) => { if (e.target === modal) closeChat(); };
  $('btn-chat-close').onclick = closeChat;

  const sendBtn = $('btn-chat-send');
  sendBtn.ontouchend = (e) => { e.preventDefault(); handleChatSend(); };
  sendBtn.onclick = handleChatSend;

  const input = $('chat-input');
  input.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend(); } };
  input.focus();

  document.querySelectorAll('.chat-quick-emoji').forEach((btn) => {
    btn.ontouchend = (e) => { e.preventDefault(); handleChatSend(btn.dataset.emoji); };
    btn.onclick = () => handleChatSend(btn.dataset.emoji);
  });
}

function closeChat() {
  $('chat-modal').style.display = 'none';
}

const PARTICIPANT_COLORS = ['#C0392B','#8E44AD','#1A6DAB','#16A085','#D35400','#27AE60','#2471A3','#884EA0','#B7950B','#196F3D'];
const colorCache = {};
function getParticipantColor(nombre) {
  if (!colorCache[nombre]) {
    const idx = Object.keys(colorCache).length % PARTICIPANT_COLORS.length;
    colorCache[nombre] = PARTICIPANT_COLORS[idx];
  }
  return colorCache[nombre];
}

function appendMessage(msg) {
  const container = $('chat-messages');
  container.querySelector('.chat-empty')?.remove();

  const isMe = msg.miembro_id === state.miembro.id;
  const d = new Date(msg.created_at);
  const time = d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
  const isTemp = String(msg.id).startsWith('tmp_');

  const row = document.createElement('div');
  row.className = 'chat-msg-row';
  row.setAttribute('data-id', msg.id);
  if (isTemp) row.style.opacity = '0.5';
  const nameColor = getParticipantColor(msg.nombre);
  row.innerHTML = `<span class="chat-msg-name" style="color:${nameColor}">${escapeHtml(msg.nombre)}</span><span class="chat-msg-text">${escapeHtml(msg.texto)}</span><span class="chat-msg-time">${time}</span>`;
  container.appendChild(row);
  setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function handleChatSend(customText) {
  const input = $('chat-input');
  const texto = customText ?? input.value.trim();
  if (!texto) return;
  if (!customText) input.value = '';

  const now = new Date().toISOString();
  const tempMsg = { id: `tmp_${Date.now()}`, mesa_id: state.mesa.id, miembro_id: state.miembro.id, nombre: state.nombre, texto, created_at: now };
  state.chatMensajes.push(tempMsg);
  appendMessage(tempMsg);
  input.focus();

  try {
    // Broadcast inmediato a todos los demás
    await state.chatChannel.send({ type: 'broadcast', event: 'nuevo_mensaje', payload: { ...tempMsg, id: `bc_${Date.now()}` } });
    // Guardar en BD
    await sb.from('mensajes').insert({ mesa_id: state.mesa.id, miembro_id: state.miembro.id, nombre: state.nombre, texto });
  } catch (e) {
    console.error(e);
    // Mostrar error al usuario si falla el envío del mensaje
    const inputEl = document.getElementById('chat-input');
    if (inputEl) { inputEl.style.borderColor = '#FF4444'; setTimeout(() => { inputEl.style.borderColor = ''; }, 2000); }
  }
}

// ─── Sesión ───────────────────────────────────────────────────────────────────
function saveSession(mesaCodigo, miembroId, nombre) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ mesaCodigo, miembroId, nombre }));
}

function loadSession(mesaCodigo) {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s.mesaCodigo !== mesaCodigo) return null;
    return s;
  } catch { return null; }
}

// ─── Voz (Whisper + GPT-4o-mini) ──────────────────────────────────────────────
let _voz = { active: false, recorder: null, audioChunks: [], stream: null };

function _buildCatalogPrompt() {
  const drinks = getAllDrinks();
  const lines = drinks.map(d => {
    let s = `${d.id}: ${d.name}`;
    if (d.brands) s += ` [marcas: ${d.brands.join(', ')}]`;
    if (d.mixers) s += ` [tamaño/mixer: ${d.mixers.join(', ')}]`;
    if (d.regions) s += ` [regiones: ${d.regions.join(', ')}]`;
    if (d.agings) s += ` [crianza: ${d.agings.join(', ')}]`;
    if (d.sep) s += ` (separador: "${d.sep}")`;
    return s;
  });
  return lines.join('\n');
}

async function startVoiceWeb() {
  const fab = $('voice-fab'), bubble = $('voice-bubble');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    _voz.stream = stream;
    _voz.audioChunks = [];
    _voz.recorder = new MediaRecorder(stream);
    _voz.recorder.ondataavailable = (e) => { if (e.data.size > 0) _voz.audioChunks.push(e.data); };
    _voz.recorder.start();
    _voz.active = true;
    fab.classList.add('listening');
    fab.textContent = '⏹';
    if (bubble) { bubble.style.display = 'block'; bubble.textContent = '🎤 Grabando... pulsa ⏹ para enviar'; }
  } catch (e) {
    if (bubble) { bubble.style.display = 'block'; bubble.textContent = '⚠️ No se pudo acceder al micrófono'; }
    setTimeout(() => { if (bubble) bubble.style.display = 'none'; }, 3000);
  }
}

function stopVoiceAndProcess() {
  if (!_voz.active || !_voz.recorder) return;
  const fab = $('voice-fab'), bubble = $('voice-bubble');
  fab.classList.remove('listening');
  fab.textContent = '🎤';
  _voz.active = false;

  _voz.recorder.onstop = async () => {
    // Liberar micrófono
    _voz.stream?.getTracks().forEach(t => t.stop());
    _voz.stream = null;

    const audioBlob = new Blob(_voz.audioChunks, { type: 'audio/webm' });
    if (audioBlob.size < 1000) { if (bubble) bubble.style.display = 'none'; return; }

    if (bubble) bubble.textContent = '🎤 Transcribiendo...';

    try {
      // Enviar audio + catálogo a la Edge Function (proxy seguro)
      const catalog = _buildCatalogPrompt();
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('catalog', catalog);

      const controller = new AbortController();
      const voiceTimeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(SUPABASE_URL + '/functions/v1/voice-order', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY },
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(voiceTimeout);
      if (!res.ok) throw new Error('Error: ' + res.status);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const transcript = data.transcript || '';
      const pedidos = data.pedidos || [];

      if (!transcript) {
        if (bubble) bubble.textContent = '🎤 No se ha detectado voz';
        setTimeout(() => { if (bubble) bubble.style.display = 'none'; }, 3000);
        return;
      }

      if (bubble) bubble.textContent = '🎤 "' + transcript + '"';

      if (!pedidos.length) {
        if (bubble) bubble.textContent = '🎤 "' + transcript + '" — GPT no devolvió bebidas';
        setTimeout(() => { if (bubble) bubble.style.display = 'none'; }, 5000);
        return;
      }

      // 3) Añadir bebidas al pedido — matching flexible de IDs
      const drinks = getAllDrinks();
      const added = [];
      const notFound = [];
      for (const p of pedidos) {
        // Buscar por ID exacto, o por nombre si GPT devolvió nombre en vez de ID
        let drink = drinks.find(d => d.id === p.id);
        if (!drink && p.id) {
          const pid = p.id.toLowerCase().trim();
          drink = drinks.find(d => d.id === pid);
        }
        if (!drink && p.name) {
          const pname = p.name.toLowerCase().trim();
          drink = drinks.find(d => d.name.toLowerCase() === pname);
          if (!drink) drink = drinks.find(d => d.name.toLowerCase().includes(pname) || pname.includes(d.name.toLowerCase()));
        }
        if (!drink) { notFound.push(p.id || p.name || '?'); continue; }

        const qty = Math.min(p.qty || 1, 10);
        for (let i = 0; i < qty; i++) {
          state.quantities[drink.id] = (state.quantities[drink.id] || 0) + 1;
          if (p.selection) {
            if (!state.brandSelections[drink.id]) state.brandSelections[drink.id] = [];
            state.brandSelections[drink.id].push(p.selection);
          }
        }
        let label = (drink.emoji || '') + ' ' + drink.name;
        if (p.selection) label += ' ' + p.selection;
        if (qty > 1) label += ' ×' + qty;
        added.push(label);
      }

      renderDrinks();
      let msg = added.length ? '🎤 ' + added.join(', ') : '🎤 No se pudo añadir';
      if (notFound.length) msg += ' (no encontrado: ' + notFound.join(', ') + ')';
      if (bubble) bubble.textContent = msg;
      if (added.length) {
        const lastDrink = drinks.find(d => added.length && state.quantities[d.id] > 0);
        if (lastDrink) setTimeout(() => { const el = document.getElementById('card-' + lastDrink.id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
      }
      setTimeout(() => { if (bubble) bubble.style.display = 'none'; }, 5000);

    } catch (err) {
      if (bubble) bubble.textContent = err.name === 'AbortError' ? '⚠️ Timeout — inténtalo de nuevo' : '⚠️ Error: ' + (err.message || 'sin conexión');
      setTimeout(() => { if (bubble) bubble.style.display = 'none'; }, 4000);
    }
  };

  _voz.recorder.stop();
}

function initVoiceFab() {
  const fab = $('voice-fab');
  if (!fab) return;
  fab.style.display = 'flex';
  fab.onclick = () => { if (_voz.active) stopVoiceAndProcess(); else startVoiceWeb(); };
  const orderChatFab = $('order-chat-fab');
  if (orderChatFab) orderChatFab.onclick = () => openChat();
}

document.addEventListener('DOMContentLoaded', () => {
  $('btn-volver-pedido')?.addEventListener('click', async () => {
    const { data: mesaFresh } = await sb.from('mesas').select('*').eq('id', state.mesa.id).single();
    if (mesaFresh) state.mesa = { ...state.mesa, ...mesaFresh };
    renderHomeScreen();
    showScreen('home');
  });

  // ── Buscador ─────────────────────────────────────────────────────────────
  $('search-input')?.addEventListener('input', (e) => {
    renderDrinks(e.target.value.trim().toLowerCase());
  });

  $('search-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') e.target.blur();
  });

  // Ajustar chat al teclado en iOS
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      const modal = $('chat-modal');
      if (!modal || modal.style.display === 'none') return;
      const sheet = modal.querySelector('.chat-sheet');
      if (sheet) {
        const vh = window.visualViewport.height;
        sheet.style.height = Math.round(vh * 0.88) + 'px';
      }
      const container = $('chat-messages');
      if (container) setTimeout(() => { container.scrollTop = container.scrollHeight; }, 100);
    });
  }
});

init();
