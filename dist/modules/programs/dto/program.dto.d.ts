export interface ProgramDto {
    title: string;
    slug: string;
    description: string;
    category: string;
    schedule: string;
    image?: string;
    genreId?: string;
}
export interface ProgramEpisodeDto {
    title: string;
    description?: string;
    audioFile?: string;
    duration?: number;
    airDate: Date;
}
//# sourceMappingURL=program.dto.d.ts.map