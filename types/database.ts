export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth0_id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth0_id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth0_id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          plan: 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          billing_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          owner_id: string;
          plan?: 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          billing_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          owner_id?: string;
          plan?: 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          billing_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      org_members: {
        Row: {
          id: string;
          org_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member' | 'viewer';
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member' | 'viewer';
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member' | 'viewer';
          created_at?: string;
        };
      };
      api_keys: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          key_hash: string;
          key_prefix: string;
          scopes: string[];
          rate_limit_per_min: number;
          last_used_at: string | null;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          key_hash: string;
          key_prefix: string;
          scopes?: string[];
          rate_limit_per_min?: number;
          last_used_at?: string | null;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          key_hash?: string;
          key_prefix?: string;
          scopes?: string[];
          rate_limit_per_min?: number;
          last_used_at?: string | null;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      usage_daily: {
        Row: {
          id: string;
          org_id: string;
          date: string;
          text_requests: number;
          audio_requests: number;
          redteam_attacks: number;
          blocked_count: number;
          avg_latency_ms: number | null;
        };
        Insert: {
          id?: string;
          org_id: string;
          date: string;
          text_requests?: number;
          audio_requests?: number;
          redteam_attacks?: number;
          blocked_count?: number;
          avg_latency_ms?: number | null;
        };
        Update: {
          id?: string;
          org_id?: string;
          date?: string;
          text_requests?: number;
          audio_requests?: number;
          redteam_attacks?: number;
          blocked_count?: number;
          avg_latency_ms?: number | null;
        };
      };
      request_log: {
        Row: {
          id: string;
          org_id: string;
          api_key_id: string | null;
          request_type: 'text' | 'audio' | 'redteam';
          status: 'blocked' | 'passed' | 'error';
          blocked_by: string | null;
          threat_category: string | null;
          latency_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          api_key_id?: string | null;
          request_type: 'text' | 'audio' | 'redteam';
          status: 'blocked' | 'passed' | 'error';
          blocked_by?: string | null;
          threat_category?: string | null;
          latency_ms?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          api_key_id?: string | null;
          request_type?: 'text' | 'audio' | 'redteam';
          status?: 'blocked' | 'passed' | 'error';
          blocked_by?: string | null;
          threat_category?: string | null;
          latency_ms?: number | null;
          created_at?: string;
        };
      };
      redteam_scans: {
        Row: {
          id: string;
          org_id: string;
          name: string | null;
          status: 'pending' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
          target_endpoint: string;
          attack_suite: 'basic' | 'standard' | 'comprehensive' | 'custom';
          total_attacks: number;
          blocked_attacks: number;
          passed_attacks: number;
          error_attacks: number;
          block_rate: number | null;
          avg_latency_ms: number | null;
          started_at: string | null;
          completed_at: string | null;
          report_json: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name?: string | null;
          status?: 'pending' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
          target_endpoint: string;
          attack_suite?: 'basic' | 'standard' | 'comprehensive' | 'custom';
          total_attacks?: number;
          blocked_attacks?: number;
          passed_attacks?: number;
          error_attacks?: number;
          block_rate?: number | null;
          avg_latency_ms?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          report_json?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string | null;
          status?: 'pending' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
          target_endpoint?: string;
          attack_suite?: 'basic' | 'standard' | 'comprehensive' | 'custom';
          total_attacks?: number;
          blocked_attacks?: number;
          passed_attacks?: number;
          error_attacks?: number;
          block_rate?: number | null;
          avg_latency_ms?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          report_json?: Json | null;
          created_at?: string;
        };
      };
      plan_limits: {
        Row: {
          plan: string;
          display_name: string;
          price_monthly: number | null;
          text_requests_monthly: number | null;
          audio_requests_monthly: number | null;
          redteam_attacks_monthly: number | null;
          max_api_keys: number | null;
          max_team_members: number | null;
          latency_sla_ms: number | null;
          audio_enabled: boolean;
          redteam_enabled: boolean;
          support_level: string;
        };
        Insert: {
          plan: string;
          display_name: string;
          price_monthly?: number | null;
          text_requests_monthly?: number | null;
          audio_requests_monthly?: number | null;
          redteam_attacks_monthly?: number | null;
          max_api_keys?: number | null;
          max_team_members?: number | null;
          latency_sla_ms?: number | null;
          audio_enabled?: boolean;
          redteam_enabled?: boolean;
          support_level?: string;
        };
        Update: {
          plan?: string;
          display_name?: string;
          price_monthly?: number | null;
          text_requests_monthly?: number | null;
          audio_requests_monthly?: number | null;
          redteam_attacks_monthly?: number | null;
          max_api_keys?: number | null;
          max_team_members?: number | null;
          latency_sla_ms?: number | null;
          audio_enabled?: boolean;
          redteam_enabled?: boolean;
          support_level?: string;
        };
      };
    };
  };
}

export type User = Database['public']['Tables']['users']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type OrgMember = Database['public']['Tables']['org_members']['Row'];
export type ApiKey = Database['public']['Tables']['api_keys']['Row'];
export type UsageDaily = Database['public']['Tables']['usage_daily']['Row'];
export type RequestLog = Database['public']['Tables']['request_log']['Row'];
export type RedteamScan = Database['public']['Tables']['redteam_scans']['Row'];
