import { useEffect, useState } from "react";
import { syncCapture, state, subscribe } from "../store/gameStore";
import { DownloadCloud, Loader2 } from "lucide-react";

export default function CaptureSync() {
  const [, setTick] = useState(0);

  useEffect(() => subscribe(() => setTick((x) => x + 1)), []);

  return (
    <button
      onClick={syncCapture}
      disabled={state.loading}
      className={`relative flex items-center justify-center gap-2 
        rounded-xl px-6 py-3 font-semibold text-white text-sm 
        transition-all duration-200 
        ${state.loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"} 
        shadow-md hover:shadow-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
    >
      {state.loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Sincronizando...</span>
        </>
      ) : (
        <>
          <DownloadCloud className="h-5 w-5" />
          <span>SINCRONIZAR</span>
        </>
      )}
    </button>
  );
}
