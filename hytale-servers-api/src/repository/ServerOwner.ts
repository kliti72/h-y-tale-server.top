export interface ServerOwner {
  server_id: number;
  discord_user_id: string;
  role: string;           // 'owner' | 'admin' | 'moderator' | ...
  joined_at: string;
}