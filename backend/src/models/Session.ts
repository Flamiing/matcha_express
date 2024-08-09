// src/models/Session.ts

export interface Session {
    id: number;
    user_id: number;
    session_token: string;
    created_at: Date;
  }
  