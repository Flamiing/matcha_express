// src/models/UserToken.ts

export interface UserToken {
    id: number;
    user_id: number;
    token: string;
    type: 'verification' | 'reset' | 'auth';
    created_at: Date;
    expires_at?: Date;
  }
  