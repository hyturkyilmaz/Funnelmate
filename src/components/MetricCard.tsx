import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { KpiData } from "@shared/types";
import { cn } from "@/lib/utils";
interface MetricCardProps {
  item: Omit<KpiData, "icon"> & {
    icon: React.ElementType;
  };
}
export function MetricCard({ item }: MetricCardProps) {
  const isPositive = item.changeDirection === "up";
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {item.title}
        </CardTitle>
        <item.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{item.value}</div>
        <div className="text-xs text-muted-foreground flex items-center">
          <span
            className={cn(
              "flex items-center font-semibold",
              isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            {item.change}
          </span>
          <span className="ml-2">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}