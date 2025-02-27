
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
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
      <div 
        className={cn(
          "relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center",
          "transition-all duration-500 ease-in-out animate-float",
          "bg-gradient-to-br from-avatar-light to-avatar-primary shadow-lg",
          "dark:from-avatar-dark dark:to-gray-800",
          animate && "scale-110 transition-transform",
          isThinking && "avatar-pulse"
        )}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/20 dark:to-white/10" />
        
        <Sparkles 
          className={cn(
            "h-12 w-12 text-gray-700 dark:text-gray-300 transition-all duration-500",
            animate && "text-amber-500 scale-110",
            isThinking && "animate-pulse-subtle"
          )} 
        />
        
        {isThinking && (
          <div className="absolute -bottom-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1 text-xs font-medium shadow-md animate-pulse-subtle">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 animate-pulse-subtle" style={{ zIndex: -1 }} />
      </div>
      <h2 className="mt-4 text-lg font-medium text-slate-800 dark:text-slate-200">Inquisitive AI</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">Ask me anything</p>
    </div>
  );
};

export default Avatar;
