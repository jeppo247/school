export interface DailyBriefing {
  id: string;
  studentId: string;
  parentId: string;
  briefingDate: string;
  content: BriefingContent;
  wasRead: boolean;
  readAt?: string;
}

export interface BriefingContent {
  focusSkills: { id: string; name: string; status: string }[];
  summary: string;
  tips: string[];
  conversationScript: string;
  estimatedDifficulty: "easy" | "moderate" | "challenging";
}

export interface ParentNudge {
  id: string;
  studentId: string;
  parentId: string;
  sessionId?: string;
  nudgeType: "stuck" | "celebration" | "break_needed" | "session_complete";
  content: string;
  wasSent: boolean;
  sentAt?: string;
  wasRead: boolean;
}

export interface WeeklyReport {
  id: string;
  studentId: string;
  familyId: string;
  reportWeek: string;
  content: WeeklyReportContent;
  shareToken?: string;
  pdfUrl?: string;
}

export interface WeeklyReportContent {
  skillsMasteredThisWeek: { id: string; name: string }[];
  activeGaps: { id: string; name: string; progress: number }[];
  sessionsCompleted: number;
  totalTimeMinutes: number;
  averageAccuracy: number;
  accuracyTrend: number[];
  streakDays: number;
  recommendedActivities: string[];
  yearLevelComparison: {
    current: number;
    expected: number;
    label: string;
  };
}

export interface Feedback {
  id: string;
  familyId: string;
  parentId: string;
  category: "general" | "bug" | "feature" | "content" | "other";
  subject: string;
  body: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  adminResponse?: string;
  respondedAt?: string;
  createdAt: string;
}
