import { Message } from "@shared/schema";
import { Heart } from "lucide-react";

interface InstagramChatProps {
  messages: Message[];
  selectedMessageId: string | null;
  onMessageSelect: (id: string) => void;
}

export function InstagramChat({
  messages,
  selectedMessageId,
  onMessageSelect,
}: InstagramChatProps) {
  return (
    <div className="w-full aspect-[9/16] max-h-[600px] bg-white dark:bg-black flex flex-col">
      <div className="bg-white dark:bg-black px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-0.5">
          <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              JD
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-gray-900 dark:text-white font-semibold text-sm">
            johndoe
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">
            Active now
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-white dark:bg-black">
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
                  max-w-[75%] rounded-3xl px-4 py-2 cursor-pointer transition-all
                  ${
                    isSent
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  }
                  ${
                    isSelected
                      ? "ring-2 ring-pink-500 ring-offset-2 ring-offset-white dark:ring-offset-black"
                      : ""
                  }
                `}
              >
                <div className="text-sm break-words whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-black px-4 py-3 flex items-center gap-2 border-t border-gray-200 dark:border-gray-800">
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Message...
          </span>
        </div>
        <Heart className="w-6 h-6 text-gray-900 dark:text-white" />
      </div>
    </div>
  );
}
