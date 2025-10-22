import {
  Flame, Droplet, Leaf, Zap, Snowflake, Bug,
  FlaskConical, Mountain, Feather, Brain, Ghost,
  Gem, Swords, Shield as SteelShield, Moon, Sparkles, Circle
} from "lucide-react";

const TYPE_INFO = {
  normal:   { color: "bg-gray-300 text-gray-800", icon: Circle, label: "Normal" },
  fire:     { color: "bg-orange-400 text-white", icon: Flame, label: "Fuego" },
  water:    { color: "bg-blue-400 text-white", icon: Droplet, label: "Agua" },
  grass:    { color: "bg-green-500 text-white", icon: Leaf, label: "Planta" },
  electric: { color: "bg-yellow-400 text-gray-900", icon: Zap, label: "Eléctrico" },
  ice:      { color: "bg-cyan-300 text-gray-800", icon: Snowflake, label: "Hielo" },
  fighting: { color: "bg-red-500 text-white", icon: Swords, label: "Lucha" },
  poison:   { color: "bg-fuchsia-500 text-white", icon: FlaskConical, label: "Veneno" },
  ground:   { color: "bg-amber-500 text-gray-900", icon: Mountain, label: "Tierra" },
  flying:   { color: "bg-indigo-400 text-white", icon: Feather, label: "Volador" },
  psychic:  { color: "bg-pink-400 text-white", icon: Brain, label: "Psíquico" },
  bug:      { color: "bg-lime-400 text-gray-900", icon: Bug, label: "Bicho" },
  rock:     { color: "bg-stone-400 text-gray-900", icon: Gem, label: "Roca" },
  ghost:    { color: "bg-purple-500 text-white", icon: Ghost, label: "Fantasma" },
  dragon:   { color: "bg-indigo-500 text-white", icon: Gem, label: "Dragón" },
  dark:     { color: "bg-neutral-700 text-white", icon: Moon, label: "Siniestro" },
  steel:    { color: "bg-slate-400 text-gray-900", icon: SteelShield, label: "Acero" },
  fairy:    { color: "bg-rose-400 text-white", icon: Sparkles, label: "Hada" },
};

export default function TypeChip({ t }) {
  const typeKey = t?.toLowerCase() || "normal";
  const { color, icon: Icon, label } = TYPE_INFO[typeKey] || TYPE_INFO.normal;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-medium rounded-full ${color} shadow-sm`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
