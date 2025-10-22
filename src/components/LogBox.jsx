import { useEffect, useState } from "react";
import { state, subscribe } from "../store/gameStore";

export default function LogBox() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((x) => x + 1)), []);

  return (
    <div className="h-48 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm shadow-inner">
      {state.log.length === 0 ? (
        <p className="text-slate-500 italic text-center mt-12">
          No hay eventos registrados aún.
        </p>
      ) : (
        <ul className="space-y-1">
          {state.log.map((msg, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-slate-200 animate-fadeIn"
            >
              <span className="text-red-500 mt-0.5">•</span>
              <span>{msg}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
