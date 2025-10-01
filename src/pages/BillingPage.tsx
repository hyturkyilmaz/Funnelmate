import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { SubscriptionPlan } from "@shared/types";
import { toast } from "sonner";
export function BillingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const fetchedPlans = await api<SubscriptionPlan[]>("/api/billing/plans");
      setPlans(fetchedPlans);
    } catch (error) {
      console.error("Failed to fetch billing plans:", error);
      toast.error("Failed to load subscription plans.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPlans();
  }, []);
  const handleChoosePlan = async (planId: string) => {
    setUpdatingId(planId);
    const originalPlans = [...plans];
    // Optimistic update
    setPlans(prev =>
      prev.map(p => ({ ...p, isCurrent: p.id === planId }))
    );
    try {
      await api('/api/billing/plan', {
        method: 'POST',
        body: JSON.stringify({ planId }),
      });
      toast.success("Subscription plan updated successfully!");
    } catch (error) {
      console.error("Failed to update plan:", error);
      toast.error("Failed to update subscription plan.");
      // Revert on failure
      setPlans(originalPlans);
    } finally {
      setUpdatingId(null);
    }
  };
  return (
    <div className="space-y-16 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Billing & Subscription</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your plan and view your billing history.
        </p>
      </header>
      <section className="space-y-8">
        <div className="flex items-center justify-center space-x-4">
          <Label htmlFor="billing-cycle" className={cn(!isYearly && "text-primary font-semibold")}>
            Monthly
          </Label>
          <Switch
            id="billing-cycle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
            aria-label="Toggle billing cycle"
          />
          <Label htmlFor="billing-cycle" className={cn(isYearly && "text-primary font-semibold")}>
            Yearly (Save 20%)
          </Label>
        </div>
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col transition-all duration-300",
                  plan.isCurrent
                    ? "border-primary ring-2 ring-primary shadow-lg"
                    : "hover:shadow-xl hover:-translate-y-1"
                )}
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={plan.isCurrent || !!updatingId}
                    onClick={() => handleChoosePlan(plan.id)}
                  >
                    {updatingId === plan.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : plan.isCurrent ? (
                      "Current Plan"
                    ) : (
                      "Choose Plan"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}