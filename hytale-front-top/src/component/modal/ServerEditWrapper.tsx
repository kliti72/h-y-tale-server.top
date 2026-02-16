// ServerEditWrapper.tsx
import { Component, createResource, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import AddEditServerPage from "./AddEditServerPage";
import { ServerResponse } from "../../types/ServerResponse";
import { ServerService } from "../../services/server.service";
import { notify } from "../../component/template/Notification";
import { StringArraysUtilis } from "../../utils/StringArrayUtils";

export const ServerEditWrapper: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  
  // Prendi l'ID dal parametro URL
  const serverId = () => parseInt(params.id || '0');
  
  console.log("ID server da editare:", serverId());
  
  // Fetch dei dati del server esistente usando l'ID
  const [serverData] = createResource(
    serverId,
    async (id) => {
      if (!id || id === 0) {
        throw new Error("ID server non valido bro!");
      }
      
      try {
        const server = await ServerService.getServerById(id);
        console.log("Dati server caricati:", server);
        return server;
      } catch (error) {
        console.error("Errore caricamento server:", error);
        throw error;
      }
    }
  );

  const handleSubmit = async (formData: Partial<ServerResponse>) => {
    try {
      const currentServer = serverData();
      if (!currentServer) {
        throw new Error('Dati server mancanti bro!');
      }

      const id = serverId();
      if (!id) {
        throw new Error('ID server non valido!');
      }

      console.log("Aggiornamento server con dati:", formData);

      // Prepara i dati per l'update (senza campi che il backend gestisce)
      const updateData = {
        name: formData.name || currentServer.name,
        ip: formData.ip || currentServer.ip,
        port: formData.port || currentServer.port,
        description: formData.description || currentServer.description,
        rules: formData.rules || currentServer.rules,
        tags: formData.tags || currentServer.tags || [],
        website_url: formData.website_url || currentServer.website_url || '',
        discord_url: formData.discord_url || currentServer.discord_url || '',
        banner_url: formData.banner_url || currentServer.banner_url || '',
        logo_url: formData.logo_url || currentServer.logo_url || '',
      };

      // Chiamata al service
      const result = await ServerService.updateServer(id, updateData);
      
      console.log('Server aggiornato con successo:', result);
      notify(`Server "${result.name}" aggiornato! 🎉`, "success");

      // Redirect alla pagina del server o al panel
      navigate(`/panel`);
      // oppure: navigate(`/server/${result.name}`);
      
    } catch (error) {
      console.error('Errore update:', error);
      notify(
        error instanceof Error 
          ? error.message 
          : 'Non sono riuscito ad aggiornare fra, riprova!',
        "error"
      );
    }
  };

  return (
    <Show 
      when={!serverData.loading} 
      fallback={
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950">
          <div class="text-center">
            <div class="text-6xl mb-4">⏳</div>
            <div class="text-white text-2xl font-bold">Carico i dati del server...</div>
            <div class="text-violet-400 mt-2">Un attimo fra!</div>
          </div>
        </div>
      }
    >
      <Show 
        when={serverData() && !serverData.error} 
        fallback={
          <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950">
            <div class="text-center">
              <div class="text-6xl mb-4">❌</div>
              <div class="text-white text-2xl font-bold mb-2">Server non trovato bro!</div>
              <div class="text-violet-400 mb-6">
                {serverData.error instanceof Error 
                  ? serverData.error.message 
                  : "Qualcosa è andato storto"}
              </div>
              <button
                onClick={() => navigate('/panel')}
                class="px-6 py-3 bg-violet-700 hover:bg-violet-600 text-white rounded-xl transition font-semibold"
              >
                ← Torna al Panel
              </button>
            </div>
          </div>
        }
      >
        <AddEditServerPage 
          mode="edit"
          serverId={serverId().toString()}
          initialData={serverData()!}
          onSubmit={handleSubmit}
        />
      </Show>
    </Show>
  );
};