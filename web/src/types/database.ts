export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          template_id: string | null;
          data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          template_id?: string | null;
          data: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          template_id?: string | null;
          data?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          preview_url: string | null;
          config: Json;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          preview_url?: string | null;
          config?: Json;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          preview_url?: string | null;
          config?: Json;
          is_default?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
