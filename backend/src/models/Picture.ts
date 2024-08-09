// src/models/Picture.ts

export interface Picture {
    id: number;
    user_id: number;
    picture_path: string;
    is_profile_picture: boolean;
    created_at: Date;
  }
  