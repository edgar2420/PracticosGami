import CaptureSync from "../components/CaptureSync"
import HeaderStats from "../components/HeaderStats"
import BattleArea from "../components/BattleArea"
import Controls from "../components/Controls"
import LogBox from "../components/LogBox"
import UnitsGrid from "../components/UnitsGrid"

export default function GamePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-800 via-red-900 to-black text-yellow-100">
      {/* HEADER */}
      <header className="relative bg-gradient-to-r from-red-600 to-yellow-500 text-black shadow-lg">
        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-wide text-center drop-shadow-md">
            <span className="text-yellow-200">POKÉ</span>
            <span className="text-red-700">DEX</span>
          </h1>
          <p className="mt-3 text-center text-yellow-50/80">
            Captura, entrena y simula batallas al estilo clásico.
          </p>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="mx-auto w-full max-w-7xl px-6 py-10 space-y-8">
        {/* Sincronización / Estadísticas */}
        <section className="rounded-xl border border-red-500/40 bg-red-950/50 backdrop-blur-sm p-6 shadow-[0_0_20px_rgba(255,0,0,0.25)] transition hover:shadow-[0_0_25px_rgba(255,255,0,0.35)]">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-yellow-300 mb-3">Sincronización</h2>
              <CaptureSync />
            </div>
            <div className="w-px bg-yellow-600/40 hidden lg:block" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-yellow-300 mb-3">Estadísticas</h2>
              <HeaderStats />
            </div>
          </div>
        </section>

        {/* Zona de combate */}
        <section className="rounded-xl border border-yellow-600/50 bg-gradient-to-br from-red-950/70 to-black/70 backdrop-blur p-6 shadow-[0_0_15px_rgba(255,255,0,0.25)]">
          <h2 className="text-2xl font-bold text-yellow-300 mb-4">Zona de combate</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <BattleArea />
            </div>
            <div className="space-y-4">
              <Controls />
              <div>
                <h3 className="font-semibold text-red-400 mb-2">Registro</h3>
                <LogBox />
              </div>
            </div>
          </div>
        </section>

        {/* Gestión de Pokemones */}
        <section className="rounded-xl border border-red-700/40 bg-red-950/50 backdrop-blur-sm p-6 shadow-[0_0_20px_rgba(255,0,0,0.25)]">
          <h2 className="text-2xl font-bold text-yellow-300 mb-4">Gestión de Pokemones</h2>
          <UnitsGrid />
        </section>
      </div>
    </main>
  )
}
