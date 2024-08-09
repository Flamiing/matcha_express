// src/models/Notification.ts

export interface Notification {
    id: number;
    user_id: number;
    type: string;
    is_read: boolean;
    created_at: Date;
  }
  