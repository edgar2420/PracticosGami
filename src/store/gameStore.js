import { getRandomPokemon } from "./../api/pokeapi";
import { simulateTurn, healAmount } from "../helpers/battle";
import { canCapture, tryCapture } from "../helpers/capture";

// ---------- Estado y suscriptores ----------
const listeners = new Set();

// Carga inicial desde localStorage (solo progreso, no combate)
export const state = {
  bag: JSON.parse(localStorage.getItem("bag") || "[]"), // [{ id,name,types,sprite,stats:{hpMax,atk,def}, favorite? }]
  active: null,        // pokémon activo (se setea desde la bolsa)
  wild: null,          // pokémon salvaje del encuentro actual
  battles: +(localStorage.getItem("battles") || 0),
  wins: +(localStorage.getItem("wins") || 0),
  log: [],
  loading: false,
};

function persist() {
  // Guardamos SOLO progreso, no el combate en curso.
  localStorage.setItem(
    "bag",
    JSON.stringify(
      state.bag.map((p) => ({
        id: p.id,
        name: p.name,
        types: p.types,
        sprite: p.sprite,
        stats: p.stats, // { hpMax, atk, def }
        favorite: !!p.favorite,
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

// ---------- Punto 1: Capturar (desde PokeAPI) ----------
export async function syncCapture() {
  if (state.bag.length >= 10) {
    log("Límite 10 alcanzado.");
    return emit();
  }
  try {
    state.loading = true;
    emit();
    const p = await getRandomPokemon();
    state.bag.push({
      ...p,
      hp: p.stats.hpMax,
      healsUsed: 0,
      favorite: false,
    });
    if (!state.active) state.active = state.bag[0];
    log(`Capturado ${p.name}.`);
  } catch (e) {
    log(`Error al capturar: ${e.message || e}`);
  } finally {
    state.loading = false;
    emit();
  }
}

// ---------- Iniciar encuentro (no se persiste) ----------
export async function startEncounter() {
  try {
    state.loading = true;
    emit();
    const w = await getRandomPokemon();
    state.wild = { ...w, hp: w.stats.hpMax };
    if (state.active) {
      state.active.hp = state.active.stats.hpMax;
      state.active.healsUsed = 0;
    }
    log(`¡Apareció ${w.name}!`);
  } catch (e) {
    log(`Error encuentro: ${e.message || e}`);
  } finally {
    state.loading = false;
    emit();
  }
}

// ---------- Punto 2: Turno simultáneo, curas x2 ----------
export function turn() {
  if (!state.active || !state.wild) return;
  if (state.active.hp <= 0 || state.wild.hp <= 0) return;

  const { aDmg, bDmg } = simulateTurn(state.active, state.wild);
  state.wild.hp = Math.max(0, state.wild.hp - aDmg);
  state.active.hp = Math.max(0, state.active.hp - bDmg);

  log(`${capitalize(state.active.name)} hace ${aDmg}. ${capitalize(state.wild.name)} hace ${bDmg}.`);

  if (state.wild.hp === 0 || state.active.hp === 0) {
    state.battles += 1;
    if (state.wild.hp === 0 && state.active.hp > 0) state.wins += 1;
  }
  emit();
}

export function heal() {
  if (!state.active) return;
  if (state.active.healsUsed >= 2) {
    log("Sin curas.");
    return emit();
  }
  const amt = healAmount(state.active.stats.hpMax);
  state.active.hp = Math.min(state.active.stats.hpMax, state.active.hp + amt);
  state.active.healsUsed += 1;
  log(`Curado +${amt} (restan ${2 - state.active.healsUsed}).`);
  emit();
}

// ---------- Punto 3: Captura con límite 10 ----------
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
    const p = {
      ...state.wild,
      hp: state.wild.stats.hpMax,
      healsUsed: 0,
      favorite: false,
    };
    state.bag.push(p);
    state.wild = null;
    log("¡Capturado!");
  } else {
    log("Se escapó.");
  }
  emit();
}

// ---------- Gestión de bolsa ----------
export function setActive(index) {
  const b = state.bag[index];
  state.active = b
    ? { ...b, hp: b.stats.hpMax, healsUsed: 0 }
    : null;
  emit();
}

export function toggleFavorite(index) {
  const p = state.bag[index];
  if (!p) return;
  p.favorite = !p.favorite;
  emit();
}

export function deleteFromBag(index) {
  state.bag.splice(index, 1);
  if (!state.bag.length) state.active = null;
  emit();
}

// ---------- Utils ----------
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
