export interface DiscordUser {
  id: string;             // Discord snowflake → string
  username: string;
  global_name?: string | null;
  avatar?: string | null; // hash o URL
  discriminator?: string | null; // legacy, spesso "0" ora
  email?: string | null;
  created_at: string;
}