/* ══════════════════════════════════════════════════════════════
   BarOrder — Web companion (vanilla JS)
   ══════════════════════════════════════════════════════════════ */

'use strict';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Audio (compatible iOS Safari) ───────────────────────────────────────────
let _beepAudio = null;

function getBeepAudio() {
  if (!_beepAudio) _beepAudio = document.getElementById('beep-audio');
  return _beepAudio;
}

// Desbloquear audio en el primer gesto del usuario (iOS Safari lo requiere)
function unlockAudio() {
  const a = getBeepAudio();
  if (!a) return;
  a.play().catch(() => {});
  a.pause();
  a.currentTime = 0;
}
document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
document.addEventListener('click', unlockAudio, { once: true });

function playBeep() {
  try {
    const a = getBeepAudio();
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch (_) {}
}

const CATEGORIES = ['Todos', 'Cerveza', 'Vino', 'Cóctel', 'Spirits', 'Licores', 'Sin alcohol', 'Aperitivos'];

const DRINKS = [
  // ── Cerveza ──────────────────────────────────────────────────────────────
  { id: 'c1', name: 'Cerveza', emoji: '🍺', category: 'Cerveza',
    brands: ['Mahou', 'Cruzcampo', 'Estrella Damm', 'Estrella Galicia', 'San Miguel', 'Amstel', 'Voll-Damm', 'Alhambra', '1906', 'Moritz', 'Heineken', 'Ámbar', 'Otro'],
    mixers: ['Caña', 'Tercio', 'Tubo', 'Botellín'],
    step1Label: 'Elige la marca', step2Label: 'Elige el tamaño', sep: ' ' },
  { id: 'c2', name: 'Cerveza sin', emoji: '🍺', category: 'Cerveza',
    brands: ['Mahou', 'Cruzcampo', 'Estrella Damm', 'Estrella Galicia', 'San Miguel', 'Amstel', 'Heineken', 'Otro'],
    mixers: ['Caña', 'Tercio', 'Tubo'],
    step1Label: 'Elige la marca', step2Label: 'Elige el tamaño', sep: ' ' },
  { id: 'c3', name: 'Clara', emoji: '🍋', category: 'Cerveza',
    brands: ['Mahou', 'Cruzcampo', 'Estrella Damm', 'San Miguel', 'Amstel', 'Heineken', 'Otro'],
    mixers: ['Caña', 'Tercio', 'Tubo'],
    step1Label: 'Elige la marca', step2Label: 'Elige el tamaño', sep: ' ' },
  { id: 'c4', name: 'Jarra',     emoji: '🍻', category: 'Cerveza' },
  { id: 'c5', name: '0,0 limón', emoji: '🍋', category: 'Cerveza' },
  { id: 'c6', name: 'IPA',       emoji: '🍺', category: 'Cerveza' },
  { id: 'c7', name: 'Tostada',   emoji: '🍺', category: 'Cerveza' },
  { id: 'c8', name: 'Trigo',     emoji: '🍺', category: 'Cerveza' },
  { id: 'c9', name: 'Radler',    emoji: '🍋', category: 'Cerveza' },

  // ── Vino ─────────────────────────────────────────────────────────────────
  { id: 'v1', name: 'Vino tinto', emoji: '🍷', category: 'Vino',
    regions: ['Rioja', 'Ribera del Duero', 'Cariñena', 'Priorat', 'Toro', 'Somontano'],
    agings: ['Joven', 'Crianza', 'Reserva', 'Gran Reserva'] },
  { id: 'v2', name: 'Vino blanco', emoji: '🥂', category: 'Vino',
    regions: ['Albariño', 'Verdejo', 'Rueda', 'Chardonnay', 'Somontano'],
    agings: ['Joven', 'Crianza'] },
  { id: 'v3', name: 'Vino rosado', emoji: '🍾', category: 'Vino',
    regions: ['Navarra', 'Rioja', 'Cigales'],
    agings: ['Joven', 'Crianza'] },
  { id: 'v4',  name: 'Sangría',    emoji: '🍷', category: 'Vino' },
  { id: 'v5',  name: 'Cava',       emoji: '🥂', category: 'Vino' },
  { id: 'v6',  name: 'Vermut',     emoji: '🍸', category: 'Vino' },
  { id: 'v7',  name: 'Fino',       emoji: '🥂', category: 'Vino' },
  { id: 'v8',  name: 'Manzanilla', emoji: '🥂', category: 'Vino' },
  { id: 'v9',  name: 'Lambrusco',  emoji: '🍷', category: 'Vino' },
  { id: 'v10', name: 'Prosecco',   emoji: '🥂', category: 'Vino' },

  // ── Cóctel ───────────────────────────────────────────────────────────────
  { id: 'k1',  name: 'Mojito',           emoji: '🍃', category: 'Cóctel' },
  { id: 'k2',  name: 'Gin tonic',        emoji: '🫧', category: 'Cóctel' },
  { id: 'k3',  name: 'Daiquiri',         emoji: '🍓', category: 'Cóctel' },
  { id: 'k4',  name: 'Margarita',        emoji: '🍋', category: 'Cóctel' },
  { id: 'k5',  name: 'Piña colada',      emoji: '🍍', category: 'Cóctel' },
  { id: 'k6',  name: 'Aperol Spritz',    emoji: '🍊', category: 'Cóctel' },
  { id: 'k7',  name: 'Negroni',          emoji: '🍸', category: 'Cóctel' },
  { id: 'k8',  name: 'Cuba libre',       emoji: '🥃', category: 'Cóctel' },
  { id: 'k9',  name: 'Tinto de verano',  emoji: '🍷', category: 'Cóctel' },
  { id: 'k10', name: 'Rebujito',         emoji: '🥂', category: 'Cóctel' },
  { id: 'k11', name: 'Bloody Mary',      emoji: '🍅', category: 'Cóctel' },
  { id: 'k12', name: 'Cosmopolitan',     emoji: '🍸', category: 'Cóctel' },
  { id: 'k13', name: 'Caipirinha',       emoji: '🍈', category: 'Cóctel' },
  { id: 'k14', name: 'Sex on the Beach', emoji: '🍑', category: 'Cóctel' },
  { id: 'k15', name: 'Moscow Mule',      emoji: '🫚', category: 'Cóctel' },
  { id: 'k16', name: 'Old Fashioned',    emoji: '🥃', category: 'Cóctel' },
  { id: 'k17', name: 'Whisky Sour',      emoji: '🍋', category: 'Cóctel' },

  // ── Spirits ──────────────────────────────────────────────────────────────
  { id: 's1', name: 'Whisky', emoji: '🥃', category: 'Spirits', isSpirit: true,
    brands: ['JB', "Ballantine's", "Jack Daniel's", 'J. Walker Rojo', 'J. Walker Negro', 'Jameson', 'DYC', 'Bourbon', 'Escocés', 'Otro'],
    mixers: ['Solo', 'Con cola', 'Con cola zero', 'Con agua con gas'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's2', name: 'Ron', emoji: '🥃', category: 'Spirits', isSpirit: true,
    brands: ['Barceló', 'Brugal', 'Bacardí', 'Havana Club', 'Captain Morgan', 'Otro'],
    mixers: ['Solo', 'Con cola', 'Con cola zero', 'Con naranja'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's3', name: 'Vodka', emoji: '🍸', category: 'Spirits', isSpirit: true,
    brands: ['Absolut', 'Smirnoff', 'Grey Goose', 'Belvedere', 'Otro'],
    mixers: ['Solo', 'Con tónica', 'Con naranja', 'Con lima'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's4', name: 'Ginebra', emoji: '🌿', category: 'Spirits', isSpirit: true,
    brands: ['Tanqueray', 'Bombay Sapphire', "Hendrick's", 'Beefeater', 'Puerto de Indias', 'Nordés', 'Otro'],
    mixers: ['Solo', 'Con tónica premium', 'Con tónica normal'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's5', name: 'Tequila', emoji: '🥃', category: 'Spirits', isSpirit: true,
    brands: ['José Cuervo', 'Patrón', 'Blanco', 'Reposado', 'Otro'],
    mixers: ['Solo', 'Con lima', 'Con naranja'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's6', name: 'Brandy', emoji: '🥃', category: 'Spirits', isSpirit: true,
    brands: ['Soberano', 'Veterano', 'Magno', 'Torres 10', 'Torres 20', 'Carlos I', 'Cardenal Mendoza', 'Lepanto', 'Otro'],
    mixers: ['Solo', 'Con cola'],
    step1Label: 'Elige la marca', step2Label: 'Elige el combinado', sep: ' + ' },
  { id: 's7', name: 'Chupito', emoji: '🥃', category: 'Spirits' },

  // ── Licores ──────────────────────────────────────────────────────────────
  { id: 'l1', name: 'Baileys',      emoji: '🥛', category: 'Licores' },
  { id: 'l2', name: 'Jägermeister', emoji: '🦌', category: 'Licores' },
  { id: 'l3', name: 'Licor café',   emoji: '☕', category: 'Licores' },
  { id: 'l4', name: 'Pacharán',     emoji: '🫐', category: 'Licores' },
  { id: 'l5', name: 'Orujo',        emoji: '🍇', category: 'Licores' },
  { id: 'l6', name: 'Amaretto',     emoji: '🥜', category: 'Licores' },
  { id: 'l7', name: 'Frangelico',   emoji: '🌰', category: 'Licores' },
  { id: 'l8', name: 'Cointreau',    emoji: '🍊', category: 'Licores' },

  // ── Sin alcohol ──────────────────────────────────────────────────────────
  { id: 'n1',  name: 'Agua',             emoji: '💧', category: 'Sin alcohol' },
  { id: 'n13', name: 'Agua con gas',     emoji: '🫧', category: 'Sin alcohol' },
  { id: 'n2',  name: 'Coca-Cola',        emoji: '🥤', category: 'Sin alcohol' },
  { id: 'n3',  name: 'Cola light',       emoji: '🥤', category: 'Sin alcohol' },
  { id: 'n14', name: 'Cola zero',        emoji: '🥤', category: 'Sin alcohol' },
  { id: 'n4',  name: 'Fanta naranja',    emoji: '🍊', category: 'Sin alcohol' },
  { id: 'n5',  name: 'Fanta limón',      emoji: '🍋', category: 'Sin alcohol' },
  { id: 'n12', name: 'Tónica',           emoji: '🫧', category: 'Sin alcohol' },
  { id: 'n15', name: 'Gaseosa',          emoji: '🫧', category: 'Sin alcohol' },
  { id: 'n16', name: 'Bitter',           emoji: '🍹', category: 'Sin alcohol' },
  { id: 'n17', name: 'Aquarius limón',   emoji: '🍋', category: 'Sin alcohol' },
  { id: 'n18', name: 'Aquarius naranja', emoji: '🍊', category: 'Sin alcohol' },
  { id: 'n9',  name: 'Zumo naranja',     emoji: '🍊', category: 'Sin alcohol' },
  { id: 'n19', name: 'Zumo melocotón',   emoji: '🍑', category: 'Sin alcohol' },
  { id: 'n20', name: 'Zumo piña',        emoji: '🍍', category: 'Sin alcohol' },
  { id: 'n21', name: 'Zumo tomate',      emoji: '🍅', category: 'Sin alcohol' },
  { id: 'n22', name: 'Zumo manzana',     emoji: '🍏', category: 'Sin alcohol' },
  { id: 'n23', name: 'Mosto tinto',      emoji: '🍇', category: 'Sin alcohol' },
  { id: 'n24', name: 'Mosto blanco',     emoji: '🍇', category: 'Sin alcohol' },
  { id: 'n7',  name: 'Limonada',         emoji: '🍋', category: 'Sin alcohol' },
  { id: 'n25', name: 'Horchata',         emoji: '🥛', category: 'Sin alcohol' },
  { id: 'n8',  name: 'Red Bull',         emoji: '⚡', category: 'Sin alcohol' },
  { id: 'n26', name: 'Monster',          emoji: '⚡', category: 'Sin alcohol' },
  { id: 'n27', name: 'Nestea',           emoji: '🧊', category: 'Sin alcohol' },
  { id: 'n6',  name: 'Té frío',          emoji: '🧋', category: 'Sin alcohol' },
  { id: 'n10', name: 'Café', emoji: '☕', category: 'Sin alcohol',
    steps: [
      { label: 'Tipo de café', options: ['Café con leche', 'Café solo', 'Cortado', 'Americano', 'Capuccino', 'Bombón', 'Carajillo'] },
      { label: 'Cafeína',      options: ['Normal', 'Descafeinado'] },
      { label: 'Endulzante',   options: ['Con azúcar', 'Con sacarina', 'Sin azúcar'] },
      { label: 'Leche',        options: ['Leche fría', 'Leche caliente'] },
    ] },
  { id: 'n11', name: 'Té',           emoji: '🍵', category: 'Sin alcohol' },
  { id: 'n32', name: 'Manzanilla',   emoji: '🍵', category: 'Sin alcohol' },
  { id: 'n33', name: 'Poleo menta',  emoji: '🍵', category: 'Sin alcohol' },
  { id: 'n34', name: 'Tila',         emoji: '🍵', category: 'Sin alcohol' },
  { id: 'n35', name: 'Batido chocolate', emoji: '🍫', category: 'Sin alcohol' },
  { id: 'n36', name: 'Batido fresa',    emoji: '🍓', category: 'Sin alcohol' },
  { id: 'n37', name: 'Batido vainilla', emoji: '🍦', category: 'Sin alcohol' },
  { id: 'n38', name: 'Granizado limón', emoji: '🍧', category: 'Sin alcohol' },
  { id: 'n39', name: 'Granizado café',  emoji: '🍧', category: 'Sin alcohol' },

  // ── Aperitivos ───────────────────────────────────────────────────────────
  { id: 'ap1',  name: 'Patatas fritas',    emoji: '🍟', category: 'Aperitivos' },
  { id: 'ap2',  name: 'Olivas',            emoji: '🫒', category: 'Aperitivos' },
  { id: 'ap3',  name: 'Pepinillos',        emoji: '🥒', category: 'Aperitivos' },
  { id: 'ap4',  name: 'Revuelto',          emoji: '🍳', category: 'Aperitivos' },
  { id: 'ap5',  name: 'Gambas rebozadas',  emoji: '🍤', category: 'Aperitivos' },
  { id: 'ap6',  name: 'Calamares',         emoji: '🦑', category: 'Aperitivos' },
  { id: 'ap7',  name: 'Tostadas',          emoji: '🍞', category: 'Aperitivos' },
  { id: 'ap8',  name: 'Tapas',             emoji: '🍽️', category: 'Aperitivos' },
  { id: 'ap9',  name: 'Nachos',            emoji: '🧀', category: 'Aperitivos' },
  { id: 'ap10', name: 'Croquetas',         emoji: '🟤', category: 'Aperitivos' },
  { id: 'ap11', name: 'Jamón ibérico',     emoji: '🥓', category: 'Aperitivos' },
  { id: 'ap12', name: 'Queso curado',      emoji: '🧀', category: 'Aperitivos' },
  { id: 'ap13', name: 'Ensaladilla rusa',  emoji: '🥗', category: 'Aperitivos' },
  { id: 'ap14', name: 'Pimientos padrón',  emoji: '🌶️', category: 'Aperitivos' },
  { id: 'ap15', name: 'Boquerones',        emoji: '🐟', category: 'Aperitivos' },
  { id: 'ap16', name: 'Montaditos',        emoji: '🥖', category: 'Aperitivos' },
  { id: 'ap17', name: 'Tabla embutidos',   emoji: '🥩', category: 'Aperitivos' },
  { id: 'ap18', name: 'Alitas de pollo',   emoji: '🍗', category: 'Aperitivos' },
  { id: 'ap19', name: 'Aros de cebolla',   emoji: '🧅', category: 'Aperitivos' },
  { id: 'ap20', name: 'Pan con tomate',    emoji: '🍅', category: 'Aperitivos' },
  { id: 'ap21', name: 'Tortilla española', emoji: '🥚', category: 'Aperitivos' },
  { id: 'ap22', name: 'Mejillones',        emoji: '🦪', category: 'Aperitivos' },
  { id: 'ap23', name: 'Pulpo',             emoji: '🐙', category: 'Aperitivos' },
  { id: 'ap24', name: 'Anchoas',           emoji: '🐟', category: 'Aperitivos' },
  { id: 'ap25', name: 'Frutos secos',      emoji: '🥜', category: 'Aperitivos' },
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
  // Ocultar botón de chat
  const fab = $('chat-fab');
  if (fab) fab.style.display = 'none';
  showScreen('closed');
  localStorage.removeItem('barorder_session');
}

function getAllDrinks() {
  // Mezclar bebidas del catálogo + personalizadas del admin
  const customs = (state.customDrinks || []).map((d) => ({ ...d, isCustom: true }));
  return [...DRINKS, ...customs];
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
      btn.onclick = () => {
        const newValues = [...stepValues, opt];
        if (stepIndex < steps.length - 1) {
          stepValues = newValues;
          stepIndex++;
          renderStep();
        } else {
          closeModal();
          onSelect(newValues.join(sep));
        }
      };
      optionsEl.appendChild(btn);
    });
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.onclick = null;
    $('modal-cancel').onclick = null;
  }

  $('modal-cancel').onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  renderStep();
  modal.style.display = 'flex';
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
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
    if (miembro) {
      state.miembro = miembro;
      state.nombre  = miembro.nombre;
      await cargarPedidosExistentes();
      subscribeRealtime();
      await initChat();
      if (mesa.estado === 'lanzada') {
        await renderReparto();
        showScreen('reparto');
      } else {
        renderOrderScreen();
        showScreen('order');
      }
      return;
    }
  }

  const nombreGrupo = mesa.nombre || mesaCodigo;
  $('join-mesa-text').textContent = `"${nombreGrupo}" — ¿Cuál es tu nombre?`;
  $('btn-join').addEventListener('click', handleJoin);
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
    const { data: miembro, error } = await sb
      .from('miembros')
      .insert({ mesa_id: state.mesa.id, nombre, es_admin: false })
      .select().single();
    if (error) throw error;

    state.miembro = miembro;
    state.nombre  = nombre;
    saveSession(state.mesa.codigo, miembro.id, nombre);

    subscribeRealtime();
    await initChat();
    renderOrderScreen();
    showScreen('order');
  } catch (e) {
    $('btn-join').disabled = false;
    $('btn-join').textContent = 'Entrar a la mesa →';
    alert('Error: ' + e.message);
  }
}

// ─── Pantalla de pedido ───────────────────────────────────────────────────────
function renderOrderScreen() {
  $('order-mesa-code').textContent = state.mesa.nombre || state.mesa.codigo;
  renderCategories();
  renderDrinks();
  $('btn-confirmar').disabled = false;
  $('btn-confirmar').textContent = '✓  Confirmar pedido';
  $('btn-confirmar').onclick = handleConfirmar;
}

function renderCategories() {
  const el = $('cat-filter');
  el.innerHTML = '';
  CATEGORIES.forEach((cat) => {
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
    CATEGORIES.filter((c) => c !== 'Todos').forEach((cat) => {
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

  const price = state.prices[drink.id] ?? 0;
  function fmtPrice(p) {
    return Number.isInteger(p) ? p + ',00' : p.toFixed(2).replace('.', ',');
  }
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
    inner += `<div class="selection-tags">`;
    selections.forEach((sel) => {
      if (sel) inner += `<div class="sel-tag">${sel}</div>`;
    });
    inner += `</div>`;
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

    // Si la mesa estaba lanzada, volver a abrirla para indicar nuevos pedidos
    if (state.mesa.estado === 'lanzada') {
      await sb.from('mesas').update({ estado: 'abierta' }).eq('id', state.mesa.id);
      state.mesa.estado = 'abierta';
    }

    renderConfirmed();
    showScreen('confirmed');
  } catch (e) {
    alert('Error al confirmar: ' + e.message);
    $('btn-confirmar').disabled = false;
    $('btn-confirmar').textContent = '✓  Confirmar pedido';
  }
}

// ─── Pantalla confirmado ──────────────────────────────────────────────────────
function renderConfirmed() {
  $('conf-mesa-code').textContent = state.mesa.nombre || state.mesa.codigo;
  $('conf-user-name').textContent = `Pedido de ${state.nombre}`;

  const allDrinks = getAllDrinks();
  const list = $('confirmed-drinks-list');
  list.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'confirmed-drinks-card';
  const title = document.createElement('div');
  title.className = 'confirmed-drinks-title';
  title.textContent = 'MI PEDIDO';
  card.appendChild(title);

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

  list.appendChild(card);

  $('btn-modificar').onclick = handleModificar;
  $('btn-borrar').onclick = handleBorrar;
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

// ─── Vista de reparto ─────────────────────────────────────────────────────────
async function renderReparto() {
  const { data: pedidos } = await sb
    .from('pedidos')
    .select('*, miembros(nombre)')
    .eq('mesa_id', state.mesa.id)
    .eq('estado', 'confirmado')
    .eq('miembro_id', state.miembro.id);

  const container = $('reparto-lines');
  container.innerHTML = '';

  if (!pedidos || !pedidos.length) {
    container.innerHTML = '<div style="color:var(--text-muted);text-align:center;margin-top:20px">No tienes pedidos confirmados</div>';
    return;
  }

  const SIN_ALCOHOL = ['n1','n2','n3','n4','n5','n6','n7','n8','n9','n10','n11','n12','n13','n14','n15','n16','n17','n18','n19','n20','n21','n22','n23','n24','n25','n26','n27','n32','n33','n34','n35','n36','n37','n38','n39'];
  let tieneAlcohol = false;

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

  const conducirEl = $('reparto-conducir');
  if (conducirEl) conducirEl.style.display = tieneAlcohol ? '' : 'none';
}

// ─── Realtime ─────────────────────────────────────────────────────────────────
function subscribePresence() {}

function subscribeRealtime() {
  subscribePresence();
  if (state.channel) return;

  state.channel = sb.channel(`web_mesa_${state.mesa.id}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'mesas',
      filter: `id=eq.${state.mesa.id}`,
    }, async (payload) => {
      const newMesa = payload.new;
      if (!newMesa) return;
      state.mesa = { ...state.mesa, ...newMesa };

      if (newMesa.estado === 'cerrada') {
        showClosedByAdmin();
      } else if (newMesa.estado === 'lanzada') {
        await renderReparto();
        showScreen('reparto');
      } else if (newMesa.estado === 'abierta') {
        state.quantities = {};
        state.brandSelections = {};
        renderOrderScreen();
        showScreen('order');
      }
    })
    .on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'mesas',
      filter: `id=eq.${state.mesa.id}`,
    }, (payload) => {
      if (payload.new?.custom_drinks) {
        state.customDrinks = payload.new.custom_drinks;
      }
      if (payload.new?.custom_prices) {
        state.prices = payload.new.custom_prices;
        renderDrinks($('search-input')?.value?.trim()?.toLowerCase() || '');
      }
    })
    .subscribe();
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

  // Mostrar FAB
  const fab = $('chat-fab');
  if (fab) { fab.style.display = 'flex'; fab.onclick = openChat; }

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
      playBeep();
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
      playBeep();
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

async function handleChatSend() {
  const input = $('chat-input');
  const texto = input.value.trim();
  if (!texto) return;
  input.value = '';

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

document.addEventListener('DOMContentLoaded', () => {
  $('btn-volver-pedido')?.addEventListener('click', () => {
    renderOrderScreen();
    showScreen('order');
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
