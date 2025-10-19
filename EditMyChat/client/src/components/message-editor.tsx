import { Message, MessageType } from "@shared/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SendHorizontal, UserCircle } from "lucide-react";

interface MessageEditorProps {
  message: Message | undefined;
  onUpdate: (updates: Partial<Message>) => void;
}

export function MessageEditor({ message, onUpdate }: MessageEditorProps) {
  if (!message) {
    return (
      <div className="w-80 border-l border-border bg-card p-6 flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">
          Select a message to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-card overflow-auto">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Message Properties</h3>
          <p className="text-sm text-muted-foreground">
            Customize the selected message
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message-type">Message Type</Label>
            <ToggleGroup
              type="single"
              value={message.type}
              onValueChange={(value) =>
                value && onUpdate({ type: value as MessageType })
              }
              className="justify-start"
            >
              <ToggleGroupItem
                value="sent"
                aria-label="Sent message"
                data-testid="toggle-sent"
                className="flex-1"
              >
                <SendHorizontal className="w-4 h-4 mr-2" />
                Sent
              </ToggleGroupItem>
              <ToggleGroupItem
                value="received"
                aria-label="Received message"
                data-testid="toggle-received"
                className="flex-1"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Received
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender">Sender Name</Label>
            <Input
              id="sender"
              value={message.sender}
              onChange={(e) => onUpdate({ sender: e.target.value })}
              placeholder="Enter sender name"
              data-testid="input-sender"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Message Text</Label>
            <Textarea
              id="text"
              value={message.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Enter message text"
              rows={4}
              data-testid="input-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timestamp">Timestamp</Label>
            <Input
              id="timestamp"
              value={message.timestamp}
              onChange={(e) => onUpdate({ timestamp: e.target.value })}
              placeholder="e.g., 10:30 AM"
              data-testid="input-timestamp"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="read-status">Read Status</Label>
            <Switch
              id="read-status"
              checked={message.isRead}
              onCheckedChange={(checked) => onUpdate({ isRead: checked })}
              data-testid="switch-read-status"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
