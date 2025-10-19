import { MessageSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">ChatSnap</h1>
          <p className="text-xs text-muted-foreground">
            Create realistic chat screenshots
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
