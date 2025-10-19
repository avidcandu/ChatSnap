import { Message } from "@shared/schema";
import { Check, CheckCheck } from "lucide-react";

interface TelegramChatProps {
  messages: Message[];
  selectedMessageId: string | null;
  onMessageSelect: (id: string) => void;
}

export function TelegramChat({
  messages,
  selectedMessageId,
  onMessageSelect,
}: TelegramChatProps) {
  return (
    <div className="w-full aspect-[9/16] max-h-[600px] bg-[#0e1621] flex flex-col">
      <div className="bg-[#1c2733] px-4 py-3 flex items-center gap-3 border-b border-[#0e1621]">
        <div className="w-10 h-10 rounded-full bg-[#5288c1] flex items-center justify-center text-white font-medium">
          JD
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">John Doe</div>
          <div className="text-[#7a8b9a] text-xs">last seen recently</div>
        </div>
      </div>

      <div
        className="flex-1 p-4 space-y-2 overflow-y-auto"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: "#0e1621",
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
                  max-w-[75%] rounded-xl px-3 py-2 cursor-pointer transition-all
                  ${
                    isSent
                      ? "bg-[#2b5278] text-white rounded-br-sm"
                      : "bg-[#1c2733] text-white rounded-bl-sm"
                  }
                  ${isSelected ? "ring-2 ring-[#0088cc] ring-offset-2 ring-offset-[#0e1621]" : ""}
                `}
              >
                {!isSent && (
                  <div className="text-[#64a9dc] text-xs font-medium mb-1">
                    {msg.sender}
                  </div>
                )}
                <div className="text-sm break-words whitespace-pre-wrap">
                  {msg.text}
                </div>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-[#7a8b9a]">
                    {msg.timestamp}
                  </span>
                  {isSent && (
                    <span className="text-[#7a8b9a]">
                      {msg.isRead ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#64a9dc]" />
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

      <div className="bg-[#1c2733] px-4 py-3 flex items-center gap-2 border-t border-[#0e1621]">
        <div className="flex-1 bg-[#0e1621] rounded-full px-4 py-2">
          <span className="text-[#7a8b9a] text-sm">Message</span>
        </div>
      </div>
    </div>
  );
}
