-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'HOST', 'CO_HOST', 'PRODUCER', 'SOUND_ENGINEER', 'CONTENT_MANAGER', 'TECHNICAL_SUPPORT');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'PREMIUM_USER');

-- CreateEnum
CREATE TYPE "BroadcastRole" AS ENUM ('HOST', 'CO_HOST', 'PRODUCER', 'SOUND_ENGINEER', 'GUEST', 'MODERATOR');

-- CreateEnum
CREATE TYPE "AudiobookStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ChapterStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BroadcastStatus" AS ENUM ('SCHEDULED', 'READY', 'LIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('IMAGE', 'AUDIO', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "GuestStatus" AS ENUM ('INVITED', 'ACCEPTED', 'JOINED', 'LEFT', 'REMOVED');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('LIVE_BROADCAST', 'PODCAST_EPISODE', 'AUDIOBOOK_CHAPTER', 'EVENT', 'CAMPAIGN', 'ADVERTISEMENT', 'ANNOUNCEMENT', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CONCERT', 'MEETUP', 'INTERVIEW', 'SPECIAL_BROADCAST', 'CONTEST', 'GIVEAWAY', 'COMMUNITY_EVENT', 'FUNDRAISER');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('PROMOTIONAL', 'AWARENESS', 'SEASONAL', 'PRODUCT_LAUNCH', 'BRAND_ACTIVATION', 'PARTNERSHIP');

-- CreateEnum
CREATE TYPE "AdType" AS ENUM ('BANNER', 'AUDIO_SPOT', 'SPONSORED_CONTENT', 'JINGLE', 'LIVE_READ', 'PRE_ROLL', 'MID_ROLL', 'POST_ROLL');

-- CreateEnum
CREATE TYPE "ProgramCategory" AS ENUM ('TALK_SHOW', 'MUSIC', 'TECHNOLOGY', 'BUSINESS', 'INTERVIEW', 'SPORTS', 'NEWS', 'ENTERTAINMENT', 'EDUCATION');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PodcastStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EpisodeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SettingsCategory" AS ENUM ('GENERAL', 'BROADCAST', 'CONTENT', 'NOTIFICATIONS', 'SECURITY', 'ANALYTICS', 'API', 'BACKUP', 'MODERATION');

-- CreateEnum
CREATE TYPE "ArchiveType" AS ENUM ('PODCAST', 'BROADCAST', 'AUDIOBOOK', 'INTERVIEW', 'TALK_SHOW', 'MUSIC_SHOW', 'NEWS', 'DOCUMENTARY', 'SERIES');

