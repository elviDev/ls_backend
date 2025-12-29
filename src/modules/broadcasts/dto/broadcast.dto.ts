export interface BroadcastDto {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  hostId: string;
  programId?: string;
  bannerId?: string;
  staff?: { userId: string; role: string }[];
  guests?: { name: string; title: string; role: string }[];
}

export interface BroadcastQueryDto {
  status?: 'SCHEDULED' | 'READY' | 'LIVE' | 'ENDED';
  limit?: number;
  programId?: string;
}