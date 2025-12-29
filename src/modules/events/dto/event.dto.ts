export interface EventDto {
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  eventType: string;
  location?: string;
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  isVirtual?: boolean;
  virtualLink?: string;
  isPaid?: boolean;
  ticketPrice?: number;
  maxAttendees?: number;
  requiresRSVP?: boolean;
  imageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface EventQueryDto {
  eventType?: string;
  upcoming?: boolean;
  limit?: number;
  search?: string;
}