/* ══════════════════════════════════════════════════════════════
   BarOrder — Web companion (vanilla JS)
   ══════════════════════════════════════════════════════════════ */

'use strict';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATEGORIES = ['Todos', 'Cerveza', 'Vino', 'Cóctel', 'Spirits', 'Sin alcohol', 'Aperitivos'];

const DRINKS = [
  { id: 'c1', name: 'Cerveza',      emoji: '🍺', category: 'Cerveza' },
  { id: 'c2', name: 'Cerveza sin',  emoji: '🍺', category: 'Cerveza' },
  { id: 'c3', name: 'Clara',        emoji: '🍋', category: 'Cerveza' },
  { id: 'c4', name: 'Jarra',        emoji: '🍻', category: 'Cerveza' },

  { id: 'v1', name: 'Vino tinto', emoji: '🍷', category: 'Vino',
    regions: ['Rioja', 'Ribera del Duero', 'Cariñena', 'Priorat', 'Toro'],
    agings: ['Joven', 'Crianza', 'Reserva', 'Gran Reserva'] },
  { id: 'v2', name: 'Vino blanco', emoji: '🥂', category: 'Vino',
    regions: ['Albariño', 'Verdejo', 'Rueda', 'Chardonnay'],
    agings: ['Joven', 'Crianza'] },
  { id: 'v3', name: 'Vino rosado', emoji: '🍾', category: 'Vino',
    regions: ['Navarra', 'Rioja', 'Cigales'],
    agings: ['Joven', 'Crianza'] },
  { id: 'v4', name: 'Sangría', emoji: '🍷', category: 'Vino' },
  { id: 'v5', name: 'Cava',    emoji: '🥂', category: 'Vino' },

  { id: 'k1', name: 'Mojito',      emoji: '🍃', category: 'Cóctel' },
  { id: 'k2', name: 'Gin tonic',   emoji: '🫧', category: 'Cóctel' },
  { id: 'k3', name: 'Daiquiri',    emoji: '🍓', category: 'Cóctel' },
  { id: 'k4', name: 'Margarita',   emoji: '🍋', category: 'Cóctel' },
  { id: 'k5', name: 'Piña colada', emoji: '🍍', category: 'Cóctel' },
  { id: 'k6', name: 'Spritz',      emoji: '🍊', category: 'Cóctel' },
  { id: 'k7', name: 'Negroni',     emoji: '🍸', category: 'Cóctel' },
  { id: 'k8', name: 'Cuba libre',  emoji: '🥃', category: 'Cóctel' },

  { id: 's1', name: 'Whisky', emoji: '🥃', category: 'Spirits', isSpirit: true,
    brands: ['Bourbon', 'Escocés', 'Irlandés', 'Japonés', 'Americano'],
    mixers: ['Solo', 'Con cola', 'Con cola zero', 'Con agua con gas'] },
  { id: 's2', name: 'Ron', emoji: '🥃', category: 'Spirits', isSpirit: true,
    brands: ['Blanco', 'Añejo', 'Oscuro', 'Spiced'],
    mixers: ['Solo', 'Con cola', 'Con cola zero', 'Con naranja'] },
  { id: 's3', name: 'Vodka', emoji: '🍸', category: 'Spirits', isSpirit: true,
    brands: ['Absolut', 'Smirnoff', 'Grey Goose', 'Belvedere', 'Otro'],
    mixers: ['Solo', 'Con tónica', 'Con naranja', 'Con lima'] },
  { id: 's4', name: 'Ginebra', emoji: '🌿', category: 'Spirits', isSpirit: true,
    brands: ['Tanqueray', 'Bombay Sapphire', 'Hendricks', 'Beefeater', 'Otro'],
    mixers: ['Solo', 'Con tónica premium', 'Con tónica normal'] },
  { id: 's5', name: 'Tequila', emoji: '🥃', category: 'Spirits', isSpirit: true,
    brands: ['Blanco', 'Reposado', 'Añejo', 'Gold'],
    mixers: ['Solo', 'Con lima', 'Con naranja'] },
  { id: 's6', name: 'Brandy', emoji: '🥃', category: 'Spirits', isSpirit: true,
    brands: ['Torres 10', 'Torres 20', 'Cardenal Mendoza', 'Lepanto', 'Veterano'],
    mixers: ['Solo', 'Con cola'] },
  { id: 's7', name: 'Chupito', emoji: '🥃', category: 'Spirits' },

  { id: 'n1',  name: 'Agua',        emoji: '💧', category: 'Sin alcohol' },
  { id: 'n2',  name: 'Cola',        emoji: '🥤', category: 'Sin alcohol' },
  { id: 'n3',  name: 'Cola light',  emoji: '🥤', category: 'Sin alcohol' },
  { id: 'n4',  name: 'Naranja',     emoji: '🍊', category: 'Sin alcohol' },
  { id: 'n5',  name: 'Limón',       emoji: '🍋', category: 'Sin alcohol' },
  { id: 'n6',  name: 'Té frío',     emoji: '🧋', category: 'Sin alcohol' },
  { id: 'n7',  name: 'Limonada',    emoji: '🫧', category: 'Sin alcohol' },
  { id: 'n8',  name: 'Energética',  emoji: '⚡', category: 'Sin alcohol' },
  { id: 'n9',  name: 'Zumo',        emoji: '🍊', category: 'Sin alcohol' },
  { id: 'n10', name: 'Café',        emoji: '☕', category: 'Sin alcohol' },
  { id: 'n11', name: 'Té',          emoji: '🍵', category: 'Sin alcohol' },
  { id: 'n12', name: 'Tónica',      emoji: '🫧', category: 'Sin alcohol' },

  { id: 'ap1', name: 'Patatas fritas',   emoji: '🍟', category: 'Aperitivos' },
  { id: 'ap2', name: 'Olivas',           emoji: '🫒', category: 'Aperitivos' },
  { id: 'ap3', name: 'Pepinillos',       emoji: '🥒', category: 'Aperitivos' },
  { id: 'ap4', name: 'Revuelto',         emoji: '🍳', category: 'Aperitivos' },
  { id: 'ap5', name: 'Gambas rebozadas', emoji: '🍤', category: 'Aperitivos' },
  { id: 'ap6', name: 'Calamares',        emoji: '🦑', category: 'Aperitivos' },
  { id: 'ap7', name: 'Tostadas',         emoji: '🍞', category: 'Aperitivos' },
  { id: 'ap8', name: 'Tapas',            emoji: '🍽️', category: 'Aperitivos' },
];

