export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// --- Clarity AI Specific Types ---
export type UserRole = 'admin' | 'brand';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Included for mock auth, would be a hash in a real app
}
export interface KpiData {
  id: string;
  title: string;
  value: string;
  change: string;
  changeDirection: "up" | "down";
}
export interface AnalyticsChartData {
  name: string;
  spend: number;
  roas: number;
  impressions: number;
}
export interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: "connected" | "disconnected";
  lastSynced: string | null;
}
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  isCurrent: boolean;
}
export interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  isLoading?: boolean;
}
export interface AppSettings {
  id: string; // Should be a singleton ID, e.g., 'global'
  activeSubscriptionId: string;
  integrationsStatus: Record<string, boolean>; // e.g., { 'google-ads': true, 'meta-ads': false }
}