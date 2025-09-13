// This file defines TypeScript types generated from the public Supabase schema
// It is **manually** written to provide strong typing for Supabase queries.
// You can regenerate it later using the `supabase gen types typescript --project-id <id> > supabase-types.ts` CLI command.

export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string | null
          created_at: string | null
          expires_at: string | null
          is_multiple_choice: boolean | null
          max_votes_per_user: number | null
          qr_code_url: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          is_multiple_choice?: boolean | null
          max_votes_per_user?: number | null
          qr_code_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          is_multiple_choice?: boolean | null
          max_votes_per_user?: number | null
          qr_code_url?: string | null
        }
      }
      options: {
        Row: {
          id: string
          poll_id: string | null
          text: string
          created_at: string | null
        }
        Insert: {
          id?: string
          poll_id?: string | null
          text: string
          created_at?: string | null
        }
        Update: {
          id?: string
          poll_id?: string | null
          text?: string
          created_at?: string | null
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string | null
          option_id: string | null
          user_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          poll_id?: string | null
          option_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          poll_id?: string | null
          option_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
      }
    }
  }
}