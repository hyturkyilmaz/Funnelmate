import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
export function SettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Settings</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your account and application settings.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            This section is under construction. You will soon be able to manage your preferences,
            notifications, and other account settings here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Thank you for your patience!</p>
        </CardContent>
      </Card>
    </div>
  );
}