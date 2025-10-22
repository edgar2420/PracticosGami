export function canCapture(wild, bagLen){
  if (!wild) return false;
  if (bagLen >= 10) return false;
  return wild.hp <= wild.stats.hpMax * 0.25;
}
export function tryCapture(wild){
  const pct = 40 + (1 - wild.hp / wild.stats.hpMax) * 50; // 40–90%
  return Math.random() * 100 < pct;
}
