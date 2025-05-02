
import React from 'react';
import { User } from 'lucide-react';
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
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          isUser ? "bg-gradient-to-br from-blue-400 to-blue-600" : "bg-gradient-to-br from-avatar-primary to-avatar-secondary"
        )}
      >
        {isUser ? (
          <User size={18} className="text-white" />
        ) : (
          <div className="w-6 h-6 flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" 
                fill="currentColor" 
              />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-sm mb-1 flex items-center">
          {isUser ? (
            <span className="text-blue-600 dark:text-blue-400">You</span>
          ) : (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-avatar-primary to-avatar-secondary">AVATAR</span>
          )}
        </div>
        <div className={cn(
          "p-4 rounded-xl text-sm md:text-base leading-relaxed message-bubble",
          isUser 
            ? "message-user text-slate-800 dark:text-slate-200" 
            : "message-avatar"
        )}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