const state = {
  mesa:             null,
  miembro:          null,
  nombre:           null,
  quantities:       {},   // { baseId: number }
  brandSelections:  {},   // { baseId: string[] } — una selección por unidad
  customDrinks:     [],
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

function getAllDrinks() {
  return [...DRINKS, ...state.customDrinks];
}

// ─── Modal de selección de marca/región ───────────────────────────────────────
function openBrandModal(drink, onSelect) {
  const modal = $('brand-modal');
  const step1Options = drink.brands || drink.regions || [];
  const step2Options = drink.mixers || drink.agings || [];

  let step = 1;
  let step1Value = null;

  function renderStep() {
    const options = step === 1 ? step1Options : step2Options;
    const label = step === 1
      ? (drink.brands ? 'Elige el tipo' : 'Elige la región')
      : (drink.mixers ? 'Elige el refresco' : 'Elige la crianza');

    $('modal-drink-title').textContent = `${drink.emoji}  ${drink.name}`;
    $('modal-label').textContent = label;

    const backEl = $('modal-back');
    if (step === 2) {
      backEl.style.display = 'flex';
      $('modal-step1-value').textContent = step1Value;
      backEl.onclick = () => { step = 1; step1Value = null; renderStep(); };
    } else {
      backEl.style.display = 'none';
    }

    const optionsEl = $('modal-options');
    optionsEl.innerHTML = '';
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'modal-option';
      btn.innerHTML = `<span>${opt}</span><span class="modal-option-arrow">›</span>`;
      btn.onclick = () => {
        if (step === 1 && step2Options.length > 0) {
          step1Value = opt;
          step = 2;
          renderStep();
        } else {
          const sep = drink.mixers ? ' + ' : ' ';
          const selection = step === 1 ? opt : `${step1Value}${sep}${opt}`;
          closeModal();
          onSelect(selection);
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

function renderDrinks() {
  const grid = $('drinks-grid');
  grid.innerHTML = '';
  const allDrinks = getAllDrinks();

  if (state.selectedCategory === 'Todos') {
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
    allDrinks.filter((d) => d.category === state.selectedCategory)
      .forEach((drink) => grid.appendChild(makeDrinkCard(drink)));
  }
}

function makeDrinkCard(drink) {
  const qty = state.quantities[drink.id] || 0;
  const active = qty > 0;
  const selections = state.brandSelections[drink.id] || [];
  const hasOptions = drink.brands || drink.regions;

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

    if (drink.brands || drink.regions) {
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
        list.appendChild(row);
      });
    } else {
      const row = document.createElement('div');
      row.className = 'confirmed-drink-row';
      row.innerHTML = `
        <span class="confirmed-drink-emoji">${drink.emoji}</span>
        <span class="confirmed-drink-name">${drink.name}</span>
        <span class="confirmed-drink-qty">×${qty}</span>
      `;
      list.appendChild(row);
    }
  });

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
    .eq('estado', 'confirmado');

  const map = {};
  (pedidos || []).forEach((p) => {
    const label = p.drink_name + (p.marca ? ` ${p.marca}` : '');
    if (!map[p.drink_id]) map[p.drink_id] = { emoji: p.drink_emoji, name: label, total: 0, personas: [] };
    map[p.drink_id].total += p.cantidad;
    map[p.drink_id].personas.push({ nombre: p.miembros?.nombre || '?', cantidad: p.cantidad });
  });

  const container = $('reparto-lines');
  container.innerHTML = '';

  Object.values(map).forEach((item) => {
    const personasStr = item.personas.map((p) => {
      let s = p.nombre;
      if (p.cantidad > 1) s += ` x${p.cantidad}`;
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

  // Suscripción: solo mensajes de OTROS (los propios se muestran por optimista)
  if (state.chatChannel) state.chatChannel.unsubscribe();
  state.chatChannel = sb.channel(`chat_web_${state.mesa.id}_${Date.now()}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes', filter: `mesa_id=eq.${state.mesa.id}` }, (payload) => {
      const nuevo = payload.new;
      if (nuevo.miembro_id === state.miembro.id) return; // propio, ya está por optimista
      if (state.chatMensajes.find((m) => m.id === nuevo.id)) return;
      state.chatMensajes.push(nuevo);
      setUnread(true);
      if ($('chat-modal').style.display !== 'none') appendMessage(nuevo);
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

  // Título
  const titleEl = modal.querySelector('.chat-title');
  if (titleEl) titleEl.textContent = `💬  Chat — ${state.mesa.nombre || state.mesa.codigo}`;

  // Renderizar todos los mensajes
  const container = $('chat-messages');
  container.innerHTML = '';
  if (state.chatMensajes.length === 0) {
    container.innerHTML = '<div class="chat-empty">Sin mensajes aún. ¡Empieza la conversación!</div>';
  } else {
    state.chatMensajes.forEach((m) => appendMessage(m));
  }
  container.scrollTop = container.scrollHeight;

  setUnread(false);
  localStorage.setItem(CHAT_KEY(state.mesa.id), new Date().toISOString());

  modal.onclick = (e) => { if (e.target === modal) closeChat(); };
  $('btn-chat-close').onclick = closeChat;

  const sendBtn = $('btn-chat-send');
  sendBtn.onclick = null;
  sendBtn.ontouchend = (e) => { e.preventDefault(); handleChatSend(); };
  sendBtn.onclick = handleChatSend;

  const input = $('chat-input');
  input.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend(); } };
  input.focus();
}

function closeChat() {
  $('chat-modal').style.display = 'none';
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
  row.innerHTML = `<span class="chat-msg-name${isMe ? ' me' : ''}">${escapeHtml(msg.nombre)}</span><span class="chat-msg-text">${escapeHtml(msg.texto)}</span><span class="chat-msg-time">${time}</span>`;
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

  // Optimista: mostrar al instante
  const tempMsg = { id: `tmp_${Date.now()}`, mesa_id: state.mesa.id, miembro_id: state.miembro.id, nombre: state.nombre, texto, created_at: new Date().toISOString() };
  state.chatMensajes.push(tempMsg);
  appendMessage(tempMsg);

  try {
    await sb.from('mensajes').insert({ mesa_id: state.mesa.id, miembro_id: state.miembro.id, nombre: state.nombre, texto });
  } catch (e) {
    state.chatMensajes = state.chatMensajes.filter((m) => m.id !== tempMsg.id);
    $('chat-messages').querySelector(`[data-id="${tempMsg.id}"]`)?.remove();
    alert('Error al enviar: ' + e.message);
  }
  input.focus();
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
