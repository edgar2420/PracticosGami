import { useEffect, useRef, useState } from "react";
import {
  Star, Trash2, Zap, Heart, Shield,
  Circle, Flame, Droplet, Leaf, Zap as ZapBolt, Snowflake, Bug,
  FlaskConical, Mountain, Feather, Brain, Ghost, Gem, Swords,
  Shield as SteelShield, Moon, Crown, Sparkles
} from "lucide-react";

const TYPE_INFO = {
  normal:   { bg: "bg-gray-300",   text: "text-gray-900",   Icon: Circle,     label: "Normal" },
  fire:     { bg: "bg-orange-400", text: "text-white",      Icon: Flame,      label: "Fire" },
  water:    { bg: "bg-blue-400",   text: "text-white",      Icon: Droplet,    label: "Water" },
  grass:    { bg: "bg-green-500",  text: "text-white",      Icon: Leaf,       label: "Grass" },
  electric: { bg: "bg-yellow-400", text: "text-gray-900",   Icon: ZapBolt,    label: "Electric" },
  ice:      { bg: "bg-cyan-300",   text: "text-gray-900",   Icon: Snowflake,  label: "Ice" },
  fighting: { bg: "bg-red-500",    text: "text-white",      Icon: Swords,     label: "Fighting" },
  poison:   { bg: "bg-fuchsia-500",text: "text-white",      Icon: FlaskConical,label: "Poison" },
  ground:   { bg: "bg-amber-500",  text: "text-gray-900",   Icon: Mountain,   label: "Ground" },
  flying:   { bg: "bg-indigo-400", text: "text-white",      Icon: Feather,    label: "Flying" },
  psychic:  { bg: "bg-pink-400",   text: "text-white",      Icon: Brain,      label: "Psychic" },
  bug:      { bg: "bg-lime-400",   text: "text-gray-900",   Icon: Bug,        label: "Bug" },
  rock:     { bg: "bg-stone-400",  text: "text-gray-900",   Icon: Gem,        label: "Rock" },
  ghost:    { bg: "bg-purple-500", text: "text-white",      Icon: Ghost,      label: "Ghost" },
  dragon:   { bg: "bg-indigo-500", text: "text-white",      Icon: Crown,      label: "Dragon" },
  dark:     { bg: "bg-neutral-700",text: "text-white",      Icon: Moon,       label: "Dark" },
  steel:    { bg: "bg-slate-400",  text: "text-gray-900",   Icon: SteelShield,label: "Steel" },
  fairy:    { bg: "bg-rose-400",   text: "text-white",      Icon: Sparkles,   label: "Fairy" },
};

