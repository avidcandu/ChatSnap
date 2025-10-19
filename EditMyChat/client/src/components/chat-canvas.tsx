import { Platform, Message } from "@shared/schema";
import { WhatsAppChat } from "@/components/platforms/whatsapp-chat";
import { InstagramChat } from "@/components/platforms/instagram-chat";
import { DiscordChat } from "@/components/platforms/discord-chat";
import { TelegramChat } from "@/components/platforms/telegram-chat";
import { Button } from "@/components/ui/button";
import { Plus, Download, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ChatCanvasProps {
  platform: Platform;
  messages: Message[];
  selectedMessageId: string | null;
  onMessageSelect: (id: string) => void;
  onAddMessage: () => void;
  onDeleteMessage: (id: string) => void;
  onExport: () => void;
  isExporting?: boolean;
}

export function ChatCanvas({
  platform,
  messages,
  selectedMessageId,
  onMessageSelect,
  onAddMessage,
  onDeleteMessage,
  onExport,
  isExporting = false,
}: ChatCanvasProps) {
  const platformComponents = {
    whatsapp: WhatsAppChat,
    instagram: InstagramChat,
    discord: DiscordChat,
    telegram: TelegramChat,
  };

  const PlatformComponent = platformComponents[platform];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          onClick={onAddMessage}
          className="flex-1"
          data-testid="button-add-message"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Message
        </Button>
        {selectedMessageId && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDeleteMessage(selectedMessageId)}
            data-testid="button-delete-message"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Card className="overflow-hidden shadow-xl" id="chat-canvas">
        <PlatformComponent
          messages={messages}
          selectedMessageId={selectedMessageId}
          onMessageSelect={onMessageSelect}
        />
      </Card>

      <Button
        onClick={onExport}
        variant="default"
        className="w-full"
        size="lg"
        disabled={isExporting}
        data-testid="button-export"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download Screenshot
          </>
        )}
      </Button>
    </div>
  );
}
