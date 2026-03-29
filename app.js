/* ══════════════════════════════════════════════════════════════
   BarOrder — Web companion (vanilla JS)
   ══════════════════════════════════════════════════════════════ */

'use strict';

// ─── Supabase client ─────────────────────────────────────────────────────────
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Bebidas predeterminadas (espejo de config/drinks.js) ────────────────────
const CATEGORIES = ['Todos', 'Cerveza', 'Vino', 'Cóctel', 'Spirits', 'Sin alcohol'];

const DRINKS = [
  // Cerveza
  { id: 'c1', name: 'Cerveza',      emoji: '🍺', category: 'Cerveza' },
  { id: 'c2', name: 'Cerveza sin',  emoji: '🍺', category: 'Cerveza' },
  { id: 'c3', name: 'Clara',        emoji: '🍋', category: 'Cerveza' },
  { id: 'c4', name: 'Jarra',        emoji: '🍻', category: 'Cerveza' },
  // Vino
  { id: 'v1', name: 'Vino tinto',   emoji: '🍷', category: 'Vino' },
  { id: 'v2', name: 'Vino blanco',  emoji: '🥂', category: 'Vino' },
  { id: 'v3', name: 'Vino rosado',  emoji: '🍾', category: 'Vino' },
  { id: 'v4', name: 'Sangría',      emoji: '🍷', category: 'Vino' },
  { id: 'v5', name: 'Cava',         emoji: '🥂', category: 'Vino' },
  // Cóctel
  { id: 'k1', name: 'Mojito',       emoji: '🍃', category: 'Cóctel' },
  { id: 'k2', name: 'Gin tonic',    emoji: '🫧', category: 'Cóctel' },
  { id: 'k3', name: 'Daiquiri',     emoji: '🍓', category: 'Cóctel' },
  { id: 'k4', name: 'Margarita',    emoji: '🍋', category: 'Cóctel' },
  { id: 'k5', name: 'Piña colada',  emoji: '🍍', category: 'Cóctel' },
  { id: 'k6', name: 'Spritz',       emoji: '🍊', category: 'Cóctel' },
  { id: 'k7', name: 'Negroni',      emoji: '🍸', category: 'Cóctel' },
  { id: 'k8', name: 'Cuba libre',   emoji: '🥃', category: 'Cóctel' },
  // Spirits
  { id: 's1', name: 'Whisky',   emoji: '🥃', category: 'Spirits', isSpirit: true },
  { id: 's2', name: 'Ron',      emoji: '🥃', category: 'Spirits', isSpirit: true },
  { id: 's3', name: 'Vodka',    emoji: '🍸', category: 'Spirits', isSpirit: true },
  { id: 's4', name: 'Ginebra',  emoji: '🌿', category: 'Spirits', isSpirit: true },
  { id: 's5', name: 'Tequila',  emoji: '🥃', category: 'Spirits', isSpirit: true },
  { id: 's6', name: 'Brandy',   emoji: '🥃', category: 'Spirits', isSpirit: true },
  { id: 's7', name: 'Chupito',  emoji: '🥃', category: 'Spirits' },
  // Sin alcohol
  { id: 'n1',  name: 'Agua',       emoji: '💧', category: 'Sin alcohol' },
  { id: 'n2',  name: 'Cola',       emoji: '🥤', category: 'Sin alcohol' },
  { id: 'n3',  name: 'Cola light', emoji: '🥤', category: 'Sin alcohol' },
  { id: 'n4',  name: 'Naranja',    emoji: '🍊', category: 'Sin alcohol' },
  { id: 'n5',  name: 'Limón',      emoji: '🍋', category: 'Sin alcohol' },
  { id: 'n6',  name: 'Té frío',    emoji: '🧋', category: 'Sin alcohol' },
  { id: 'n7',  name: 'Limonada',   emoji: '🫧', category: 'Sin alcohol' },
  { id: 'n8',  name: 'Energética', emoji: '⚡', category: 'Sin alcohol' },
  { id: 'n9',  name: 'Zumo',       emoji: '🍊', category: 'Sin alcohol' },
  { id: 'n10', name: 'Café',       emoji: '☕', category: 'Sin alcohol' },
  { id: 'n11', name: 'Té',         emoji: '🍵', category: 'Sin alcohol' },
  { id: 'n12', name: 'Tónica',     emoji: '🫧', category: 'Sin alcohol' },
];

