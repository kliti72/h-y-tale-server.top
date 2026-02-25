export interface ServerApiResponse {
  success: boolean;
  data: ServerResponse;
  error: string,
}

export interface ServerStatusApiResponse {
  success: boolean;
  data: ServerStatus;
  error: string,
}


export type ServerResponse = {
    created_at?: string,
    id?: number,
    ip?: string,
    name?: string,
    port?: string,
    tags: string[],
    description?: string,
    ServerResponse?: string,
    logo_url?: string
    discord_url?: string,
    website_url?: string,
    banner_url?: string,
    rules?: string,
    secret_key: string,
    role?: string,
    updated_at?: string;
    players_online? : number,
    max_players? : number;
    votes?: number;
    voti_totali?: number;
}

export interface MyServersResponse {
  user: {
    id: string;
  };
  servers: ServerResponse[];
  count: number;
}

export interface GetServerParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string; 
}


export interface ServerStatus {
  id?: number;
  server_id: number;
  players_online: number;
  players_max: number;
  is_online: boolean;
  last_updated?: string;
}
