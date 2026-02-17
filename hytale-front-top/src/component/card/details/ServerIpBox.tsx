import { createSignal } from "solid-js";

export default function ServerIpBox() {
  const [copiedIP, setCopiedIP] = createSignal(false);

    const copyIP = async () => {
        const ip = `${server()?.ip}${server()?.port ? ':' + server()?.port : ''}`;
        try {
            await navigator.clipboard.writeText(ip);
            setCopiedIP(true);
            notify("IP copiato negli appunti! 📋", "success");
            setTimeout(() => setCopiedIP(false), 2000);
        } catch (err) {
            notify("Errore nella copia", "error");
        }
    };

    return (<div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-800/50 backdrop-blur-md">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex-1">
                <h3 class="text-sm font-medium text-violet-400 mb-2">Indirizzo Server</h3>
                <div class="flex items-center gap-3 font-mono text-2xl">
                    <span class="text-fuchsia-400">{serverData().ip || '—'}</span>
                    {serverData().port && (
                        <>
                            <span class="text-violet-600">:</span>
                            <span class="text-fuchsia-400">{serverData().port}</span>
                        </>
                    )}
                </div>
            </div>

            <button
                onClick={copyIP}
                class={`
                              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                              transition-all duration-300
                              ${copiedIP()
                        ? "bg-green-600 text-white"
                        : "bg-violet-600 hover:bg-violet-500 text-white"}
                            `}
            >
                <span class="text-xl">{copiedIP() ? "✓" : "📋"}</span>
                {copiedIP() ? "Copiato!" : "Copia IP"}
            </button>
        </div>
    </div>)
}