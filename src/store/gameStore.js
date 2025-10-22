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
    if (!p?.id) { changed = true; return ensureId(p); }
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
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
const log = (m) => { state.log = [m, ...state.log].slice(0, 30); };


export async function syncCapture() {
  if (state.bag.length >= 10) { log("Límite 10 alcanzado."); return emit(); }
  try {
    state.loading = true; emit();
    const base = await getRandomPokemon();
    const p = ensureId(base);
    state.bag.push({ ...p, hp: p.stats.hpMax, healsUsed: 0, favorite: false });
    if (!state.active) state.active = state.bag[0];
    log(`Capturado ${cap(p.name)}.`);
  } catch (e) {
    log(`Error al capturar: ${e?.message || e}`);
  } finally { state.loading = false; emit(); }
}


export async function startEncounter() {
  try {
    state.loading = true; emit();
    const w = ensureId(await getRandomPokemon());
    state.wild = { ...w, hp: w.stats.hpMax };
    if (state.active) {
      state.active.hp = state.active.stats.hpMax;
      state.active.healsUsed = 0;
    }
    log(`¡Apareció ${cap(w.name)}!`);
  } catch (e) {
    log(`Error encuentro: ${e?.message || e}`);
  } finally { state.loading = false; emit(); }
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
  if (state.active.healsUsed >= 2) { log("Sin curas."); return emit(); }
  const amt = healAmount(state.active.stats.hpMax);
  state.active.hp = Math.min(state.active.stats.hpMax, state.active.hp + amt);
  state.active.healsUsed += 1;
  log(`Curado +${amt} (restan ${2 - state.active.healsUsed}).`);
  emit();
}

export function capture() {
  if (!state.wild) return;
  if (!canCapture(state.wild, state.bag.length)) { log("Bájale más la vida."); return emit(); }
  const ok = tryCapture(state.wild);
  if (ok) {
    if (state.bag.length >= 10) { log("Límite 10 alcanzado."); return emit(); }
    const p = ensureId(state.wild);
    state.bag.push({ ...p, hp: p.stats.hpMax, healsUsed: 0, favorite: false });
    state.wild = null;
    log("¡Capturado!");
  } else log("Se escapó.");
  emit();
}


const findIndexById = (id) => state.bag.findIndex((p) => p.id === id);

export function setActive(id) {
  const i = findIndexById(id);
  const b = i >= 0 ? state.bag[i] : null;
  state.active = b ? { ...b, hp: b.stats.hpMax, healsUsed: 0 } : null;
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