const TypeChip = ({ t }) => {
  const k = (t || "normal").toLowerCase();
  const { bg, text, Icon, label } = TYPE_INFO[k] || TYPE_INFO.normal;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${bg} ${text}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

export default function PokemonCard({
  pokemon,
  onUse,
  onToggleFav,
  onDelete,
  onHeal,
  isFavorite = false
}) {
  const { id, name, sprite, types = [], stats } = pokemon;

  const healsTotal = pokemon.healsTotal ?? 2;
  const healsUsed  = pokemon.healsUsed  ?? 0;
  const healsLeft  = Math.max(0, healsTotal - healsUsed);

  const hpNow   = pokemon.hp ?? stats.hpMax;
  const hpPct   = Math.round((hpNow / stats.hpMax) * 100);
  const totalLost = Math.max(0, stats.hpMax - hpNow);

  const prevHpRef = useRef(hpNow);
  const [justHealed, setJustHealed] = useState(false);
  const [delta, setDelta] = useState(0);

  useEffect(() => {
    const prev = prevHpRef.current;
    if (hpNow < prev) {
      setDelta(hpNow - prev);
      setJustHealed(false);
      const t = setTimeout(() => setDelta(0), 450);
      prevHpRef.current = hpNow;
      return () => clearTimeout(t);
    }
    if (hpNow > prev) {
      setDelta(hpNow - prev);
      setJustHealed(true);
      const t1 = setTimeout(() => setJustHealed(false), 450);
      const t2 = setTimeout(() => setDelta(0), 450);
      prevHpRef.current = hpNow;
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    prevHpRef.current = hpNow;
  }, [hpNow]);

  const rawAttacks =
    (Array.isArray(pokemon.attacks) && pokemon.attacks.length > 0)
      ? pokemon.attacks
      : (Array.isArray(pokemon.moves)
          ? pokemon.moves.map(m => m?.move?.name ?? m?.name ?? m).filter(Boolean).slice(0,4)
          : []);

  const attacks = rawAttacks
    .filter(Boolean)
    .slice(0,4)
    .map(a => (typeof a === "string" ? { name: a } : a));

  const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

  const lastDamageTaken = delta < 0 ? Math.abs(delta) : 0;
  const damageBoxValue = lastDamageTaken || totalLost;


  const canHeal = healsLeft > 0 && hpNow < stats.hpMax;

  return (
    <div className={`group relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm p-4 shadow-xl hover:shadow-2xl hover:border-slate-600/80 transition-all duration-300 hover:scale-[1.02] ${lastDamageTaken ? "animate-hit" : ""}`}>
      <style>{`
        @keyframes hit-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}
        .animate-hit{animation:hit-shake .35s ease-in-out}
        @keyframes float-up{0%{opacity:0;transform:translateY(6px) scale(.98)}15%{opacity:1}100%{opacity:0;transform:translateY(-8px) scale(1)}}
        .badge-float{animation:float-up .45s ease-out both}
        .heal-pulse{box-shadow:0 0 0 2px rgba(16,185,129,.25),0 0 18px -6px rgba(16,185,129,.5)}
      `}</style>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />

      <div className="relative flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{cap(name)}</h3>
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <TypeChip key={`${id}-${t}`} t={t} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleFav}
            title="Favorito"
            className={`h-9 w-9 grid place-content-center rounded-xl transition-all duration-200 ${isFavorite ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/30 scale-100" : "bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-yellow-400 hover:border-yellow-400/40 hover:scale-110"}`}
          >
            <Star className="h-4.5 w-4.5" fill={isFavorite ? "currentColor" : "none"} strokeWidth={2} />
          </button>
          <button
            onClick={onDelete}
            title="Eliminar"
            className="h-9 w-9 grid place-content-center rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-rose-400 hover:border-rose-400/40 hover:bg-rose-500/10 hover:scale-110 transition-all duration-200"
          >
            <Trash2 className="h-4.5 w-4.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className={`relative my-4 mx-auto h-32 w-32 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700/40 grid place-content-center overflow-hidden shadow-inner group-hover:border-slate-600/60 transition-colors ${justHealed ? "heal-pulse" : ""}`}>
        {delta < 0 && <div className="absolute inset-0 bg-rose-500/20 mix-blend-screen" />}
        {delta > 0 && <div className="absolute inset-0 bg-emerald-400/15 mix-blend-screen" />}

        {sprite ? (
          <img src={sprite} alt={name} className="relative h-28 w-28 object-contain drop-shadow-lg" />
        ) : (
          <div className="text-slate-600 text-xs font-medium">Sin imagen</div>
        )}

        {delta !== 0 && (
          <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-md text-xs font-bold badge-float ${delta < 0 ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}>
            {delta < 0 ? `-${Math.abs(delta)}` : `+${delta}`}
          </div>
        )}
      </div>

      <div className="mb-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300 font-medium">HP</span>
          <span className={`font-bold ${hpPct > 50 ? "text-emerald-400" : hpPct > 20 ? "text-amber-400" : "text-rose-400"}`}>
            {hpNow} / {stats.hpMax}
          </span>
        </div>
        <div className={`relative h-3 w-full rounded-full bg-slate-900/80 border border-slate-700/40 overflow-hidden shadow-inner ${justHealed ? "heal-pulse" : ""}`}>
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 shadow-lg ${
              hpPct > 50
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-emerald-500/50"
                : hpPct > 20
                ? "bg-gradient-to-r from-amber-500 to-amber-400 shadow-amber-500/50"
                : "bg-gradient-to-r from-rose-500 to-rose-400 shadow-rose-500/50"
            }`}
            style={{ width: `${Math.max(0, Math.min(100, hpPct))}%` }}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center justify-center bg-slate-900/40 rounded-xl py-2.5 border border-slate-700/30">
          <Zap className="h-5 w-5 text-amber-400 mb-1" strokeWidth={2.5} />
          <span className="text-xs text-slate-400 mb-0.5">Ataque</span>
          <span className="text-lg font-bold text-white">{stats.atk}</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-slate-900/40 rounded-xl py-2.5 border border-slate-700/30">
          <Shield className="h-5 w-5 text-rose-400 mb-1" strokeWidth={2.5} />
          <span className="text-xs text-slate-400 mb-0.5">
            {lastDamageTaken ? "Daño (últ)" : "Daño"}
          </span>
          <span className="text-lg font-bold text-white">
            {damageBoxValue}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center bg-slate-900/40 rounded-xl py-2.5 border border-slate-700/30">
          <Heart className="h-5 w-5 text-pink-400 mb-1" strokeWidth={2.5} />
          <span className="text-xs text-slate-400 mb-0.5">Curas</span>
          <span className="text-lg font-bold text-white">{healsLeft}/{healsTotal}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Ataques</h4>
        {attacks.length ? (
          <div className="flex flex-wrap gap-2">
            {attacks.map((m, i) => {
              const typeKey = (m.type || types?.[0] || "normal").toLowerCase();
              const typeCfg = TYPE_INFO[typeKey] || TYPE_INFO.normal;
              return (
                <span
                  key={`${id}-atk-${i}-${m.name}`}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${typeCfg.bg} ${typeCfg.text}`}
                  title={m.type ? `${cap(m.name)} • ${cap(m.type)}` : cap(m.name)}
                >
                  {typeCfg.Icon ? <typeCfg.Icon className="h-3.5 w-3.5" /> : null}
                  {cap(m.name)}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic">Sin ataques</div>
        )}
      </div>

      <div className="space-y-2">
        {onUse && (
          <button
            onClick={onUse}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Usar en combate
          </button>
        )}

        <button
          onClick={() => { if (onHeal && canHeal) onHeal(id); }}
          disabled={!canHeal}
          title={!canHeal ? (healsLeft === 0 ? "Sin curas" : "Vida completa") : "Curar"}
          className={`w-full rounded-xl font-medium py-3 text-sm transition ${
            !canHeal
              ? "bg-slate-800/40 border border-slate-700/50 text-slate-500 cursor-not-allowed"
              : "bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
          }`}
        >
          {canHeal ? "+ Curar" : healsLeft === 0 ? "Sin curas" : "Vida completa"}
          {canHeal && healsLeft > 0 ? ` (${healsLeft} restantes)` : ""}
        </button>
      </div>
    </div>
  );
}
