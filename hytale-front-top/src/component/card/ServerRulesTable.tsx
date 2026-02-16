export default function ServerRulesTable() {
    return (
        <div>
            <h3 class="text-2xl font-bold text-white mb-4">Regole del Server</h3>
            <div class="bg-violet-950/30 border border-violet-800/30 rounded-xl p-6">
                <ul class="space-y-2 text-violet-200">
                    <li class="flex items-start gap-3">
                        <span class="text-green-400 mt-1">✓</span>
                        <span>Rispetta tutti i giocatori e lo staff</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-red-400 mt-1">✗</span>
                        <span>No griefing, hacking o cheating di alcun tipo</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-red-400 mt-1">✗</span>
                        <span>No spam in chat o pubblicità</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-green-400 mt-1">✓</span>
                        <span>Divertiti e aiuta la community a crescere!</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}