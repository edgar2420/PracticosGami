const CHART = {
  fire: { grass: 2, water: 0.5 },
  water:{ fire: 2, grass: 0.5 },
  grass:{ water: 2, fire: 0.5 },
  electric:{ water: 2, ground: 0, grass: 0.5 },
};

export function typeMultiplier(attTypes, defTypes){
  let best = 1;
  for (const a of attTypes){
    let m = 1;
    for (const d of defTypes) m *= (CHART[a]?.[d] ?? 1);
    if (m > best) best = m;
  }
  return best;
}
