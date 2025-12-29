export interface SettingsDto {
  dashboardTitle?: string;
  organizationName?: string;
  logoUrl?: string;
  theme?: string;
  primaryColor?: string;
  defaultBroadcastQuality?: string;
  maxConcurrentListeners?: number;
  enableEmailNotifications?: boolean;
  enableAnalytics?: boolean;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
}