
import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChatMessageProps = {
  content: string;
  isUser: boolean;
  isNew?: boolean;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser, isNew = false }) => {
  return (
    <div 
      className={cn(
        "flex gap-3 mb-4 opacity-0",
        isNew && "chat-message-appear",
        !isNew && "opacity-100"
      )}
    >
      <div 
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-violet-100 dark:bg-violet-900" : "bg-emerald-100 dark:bg-emerald-900"
        )}
      >
        {isUser ? (
          <User size={16} className="text-violet-600 dark:text-violet-300" />
        ) : (
          <Bot size={16} className="text-emerald-600 dark:text-emerald-300" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-sm mb-1">
          {isUser ? 'You' : 'AI Assistant'}
        </div>
        <div className={cn(
          "p-3 rounded-lg text-sm md:text-base leading-relaxed",
          isUser 
            ? "bg-violet-50 dark:bg-violet-900/30 text-slate-800 dark:text-slate-200" 
            : "glass-panel"
        )}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
