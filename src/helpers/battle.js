import { typeMultiplier } from "./typeChart";

export function simulateTurn(player, wild){
  const mA = typeMultiplier(player.types, wild.types);
  const mB = typeMultiplier(wild.types, player.types);
  const aDmg = Math.max(1, Math.floor(player.stats.atk * mA - wild.stats.def * 0.5));
  const bDmg = Math.max(1, Math.floor(wild.stats.atk * mB - player.stats.def * 0.5));
  return { aDmg, bDmg };
}

export const healAmount = (maxHp) => Math.round(maxHp * 0.3);
