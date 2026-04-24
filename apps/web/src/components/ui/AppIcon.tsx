import {
  AlertCircle,
  Apple,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Coffee,
  Compass,
  Dumbbell,
  Flame,
  Gift,
  Globe2,
  GraduationCap,
  Handshake,
  HelpCircle,
  Home,
  Lightbulb,
  Lock,
  Map,
  MessageCircle,
  Paintbrush,
  Palette,
  PartyPopper,
  Rocket,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy,
  UserCircle,
  Users,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AppIconName =
  | "alert"
  | "apple"
  | "award"
  | "barChart"
  | "book"
  | "brain"
  | "brand"
  | "check"
  | "clipboard"
  | "clock"
  | "coffee"
  | "compass"
  | "dumbbell"
  | "flame"
  | "gift"
  | "globe"
  | "graduation"
  | "handshake"
  | "help"
  | "home"
  | "lightbulb"
  | "lock"
  | "map"
  | "message"
  | "paintbrush"
  | "palette"
  | "party"
  | "rocket"
  | "shield"
  | "shop"
  | "sparkles"
  | "star"
  | "sun"
  | "target"
  | "trophy"
  | "user"
  | "users"
  | "volume";

const ICONS: Record<Exclude<AppIconName, "brand">, LucideIcon> = {
  alert: AlertCircle,
  apple: Apple,
  award: Award,
  barChart: BarChart3,
  book: BookOpen,
  brain: Brain,
  check: CheckCircle2,
  clipboard: ClipboardList,
  clock: Clock3,
  coffee: Coffee,
  compass: Compass,
  dumbbell: Dumbbell,
  flame: Flame,
  gift: Gift,
  globe: Globe2,
  graduation: GraduationCap,
  handshake: Handshake,
  help: HelpCircle,
  home: Home,
  lightbulb: Lightbulb,
  lock: Lock,
  map: Map,
  message: MessageCircle,
  paintbrush: Paintbrush,
  palette: Palette,
  party: PartyPopper,
  rocket: Rocket,
  shield: Shield,
  shop: ShoppingBag,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  target: Target,
  trophy: Trophy,
  user: UserCircle,
  users: Users,
  volume: Volume2,
};

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center justify-center", className)} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-sm">
        <defs>
          <linearGradient id="upwise-mark-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F8CF7" />
            <stop offset="0.55" stopColor="#7C6BF5" />
            <stop offset="1" stopColor="#34D399" />
          </linearGradient>
          <linearGradient id="upwise-mark-shine" x1="18" y1="12" x2="46" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect x="5" y="5" width="54" height="54" rx="20" fill="url(#upwise-mark-bg)" />
        <path
          d="M20 24c0-5 4-9 9-9h6c5 0 9 4 9 9v10c0 8-5 14-12 16-7-2-12-8-12-16V24Z"
          fill="url(#upwise-mark-shine)"
        />
        <circle cx="27" cy="29" r="3.5" fill="#2563EB" />
        <circle cx="37" cy="29" r="3.5" fill="#2563EB" />
        <path d="M30 37h4l-2 3-2-3Z" fill="#F59E0B" />
        <path
          d="M24 22c4-3 12-3 16 0M24 44c5 4 11 4 16 0"
          fill="none"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function AppIcon({
  name,
  className,
  strokeWidth = 2,
}: {
  name: AppIconName;
  className?: string;
  strokeWidth?: number;
}) {
  if (name === "brand") {
    return <BrandMark className={className} />;
  }

  const Icon = ICONS[name] ?? Sparkles;
  return <Icon aria-hidden="true" className={className} strokeWidth={strokeWidth} />;
}

export function IconBadge({
  name,
  className,
  iconClassName,
}: {
  name: AppIconName;
  className?: string;
  iconClassName?: string;
}) {
  if (name === "brand") {
    return <BrandMark className={cn("h-12 w-12", className)} />;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]",
        className,
      )}
      aria-hidden="true"
    >
      <AppIcon name={name} className={cn("h-5 w-5", iconClassName)} />
    </span>
  );
}
