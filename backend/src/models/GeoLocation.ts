// src/models/GeoLocation.ts

export interface GeoLocation {
    id: number;
    user_id: number;
    latitude: number;
    longitude: number;
    neighborhood?: string;
    created_at: Date;
  }
  