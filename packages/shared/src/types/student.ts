export interface Student {
  id: string;
  familyId: string;
  name: string;
  yearLevel: number;
  dateOfBirth?: string;
  avatarUrl?: string;
  themeId: string;
  interests: string[];
  xpTotal: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate?: string;
  diagnosticCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile extends Student {
  level: number;
  xpForNextLevel: number;
  masteryPercentage: number;
  totalSkillsAssessed: number;
}
