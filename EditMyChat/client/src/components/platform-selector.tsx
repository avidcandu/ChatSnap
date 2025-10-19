import { Platform } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { SiWhatsapp, SiInstagram, SiDiscord, SiTelegram } from "react-icons/si";

interface PlatformSelectorProps {
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export function PlatformSelector({
  platform,
  onPlatformChange,
}: PlatformSelectorProps) {
  const platforms: Array<{
    id: Platform;
    icon: typeof SiWhatsapp;
    label: string;
    color: string;
  }> = [
    { id: "whatsapp", icon: SiWhatsapp, label: "WhatsApp", color: "#25D366" },
    { id: "instagram", icon: SiInstagram, label: "Instagram", color: "#E4405F" },
    { id: "discord", icon: SiDiscord, label: "Discord", color: "#5865F2" },
    { id: "telegram", icon: SiTelegram, label: "Telegram", color: "#0088cc" },
  ];

  return (
    <div className="w-20 border-r border-border bg-card flex flex-col items-center gap-4 py-6">
      {platforms.map((p) => {
        const Icon = p.icon;
        const isActive = platform === p.id;
        return (
          <Button
            key={p.id}
            variant="ghost"
            size="icon"
            onClick={() => onPlatformChange(p.id)}
            data-testid={`button-platform-${p.id}`}
            className={`w-12 h-12 rounded-lg relative ${
              isActive ? "bg-accent" : ""
            }`}
            title={p.label}
          >
            <Icon
              className="w-6 h-6"
              style={{ color: isActive ? p.color : undefined }}
            />
            {isActive && (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r"
                style={{ backgroundColor: p.color }}
              />
            )}
          </Button>
        );
      })}
    </div>
  );
}
