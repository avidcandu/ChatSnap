import { Message } from "@shared/schema";
import { Check, CheckCheck } from "lucide-react";

interface WhatsAppChatProps {
  messages: Message[];
  selectedMessageId: string | null;
  onMessageSelect: (id: string) => void;
}

export function WhatsAppChat({
  messages,
  selectedMessageId,
  onMessageSelect,
}: WhatsAppChatProps) {
  return (
    <div className="w-full aspect-[9/16] max-h-[600px] bg-[#0a1014] flex flex-col">
      <div className="bg-[#1f2c33] px-4 py-3 flex items-center gap-3 border-b border-[#2a3942]">
        <div className="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center text-white font-semibold">
          JD
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">John Doe</div>
          <div className="text-[#8696a0] text-xs">online</div>
        </div>
      </div>

      <div
        className="flex-1 p-4 space-y-2 overflow-y-auto"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.map((msg) => {
          const isSent = msg.type === "sent";
          const isSelected = msg.id === selectedMessageId;

          return (
            <div
              key={msg.id}
              onClick={() => onMessageSelect(msg.id)}
              className={`flex ${isSent ? "justify-end" : "justify-start"}`}
              data-testid={`message-${msg.id}`}
            >
              <div
                className={`
                  max-w-[75%] rounded-lg px-3 py-2 cursor-pointer transition-all
                  ${
                    isSent
                      ? "bg-[#005c4b] text-white"
                      : "bg-[#1f2c33] text-white"
                  }
                  ${isSelected ? "ring-2 ring-[#25d366] ring-offset-2 ring-offset-[#0a1014]" : ""}
                `}
              >
                {!isSent && (
                  <div className="text-[#25d366] text-xs font-medium mb-1">
                    {msg.sender}
                  </div>
                )}
                <div className="text-sm break-words whitespace-pre-wrap">
                  {msg.text}
                </div>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-[#8696a0]">
                    {msg.timestamp}
                  </span>
                  {isSent && (
                    <span className="text-[#8696a0]">
                      {msg.isRead ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#1f2c33] px-4 py-2 flex items-center gap-2 border-t border-[#2a3942]">
        <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2">
          <span className="text-[#8696a0] text-sm">Type a message</span>
        </div>
      </div>
    </div>
  );
}
