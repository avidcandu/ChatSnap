import { Message } from "@shared/schema";

interface DiscordChatProps {
  messages: Message[];
  selectedMessageId: string | null;
  onMessageSelect: (id: string) => void;
}

export function DiscordChat({
  messages,
  selectedMessageId,
  onMessageSelect,
}: DiscordChatProps) {
  return (
    <div className="w-full aspect-[9/16] max-h-[600px] bg-[#313338] flex flex-col">
      <div className="bg-[#313338] px-4 py-3 flex items-center gap-3 border-b border-[#1e1f22] shadow-sm">
        <div className="text-[#949ba4] text-xl font-bold">#</div>
        <div className="flex-1">
          <div className="text-white font-semibold text-base">general</div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#313338]">
        {messages.map((msg) => {
          const isSelected = msg.id === selectedMessageId;
          const isSent = msg.type === "sent";

          return (
            <div
              key={msg.id}
              onClick={() => onMessageSelect(msg.id)}
              className={`
                flex gap-3 hover:bg-[#2e3035] px-2 py-1 rounded cursor-pointer transition-all
                ${isSelected ? "bg-[#2e3035] ring-2 ring-[#5865f2] ring-offset-2 ring-offset-[#313338]" : ""}
              `}
              data-testid={`message-${msg.id}`}
            >
              <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {msg.sender.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className={`font-medium text-sm ${
                      isSent ? "text-[#00a8fc]" : "text-[#f2f3f5]"
                    }`}
                  >
                    {msg.sender}
                  </span>
                  <span className="text-[#949ba4] text-xs">
                    {msg.timestamp}
                  </span>
                </div>
                <div className="text-[#dbdee1] text-sm break-words whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#383a40] mx-4 mb-4 rounded-lg px-4 py-3">
        <span className="text-[#6d6f78] text-sm">
          Message #general
        </span>
      </div>
    </div>
  );
}
