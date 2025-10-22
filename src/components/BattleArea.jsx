import { useEffect, useState } from "react";
import { state, subscribe } from "../store/gameStore";
import { Heart, Sword, Shield } from "lucide-react";

export default function BattleArea() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((x) => x + 1)), []);
  const { active, wild } = state;

  const pct = (hp = 0, max = 1) => `${Math.max(0, Math.min(100, (hp / Math.max(1, max)) * 100))}%`;

  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">

      <div className="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 p-4 shadow">
        <h3 className="text-lg font-semibold text-blue-400 mb-2">Jugador</h3>
        {active ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img
                src={active.sprite}
                alt={active.name}
                className="h-20 w-20 object-contain"
              />
              <div>
                <p className="font-bold text-white capitalize text-lg">
                  {active.name}
                </p>
                <div className="text-sm text-slate-300">
                  HP: {active.hp}/{active.stats.hpMax}
                </div>
                <div className="flex gap-3 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Sword className="h-3 w-3 text-red-400" />
                    Atq: {active.stats.atk ?? active.stats.attack ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-blue-400" />
                    Def: {active.stats.def ?? active.stats.defense ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-pink-400" />
                    Cur: {Math.max(0, (active.healsTotal ?? 2) - (active.healsUsed ?? 0))}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 mt-2 overflow-hidden">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: pct(active.hp, active.stats.hpMax) }}
              />
            </div>
          </div>
        ) : (
          <p className="text-slate-500 italic text-sm">Sin Pokémon activo</p>
        )}
      </div>


      <div className="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 p-4 shadow">
        <h3 className="text-lg font-semibold text-red-400 mb-2">Salvaje</h3>
        {wild ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img
                src={wild.sprite}
                alt={wild.name}
                className="h-20 w-20 object-contain"
              />
              <div>
                <p className="font-bold text-white capitalize text-lg">
                  {wild.name}
                </p>
                <div className="text-sm text-slate-300">
                  HP: {wild.hp}/{wild.stats.hpMax}
                </div>
                <div className="flex gap-3 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Sword className="h-3 w-3 text-red-400" />
                    Atq: {wild.stats.atk ?? wild.stats.attack ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-blue-400" />
                    Def: {wild.stats.def ?? wild.stats.defense ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 mt-2 overflow-hidden">
              <div
                className="bg-red-500 h-3 rounded-full transition-all"
                style={{ width: pct(wild.hp, wild.stats.hpMax) }}
              />
            </div>
          </div>
        ) : (
          <p className="text-slate-500 italic text-sm">No hay enemigo salvaje</p>
        )}
      </div>
    </div>
  );
}
