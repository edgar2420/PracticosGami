import { useEffect, useMemo, useState } from "react";
import { state, subscribe, setActive, toggleFavorite, deleteFromBag } from "../store/gameStore";
import PokemonCard from "./PokemonCard";

export default function UnitsGrid() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(x => x + 1)), []);

  if (!state.bag.length) {
    return (
      <div className="text-sm text-slate-400 italic">
        Aún no tienes unidades. Pulsa <b>SINCRONIZAR</b> para capturar.
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const bagSorted = useMemo(() => {
    return [...state.bag].sort((a, b) => {
      if ((b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) !== 0) {
        return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
      }
      return a.name.localeCompare(b.name);
    });
  }, [state.bag]);

  return (
    <div
      className="
        grid gap-5
        xl:grid-cols-4
        lg:grid-cols-3
        md:grid-cols-2
        sm:grid-cols-2
        grid-cols-1
      "
    >
      {bagSorted.map((p, idx) => (
        <PokemonCard
          key={`${p.id}-${idx}`}     // si id viene duplicado a veces, combinamos con idx
          pokemon={p}
          onUse={() => setActive(state.bag.indexOf(p))}
          onToggleFav={() => toggleFavorite(state.bag.indexOf(p))}
          onDelete={() => deleteFromBag(state.bag.indexOf(p))}
          isFavorite={!!p.favorite}
        />
      ))}
    </div>
  );
}
