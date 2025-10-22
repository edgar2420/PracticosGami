export async function getRandomPokemon() {
  const id = Math.floor(Math.random() * 151) + 1;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`PokeAPI ${res.status}`);
  const d = await res.json();

  const stat = (name) => d.stats.find((s) => s.stat.name === name)?.base_stat ?? 50;
  const hpMax = stat("hp") * 5;

  const sprite =
    d.sprites?.other?.["official-artwork"]?.front_default ??
    d.sprites?.front_default ??
    null;

  const attacks = (d.moves ?? [])
    .slice(0, 4)
    .map((m) => ({ name: m?.move?.name ?? "" }))
    .filter((m) => m.name);

  return {
    id: d.id,
    name: d.name,
    sprite,
    types: (d.types ?? []).map((t) => t.type?.name).filter(Boolean),
    stats: { hpMax, atk: stat("attack"), def: stat("defense") },
    hp: undefined,
    healsTotal: 2,
    healsUsed: 0,
    attacks,
  };
}
