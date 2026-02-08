export interface AudiobookDto {
    title: string;
    slug: string;
    narrator: string;
    description: string;
    coverImage: string;
    duration: number;
    releaseDate: Date;
    isbn?: string;
    publisher?: string;
    language?: string;
    tags?: string;
    price?: number;
    currency?: string;
    isExclusive?: boolean;
    genreId: string;
    author?: string;
}
export interface ChapterDto {
    title: string;
    audioFile: string;
    duration: number;
    trackNumber: number;
    description?: string;
    transcript?: string;
}
export interface AudiobookQueryDto {
    featured?: boolean;
    limit?: number;
    genreId?: string;
    author?: string;
    language?: string;
    status?: string;
}
//# sourceMappingURL=audiobook.dto.d.ts.map