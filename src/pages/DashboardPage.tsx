import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  DollarSign,
  Users,
  MousePointerClick,
  TrendingUp,
  Calendar as CalendarIcon,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { KpiData, AnalyticsChartData } from "@shared/types";

// Local type for dashboard KPIs, extending the shared type with a frontend-specific icon
type DashboardKpi = Omit<KpiData, "icon"> & {
  icon: React.ElementType;
};

const iconMap: { [key: string]: React.ElementType } = {
  spend: DollarSign,
  cpa: DollarSign,
  roas: TrendingUp,
  impressions: Users,
  clicks: MousePointerClick,
};
// Helper to generate random mock data
const generateRandomKpi = (base: number, positive: boolean): { value: number; change: number } => {
  const value = base * (0.8 + Math.random() * 0.4); // +/- 20%
  const change = (Math.random() * 15) * (Math.random() > 0.5 ? 1 : -1);
  return { value, change };
};
const generateMockData = (): { kpis: DashboardKpi[], charts: AnalyticsChartData[] } => {
  const spendData = generateRandomKpi(12000, true);
  const cpaData = generateRandomKpi(25, false);
  const roasData = generateRandomKpi(4, true);
  const impressionsData = generateRandomKpi(2000000, true);
  const kpis: DashboardKpi[] = [
    { id: "spend", title: "Total Spend", value: `${(spendData.value / 1000).toFixed(1)}k`, change: `${spendData.change.toFixed(1)}%`, changeDirection: spendData.change > 0 ? "up" : "down", icon: iconMap.spend },
    { id: "cpa", title: "Avg. CPA", value: `${cpaData.value.toFixed(2)}`, change: `${cpaData.change.toFixed(1)}%`, changeDirection: cpaData.change > 0 ? "up" : "down", icon: iconMap.cpa },
    { id: "roas", title: "Total ROAS", value: `${roasData.value.toFixed(1)}x`, change: `${roasData.change.toFixed(1)}%`, changeDirection: roasData.change > 0 ? "up" : "down", icon: iconMap.roas },
    { id: "impressions", title: "Impressions", value: `${(impressionsData.value / 1000000).toFixed(1)}M`, change: `${impressionsData.change.toFixed(1)}%`, changeDirection: impressionsData.change > 0 ? "up" : "down", icon: iconMap.impressions },
  ];
  const charts: AnalyticsChartData[] = Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    spend: Math.floor(2000 + Math.random() * 3000),
    roas: parseFloat((2 + Math.random() * 5).toFixed(1)),
    impressions: Math.floor(100000 + Math.random() * 400000),
  }));
  return { kpis, charts };
};
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};
export function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKpi[]>([]);
  const [chartData, setChartData] = useState<AnalyticsChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      try {
        const { kpis: newKpis, charts: newCharts } = generateMockData();
        setKpis(newKpis);
        setChartData(newCharts);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [date]);
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-display font-bold">Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">
            High-level overview of your marketing performance.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {isLoading ? (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="h-32 animate-pulse bg-muted"></Card>
            <Card className="h-32 animate-pulse bg-muted"></Card>
            <Card className="h-32 animate-pulse bg-muted"></Card>
            <Card className="h-32 animate-pulse bg-muted"></Card>
         </div>
      ) : (
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {kpis.map((kpi) => (
            <motion.div key={kpi.id} variants={itemVariants}>
              <MetricCard item={kpi} />
            </motion.div>
          ))}
        </motion.div>
      )}
      <motion.div
        className="grid gap-8 md:grid-cols-1 lg:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        >
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Spend vs ROAS</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend iconSize={10} />
                  <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="roas" fill="hsl(var(--primary) / 0.5)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Impressions Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorImpressions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}