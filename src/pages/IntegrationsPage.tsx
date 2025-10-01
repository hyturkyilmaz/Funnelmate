import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api-client";
import { Integration } from "@shared/types";
import { toast } from "sonner";
export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const fetchIntegrations = async () => {
    try {
      setIsLoading(true);
      const data = await api<Integration[]>("/api/integrations");
      setIntegrations(data);
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
      toast.error("Failed to load integrations.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchIntegrations();
  }, []);
  const handleToggle = async (integrationId: string) => {
    setUpdatingId(integrationId);
    // Optimistic update
    const originalIntegrations = [...integrations];
    setIntegrations(prev =>
      prev.map(i =>
        i.id === integrationId
          ? { ...i, status: i.status === 'connected' ? 'disconnected' : 'connected' }
          : i
      )
    );
    try {
      await api(`/api/integrations/${integrationId}/toggle`, { method: 'POST' });
      toast.success("Integration status updated successfully.");
    } catch (error) {
      console.error("Failed to toggle integration:", error);
      toast.error("Failed to update integration status.");
      // Revert on failure
      setIntegrations(originalIntegrations);
    } finally {
      setUpdatingId(null);
    }
  };
  return (
    <div className="space-y-16 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Integrations</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Connect and manage your marketing data sources.
        </p>
      </header>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="h-56 animate-pulse bg-muted"></Card>
            <Card className="h-56 animate-pulse bg-muted"></Card>
            <Card className="h-56 animate-pulse bg-muted"></Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrations.map((integration) => (
            <Card key={integration.id} className="shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={integration.logo} alt={`${integration.name} logo`} className="h-10 w-10 mr-4" />
                    <CardTitle className="text-xl">{integration.name}</CardTitle>
                  </div>
                  {integration.status === "connected" ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <CardDescription>{integration.description}</CardDescription>
                <div className="mt-4">
                  {integration.status === "connected" ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Connected
                      </span>
                      <Button variant="destructive" size="sm" onClick={() => handleToggle(integration.id)} disabled={updatingId === integration.id}>
                        {updatingId === integration.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Disconnect'}
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => handleToggle(integration.id)} disabled={updatingId === integration.id}>
                      {updatingId === integration.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}