import { prisma } from "../../../lib/prisma";
import { SettingsDto } from "../dto/settings.dto";

export class SettingsService {
  async getSettings() {
    let settings = await prisma.dashboardSettings.findFirst();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.dashboardSettings.create({
        data: {
          dashboardTitle: "Radio Dashboard",
          organizationName: "Internet Radio Station",
          theme: "light",
          primaryColor: "#3b82f6",
          defaultBroadcastQuality: "HD",
          maxConcurrentListeners: 1000,
          enableEmailNotifications: true,
          enableAnalytics: true,
          maintenanceMode: false
        }
      });
    }

    return settings;
  }

  async updateSettings(settingsData: SettingsDto, userId: string) {
    let settings = await prisma.dashboardSettings.findFirst();
    
    if (!settings) {
      // Create if doesn't exist
      settings = await prisma.dashboardSettings.create({
        data: {
          ...settingsData,
          lastUpdatedBy: userId
        }
      });
    } else {
      // Update existing
      settings = await prisma.dashboardSettings.update({
        where: { id: settings.id },
        data: {
          ...settingsData,
          lastUpdatedBy: userId
        }
      });
    }

    return settings;
  }

  async getPublicSettings() {
    const settings = await this.getSettings();
    
    // Return only public settings
    return {
      dashboardTitle: settings.dashboardTitle,
      organizationName: settings.organizationName,
      logoUrl: settings.logoUrl,
      theme: settings.theme,
      primaryColor: settings.primaryColor,
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage
    };
  }

  async toggleMaintenanceMode(enabled: boolean, message?: string, userId?: string) {
    const settings = await this.getSettings();
    
    return await prisma.dashboardSettings.update({
      where: { id: settings.id },
      data: {
        maintenanceMode: enabled,
        maintenanceMessage: message || settings.maintenanceMessage,
        lastUpdatedBy: userId
      }
    });
  }
}