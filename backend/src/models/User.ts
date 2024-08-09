// src/models/User.ts

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role_id?: number;
    is_verified: boolean;
    verification_token?: string;
    email_verified_at?: Date;
    password_reset_token?: string;
    password_reset_expires_at?: Date;
    created_at: Date;
    updated_at: Date;
  }
  