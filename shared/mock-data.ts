import type {
  KpiData,
  AnalyticsChartData,
  Integration,
  SubscriptionPlan,
} from "./types";
// Dashboard KPIs
export const MOCK_KPIS: KpiData[] = [
  {
    id: "spend",
    title: "Total Spend",
    value: "$12,345",
    change: "+12.5%",
    changeDirection: "up",
  },
  {
    id: "cpa",
    title: "Avg. CPA",
    value: "$25.50",
    change: "-8.2%",
    changeDirection: "down",
  },
  {
    id: "roas",
    title: "Total ROAS",
    value: "4.2x",
    change: "+5.1%",
    changeDirection: "up",
  },
  {
    id: "impressions",
    title: "Impressions",
    value: "2.1M",
    change: "+20.3%",
    changeDirection: "up",
  },
];
// Dashboard Charts
export const MOCK_CHART_DATA: AnalyticsChartData[] = [
  { name: "Week 1", spend: 4000, roas: 2.4, impressions: 240000 },
  { name: "Week 2", spend: 3000, roas: 1.3, impressions: 139800 },
  { name: "Week 3", spend: 2000, roas: 9.8, impressions: 980000 },
  { name: "Week 4", spend: 2780, roas: 3.9, impressions: 390800 },
  { name: "Week 5", spend: 1890, roas: 4.8, impressions: 480000 },
  { name: "Week 6", spend: 2390, roas: 3.8, impressions: 380000 },
  { name: "Week 7", spend: 3490, roas: 4.3, impressions: 430000 },
];
// Integrations
export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Connect your Google Ads account to analyze campaign performance.",
    logo: "https://www.gstatic.com/images/branding/product/1x/ads_48dp.png",
    status: "connected",
    lastSynced: "2 hours ago",
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    description: "Connect your Meta Ads account for Facebook and Instagram insights.",
    logo: "https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/p_t2-t-9.png",
    status: "connected",
    lastSynced: "3 hours ago",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Connect Google Analytics to track website traffic and user behavior.",
    logo: "https://www.gstatic.com/images/branding/product/1x/analytics_48dp.png",
    status: "disconnected",
    lastSynced: null,
  },
];
// Billing Plans
export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams and individuals getting started.",
    price: { monthly: 29, yearly: 278 },
    features: [
      "Up to 2 integrations",
      "Basic AI chat analysis",
      "Dashboard access",
      "Email support",
    ],
    isCurrent: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses that need more power.",
    price: { monthly: 99, yearly: 950 },
    features: [
      "Up to 10 integrations",
      "Advanced AI chat analysis",
      "Customizable dashboards",
      "Priority email support",
      "API Access",
    ],
    isCurrent: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom needs.",
    price: { monthly: 499, yearly: 4790 },
    features: [
      "Unlimited integrations",
      "Dedicated AI models",
      "SSO and advanced security",
      "Dedicated account manager",
      "24/7 phone support",
    ],
    isCurrent: false,
  },
];