export interface ServerApiResponse {
  success: boolean;
  data: ServerResponse;
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
}
