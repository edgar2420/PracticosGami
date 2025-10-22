import { useEffect, useState } from "react";
import { state, subscribe } from "../store/gameStore";
import { Users, Trophy, Swords } from "lucide-react";

export default function HeaderStats() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((x) => x + 1)), []);

  const Stat = ({ icon: Icon, label, value, suffix, color }) => (
    <div className="flex items-center gap-3">
      <div className={`grid place-content-center h-9 w-9 rounded-lg bg-slate-200 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-lg font-bold text-slate-900">
          {value}
          {suffix ? <span className="text-slate-500 text-sm"> {suffix}</span> : null}
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl bg-slate-100 text-slate-900 border border-slate-300/70 px-6 py-4 shadow-inner">
      <div className="grid grid-cols-3 divide-x divide-slate-300">
        <div className="pr-6">
          <Stat
            icon={Users}
            label="Unidades"
            value={`${state.bag.length}`}
            suffix="/ 10"
            color="text-slate-900"
          />
        </div>
        <div className="px-6">
          <Stat
            icon={Trophy}
            label="Victorias"
            value={state.wins}
            color="text-amber-600"
          />
        </div>
        <div className="pl-6">
          <Stat
            icon={Swords}
            label="Batallas"
            value={state.battles}
            color="text-rose-600"
          />
        </div>
      </div>
    </div>
  );
}
