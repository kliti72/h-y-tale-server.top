
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
