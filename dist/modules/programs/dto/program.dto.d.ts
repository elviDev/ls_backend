export interface ProgramDto {
    title: string;
    description: string;
    category: ProgramCategory;
    schedule: string;
    image?: string;
    genreId?: string;
    hostId?: string;
    status?: ProgramStatus;
}
export interface ProgramEpisodeDto {
    title: string;
    description?: string;
    audioFile?: string;
    duration?: number;
    airDate: Date;
    broadcastId?: string;
}
export interface UpdateProgramEpisodeDto {
    title?: string;
    description?: string;
    audioFile?: string;
    duration?: number;
    airDate?: Date;
    broadcastId?: string;
}
export interface ProgramQueryDto {
    category?: ProgramCategory;
    status?: ProgramStatus;
    hostId?: string;
    genreId?: string;
    search?: string;
    page?: number;
    limit?: number;
}
export interface ScheduleDto {
    title: string;
    description?: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    isRecurring?: boolean;
    recurringPattern?: string;
    recurringEndDate?: Date;
    priority?: number;
    tags?: string;
    autoPublish?: boolean;
    notifyStaff?: boolean;
    notifyUsers?: boolean;
}
export interface LinkBroadcastDto {
    broadcastId: string;
}
export declare enum ProgramCategory {
    TALK_SHOW = "TALK_SHOW",
    MUSIC = "MUSIC",
    TECHNOLOGY = "TECHNOLOGY",
    BUSINESS = "BUSINESS",
    INTERVIEW = "INTERVIEW",
    SPORTS = "SPORTS",
    NEWS = "NEWS",
    ENTERTAINMENT = "ENTERTAINMENT",
    EDUCATION = "EDUCATION"
}
export declare enum ProgramStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ARCHIVED = "ARCHIVED"
}
//# sourceMappingURL=program.dto.d.ts.map