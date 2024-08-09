// src/models/Report.ts

export interface Report {
    id: number;
    reporter_id: number;
    reported_id: number;
    reason?: string;
    created_at: Date;
  }
  