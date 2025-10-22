import CaptureSync from "../components/CaptureSync"
import HeaderStats from "../components/HeaderStats"
import BattleArea from "../components/BattleArea"
import Controls from "../components/Controls"
import LogBox from "../components/LogBox"
import UnitsGrid from "../components/UnitsGrid"
import { Map, Mountain, Castle } from "lucide-react"

export default function GamePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-slate-100">
      {/* Header con franja diagonal */}
      <header className="relative bg-[#b30000] text-white overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-8 py-10">
          <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-sm text-center">
            POKÉ SYNERGY CORE
          </h1>
          <p className="mt-1 text-sm opacity-90 text-center">Simulador de Combate v2.1</p>
        </div>
        <div className="pointer-events-none absolute bottom-[-26px] left-0 h-12 w-[160%] rotate-[-4deg] bg-[#b30000]" />
      </header>

      <div className="mx-auto w-full max-w-7xl px-6 py-6 space-y-6">
        {/* 1. Capturar + panel de stats claro */}
        <section className="rounded-xl bg-[#c92727] p-4 shadow-[0_0_0_1px_rgba(0,0,0,.35)]">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-[15px] font-semibold mb-3">1. Capturar Unidad</h2>
              <CaptureSync />
            </div>

            <div className="w-[520px]">
              <div className="rounded-lg border border-black/20 bg-slate-100 text-slate-900 px-6 py-4 shadow-[inset_0_3px_12px_rgba(0,0,0,.1)]">
                <HeaderStats />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Zonas de combate (tres botones iguales) */}
        <section className="rounded-xl bg-[#c92727] p-4 shadow-[0_0_0_1px_rgba(0,0,0,.35)]">
          <h2 className="text-[15px] font-semibold mb-3">2. Seleccionar Zona de Combate</h2>
          <div className="grid grid-cols-3 gap-4">
            <button className="rounded-lg bg-slate-900/35 hover:bg-slate-900/55 border border-white/20 py-5 font-semibold tracking-wide transition flex flex-col items-center">
              <Map className="h-6 w-6 mb-1" /> Pueblo Valdeo
            </button>
            <button className="rounded-lg bg-slate-900/35 hover:bg-slate-900/55 border border-white/20 py-5 font-semibold tracking-wide transition flex flex-col items-center">
              <Mountain className="h-6 w-6 mb-1" /> Ciudad Sirio
            </button>
            <button className="rounded-lg bg-slate-900/35 hover:bg-slate-900/55 border border-white/20 py-5 font-semibold tracking-wide transition flex flex-col items-center">
              <Castle className="h-6 w-6 mb-1" /> Pueblo Kena
            </button>
          </div>
        </section>

        {/* 3. Combate (panel oscuro) */}
        <section className="rounded-xl bg-[#0f131a] p-4 border border-slate-700/60">
          <h2 className="text-[15px] font-semibold mb-3">3. Combate</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7">
              <BattleArea />
            </div>
            <div className="col-span-5 flex flex-col gap-3">
              <Controls />
              <div className="rounded-lg border border-slate-700/60 bg-slate-800/50 p-3">
                <h3 className="font-medium mb-2">Registro</h3>
                <LogBox />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Gestión de Unidades (cards) */}
        <section className="rounded-xl bg-[#0f131a] p-4 border border-slate-700/60">
          <h2 className="text-[15px] font-semibold mb-3">4. Gestión de Unidades</h2>
          <UnitsGrid />
        </section>
      </div>
    </main>
  )
}
