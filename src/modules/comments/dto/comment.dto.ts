export interface CommentDto {
  content: string;
  podcastId?: string;
  audiobookId?: string;
  liveBroadcastId?: string;
  podcastEpisodeId?: string;
  archiveId?: string;
  parentId?: string;
}

export interface CommentUpdateDto {
  content: string;
}