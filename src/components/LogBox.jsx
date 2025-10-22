import { useEffect, useMemo, useRef, useState } from "react";
import { state, subscribe } from "../store/gameStore";
import {
  Sword,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  XCircle,
  Info,
  ArrowDownToLine,
} from "lucide-react";

function classify(msg = "") {
  const m = msg.toLowerCase();
  if (/(captur|atrap)/.test(m)) return { icon: CheckCircle2, tone: "success", label: "Captura" };
  if (/(fall|err|fracasa|falla)/.test(m)) return { icon: XCircle, tone: "danger", label: "Fallo" };
  if (/(cura|salud|heal)/.test(m)) return { icon: HeartPulse, tone: "heal", label: "Curación" };
  if (/(ataque|dañ|golpe|turno|crit)/.test(m)) return { icon: Sword, tone: "attack", label: "Acción" };
  if (/(encuentro|spawn|aparece)/.test(m)) return { icon: Sparkles, tone: "encounter", label: "Encuentro" };
  return { icon: Info, tone: "neutral", label: "Evento" };
}

const toneStyles = {
  success: {
    dot: "bg-emerald-400",
    ring: "ring-emerald-500/30",
    badge: "from-emerald-500 to-teal-500",
    bar: "from-emerald-400 to-teal-400",
    text: "text-emerald-100",
  },
  danger: {
    dot: "bg-rose-400",
    ring: "ring-rose-500/30",
    badge: "from-rose-500 to-pink-500",
    bar: "from-rose-400 to-pink-400",
    text: "text-rose-100",
  },
  heal: {
    dot: "bg-cyan-300",
    ring: "ring-cyan-400/30",
    badge: "from-cyan-500 to-sky-500",
    bar: "from-cyan-300 to-sky-400",
    text: "text-cyan-100",
  },
  attack: {
    dot: "bg-amber-300",
    ring: "ring-amber-400/30",
    badge: "from-amber-500 to-orange-500",
    bar: "from-amber-300 to-orange-400",
    text: "text-amber-100",
  },
  encounter: {
    dot: "bg-violet-400",
    ring: "ring-violet-500/30",
    badge: "from-indigo-500 to-violet-500",
    bar: "from-indigo-400 to-violet-400",
    text: "text-violet-100",
  },
  neutral: {
    dot: "bg-slate-400",
    ring: "ring-slate-400/20",
    badge: "from-slate-600 to-slate-500",
    bar: "from-slate-400 to-slate-500",
    text: "text-slate-200",
  },
};

export default function LogBox() {
  const [, setTick] = useState(0);
  const viewportRef = useRef(null);
  const [stickToEnd, setStickToEnd] = useState(true);

  useEffect(() => subscribe(() => setTick((x) => x + 1)), []);


  const grouped = useMemo(() => {
    const res = [];
    for (let i = 0; i < state.log.length; i++) {
      const msg = state.log[i];
      if (res.length && res[res.length - 1].msg === msg) {
        res[res.length - 1].count += 1;
      } else {
        res.push({ msg, count: 1, isNew: i === state.log.length - 1 });
      }
    }
    return res;
  }, [state.log]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !stickToEnd) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [grouped, stickToEnd]);

  const onScroll = () => {
    const el = viewportRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
    setStickToEnd(distanceFromBottom < 40);
  };

  return (
    <div
      className="
        relative rounded-2xl p-[1px]
        bg-gradient-to-br from-fuchsia-600/40 via-sky-500/40 to-emerald-500/40
        shadow-[0_0_40px_-10px_rgba(99,102,241,0.35)]
      "
    >

      <div
        className="
          rounded-2xl border border-slate-700/70 bg-slate-900/70 backdrop-blur
        "
        style={{
          backgroundImage:
            "radial-gradient(1200px 400px at 10% -20%, rgba(56,189,248,.06), transparent), radial-gradient(800px 300px at 110% 20%, rgba(168,85,247,.06), transparent)",
        }}
      >

        <div className="sticky top-0 z-10 rounded-t-2xl px-4 py-2.5 border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-widest text-slate-400">
              Registro de batalla
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" />
              <span className="text-[11px] text-slate-400">en vivo</span>
            </div>
          </div>
        </div>

        <div
          ref={viewportRef}
          onScroll={onScroll}
          className="
            h-60 overflow-y-auto rounded-b-2xl p-3
            [scrollbar-color:theme(colors.slate.600)_transparent] [scrollbar-width:thin]
          "
        >
          {grouped.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-2">
              {grouped.map(({ msg, count, isNew }, i) => {
                const { icon: Icon, tone, label } = classify(msg);
                const t = toneStyles[tone] ?? toneStyles.neutral;
                return (
                  <li
                    key={i}
                    className={`
                      group relative overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/40
                      ring-1 ${t.ring} transition
                      hover:border-slate-600/70 hover:bg-slate-800/60
                      ${isNew ? "shadow-[0_0_0_2px_rgba(148,163,184,.08)_inset] animate-[pulse_1.3s_ease-in-out_1]" : ""}
                    `}
                  >
                    <div className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${t.bar}`} />
                    <div className="flex items-start gap-3 px-3 py-2.5 pl-5">
                      <span className={`mt-1 h-2.5 w-2.5 flex-none rounded-full ${t.dot} shadow`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                              inline-flex items-center gap-1.5 rounded-full border border-white/10
                              bg-gradient-to-br ${t.badge} px-2 py-0.5 text-[11px] font-medium
                              text-white/95 shadow-sm
                            `}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                          </span>
                          {count > 1 && (
                            <span className="ml-1 rounded-full bg-slate-900/60 px-2 py-0.5 text-[11px] text-slate-200 border border-slate-700/60">
                              ×{count}
                            </span>
                          )}
                          {isNew && (
                            <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-200 border border-emerald-400/30">
                              nuevo
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-snug text-slate-100">
                          {msg}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {!stickToEnd && grouped.length > 0 && (
          <button
            onClick={() => {
              const el = viewportRef.current;
              if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
            }}
            className="
              absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full
              border border-slate-600/60 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-100
              shadow hover:bg-slate-800/90
            "
            title="Ir al final"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Ir al final
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid h-44 place-items-center rounded-xl border border-dashed border-slate-700/70 bg-slate-900/40">
      <div className="text-center">
        <div className="text-slate-300">No hay eventos aún</div>
        <div className="text-[12px] text-slate-500">
          Inicia un encuentro para comenzar el registro.
        </div>
      </div>
    </div>
  );
}
