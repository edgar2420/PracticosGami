import {
  Star, Trash2, Zap, Heart, Shield,
  Circle, Flame, Droplet, Leaf, Zap as ZapBolt, Snowflake, Bug,
  FlaskConical, Mountain, Feather, Brain, Ghost, Gem, Swords, Shield as SteelShield,
  Moon, Crown, Sparkles
} from "lucide-react";

/* =========================
   Chips de Tipo (pastillas)
   ========================= */
const TYPE_INFO = {
  normal:   { bg: "bg-gray-300",   text: "text-gray-900",   Icon: Circle,     label: "Normal" },
  fire:     { bg: "bg-orange-400", text: "text-white",      Icon: Flame,      label: "Fuego" },
  water:    { bg: "bg-blue-400",   text: "text-white",      Icon: Droplet,    label: "Agua" },
  grass:    { bg: "bg-green-500",  text: "text-white",      Icon: Leaf,       label: "Planta" },
  electric: { bg: "bg-yellow-400", text: "text-gray-900",   Icon: ZapBolt,    label: "Eléctrico" },
  ice:      { bg: "bg-cyan-300",   text: "text-gray-900",   Icon: Snowflake,  label: "Hielo" },
  fighting: { bg: "bg-red-500",    text: "text-white",      Icon: Swords,     label: "Lucha" },
  poison:   { bg: "bg-fuchsia-500",text: "text-white",      Icon: FlaskConical,label: "Veneno" },
  ground:   { bg: "bg-amber-500",  text: "text-gray-900",   Icon: Mountain,   label: "Tierra" },
  flying:   { bg: "bg-indigo-400", text: "text-white",      Icon: Feather,    label: "Volador" },
  psychic:  { bg: "bg-pink-400",   text: "text-white",      Icon: Brain,      label: "Psíquico" },
  bug:      { bg: "bg-lime-400",   text: "text-gray-900",   Icon: Bug,        label: "Bicho" },
  rock:     { bg: "bg-stone-400",  text: "text-gray-900",   Icon: Gem,        label: "Roca" },
  ghost:    { bg: "bg-purple-500", text: "text-white",      Icon: Ghost,      label: "Fantasma" },
  dragon:   { bg: "bg-indigo-500", text: "text-white",      Icon: Crown,      label: "Dragón" },
  dark:     { bg: "bg-neutral-700",text: "text-white",      Icon: Moon,       label: "Siniestro" },
  steel:    { bg: "bg-slate-400",  text: "text-gray-900",   Icon: SteelShield,label: "Acero" },
  fairy:    { bg: "bg-rose-400",   text: "text-white",      Icon: Sparkles,   label: "Hada" },
};

function TypeChip({ t }) {
  const key = (t || "normal").toLowerCase();
  const { bg, text, Icon, label } = TYPE_INFO[key] || TYPE_INFO.normal;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-medium rounded-full ${bg} ${text} shadow`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

/* =========================
   Clase por tipo primario
   ========================= */
const CLASS_ICON = Object.fromEntries(
  Object.entries(TYPE_INFO).map(([k, v]) => [k, { Icon: v.Icon, cls: `${v.text}`, label: v.label }])
);

export default function PokemonCard({ pokemon, onUse, onToggleFav, onDelete, isFavorite }) {
  const { name, sprite, types = [], stats } = pokemon;

  const primary = (types[0] || "normal").toLowerCase();
  const classInfo = CLASS_ICON[primary] || CLASS_ICON.normal;
  const { Icon: ClassIcon, cls, label } = classInfo;

  // Si en tu store guardas hp temporal, úsalo; si no, hpMax.
  const hp = (pokemon.hp ?? stats.hpMax);
  const pct = Math.max(0, Math.min(100, Math.round((hp / stats.hpMax) * 100)));
  const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

  return (
    <div className="group relative rounded-xl border border-slate-700/50 bg-slate-800/60 p-4 shadow hover:border-slate-500/60">
      {/* Acciones */}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <button
          onClick={onToggleFav}
          className={`h-8 w-8 grid place-content-center rounded-md border transition
          ${isFavorite ? "border-yellow-400/50 text-yellow-400 bg-yellow-500/10" : "border-slate-600 text-slate-300 hover:text-yellow-300 hover:border-yellow-300/50"}`}
          title="Favorito"
        >
          <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <button
          onClick={onDelete}
          className="h-8 w-8 grid place-content-center rounded-md border border-slate-600 text-slate-300 hover:text-rose-300 hover:border-rose-300/50"
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Header */}
      <div className="flex gap-4">
        <div className="h-20 w-20 rounded-lg bg-slate-900/60 border border-slate-700/60 grid place-content-center overflow-hidden">
          {sprite ? (
            <img src={sprite} alt={name} className="h-16 w-16 object-contain" />
          ) : (
            <div className="text-slate-500 text-xs">No img</div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-xl font-semibold text-slate-100 leading-6">{cap(name)}</div>

          {/* Tipos (chips) */}
          <div className="mt-2 flex flex-wrap gap-2">
            {types.map((t) => (
              <TypeChip key={t} t={t} />
            ))}
          </div>

          {/* Clase (según tipo primario) */}
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-slate-400">Clase:</span>
            <span className={`inline-flex items-center gap-1 font-medium ${cls}`}>
              <ClassIcon className="h-4 w-4" />
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* HP */}
      <div className="mt-4 text-xs text-slate-300">HP: {hp}/{stats.hpMax}</div>
      <div className="mt-1 h-2 w-full rounded bg-slate-700 overflow-hidden">
        <div
          className={`h-2 transition-all ${pct > 50 ? "bg-emerald-400" : pct > 20 ? "bg-amber-400" : "bg-rose-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-slate-200">
        <div className="flex items-center gap-2"><Zap className="h-4 w-4 opacity-80" /> Atq: <b>{stats.atk}</b></div>
        <div className="flex items-center gap-2"><Shield className="h-4 w-4 opacity-80" /> Def: <b>{stats.def}</b></div>
        <div className="flex items-center gap-2"><Heart className="h-4 w-4 opacity-80" /> Curas: <b>2</b></div>
      </div>

      {/* Acciones */}
      <div className="mt-3">
        <button
          onClick={onUse}
          className="w-full rounded-lg border border-slate-600 bg-slate-900/50 text-slate-200 py-2 text-sm hover:bg-slate-900"
          title="Usar en combate"
        >
          Usar en combate
        </button>
        <button
          disabled
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/70 text-slate-400 py-2 text-sm cursor-not-allowed"
          title="Curar (solo en combate)"
        >
          + CURAR
        </button>
      </div>
    </div>
  );
}
