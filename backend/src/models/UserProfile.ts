// src/models/UserProfile.ts

export interface UserProfile {
    id: number;
    user_id: number;
    gender?: string;
    sexual_preferences?: string;
    biography?: string;
    gps_location?: string;
    profile_picture?: number; // This could be a picture ID
    fame_rating: number;
    created_at: Date;
    updated_at: Date;
  }
  