// ─── Estado global ────────────────────────────────────────────────────────────
const state = {
  mesa:       null,   // objeto mesa de Supabase
  miembro:    null,   // objeto miembro de Supabase
  nombre:     null,
  quantities: {},     // { drinkId: number }
  brands:     {},     // { drinkId: string }
  customDrinks: [],
  selectedCategory: 'Todos',
  channel:    null,
};

const SESSION_KEY = 'barorder_web_session';

// ─── Helpers DOM ──────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

function showScreen(name) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  $(`screen-${name}`).classList.add('active');
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const mesaCodigo = (pathParts[0] || '').toUpperCase();

  if (!mesaCodigo || !mesaCodigo.startsWith('MESA-')) {
    showScreen('closed');
    $('screen-closed').querySelector('.closed-title').textContent = 'Enlace inválido';
    $('screen-closed').querySelector('.closed-sub').textContent = 'Pide al organizador que te comparta el enlace correcto.';
    return;
  }

  // Cargar mesa
  let mesa;
  try {
    const { data, error } = await sb.from('mesas').select('*').eq('codigo', mesaCodigo).single();
    if (error || !data) throw new Error('Mesa no encontrada');
    mesa = data;
    state.mesa = mesa;
    state.customDrinks = mesa.custom_drinks || [];
  } catch {
    showScreen('closed');
    $('screen-closed').querySelector('.closed-title').textContent = 'Mesa no encontrada';
    $('screen-closed').querySelector('.closed-sub').textContent = 'El enlace ha expirado o es incorrecto.';
    return;
  }

  if (mesa.estado === 'cerrada') { showScreen('closed'); return; }

  // Intentar recuperar sesión guardada
  const saved = loadSession(mesaCodigo);

  if (saved) {
    // Verificar que el miembro aún existe
    const { data: miembro } = await sb.from('miembros').select('*').eq('id', saved.miembroId).single();
    if (miembro) {
      state.miembro = miembro;
      state.nombre  = miembro.nombre;
      // Cargar pedidos existentes
      const { data: pedidos } = await sb.from('pedidos')
        .select('*')
        .eq('miembro_id', miembro.id)
        .eq('mesa_id', mesa.id);
      if (pedidos?.length) {
        pedidos.forEach((p) => {
          state.quantities[p.drink_id] = p.cantidad;
          if (p.marca) state.brands[p.drink_id] = p.marca;
        });
      }
      subscribeRealtime();
      if (mesa.estado === 'lanzada') {
        await renderReparto();
        showScreen('reparto');
      } else if (pedidos?.length && pedidos.every((p) => p.estado === 'confirmado')) {
        renderConfirmed();
        showScreen('confirmed');
      } else {
        renderOrderScreen();
        showScreen('order');
      }
      return;
    }
  }

  // Sin sesión válida → pedir nombre
  $('join-mesa-text').textContent = `Mesa ${mesaCodigo} — ¿Cuál es tu nombre?`;
  $('btn-join').addEventListener('click', handleJoin);
  $('input-nombre').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleJoin(); });
  showScreen('join');
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
  // Código de mesa
  $('order-mesa-code').textContent = state.mesa.codigo;

  // Categorías
  renderCategories();

  // Grid de bebidas
  renderDrinks();

  // Botón confirmar
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

