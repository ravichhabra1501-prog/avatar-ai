
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type AvatarProps = {
  isActive: boolean;
  isThinking: boolean;
};

const Avatar: React.FC<AvatarProps> = ({ isActive, isThinking }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="avatar-ring"></div>
        <div className="avatar-ring"></div>
        
        <div 
          className={cn(
            "relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center",
            "transition-all duration-500 ease-in-out",
            "bg-gradient-to-br from-avatar-primary via-avatar-secondary to-avatar-accent shadow-lg",
            "dark:from-avatar-primary dark:via-avatar-secondary dark:to-avatar-accent",
            animate && "scale-110 transition-transform",
            isThinking && "avatar-pulse"
          )}
        >
          <div className="avatar-glow"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/20 dark:to-white/10" />
          
          <svg 
            className={cn(
              "h-16 w-16 text-white drop-shadow-md transition-all duration-500",
              animate && "scale-110",
              isThinking && "animate-pulse-subtle"
            )}
            viewBox="0 0 128 128" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M64 12C35.9 12 13 34.9 13 63C13 91.1 35.9 114 64 114C92.1 114 115 91.1 115 63C115 34.9 92.1 12 64 12ZM64 24C70.6 24 76 29.4 76 36C76 42.6 70.6 48 64 48C57.4 48 52 42.6 52 36C52 29.4 57.4 24 64 24ZM64 98C53 98 43.2 92.2 37 83.2C37.2 73.1 57.4 67.5 64 67.5C70.6 67.5 90.8 73.1 91 83.2C84.8 92.2 75 98 64 98Z" 
              fill="currentColor" 
            />
          </svg>
          
          {isThinking && (
            <div className="absolute -bottom-3 bg-white dark:bg-gray-800 rounded-full px-4 py-1.5 text-xs font-medium shadow-md animate-pulse-subtle z-20">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div className="absolute -inset-1.5 bg-gradient-to-r from-avatar-glow to-avatar-accent rounded-full blur opacity-30 animate-pulse-subtle" style={{ zIndex: -1 }} />
        </div>
      </div>
      <h2 className="mt-5 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-avatar-primary to-avatar-secondary dark:from-avatar-primary dark:to-avatar-secondary">AVATAR</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Your Virtual Companion</p>
    </div>
  );
};

export default Avatar;