-- CreateEnum
CREATE TYPE "ArchiveStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'HIDDEN', 'FEATURED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "bio" TEXT,
    "profileImage" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "verificationTokenExpires" TIMESTAMP(3),
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpires" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "suspendedAt" TIMESTAMP(3),
    "suspendedReason" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "role" "StaffRole" NOT NULL DEFAULT 'HOST',
    "department" TEXT,
    "position" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "emergencyContact" TEXT,
    "profileImage" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "requestedRole" "StaffRole",
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "salary" DOUBLE PRECISION,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVerificationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audiobook" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "narrator" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "status" "AudiobookStatus" NOT NULL DEFAULT 'DRAFT',
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "isbn" TEXT,
    "publisher" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "tags" TEXT,
    "price" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isExclusive" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "genreId" TEXT NOT NULL,
    "author" TEXT,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Audiobook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "audioFile" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "trackNumber" INTEGER NOT NULL,
    "status" "ChapterStatus" NOT NULL DEFAULT 'DRAFT',
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "transcript" TEXT,
    "audiobookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Podcast" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "guests" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "image" TEXT,
    "coverImage" TEXT,
    "audioFile" TEXT,
    "duration" INTEGER,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "tags" TEXT,
    "status" "PodcastStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastEpisode" (
    "id" TEXT NOT NULL,
    "podcastId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "episodeNumber" INTEGER NOT NULL,
    "audioFile" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "status" "EpisodeStatus" NOT NULL DEFAULT 'DRAFT',
    "transcript" TEXT,
    "transcriptFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PodcastEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" "AssetType" NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveBroadcast" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "streamUrl" TEXT,
    "status" "BroadcastStatus" NOT NULL DEFAULT 'SCHEDULED',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "hostId" TEXT NOT NULL,
    "bannerId" TEXT,
    "programId" TEXT,
    "recordingUrl" TEXT,
    "autoRecord" BOOLEAN NOT NULL DEFAULT false,
    "chatEnabled" BOOLEAN NOT NULL DEFAULT true,
    "chatModeration" BOOLEAN NOT NULL DEFAULT true,
    "allowGuests" BOOLEAN NOT NULL DEFAULT true,
    "maxListeners" INTEGER DEFAULT 1000,
    "quality" TEXT NOT NULL DEFAULT 'HD',
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "slackNotifications" BOOLEAN NOT NULL DEFAULT false,
    "recordingFormat" TEXT NOT NULL DEFAULT 'MP3',
    "streamDelay" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveBroadcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BroadcastStaff" (
    "id" TEXT NOT NULL,
    "broadcastId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "BroadcastRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BroadcastStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transcription" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "format" TEXT,
    "isEditable" BOOLEAN NOT NULL DEFAULT true,
    "lastEditedBy" TEXT,
    "lastEditedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "audiobookId" TEXT,
    "podcastId" TEXT,
    "liveBroadcastId" TEXT,

    CONSTRAINT "Transcription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "audiobookId" TEXT,
    "podcastId" TEXT,
    "podcastEpisodeId" TEXT,
    "liveBroadcastId" TEXT,
    "archiveId" TEXT,
    "parentId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "audiobookId" TEXT,
    "podcastId" TEXT,
    "archiveId" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "audiobookId" TEXT,
    "podcastId" TEXT,
    "archiveId" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybackProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "staffId" TEXT,
    "audiobookId" TEXT,
    "podcastId" TEXT,
    "podcastEpisodeId" TEXT,
    "liveBroadcastId" TEXT,
    "archiveId" TEXT,
    "chapterId" TEXT,
    "position" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybackProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "staffId" TEXT,
    "audiobookId" TEXT,
    "podcastId" TEXT,
    "podcastEpisodeId" TEXT,
    "archiveId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistItem" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "audiobookId" TEXT,
    "podcastId" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PlaylistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "audiobookId" TEXT,
    "podcastId" TEXT,
    "liveBroadcastId" TEXT,
    "listenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BroadcastGuest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "role" TEXT NOT NULL,
    "broadcastId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BroadcastGuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestInvitation" (
    "id" TEXT NOT NULL,
    "podcastId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "invitationToken" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "acceptedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastGuest" (
    "id" TEXT NOT NULL,
    "podcastId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "GuestStatus" NOT NULL DEFAULT 'INVITED',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PodcastGuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "ScheduleType" NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'DRAFT',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringPattern" TEXT,
    "recurringEndDate" TIMESTAMP(3),
    "liveBroadcastId" TEXT,
    "podcastId" TEXT,
    "audiobookId" TEXT,
    "chapterId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "metadata" TEXT,
    "publishedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "autoPublish" BOOLEAN NOT NULL DEFAULT false,
    "notifyStaff" BOOLEAN NOT NULL DEFAULT true,
    "notifyUsers" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "location" TEXT,
    "venue" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "isVirtual" BOOLEAN NOT NULL DEFAULT false,
    "virtualLink" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "ticketPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "maxAttendees" INTEGER,
    "currentAttendees" INTEGER NOT NULL DEFAULT 0,
    "requiresRSVP" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "bannerUrl" TEXT,
    "galleryUrls" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactPerson" TEXT,
    "facebookEvent" TEXT,
    "twitterEvent" TEXT,
    "linkedinEvent" TEXT,
    "organizer" TEXT NOT NULL,
    "coOrganizers" TEXT,
    "sponsors" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "campaignType" "CampaignType" NOT NULL,
    "budget" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "targetAudience" TEXT,
    "primaryGoal" TEXT,
    "successMetrics" TEXT,
    "expectedReach" INTEGER,
    "actualReach" INTEGER DEFAULT 0,
    "conversionGoal" TEXT,
    "creativeAssets" TEXT,
    "scriptContent" TEXT,
    "callToAction" TEXT,
    "landingPageUrl" TEXT,
    "channels" TEXT,
    "socialPlatforms" TEXT,
    "partners" TEXT,
    "influencers" TEXT,
    "manager" TEXT NOT NULL,
    "team" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advertisement" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "adType" "AdType" NOT NULL,
    "advertiser" TEXT NOT NULL,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "audioFileUrl" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "scriptContent" TEXT,
    "callToAction" TEXT,
    "websiteUrl" TEXT,
    "rate" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billingType" TEXT,
    "totalCost" DOUBLE PRECISION,
    "targetDemo" TEXT,
    "targetShows" TEXT,
    "targetTimeSlots" TEXT,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "conversionCount" INTEGER NOT NULL DEFAULT 0,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "complianceNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ProgramCategory" NOT NULL,
    "schedule" TEXT NOT NULL,
    "image" TEXT,
    "status" "ProgramStatus" NOT NULL DEFAULT 'ACTIVE',
    "hostId" TEXT NOT NULL,
    "genreId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramEpisode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "audioFile" TEXT,
    "duration" INTEGER,
    "airDate" TIMESTAMP(3) NOT NULL,
    "programId" TEXT NOT NULL,
    "broadcastId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "broadcastId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userAvatar" TEXT,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'user',
    "replyTo" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "moderationReason" TEXT,
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "likedBy" TEXT,
    "emojis" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamSession" (
    "id" TEXT NOT NULL,
    "broadcastId" TEXT NOT NULL,
    "streamKey" TEXT NOT NULL,
    "streamUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'STARTING',
    "config" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatModerationAction" (
    "id" TEXT NOT NULL,
    "broadcastId" TEXT NOT NULL,
    "messageId" TEXT,
    "targetUserId" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "reason" TEXT,
    "duration" INTEGER,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatModerationAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatUserSession" (
    "id" TEXT NOT NULL,
    "broadcastId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userAvatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'listener',
    "isOnline" BOOLEAN NOT NULL DEFAULT true,
    "isTyping" BOOLEAN NOT NULL DEFAULT false,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "violations" INTEGER NOT NULL DEFAULT 0,
    "leftAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatUserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListenerAnalytics" (
    "id" TEXT NOT NULL,
    "broadcastId" TEXT NOT NULL,
    "listenerCount" INTEGER NOT NULL,
    "peakListeners" INTEGER NOT NULL DEFAULT 0,
    "geoData" TEXT,
    "deviceData" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListenerAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_settings" (
    "id" TEXT NOT NULL,
    "dashboardTitle" TEXT NOT NULL DEFAULT 'Radio Dashboard',
    "organizationName" TEXT NOT NULL DEFAULT 'Internet Radio Station',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#64748b',
    "defaultBroadcastQuality" TEXT NOT NULL DEFAULT 'HD',
    "defaultStreamDelay" INTEGER NOT NULL DEFAULT 5,
    "maxConcurrentListeners" INTEGER NOT NULL DEFAULT 1000,
    "autoRecordBroadcasts" BOOLEAN NOT NULL DEFAULT false,
    "enableChatModeration" BOOLEAN NOT NULL DEFAULT true,
    "defaultRecordingFormat" TEXT NOT NULL DEFAULT 'MP3',
    "defaultAudioQuality" TEXT NOT NULL DEFAULT '128kbps',
    "allowFileUploads" BOOLEAN NOT NULL DEFAULT true,
    "maxFileUploadSize" INTEGER NOT NULL DEFAULT 104857600,
    "allowedFileTypes" TEXT NOT NULL DEFAULT 'mp3,wav,flac,m4a',
    "enableTranscription" BOOLEAN NOT NULL DEFAULT true,
    "autoGenerateTranscripts" BOOLEAN NOT NULL DEFAULT false,
    "enableEmailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "enableSMSNotifications" BOOLEAN NOT NULL DEFAULT false,
    "enableSlackNotifications" BOOLEAN NOT NULL DEFAULT false,
    "notificationEmail" TEXT,
    "slackWebhookUrl" TEXT,
    "smsProviderConfig" TEXT,
    "enableTwoFactorAuth" BOOLEAN NOT NULL DEFAULT false,
    "sessionTimeout" INTEGER NOT NULL DEFAULT 3600,
    "passwordMinLength" INTEGER NOT NULL DEFAULT 8,
    "requirePasswordComplexity" BOOLEAN NOT NULL DEFAULT true,
    "maxLoginAttempts" INTEGER NOT NULL DEFAULT 5,
    "lockoutDuration" INTEGER NOT NULL DEFAULT 900,
    "enableAnalytics" BOOLEAN NOT NULL DEFAULT true,
    "analyticsProvider" TEXT NOT NULL DEFAULT 'internal',
    "enableErrorReporting" BOOLEAN NOT NULL DEFAULT true,
    "enablePerformanceMonitoring" BOOLEAN NOT NULL DEFAULT true,
    "dataRetentionDays" INTEGER NOT NULL DEFAULT 90,
    "enablePublicAPI" BOOLEAN NOT NULL DEFAULT false,
    "apiRateLimit" INTEGER NOT NULL DEFAULT 1000,
    "enableWebhooks" BOOLEAN NOT NULL DEFAULT false,
    "webhookSigningSecret" TEXT,
    "enableAutomaticBackups" BOOLEAN NOT NULL DEFAULT true,
    "backupFrequency" TEXT NOT NULL DEFAULT 'daily',
    "backupRetentionDays" INTEGER NOT NULL DEFAULT 30,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "enableContentModeration" BOOLEAN NOT NULL DEFAULT true,
    "autoFlagInappropriate" BOOLEAN NOT NULL DEFAULT true,
    "requireContentApproval" BOOLEAN NOT NULL DEFAULT false,
    "moderationKeywords" TEXT,
    "systemVersion" TEXT,
    "lastUpdatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Archive" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "host" TEXT,
    "guests" TEXT,
    "category" TEXT,
    "type" "ArchiveType" NOT NULL,
    "status" "ArchiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "duration" INTEGER,
    "fileSize" INTEGER,
    "audioFile" TEXT,
    "downloadUrl" TEXT,
    "coverImage" TEXT,
    "thumbnailImage" TEXT,
    "originalAirDate" TIMESTAMP(3),
    "archivedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isDownloadable" BOOLEAN NOT NULL DEFAULT true,
    "isExclusive" BOOLEAN NOT NULL DEFAULT false,
    "accessLevel" TEXT NOT NULL DEFAULT 'PUBLIC',
    "tags" TEXT,
    "metadata" TEXT,
    "transcript" TEXT,
    "transcriptFile" TEXT,
    "qualityVariants" TEXT,
    "podcastId" TEXT,
    "audiobookId" TEXT,
    "broadcastId" TEXT,
    "episodeId" TEXT,
    "createdById" TEXT NOT NULL,
    "curatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Archive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_username_key" ON "Staff"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_resetPasswordToken_key" ON "Staff"("resetPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserPasswordResetToken_token_key" ON "UserPasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserVerificationToken_token_key" ON "UserVerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Audiobook_slug_key" ON "Audiobook"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_audiobookId_trackNumber_key" ON "Chapter"("audiobookId", "trackNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_slug_key" ON "Podcast"("slug");

-- CreateIndex
CREATE INDEX "PodcastEpisode_podcastId_idx" ON "PodcastEpisode"("podcastId");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastEpisode_podcastId_episodeNumber_key" ON "PodcastEpisode"("podcastId", "episodeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LiveBroadcast_slug_key" ON "LiveBroadcast"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BroadcastStaff_broadcastId_userId_role_key" ON "BroadcastStaff"("broadcastId", "userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Transcription_audiobookId_key" ON "Transcription"("audiobookId");

-- CreateIndex
CREATE UNIQUE INDEX "Transcription_podcastId_key" ON "Transcription"("podcastId");

-- CreateIndex
CREATE UNIQUE INDEX "Transcription_liveBroadcastId_key" ON "Transcription"("liveBroadcastId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_audiobookId_key" ON "Review"("userId", "audiobookId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_podcastId_key" ON "Review"("userId", "podcastId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_archiveId_key" ON "Review"("userId", "archiveId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybackProgress_userId_audiobookId_key" ON "PlaybackProgress"("userId", "audiobookId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybackProgress_userId_podcastId_key" ON "PlaybackProgress"("userId", "podcastId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybackProgress_userId_archiveId_key" ON "PlaybackProgress"("userId", "archiveId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybackProgress_staffId_audiobookId_key" ON "PlaybackProgress"("staffId", "audiobookId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybackProgress_staffId_podcastId_key" ON "PlaybackProgress"("staffId", "podcastId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybackProgress_staffId_archiveId_key" ON "PlaybackProgress"("staffId", "archiveId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_audiobookId_key" ON "Favorite"("userId", "audiobookId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_podcastId_key" ON "Favorite"("userId", "podcastId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_podcastEpisodeId_key" ON "Favorite"("userId", "podcastEpisodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_archiveId_key" ON "Favorite"("userId", "archiveId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_staffId_audiobookId_key" ON "Favorite"("staffId", "audiobookId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_staffId_podcastId_key" ON "Favorite"("staffId", "podcastId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_staffId_podcastEpisodeId_key" ON "Favorite"("staffId", "podcastEpisodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_staffId_archiveId_key" ON "Favorite"("staffId", "archiveId");

-- CreateIndex
CREATE UNIQUE INDEX "GuestInvitation_invitationToken_key" ON "GuestInvitation"("invitationToken");

-- CreateIndex
CREATE INDEX "GuestInvitation_invitationToken_idx" ON "GuestInvitation"("invitationToken");

-- CreateIndex
CREATE INDEX "GuestInvitation_podcastId_idx" ON "GuestInvitation"("podcastId");

-- CreateIndex
CREATE INDEX "GuestInvitation_guestEmail_idx" ON "GuestInvitation"("guestEmail");

-- CreateIndex
CREATE INDEX "PodcastGuest_podcastId_idx" ON "PodcastGuest"("podcastId");

-- CreateIndex
CREATE INDEX "PodcastGuest_userId_idx" ON "PodcastGuest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastGuest_podcastId_userId_key" ON "PodcastGuest"("podcastId", "userId");

-- CreateIndex
CREATE INDEX "Schedule_type_status_idx" ON "Schedule"("type", "status");

-- CreateIndex
CREATE INDEX "Schedule_startTime_idx" ON "Schedule"("startTime");

-- CreateIndex
CREATE INDEX "Schedule_createdBy_idx" ON "Schedule"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "Event_scheduleId_key" ON "Event"("scheduleId");

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_idx" ON "EventRegistration"("eventId");

-- CreateIndex
CREATE INDEX "EventRegistration_userId_idx" ON "EventRegistration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_userId_eventId_key" ON "EventRegistration"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_scheduleId_key" ON "Campaign"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Advertisement_scheduleId_key" ON "Advertisement"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramEpisode_broadcastId_key" ON "ProgramEpisode"("broadcastId");

-- CreateIndex
CREATE INDEX "ChatMessage_broadcastId_idx" ON "ChatMessage"("broadcastId");

-- CreateIndex
CREATE INDEX "ChatMessage_timestamp_idx" ON "ChatMessage"("timestamp");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_idx" ON "ChatMessage"("userId");

-- CreateIndex
CREATE INDEX "ChatMessage_messageType_idx" ON "ChatMessage"("messageType");

-- CreateIndex
CREATE UNIQUE INDEX "StreamSession_streamKey_key" ON "StreamSession"("streamKey");

-- CreateIndex
CREATE INDEX "StreamSession_broadcastId_idx" ON "StreamSession"("broadcastId");

-- CreateIndex
CREATE INDEX "StreamSession_streamKey_idx" ON "StreamSession"("streamKey");

-- CreateIndex
CREATE INDEX "ChatModerationAction_broadcastId_idx" ON "ChatModerationAction"("broadcastId");

-- CreateIndex
CREATE INDEX "ChatModerationAction_targetUserId_idx" ON "ChatModerationAction"("targetUserId");

-- CreateIndex
CREATE INDEX "ChatModerationAction_moderatorId_idx" ON "ChatModerationAction"("moderatorId");

-- CreateIndex
CREATE INDEX "ChatModerationAction_actionType_idx" ON "ChatModerationAction"("actionType");

-- CreateIndex
CREATE INDEX "ChatUserSession_broadcastId_idx" ON "ChatUserSession"("broadcastId");

-- CreateIndex
CREATE INDEX "ChatUserSession_userId_idx" ON "ChatUserSession"("userId");

-- CreateIndex
CREATE INDEX "ChatUserSession_isOnline_idx" ON "ChatUserSession"("isOnline");

-- CreateIndex
CREATE UNIQUE INDEX "ChatUserSession_broadcastId_userId_key" ON "ChatUserSession"("broadcastId", "userId");

-- CreateIndex
CREATE INDEX "ListenerAnalytics_broadcastId_idx" ON "ListenerAnalytics"("broadcastId");

-- CreateIndex
CREATE INDEX "ListenerAnalytics_timestamp_idx" ON "ListenerAnalytics"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Archive_slug_key" ON "Archive"("slug");

-- CreateIndex
CREATE INDEX "Archive_type_idx" ON "Archive"("type");

-- CreateIndex
CREATE INDEX "Archive_status_idx" ON "Archive"("status");

-- CreateIndex
CREATE INDEX "Archive_originalAirDate_idx" ON "Archive"("originalAirDate");

-- CreateIndex
CREATE INDEX "Archive_archivedDate_idx" ON "Archive"("archivedDate");

-- CreateIndex
CREATE INDEX "Archive_category_idx" ON "Archive"("category");

-- CreateIndex
CREATE INDEX "Archive_createdById_idx" ON "Archive"("createdById");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPasswordResetToken" ADD CONSTRAINT "UserPasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVerificationToken" ADD CONSTRAINT "UserVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audiobook" ADD CONSTRAINT "Audiobook_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audiobook" ADD CONSTRAINT "Audiobook_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "Audiobook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastEpisode" ADD CONSTRAINT "PodcastEpisode_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveBroadcast" ADD CONSTRAINT "LiveBroadcast_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveBroadcast" ADD CONSTRAINT "LiveBroadcast_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveBroadcast" ADD CONSTRAINT "LiveBroadcast_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BroadcastStaff" ADD CONSTRAINT "BroadcastStaff_broadcastId_fkey" FOREIGN KEY ("broadcastId") REFERENCES "LiveBroadcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BroadcastStaff" ADD CONSTRAINT "BroadcastStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "Audiobook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_liveBroadcastId_fkey" FOREIGN KEY ("liveBroadcastId") REFERENCES "LiveBroadcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "Audiobook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_liveBroadcastId_fkey" FOREIGN KEY ("liveBroadcastId") REFERENCES "LiveBroadcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "Archive"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_podcastEpisodeId_fkey" FOREIGN KEY ("podcastEpisodeId") REFERENCES "PodcastEpisode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "Audiobook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "Archive"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "Audiobook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "Archive"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybackProgress" ADD CONSTRAINT "PlaybackProgress_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "Audiobook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybackProgress" ADD CONSTRAINT "PlaybackProgress_liveBroadcastId_fkey" FOREIGN KEY ("liveBroadcastId") REFERENCES "LiveBroadcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybackProgress" ADD CONSTRAINT "PlaybackProgress_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybackProgress" ADD CONSTRAINT "PlaybackProgress_podcastEpisodeId_fkey" FOREIGN KEY ("podcastEpisodeId") REFERENCES "PodcastEpisode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybackProgress" ADD CONSTRAINT "PlaybackProgress_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "Archive"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybackProgress" ADD CONSTRAINT "PlaybackProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybackProgress" ADD CONSTRAINT "PlaybackProgress_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "Audiobook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_podcastEpisodeId_fkey" FOREIGN KEY ("podcastEpisodeId") REFERENCES "PodcastEpisode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "Archive"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "Audiobook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaHistory" ADD CONSTRAINT "MediaHistory_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "Audiobook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaHistory" ADD CONSTRAINT "MediaHistory_liveBroadcastId_fkey" FOREIGN KEY ("liveBroadcastId") REFERENCES "LiveBroadcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaHistory" ADD CONSTRAINT "MediaHistory_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaHistory" ADD CONSTRAINT "MediaHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BroadcastGuest" ADD CONSTRAINT "BroadcastGuest_broadcastId_fkey" FOREIGN KEY ("broadcastId") REFERENCES "LiveBroadcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestInvitation" ADD CONSTRAINT "GuestInvitation_acceptedByUserId_fkey" FOREIGN KEY ("acceptedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestInvitation" ADD CONSTRAINT "GuestInvitation_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastGuest" ADD CONSTRAINT "PodcastGuest_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastGuest" ADD CONSTRAINT "PodcastGuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "Audiobook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_liveBroadcastId_fkey" FOREIGN KEY ("liveBroadcastId") REFERENCES "LiveBroadcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_publishedBy_fkey" FOREIGN KEY ("publishedBy") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizer_fkey" FOREIGN KEY ("organizer") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_manager_fkey" FOREIGN KEY ("manager") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advertisement" ADD CONSTRAINT "Advertisement_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advertisement" ADD CONSTRAINT "Advertisement_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramEpisode" ADD CONSTRAINT "ProgramEpisode_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramEpisode" ADD CONSTRAINT "ProgramEpisode_broadcastId_fkey" FOREIGN KEY ("broadcastId") REFERENCES "LiveBroadcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_replyTo_fkey" FOREIGN KEY ("replyTo") REFERENCES "ChatMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_moderatedBy_fkey" FOREIGN KEY ("moderatedBy") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatModerationAction" ADD CONSTRAINT "ChatModerationAction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatModerationAction" ADD CONSTRAINT "ChatModerationAction_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_curatedById_fkey" FOREIGN KEY ("curatedById") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "Audiobook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_broadcastId_fkey" FOREIGN KEY ("broadcastId") REFERENCES "LiveBroadcast"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "PodcastEpisode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
