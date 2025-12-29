export interface ReviewDto {
  rating: number;
  comment?: string;
  podcastId?: string;
  audiobookId?: string;
  archiveId?: string;
}

export interface ReviewUpdateDto {
  rating: number;
  comment?: string;
}