function renderDrinks() {
  const grid = $('drinks-grid');
  grid.innerHTML = '';

  const allDrinks = [...DRINKS, ...state.customDrinks];

  if (state.selectedCategory === 'Todos') {
    // Secciones por categoría
    CATEGORIES.filter((c) => c !== 'Todos').forEach((cat) => {
      const catDrinks = allDrinks.filter((d) => d.category === cat);
      if (!catDrinks.length) return;

      const header = document.createElement('div');
      header.className = 'section-header';
      header.textContent = cat;
      grid.appendChild(header);

      catDrinks.forEach((drink) => grid.appendChild(makeDrinkCard(drink)));
    });
  } else {
    allDrinks
      .filter((d) => d.category === state.selectedCategory)
      .forEach((drink) => grid.appendChild(makeDrinkCard(drink)));
  }
}

function makeDrinkCard(drink) {
  const qty = state.quantities[drink.id] || 0;
  const active = qty > 0;

  const card = document.createElement('div');
  card.className = 'drink-card' + (active ? ' active' : '');
  card.id = `card-${drink.id}`;

  let inner = '';
  if (active) inner += `<div class="qty-badge">${qty}</div>`;
  inner += `<div class="drink-emoji">${drink.emoji}</div>`;
  inner += `<div class="drink-name">${drink.name}</div>`;
  inner += `<div class="drink-controls">`;
  if (active) inner += `<button class="btn-minus" data-id="${drink.id}">−</button>`;
  inner += `<button class="btn-plus" data-id="${drink.id}">+</button>`;
  inner += `</div>`;
  if (drink.isSpirit && active) {
    inner += `<input class="brand-input" data-id="${drink.id}"
      placeholder="Especifica la marca... (opcional)"
      value="${(state.brands[drink.id] || '').replace(/"/g, '&quot;')}" />`;
  }

  card.innerHTML = inner;

  card.querySelector('.btn-plus')?.addEventListener('click', () => {
    state.quantities[drink.id] = (state.quantities[drink.id] || 0) + 1;
    refreshDrinkCard(drink);
  });
  card.querySelector('.btn-minus')?.addEventListener('click', () => {
    state.quantities[drink.id] = Math.max(0, (state.quantities[drink.id] || 0) - 1);
    if (state.quantities[drink.id] === 0) {
      delete state.quantities[drink.id];
      delete state.brands[drink.id];
    }
    refreshDrinkCard(drink);
  });
  card.querySelector('.brand-input')?.addEventListener('input', (e) => {
    state.brands[drink.id] = e.target.value;
  });

  return card;
}

function refreshDrinkCard(drink) {
  const old = $(`card-${drink.id}`);
  if (old) old.replaceWith(makeDrinkCard(drink));
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
    // Borrar pedidos anteriores e insertar nuevos
    await sb.from('pedidos').delete()
      .eq('miembro_id', state.miembro.id)
      .eq('mesa_id', state.mesa.id);

    const rows = pedidosSeleccionados.map((p) => ({
      miembro_id: state.miembro.id,
      mesa_id:    state.mesa.id,
      drink_id:   p.drinkId,
      drink_name: p.drinkName,
      drink_emoji: p.drinkEmoji,
      cantidad:   p.cantidad,
      marca:      p.marca || null,
      estado:     'confirmado',
    }));

    const { error } = await sb.from('pedidos').insert(rows);
    if (error) throw error;

    renderConfirmed();
    showScreen('confirmed');
  } catch (e) {
    alert('Error al confirmar: ' + e.message);
    $('btn-confirmar').disabled = false;
    $('btn-confirmar').textContent = '✓  Confirmar pedido';
  }
}

function buildPedidos() {
  const allDrinks = [...DRINKS, ...state.customDrinks];
  return Object.entries(state.quantities)
    .filter(([, qty]) => qty > 0)
    .map(([drinkId, cantidad]) => {
      const drink = allDrinks.find((d) => d.id === drinkId);
      if (!drink) return null;
      return { drinkId, drinkName: drink.name, drinkEmoji: drink.emoji, cantidad, marca: state.brands[drinkId] || null };
    })
    .filter(Boolean);
}

