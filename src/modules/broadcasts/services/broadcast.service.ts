import { prisma } from "../../../lib/prisma";
import { BroadcastDto, BroadcastQueryDto } from "../dto/broadcast.dto";

export class BroadcastService {
  constructor() {
    console.log('📡 BroadcastService initialized, prisma:', !!prisma);
  }

  async getBroadcasts(query: BroadcastQueryDto) {
    try {
      const { status, limit = 10, programId } = query;
      
      const where: any = {};
      const now = new Date();

      if (programId) {
        where.programId = programId;
      }

      if (status === 'SCHEDULED') {
        where.status = 'SCHEDULED';
      } else if (status === 'LIVE') {
        where.status = 'LIVE';
      } else if (status === 'ENDED') {
        where.status = 'ENDED';
      } else if (status === 'READY') {
        where.status = 'READY';
      }

      const broadcasts = await prisma.liveBroadcast.findMany({
        where,
        include: {
          program: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true
            }
          },
          hostUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          },
          banner: {
            select: {
              id: true,
              url: true
            }
          }
        },
        orderBy: { startTime: status === 'ENDED' ? 'desc' : 'asc' },
        take: limit
      });

      return broadcasts;
    } catch (error) {
      console.error('Database error in getBroadcasts:', error);
      return [];
    }
  }

  async getCurrentBroadcast() {
    try {
      const now = new Date();
      
      const broadcast = await prisma.liveBroadcast.findFirst({
        where: {
          status: 'LIVE'
        },
        include: {
          program: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true,
              description: true
            }
          },
          hostUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          }
        }
      });

      return broadcast;
    } catch (error) {
      console.error('Database error in getCurrentBroadcast:', error);
      return null;
    }
  }

  async getUpcomingBroadcasts(limit: number = 5) {
    try {
      const now = new Date();
      
      const broadcasts = await prisma.liveBroadcast.findMany({
        where: {
          status: 'SCHEDULED'
        },
        include: {
          program: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true
            }
          },
          hostUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          }
        },
        orderBy: { startTime: 'asc' },
        take: limit
      });

      return broadcasts;
    } catch (error) {
      console.error('Database error in getUpcomingBroadcasts:', error);
      return [];
    }
  }

  async getBroadcastEvents() {
    try {
      const now = new Date();
      
      const liveBroadcast = await prisma.liveBroadcast.findFirst({
        where: {
          status: 'LIVE'
        },
        include: {
          program: { select: { id: true, title: true, slug: true, image: true } },
          hostUser: { select: { id: true, firstName: true, lastName: true, profileImage: true } }
        }
      });

      const upcomingBroadcast = await prisma.liveBroadcast.findFirst({
        where: { status: 'SCHEDULED' },
        include: {
          program: { select: { id: true, title: true, slug: true, image: true } },
          hostUser: { select: { id: true, firstName: true, lastName: true, profileImage: true } }
        },
        orderBy: { startTime: 'asc' }
      });

      return { live: liveBroadcast, upcoming: upcomingBroadcast };
    } catch (error) {
      console.error('Database error in getBroadcastEvents:', error);
      return { live: null, upcoming: null };
    }
  }

  async createBroadcast(broadcastData: BroadcastDto, createdById: string) {
    try {
      // Create the broadcast first
      const broadcast = await prisma.liveBroadcast.create({
        data: {
          title: broadcastData.title,
          description: broadcastData.description,
          startTime: new Date(broadcastData.startTime),
          endTime: new Date(broadcastData.endTime),
          hostId: broadcastData.hostId,
          programId: broadcastData.programId,
          bannerId: broadcastData.bannerId,
          slug: this.generateSlug(broadcastData.title)
        }
      });

      // Create staff assignments if provided
      if (broadcastData.staff && broadcastData.staff.length > 0) {
        await prisma.broadcastStaff.createMany({
          data: broadcastData.staff.map(staffMember => ({
            broadcastId: broadcast.id,
            userId: staffMember.userId,
            role: staffMember.role as any
          }))
        });
      }

      // Create guest entries if provided
      if (broadcastData.guests && broadcastData.guests.length > 0) {
        await prisma.broadcastGuest.createMany({
          data: broadcastData.guests.map(guest => ({
            broadcastId: broadcast.id,
            name: guest.name,
            title: guest.title,
            role: guest.role
          }))
        });
      }

      // Return broadcast with all relations
      return await prisma.liveBroadcast.findUnique({
        where: { id: broadcast.id },
        include: {
          program: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true
            }
          },
          hostUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          },
          banner: {
            select: {
              id: true,
              url: true
            }
          },
          staff: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          guests: true
        }
      });
    } catch (error) {
      console.error('Database error in createBroadcast:', error);
      throw { statusCode: 500, message: 'Failed to create broadcast' };
    }
  }

  async getBroadcastById(identifier: string) {
    try {
      // Try to find by ID first, then by slug
      let broadcast = await prisma.liveBroadcast.findUnique({
        where: { id: identifier },
        include: {
          program: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true
            }
          },
          hostUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          },
          banner: {
            select: {
              id: true,
              url: true
            }
          },
          staff: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          guests: true
        }
      });

      // If not found by ID, try by slug
      if (!broadcast) {
        broadcast = await prisma.liveBroadcast.findUnique({
          where: { slug: identifier },
          include: {
            program: {
              select: {
                id: true,
                title: true,
                slug: true,
                image: true
              }
            },
            hostUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            },
            banner: {
              select: {
                id: true,
                url: true
              }
            },
            staff: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true
                  }
                }
              }
            },
            guests: true
          }
        });
      }

      return broadcast;
    } catch (error) {
      console.error('Database error in getBroadcastById:', error);
      return null;
    }
  }

  async deleteBroadcast(identifier: string, userId: string) {
    try {
      // First find the broadcast by ID or slug
      const broadcast = await this.getBroadcastById(identifier);
      if (!broadcast) {
        throw { statusCode: 404, message: 'Broadcast not found' };
      }

      await prisma.liveBroadcast.delete({
        where: { id: broadcast.id }
      });
      return { message: 'Broadcast deleted successfully' };
    } catch (error) {
      console.error('Database error in deleteBroadcast:', error);
      throw { statusCode: 500, message: 'Failed to delete broadcast' };
    }
  }

  async updateBroadcast(identifier: string, broadcastData: Partial<BroadcastDto>, userId: string) {
    try {
      // First find the broadcast by ID or slug
      const broadcast = await this.getBroadcastById(identifier);
      if (!broadcast) {
        throw { statusCode: 404, message: 'Broadcast not found' };
      }

      // Update the broadcast
      const updatedBroadcast = await prisma.liveBroadcast.update({
        where: { id: broadcast.id },
        data: {
          title: broadcastData.title,
          description: broadcastData.description,
          startTime: broadcastData.startTime ? new Date(broadcastData.startTime) : undefined,
          endTime: broadcastData.endTime ? new Date(broadcastData.endTime) : undefined,
          hostId: broadcastData.hostId,
          programId: broadcastData.programId,
          bannerId: broadcastData.bannerId
        }
      });

      // Update staff if provided
      if (broadcastData.staff) {
        await prisma.broadcastStaff.deleteMany({ where: { broadcastId: broadcast.id } });
        if (broadcastData.staff.length > 0) {
          await prisma.broadcastStaff.createMany({
            data: broadcastData.staff.map(staffMember => ({
              broadcastId: broadcast.id,
              userId: staffMember.userId,
              role: staffMember.role as any
            }))
          });
        }
      }

      // Update guests if provided
      if (broadcastData.guests) {
        await prisma.broadcastGuest.deleteMany({ where: { broadcastId: broadcast.id } });
        if (broadcastData.guests.length > 0) {
          await prisma.broadcastGuest.createMany({
            data: broadcastData.guests.map(guest => ({
              broadcastId: broadcast.id,
              name: guest.name,
              title: guest.title,
              role: guest.role
            }))
          });
        }
      }

      return await prisma.liveBroadcast.findUnique({
        where: { id: broadcast.id },
        include: {
          program: { select: { id: true, title: true, slug: true, image: true } },
          hostUser: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
          banner: { select: { id: true, url: true } },
          staff: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
          guests: true
        }
      });
    } catch (error) {
      console.error('Database error in updateBroadcast:', error);
      throw { statusCode: 500, message: 'Failed to update broadcast' };
    }
  }

  async startBroadcast(identifier: string, userId: string) {
    try {
      // First find the broadcast by ID or slug
      const broadcast = await this.getBroadcastById(identifier);
      if (!broadcast) {
        throw { statusCode: 404, message: 'Broadcast not found' };
      }

      return await prisma.liveBroadcast.update({
        where: { id: broadcast.id },
        data: { status: 'LIVE' }
      });
    } catch (error) {
      console.error('Database error in startBroadcast:', error);
      throw { statusCode: 500, message: 'Failed to start broadcast' };
    }
  }

  async endBroadcast(identifier: string, userId: string) {
    try {
      // First find the broadcast by ID or slug
      const broadcast = await this.getBroadcastById(identifier);
      if (!broadcast) {
        throw { statusCode: 404, message: 'Broadcast not found' };
      }

      return await prisma.liveBroadcast.update({
        where: { id: broadcast.id },
        data: { status: 'ENDED' }
      });
    } catch (error) {
      console.error('Database error in endBroadcast:', error);
      throw { statusCode: 500, message: 'Failed to end broadcast' };
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now();
  }
}