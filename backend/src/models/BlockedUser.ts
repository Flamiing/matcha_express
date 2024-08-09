// src/models/BlockedUser.ts

export interface BlockedUser {
    blocker_id: number;
    blocked_id: number;
    created_at: Date;
  }
  