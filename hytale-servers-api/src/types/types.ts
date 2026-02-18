
export interface ServerResponse {
  id?: number;
  name: string;
  ip: string;
  port: string;
  tags?: string[];
  description?: string;
  website_url?: string;
  discord_url?: string;
  voti_totali?: number;
  banner_url?: string;
  logo_url?: string;
  rules?: string;
  secret_key?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServerStatus {
  id?: number;
  server_id: number;
  players_online: number;
  players_max: number;
  is_online: boolean;
  latency_ms?: number | null;
  last_updated?: string;
}
