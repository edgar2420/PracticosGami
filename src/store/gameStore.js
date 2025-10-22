import { getRandomPokemon } from "./../api/pokeapi";
import { simulateTurn, healAmount } from "../helpers/battle";
import { canCapture, tryCapture } from "../helpers/capture";

const listeners = new Set();

export const state = {
  bag: JSON.parse(localStorage.getItem("bag") || "[]"),
  active: null,
  wild: null,
  battles: +(localStorage.getItem("battles") || 0),
  wins: +(localStorage.getItem("wins") || 0),
  log: [],
  loading: false,
};

const cryptoRandom = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

const ensureId = (p) => ({ ...p, id: p?.id ?? cryptoRandom() });

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

(function migrateIdsOnLoad() {
  let changed = false;
  state.bag = (state.bag || []).map((p) => {
    if (!p?.id) {
      changed = true;
      return ensureId(p);
    }
    return p;
  });
  if (changed) localStorage.setItem("bag", JSON.stringify(state.bag));
})();

function persist() {
  localStorage.setItem(
    "bag",
    JSON.stringify(
      state.bag.map((p) => ({
        id: p.id,
        name: p.name,
        types: p.types || [],
        sprite: p.sprite,
        stats: p.stats,
        favorite: !!p.favorite,
        hp: p.hp ?? p.stats?.hpMax,
        healsUsed: p.healsUsed ?? 0,
        healsTotal: p.healsTotal ?? 2,
        attacks: p.attacks ?? [],
      }))
    )
  );
  localStorage.setItem("battles", state.battles);
  localStorage.setItem("wins", state.wins);
}

