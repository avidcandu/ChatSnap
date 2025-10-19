import { PricingTier } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Infinity } from "lucide-react";

interface PricingCardProps {
  tier: PricingTier;
  config: {
    name: string;
    price: number;
    screenshots: number;
    description: string;
    popular: boolean;
  };
  onSelect: () => void;
}

export function PricingCard({ tier, config, onSelect }: PricingCardProps) {
  const features = [
    `${config.screenshots === -1 ? "Unlimited" : config.screenshots} screenshots`,
    "All platforms supported",
    "High-quality exports",
    "Instant downloads",
  ];

  return (
    <Card
      className={`relative hover-elevate ${
        config.popular ? "border-primary shadow-lg" : ""
      }`}
    >
      {config.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="default" className="px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="text-2xl font-bold mb-2">{config.name}</div>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold">${config.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {config.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <Button
          onClick={onSelect}
          variant={config.popular ? "default" : "outline"}
          className="w-full"
          size="lg"
          data-testid={`button-select-${tier}`}
        >
          {config.screenshots === -1 && (
            <Infinity className="w-4 h-4 mr-2" />
          )}
          Select Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
