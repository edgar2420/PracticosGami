import { useEffect, useState } from "react";
import { state, subscribe, setActive, toggleFavorite, deleteFromBag } from "../store/gameStore";
import PokemonCard from "./PokemonCard";

export default function UnitsGrid() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((x) => x + 1)), []);


  const bagSorted = [...state.bag].sort(
    (a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || a.name.localeCompare(b.name)
  );

  if (!bagSorted.length) {
    return (
      <div className="text-sm text-slate-400 italic">
        Aún no tienes unidades. Pulsa <b>SINCRONIZAR</b> para capturar.
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1">
      {bagSorted.map((p) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          onUse={() => setActive(p.id)}
          onToggleFav={() => toggleFavorite(p.id)}
          onDelete={() => deleteFromBag(p.id)}
          isFavorite={!!p.favorite}
        />
      ))}
    </div>
  );
}
