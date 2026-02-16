// ServerAddWrapper.tsx
import { Component, createResource } from "solid-js";
import { useNavigate } from "@solidjs/router";
import AddEditServerPage from "./AddEditServerPage";
import { ServerResponse } from "../../types/ServerResponse";
import { ServerService } from "../../services/server.service";

export const ServerAddWrapper: Component = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: Partial<ServerResponse>) => {
    try {
      // Costruisco l'oggetto ServerResponse completo
      const serverData: ServerResponse = {
        name: formData.name || '',
        ip: formData.ip || '',
        port: formData.port || '25565',
        description: formData.description || '',
        rules: formData.rules || '',
        tags: formData.tags || [],
        website_url: formData.website_url || '',
        discord_url: formData.discord_url || '',
        banner_url: formData.banner_url || '',
        logo_url: formData.logo_url || '',
        secret_key: formData.secret_key || '',
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString(),
      };

      console.log("Metodo per creare il server chiamato");
      // Chiamata API per creare il server
      const response = ServerService.addServer(serverData);
      console.log('Server creato:', response);

      // Redirect alla pagina del server o alla lista
      navigate(`/servers/${serverData.name}`);
      // oppure: navigate('/servers');
      
    } catch (error) {
      console.error('Errore submit:', error);
      alert('Qualcosa è andato storto fra, riprova!');
    }
  };

  return (
    <AddEditServerPage 
      mode="add"
      onSubmit={handleSubmit}
    />
  );
};