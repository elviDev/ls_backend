export interface ArchiveDto {
  title: string;
  slug: string;
  description?: string;
  host?: string;
  guests?: string;
  category?: string;
  type: string;
  duration?: number;
  audioFile?: string;
  coverImage?: string;
  originalAirDate?: Date;
  tags?: string;
  transcript?: string;
  podcastId?: string;
  audiobookId?: string;
  broadcastId?: string;
  episodeId?: string;
}

export interface ArchiveQueryDto {
  type?: string;
  category?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}