// ─── Pantalla confirmado ──────────────────────────────────────────────────────
function renderConfirmed() {
  $('conf-mesa-code').textContent = state.mesa.codigo;
  $('conf-user-name').textContent = `Pedido de ${state.nombre}`;

  const allDrinks = [...DRINKS, ...state.customDrinks];
  const list = $('confirmed-drinks-list');
  list.innerHTML = '';

  Object.entries(state.quantities).forEach(([drinkId, qty]) => {
    const drink = allDrinks.find((d) => d.id === drinkId);
    if (!drink) return;

    const row = document.createElement('div');
    row.className = 'confirmed-drink-row';

    let label = drink.name;
    if (state.brands[drinkId]) label += ` — ${state.brands[drinkId]}`;

    row.innerHTML = `
      <span class="confirmed-drink-emoji">${drink.emoji}</span>
      <span class="confirmed-drink-name">${label}</span>
      <span class="confirmed-drink-qty">×${qty}</span>
    `;
    list.appendChild(row);
  });

  $('btn-modificar').onclick = handleModificar;
  $('btn-borrar').onclick = handleBorrar;
}

async function handleModificar() {
  // Marcar pedidos como 'modificando' en DB
  await sb.from('pedidos')
    .update({ estado: 'modificando' })
    .eq('miembro_id', state.miembro.id)
    .eq('mesa_id', state.mesa.id);

  renderOrderScreen();
  showScreen('order');
}

async function handleBorrar() {
  if (!confirm('¿Seguro que quieres borrar tu pedido?')) return;

  await sb.from('pedidos').delete()
    .eq('miembro_id', state.miembro.id)
    .eq('mesa_id', state.mesa.id);

  state.quantities = {};
  state.brands = {};
  renderOrderScreen();
  showScreen('order');
}

// ─── Vista de reparto ─────────────────────────────────────────────────────────
async function renderReparto() {
  const { data: pedidos } = await sb
    .from('pedidos')
    .select('*, miembros(nombre)')
    .eq('mesa_id', state.mesa.id)
    .eq('estado', 'confirmado');

  const map = {};
  (pedidos || []).forEach((p) => {
    if (!map[p.drink_id]) {
      map[p.drink_id] = { emoji: p.drink_emoji, name: p.drink_name, total: 0, personas: [] };
    }
    map[p.drink_id].total += p.cantidad;
    map[p.drink_id].personas.push({ nombre: p.miembros?.nombre || '?', cantidad: p.cantidad, marca: p.marca });
  });

  const container = $('reparto-lines');
  container.innerHTML = '';

  Object.values(map).forEach((item) => {
    const personasStr = item.personas.map((p) => {
      let s = p.nombre;
      if (p.cantidad > 1) s += ` x${p.cantidad}`;
      if (p.marca) s += ` → ${p.marca}`;
      return s;
    }).join(', ');

    const div = document.createElement('div');
    div.className = 'order-line';
    div.innerHTML = `
      <div class="order-line-top">
        <span class="order-line-emoji">${item.emoji}</span>
        <span class="order-line-name">${item.name}</span>
        <span class="order-line-qty">×${item.total}</span>
      </div>
      <div class="order-line-personas">${personasStr}</div>
    `;
    container.appendChild(div);
  });
}

// ─── Realtime ─────────────────────────────────────────────────────────────────
function subscribeRealtime() {
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
        showScreen('closed');
      } else if (newMesa.estado === 'lanzada') {
        await renderReparto();
        showScreen('reparto');
      } else if (newMesa.estado === 'abierta') {
        // Reset (admin resetea)
        state.quantities = {};
        state.brands = {};
        renderOrderScreen();
        showScreen('order');
      }
    })
    .on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'mesas',
      filter: `id=eq.${state.mesa.id}`,
    }, async (payload) => {
      // custom_drinks puede haber cambiado
      if (payload.new?.custom_drinks) {
        state.customDrinks = payload.new.custom_drinks;
      }
    })
    .subscribe();
}

// ─── Persistencia de sesión ───────────────────────────────────────────────────
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

// ─── Arrancar ────────────────────────────────────────────────────────────────
init();
