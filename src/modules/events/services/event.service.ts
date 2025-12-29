import { prisma } from "../../../lib/prisma";
import { EventDto, EventQueryDto } from "../dto/event.dto";

export class EventService {
  async getEvents(query: EventQueryDto) {
    const { eventType, upcoming, limit = 10, search } = query;
    
    const where: any = {};
    
    if (eventType) where.eventType = eventType;
    if (upcoming) {
      where.schedule = {
        startTime: { gte: new Date() }
      };
    }
    if (search) {
      where.OR = [
        { schedule: { title: { contains: search, mode: "insensitive" } } },
        { schedule: { description: { contains: search, mode: "insensitive" } } },
        { venue: { contains: search, mode: "insensitive" } }
      ];
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        schedule: {
          select: {
            id: true,
            title: true,
            description: true,
            startTime: true,
            endTime: true,
            status: true
          }
        },
        organizerStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: { schedule: { startTime: upcoming ? 'asc' : 'desc' } },
      take: limit
    });

    return { events, count: events.length };
  }

  async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        schedule: {
          select: {
            id: true,
            title: true,
            description: true,
            startTime: true,
            endTime: true,
            status: true
          }
        },
        organizerStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            registrations: true
          }
        }
      }
    });

    if (!event) {
      throw { statusCode: 404, message: "Event not found" };
    }

    return event;
  }

  async createEvent(eventData: EventDto, organizerId: string) {
    // First create the schedule
    const schedule = await prisma.schedule.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        type: "EVENT",
        status: "SCHEDULED",
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        createdBy: organizerId
      }
    });

    // Then create the event
    const event = await prisma.event.create({
      data: {
        scheduleId: schedule.id,
        eventType: eventData.eventType as any,
        location: eventData.location,
        venue: eventData.venue,
        address: eventData.address,
        city: eventData.city,
        state: eventData.state,
        country: eventData.country,
        isVirtual: eventData.isVirtual || false,
        virtualLink: eventData.virtualLink,
        isPaid: eventData.isPaid || false,
        ticketPrice: eventData.ticketPrice,
        maxAttendees: eventData.maxAttendees,
        requiresRSVP: eventData.requiresRSVP || false,
        imageUrl: eventData.imageUrl,
        contactEmail: eventData.contactEmail,
        contactPhone: eventData.contactPhone,
        organizer: organizerId
      },
      include: {
        schedule: true,
        organizerStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return event;
  }

  async updateEvent(id: string, eventData: Partial<EventDto>, userId: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { organizer: true }
    });

    if (!event) {
      throw { statusCode: 404, message: "Event not found" };
    }

    if (event.organizer !== userId) {
      throw { statusCode: 403, message: "Not authorized to update this event" };
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: eventData as any,
      include: {
        schedule: true,
        organizerStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return updatedEvent;
  }

  async deleteEvent(id: string, userId: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { organizer: true, scheduleId: true }
    });

    if (!event) {
      throw { statusCode: 404, message: "Event not found" };
    }

    if (event.organizer !== userId) {
      throw { statusCode: 403, message: "Not authorized to delete this event" };
    }

    // Delete event and its schedule
    await prisma.event.delete({
      where: { id }
    });

    await prisma.schedule.delete({
      where: { id: event.scheduleId }
    });

    return { message: "Event deleted successfully" };
  }

  async registerForEvent(eventId: string, userId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { 
        maxAttendees: true,
        requiresRSVP: true,
        _count: {
          select: {
            registrations: true
          }
        }
      }
    });

    if (!event) {
      throw { statusCode: 404, message: "Event not found" };
    }

    if (!event.requiresRSVP) {
      throw { statusCode: 400, message: "This event does not require registration" };
    }

    if (event.maxAttendees && event._count.registrations >= event.maxAttendees) {
      throw { statusCode: 400, message: "Event is full" };
    }

    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    });

    if (existingRegistration) {
      throw { statusCode: 400, message: "Already registered for this event" };
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        userId,
        eventId
      }
    });

    return { message: "Successfully registered for event", registration };
  }
}