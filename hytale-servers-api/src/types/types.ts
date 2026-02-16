
export interface ServerResponse {
  id?: number;
  name: string;
  ip: string;
  port: string;
  tags?: string[];
  description?: string;
  website_url?: string;
  discord_url?: string;
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
  version_name?: string;
  version_protocol?: number | null;
  motd?: string | null;
  latency_ms?: number | null;
  software_type?: string | null;
  last_updated?: string;          // ISO string o timestamp
  last_ping_error?: string | null;
}