function emit() {
  persist();
  listeners.forEach((fn) => fn());
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const log = (m) => {
  state.log = [m, ...state.log].slice(0, 30);
};

export async function syncCapture() {
  if (state.bag.length >= 10) {
    log("Límite 10 alcanzado.");
    return emit();
  }
  try {
    state.loading = true;
    emit();
    const base = await getRandomPokemon();
    const p = ensureId(base);
    const attacks =
      Array.isArray(p.attacks) && p.attacks.length
        ? p.attacks
        : Array.isArray(p.moves)
        ? p.moves
            .slice(0, 4)
            .map((m) => ({ name: m?.name || m?.move?.name || "" }))
            .filter((m) => m.name)
        : [];
    state.bag.push({
      ...p,
      hp: p.stats.hpMax,
      healsUsed: 0,
      healsTotal: p.healsTotal ?? 2,
      favorite: false,
      attacks,
    });
    if (!state.active) state.active = state.bag[0];
    log(`Capturado ${cap(p.name)}.`);
  } catch (e) {
    log(`Error al capturar: ${e?.message || e}`);
  } finally {
    state.loading = false;
    emit();
  }
}

export async function startEncounter() {
  try {
    state.loading = true;
    emit();
    const w = ensureId(await getRandomPokemon());
    state.wild = { ...w, hp: w.stats.hpMax };
    if (state.active) {
      state.active.hp = state.active.stats.hpMax;
      state.active.healsUsed = 0;
    }
    log(`¡Apareció ${cap(w.name)}!`);
  } catch (e) {
    log(`Error encuentro: ${e?.message || e}`);
  } finally {
    state.loading = false;
    emit();
  }
}

export function turn() {
  if (!state.active || !state.wild) return;
  if (state.active.hp <= 0 || state.wild.hp <= 0) return;

  const { aDmg, bDmg } = simulateTurn(state.active, state.wild);
  state.wild.hp = Math.max(0, state.wild.hp - aDmg);
  state.active.hp = Math.max(0, state.active.hp - bDmg);

  log(`${cap(state.active.name)} hace ${aDmg}. ${cap(state.wild.name)} hace ${bDmg}.`);

  if (state.wild.hp === 0 || state.active.hp === 0) {
    state.battles += 1;
    if (state.wild.hp === 0 && state.active.hp > 0) state.wins += 1;
  }
  emit();
}

export function heal() {
  if (!state.active) return;
  const total = state.active.healsTotal ?? 2;
  const used = state.active.healsUsed ?? 0;
  if (used >= total) {
    log("Sin curas.");
    return emit();
  }
  if (state.active.hp >= state.active.stats.hpMax) {
    log(`${cap(state.active.name)} ya está con vida completa.`);
    return emit();
  }
  const amt = healAmount(state.active.stats.hpMax);
  state.active.hp = Math.min(state.active.stats.hpMax, state.active.hp + amt);
  state.active.healsUsed = used + 1;
  log(`Curado +${amt} (restan ${total - state.active.healsUsed}).`);
  emit();
}

export function capture() {
  if (!state.wild) return;
  if (!canCapture(state.wild, state.bag.length)) {
    log("Bájale más la vida.");
    return emit();
  }
  const ok = tryCapture(state.wild);
  if (ok) {
    if (state.bag.length >= 10) {
      log("Límite 10 alcanzado.");
      return emit();
    }
    const p = ensureId(state.wild);
    const attacks =
      Array.isArray(p.attacks) && p.attacks.length
        ? p.attacks
        : Array.isArray(p.moves)
        ? p.moves
            .slice(0, 4)
            .map((m) => ({ name: m?.name || m?.move?.name || "" }))
            .filter((m) => m.name)
        : [];
    state.bag.push({
      ...p,
      hp: p.stats.hpMax,
      healsUsed: 0,
      healsTotal: p.healsTotal ?? 2,
      favorite: false,
      attacks,
    });
    state.wild = null;
    log("¡Capturado!");
  } else log("Se escapó.");
  emit();
}

const findIndexById = (id) => state.bag.findIndex((p) => p.id === id);

export function setActive(id) {
  const i = findIndexById(id);
  state.active = i >= 0 ? state.bag[i] : null;
  emit();
}

export function toggleFavorite(id) {
  const i = findIndexById(id);
  if (i === -1) return;
  state.bag[i].favorite = !state.bag[i].favorite;
  emit();
}

export function deleteFromBag(id) {
  const i = findIndexById(id);
  if (i === -1) return;
  const deletingActive = state.active?.id === id;
  state.bag.splice(i, 1);
  if (deletingActive) state.active = null;
  if (state.bag.length === 0) state.active = null;
  emit();
}

export function healPokemon(pokemonId, amount = 30) {
  const i = findIndexById(pokemonId);
  if (i !== -1) {
    const p = state.bag[i];
    const total = p.healsTotal ?? 2;
    const used = p.healsUsed ?? 0;
    const hpMax = p.stats.hpMax;
    const hpNow = p.hp ?? hpMax;

    if (hpNow >= hpMax) {
      log(`${cap(p.name)} ya está con vida completa.`);
      return emit();
    }
    if (used >= total) {
      log("Sin curas.");
      return emit();
    }

    const healed = Math.min(hpMax, hpNow + amount);
    p.hp = healed;
    p.healsUsed = used + 1;

    if (state.active?.id === p.id) {
      state.active.hp = p.hp;          // por si acaso
      state.active.healsUsed = p.healsUsed;
    }
    log(`Curado ${cap(p.name)} +${healed - hpNow} (restan ${total - p.healsUsed}).`);
    return emit();
  }
  if (state.wild?.id === pokemonId) {
    const hpMax = state.wild.stats.hpMax;
    const hpNow = state.wild.hp ?? hpMax;
    if (hpNow >= hpMax) {
      log(`${cap(state.wild.name)} ya está con vida completa.`);
      return emit();
    }
    state.wild.hp = Math.min(hpMax, hpNow + amount);
    log(`Curado ${cap(state.wild.name)} +${Math.min(amount, hpMax - hpNow)}.`);
    return emit();
  }
}

export function applyDamage(pokemonId, amount = 15) {
  const i = findIndexById(pokemonId);
  if (i !== -1) {
    const p = state.bag[i];
    const hpMax = p.stats.hpMax;
    const hpNow = p.hp ?? hpMax;
    p.hp = Math.max(0, hpNow - amount);
    if (state.active?.id === p.id) state.active.hp = p.hp;
    log(`${cap(p.name)} recibió ${amount} de daño.`);
    return emit();
  }
  if (state.wild?.id === pokemonId) {
    state.wild.hp = Math.max(0, state.wild.hp - amount);
    log(`${cap(state.wild.name)} recibió ${amount} de daño.`);
    return emit();
  }
}

export function regenPokemon(pokemonId, percent = 1) {
  const i = findIndexById(pokemonId);
  if (i !== -1) {
    const p = state.bag[i];
    const hpMax = p.stats.hpMax;
    const hpNow = p.hp ?? hpMax;
    const delta = Math.round(hpMax * percent);
    p.hp = Math.min(hpMax, hpNow + delta);
    p.healsUsed = 0;
    if (state.active?.id === p.id) {
      state.active.hp = p.hp;
      state.active.healsUsed = 0;
    }
    log(`Regenerado ${cap(p.name)}.`);
    return emit();
  }
  if (state.wild?.id === pokemonId) {
    const hpMax = state.wild.stats.hpMax;
    const hpNow = state.wild.hp ?? hpMax;
    const delta = Math.round(hpMax * percent);
    state.wild.hp = Math.min(hpMax, hpNow + delta);
    log(`Regenerado ${cap(state.wild.name)}.`);
    return emit();
  }
}

export function regenAll(percent = 1) {
  state.bag.forEach((p) => {
    const hpMax = p.stats.hpMax;
    const hpNow = p.hp ?? hpMax;
    const delta = Math.round(hpMax * percent);
    p.hp = Math.min(hpMax, hpNow + delta);
    p.healsUsed = 0;
  });
  if (state.active) {
    const hpMax = state.active.stats.hpMax;
    const hpNow = state.active.hp ?? hpMax;
    const delta = Math.round(hpMax * percent);
    state.active.hp = Math.min(hpMax, hpNow + delta);
    state.active.healsUsed = 0;
  }
  if (state.wild) {
    const hpMax = state.wild.stats.hpMax;
    const hpNow = state.wild.hp ?? hpMax;
    const delta = Math.round(hpMax * percent);
    state.wild.hp = Math.min(hpMax, hpNow + delta);
  }
  log("Regeneración aplicada a todos.");
  emit();
}

let _regenTimer = null;

export function startRegenLoop(intervalMs = 5000, stepPercent = 0.1) {
  if (_regenTimer) return;
  _regenTimer = setInterval(() => {
    state.bag.forEach((p) => {
      const hpMax = p.stats.hpMax;
      const hpNow = p.hp ?? hpMax;
      p.hp = Math.min(hpMax, hpNow + Math.round(hpMax * stepPercent));
    });
    if (state.active) {
      const hpMax = state.active.stats.hpMax;
      const hpNow = state.active.hp ?? hpMax;
      state.active.hp = Math.min(hpMax, hpNow + Math.round(hpMax * stepPercent));
    }
    emit();
  }, intervalMs);
}

export function stopRegenLoop() {
  if (_regenTimer) clearInterval(_regenTimer);
  _regenTimer = null;
}

export async function hydrateMissingAttacks() {
  const toFix = state.bag.filter((p) => !p.attacks || p.attacks.length === 0);
  for (const p of toFix) {
    try {
      const ref = p.id || p.name;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${ref}`);
      if (!res.ok) continue;
      const d = await res.json();
      p.attacks = (d.moves ?? [])
        .slice(0, 4)
        .map((m) => ({ name: m?.move?.name ?? "" }))
        .filter((m) => m.name);
    } catch {/* ekisde */}
  }
  emit();
}
