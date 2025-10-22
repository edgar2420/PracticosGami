import { startEncounter, turn, heal, capture } from "../store/gameStore";
import { Sparkles, Sword, BriefcaseMedical, Lasso } from "lucide-react";

export default function Controls() {
  // Componente interno para reutilizar botones
  const Btn = ({ icon: Icon, children, ...props }) => (
    <button
      {...props}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-900 px-4 py-2 text-sm shadow"
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-3">
      <Btn icon={Sparkles} onClick={startEncounter}>
        Nuevo encuentro
      </Btn>
      <Btn icon={Sword} onClick={turn}>
        Turno
      </Btn>
      <Btn icon={BriefcaseMedical} onClick={heal}>
        Curar
      </Btn>
      <Btn icon={Lasso} onClick={capture}>
        Capturar
      </Btn>
    </div>
  );
}
