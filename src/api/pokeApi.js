export async function getRandomPokemon() {
  const id = Math.floor(Math.random() * 151) + 1;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`PokeAPI ${res.status}`);
  const d = await res.json();

  const stat = (name) => d.stats.find(s => s.stat.name === name)?.base_stat ?? 50;
  const hpMax = stat('hp') * 5;

  return {
    id: d.id,
    name: d.name,
    sprite: d.sprites.front_default,
    types: d.types.map(t => t.type.name),
    stats: { hpMax, atk: stat('attack'), def: stat('defense') },
  };
}
