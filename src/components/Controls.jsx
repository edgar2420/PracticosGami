import { startEncounter, turn, heal, capture } from "../store/gameStore";
import { Sparkles, Sword, BriefcaseMedical, Lasso } from "lucide-react";

export default function Controls() {
  const Btn = ({ icon: Icon, color, children, ...props }) => (
    <button
      {...props}
      className={`
        flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200
        shadow-md hover:shadow-lg border border-slate-700/40 
        bg-gradient-to-br ${color} text-white hover:scale-105 active:scale-95
      `}
    >
      <Icon className="h-4 w-4 opacity-90" />
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap justify-center gap-4 bg-slate-900/60 p-4 rounded-2xl shadow-inner border border-slate-700/50">
      <Btn icon={Sparkles} onClick={startEncounter} color="from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
        Nuevo encuentro
      </Btn>
      <Btn icon={Sword} onClick={turn} color="from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700">
        Turno
      </Btn>
      <Btn icon={BriefcaseMedical} onClick={heal} color="from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
        Curar
      </Btn>
      <Btn icon={Lasso} onClick={capture} color="from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700">
        Capturar
      </Btn>
    </div>
  );
}
