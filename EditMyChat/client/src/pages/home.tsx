import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Platform, Message } from "@shared/schema";
import { PlatformSelector } from "@/components/platform-selector";
import { ChatCanvas } from "@/components/chat-canvas";
import { MessageEditor } from "@/components/message-editor";
import { UsageCounter } from "@/components/usage-counter";
import { PricingModal } from "@/components/pricing-modal";
import { Header } from "@/components/header";
import { nanoid } from "nanoid";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("whatsapp");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      type: "received",
      sender: "John Doe",
      text: "Hey! How are you doing?",
      timestamp: "10:30 AM",
      isRead: true,
    },
    {
      id: nanoid(),
      type: "sent",
      sender: "Me",
      text: "I'm great! Just working on something cool.",
      timestamp: "10:32 AM",
      isRead: true,
    },
  ]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/session"],
  });

  const useScreenshotMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/screenshot/use", {});
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/session"] });
    },
  });

  const handleExport = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "Session not loaded",
        variant: "destructive",
      });
      return;
    }

    // Check if user has screenshots available
    if (!session.isUnlimited && session.screenshotsUsed >= session.screenshotLimit) {
      setPricingModalOpen(true);
      return;
    }

    setIsExporting(true);

    try {
      const canvas = document.getElementById("chat-canvas");
      if (!canvas) {
        throw new Error("Chat canvas not found");
      }

      const screenshot = await html2canvas(canvas, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      // Convert to blob and download
      screenshot.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `chatsnap-${platform}-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);

          // Increment usage count
          useScreenshotMutation.mutate();

          toast({
            title: "Success",
            description: "Screenshot downloaded successfully!",
          });
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export screenshot",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const addMessage = () => {
    const newMessage: Message = {
      id: nanoid(),
      type: "sent",
      sender: "Me",
      text: "New message",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isRead: true,
    };
    setMessages([...messages, newMessage]);
    setSelectedMessageId(newMessage.id);
  };

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter((msg) => msg.id !== id));
    if (selectedMessageId === id) {
      setSelectedMessageId(null);
    }
  };

  const selectedMessage = messages.find((msg) => msg.id === selectedMessageId);

  if (sessionLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div
          className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <PlatformSelector platform={platform} onPlatformChange={setPlatform} />

        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
          <div className="w-full max-w-md">
            <ChatCanvas
              platform={platform}
              messages={messages}
              selectedMessageId={selectedMessageId}
              onMessageSelect={setSelectedMessageId}
              onAddMessage={addMessage}
              onDeleteMessage={deleteMessage}
              onExport={handleExport}
              isExporting={isExporting}
            />
          </div>
        </div>

        <MessageEditor
          message={selectedMessage}
          onUpdate={(updates) =>
            selectedMessage && updateMessage(selectedMessage.id, updates)
          }
        />
      </div>

      {session && (
        <UsageCounter
          used={session.screenshotsUsed}
          limit={session.screenshotLimit}
          isUnlimited={session.isUnlimited}
          onUpgrade={() => setPricingModalOpen(true)}
        />
      )}

      <PricingModal open={pricingModalOpen} onOpenChange={setPricingModalOpen} />
    </div>
  );
}
