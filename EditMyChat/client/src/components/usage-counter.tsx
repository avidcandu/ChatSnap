import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Infinity } from "lucide-react";

interface UsageCounterProps {
  used: number;
  limit: number;
  isUnlimited: boolean;
  onUpgrade: () => void;
}

export function UsageCounter({
  used,
  limit,
  isUnlimited,
  onUpgrade,
}: UsageCounterProps) {
  const remaining = limit - used;
  const isLow = remaining <= 1 && !isUnlimited;

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3">
      <Badge
        variant={isLow ? "destructive" : "secondary"}
        className="px-4 py-2 text-sm font-medium"
        data-testid="badge-usage"
      >
        {isUnlimited ? (
          <span className="flex items-center gap-1.5">
            <Infinity className="w-4 h-4" />
            Unlimited
          </span>
        ) : (
          <span>
            {remaining} / {limit} screenshots remaining
          </span>
        )}
      </Badge>
      {!isUnlimited && (
        <Button
          onClick={onUpgrade}
          variant="default"
          size="sm"
          data-testid="button-upgrade"
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade
        </Button>
      )}
    </div>
  );
}
