import { GenreDto } from "../dto/genre.dto";
export declare class GenreService {
    getGenres(): Promise<{
        genres: ({
            _count: {
                audiobooks: number;
                podcasts: number;
                programs: number;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        })[];
    }>;
    getGenreById(id: string): Promise<{
        audiobooks: {
            id: string;
            createdAt: Date;
            title: string;
            coverImage: string;
        }[];
        podcasts: {
            id: string;
            createdAt: Date;
            title: string;
            coverImage: string;
        }[];
        _count: {
            audiobooks: number;
            podcasts: number;
            programs: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        coverImage: string | null;
    }>;
    createGenre(genreData: GenreDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        coverImage: string | null;
    }>;
    updateGenre(id: string, genreData: Partial<GenreDto>): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        coverImage: string | null;
    }>;
    deleteGenre(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=genre.service.d.ts.map