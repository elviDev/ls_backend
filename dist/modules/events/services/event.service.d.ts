import { EventDto, EventQueryDto } from "../dto/event.dto";
export declare class EventService {
    getEvents(query: EventQueryDto): Promise<{
        events: ({
            schedule: {
                id: string;
                status: import(".prisma/client").$Enums.ScheduleStatus;
                description: string;
                title: string;
                startTime: Date;
                endTime: Date;
            };
            _count: {
                registrations: number;
            };
            organizerStaff: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            scheduleId: string;
            contactEmail: string | null;
            contactPhone: string | null;
            imageUrl: string | null;
            currency: string;
            eventType: import(".prisma/client").$Enums.EventType;
            location: string | null;
            venue: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            isVirtual: boolean;
            virtualLink: string | null;
            isPaid: boolean;
            ticketPrice: number | null;
            maxAttendees: number | null;
            currentAttendees: number;
            requiresRSVP: boolean;
            bannerUrl: string | null;
            galleryUrls: string | null;
            contactPerson: string | null;
            facebookEvent: string | null;
            twitterEvent: string | null;
            linkedinEvent: string | null;
            organizer: string;
            coOrganizers: string | null;
            sponsors: string | null;
        })[];
        count: number;
    }>;
    getEventById(id: string): Promise<{
        schedule: {
            id: string;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            description: string;
            title: string;
            startTime: Date;
            endTime: Date;
        };
        _count: {
            registrations: number;
        };
        organizerStaff: {
            id: string;
            firstName: string;
            lastName: string;
        };
        registrations: ({
            user: {
                name: string;
                id: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            eventId: string;
            registeredAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        scheduleId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        imageUrl: string | null;
        currency: string;
        eventType: import(".prisma/client").$Enums.EventType;
        location: string | null;
        venue: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        isVirtual: boolean;
        virtualLink: string | null;
        isPaid: boolean;
        ticketPrice: number | null;
        maxAttendees: number | null;
        currentAttendees: number;
        requiresRSVP: boolean;
        bannerUrl: string | null;
        galleryUrls: string | null;
        contactPerson: string | null;
        facebookEvent: string | null;
        twitterEvent: string | null;
        linkedinEvent: string | null;
        organizer: string;
        coOrganizers: string | null;
        sponsors: string | null;
    }>;
    createEvent(eventData: EventDto, organizerId: string): Promise<{
        schedule: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            audiobookId: string | null;
            podcastId: string | null;
            liveBroadcastId: string | null;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            chapterId: string | null;
            type: import(".prisma/client").$Enums.ScheduleType;
            description: string | null;
            tags: string | null;
            title: string;
            duration: number | null;
            publishedAt: Date | null;
            startTime: Date;
            endTime: Date | null;
            timezone: string;
            isRecurring: boolean;
            recurringPattern: string | null;
            recurringEndDate: Date | null;
            priority: number;
            metadata: string | null;
            publishedBy: string | null;
            autoPublish: boolean;
            notifyStaff: boolean;
            notifyUsers: boolean;
            createdBy: string;
            assignedTo: string | null;
        };
        organizerStaff: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        scheduleId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        imageUrl: string | null;
        currency: string;
        eventType: import(".prisma/client").$Enums.EventType;
        location: string | null;
        venue: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        isVirtual: boolean;
        virtualLink: string | null;
        isPaid: boolean;
        ticketPrice: number | null;
        maxAttendees: number | null;
        currentAttendees: number;
        requiresRSVP: boolean;
        bannerUrl: string | null;
        galleryUrls: string | null;
        contactPerson: string | null;
        facebookEvent: string | null;
        twitterEvent: string | null;
        linkedinEvent: string | null;
        organizer: string;
        coOrganizers: string | null;
        sponsors: string | null;
    }>;
    updateEvent(id: string, eventData: Partial<EventDto>, userId: string): Promise<{
        schedule: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            audiobookId: string | null;
            podcastId: string | null;
            liveBroadcastId: string | null;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            chapterId: string | null;
            type: import(".prisma/client").$Enums.ScheduleType;
            description: string | null;
            tags: string | null;
            title: string;
            duration: number | null;
            publishedAt: Date | null;
            startTime: Date;
            endTime: Date | null;
            timezone: string;
            isRecurring: boolean;
            recurringPattern: string | null;
            recurringEndDate: Date | null;
            priority: number;
            metadata: string | null;
            publishedBy: string | null;
            autoPublish: boolean;
            notifyStaff: boolean;
            notifyUsers: boolean;
            createdBy: string;
            assignedTo: string | null;
        };
        organizerStaff: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        scheduleId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        imageUrl: string | null;
        currency: string;
        eventType: import(".prisma/client").$Enums.EventType;
        location: string | null;
        venue: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        isVirtual: boolean;
        virtualLink: string | null;
        isPaid: boolean;
        ticketPrice: number | null;
        maxAttendees: number | null;
        currentAttendees: number;
        requiresRSVP: boolean;
        bannerUrl: string | null;
        galleryUrls: string | null;
        contactPerson: string | null;
        facebookEvent: string | null;
        twitterEvent: string | null;
        linkedinEvent: string | null;
        organizer: string;
        coOrganizers: string | null;
        sponsors: string | null;
    }>;
    deleteEvent(id: string, userId: string): Promise<{
        message: string;
    }>;
    registerForEvent(eventId: string, userId: string): Promise<{
        message: string;
        registration: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            eventId: string;
            registeredAt: Date;
        };
    }>;
}
//# sourceMappingURL=event.service.d.ts.map