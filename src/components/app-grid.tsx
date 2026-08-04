import { AppWithRating } from "@/types";
import { AppCard } from "./app-card";

export function AppGrid({ apps }: { apps: AppWithRating[] }) {
  if (apps.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No apps found. Check back later!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
