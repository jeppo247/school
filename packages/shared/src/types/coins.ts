export type CoinRewardReason =
  | "session_complete"
  | "diagnostic_complete"
  | "skill_mastery"
  | "sub_strand_complete"
  | "strand_complete"
  | "year_complete"
  | "perfect_session"
  | "weekly_return"
  | "level_up"
  | "streak_milestone"
  | "shop_purchase";

export interface CoinReward {
  reason: CoinRewardReason;
  amount: number;
  label: string;
  referenceId?: string;
}

export interface CoinTransaction {
  id: string;
  studentId: string;
  amount: number;
  type: "earn" | "spend";
  reason: CoinRewardReason;
  referenceId?: string;
  balanceAfter: number;
  createdAt: string;
}

export type ShopItemCategory =
  | "theme"
  | "avatar"
  | "celebration"
  | "sound_pack"
  | "brain_break"
  | "badge";

export interface ShopItem {
  id: string;
  category: ShopItemCategory;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  previewData?: Record<string, unknown>;
  prerequisite?: ShopItemPrerequisite;
  isActive: boolean;
  isLimited: boolean;
  availableUntil?: string;
  displayOrder: number;
}

export interface ShopItemPrerequisite {
  minStreak?: number;
  minLevel?: number;
  requiredBadge?: string;
}

export interface ShopItemWithOwnership extends ShopItem {
  isOwned: boolean;
}

export interface StudentPurchase {
  id: string;
  studentId: string;
  itemId: string;
  purchasedAt: string;
}
