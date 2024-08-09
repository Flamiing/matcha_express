// src/models/Message.ts

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    created_at: Date;
  }
  