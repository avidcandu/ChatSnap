import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PricingTier, pricingConfig } from "@shared/schema";
import { PricingCard } from "@/components/pricing-card";
import { CheckoutForm } from "@/components/checkout-form";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  const handleBack = () => {
    setSelectedTier(null);
  };

  const handleSuccess = () => {
    setSelectedTier(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {!selectedTier ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-center">
                Upgrade Your Plan
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                Choose the perfect plan for your screenshot needs
              </DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-3 gap-6 py-6">
              {(Object.keys(pricingConfig) as PricingTier[]).map((tier) => (
                <PricingCard
                  key={tier}
                  tier={tier}
                  config={pricingConfig[tier]}
                  onSelect={() => setSelectedTier(tier)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Complete Your Purchase
              </DialogTitle>
              <DialogDescription>
                {pricingConfig[selectedTier].name} Plan - $
                {pricingConfig[selectedTier].price.toFixed(2)}
              </DialogDescription>
            </DialogHeader>

            <CheckoutForm
              tier={selectedTier}
              onBack={handleBack}
              onSuccess={handleSuccess}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
