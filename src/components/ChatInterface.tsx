
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Eraser, MoonStar, Sun, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Avatar from './Avatar';
import ChatMessage from './ChatMessage';
import { generateResponse, Message } from '@/services/openaiService';

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isActiveAvatar, setIsActiveAvatar] = useState(false);
  const [messages, setMessages] = useState<{ content: string; isUser: boolean }[]>([]);
  const [newMessageIndex, setNewMessageIndex] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (newMessageIndex !== null) {
      const timer = setTimeout(() => {
        setNewMessageIndex(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [messages, newMessageIndex]);

  useEffect(() => {
    // Set body class for theme
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    toast({
      title: "Theme changed",
      description: `Switched to ${theme === 'light' ? 'dark' : 'light'} mode`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setNewMessageIndex(messages.length);
    setInput('');
    setIsActiveAvatar(true);
    
    // Start thinking animation
    setIsThinking(true);

    try {
      // Convert messages for OpenAI API
      const apiMessages: Message[] = [
        {
          role: 'system',
          content: 'You are AVATAR, a helpful, friendly AI assistant. Provide concise, accurate answers to user questions. Be conversational but efficient.'
        },
        ...messages.map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        { role: 'user', content: input }
      ];

      // Get AI response
      const response = await generateResponse(apiMessages);
      
      // Add AI message
      const aiMessage = { content: response, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
      setNewMessageIndex(messages.length + 1);
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again.",
      });
    } finally {
      setIsThinking(false);
      setIsActiveAvatar(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "Your conversation has been reset.",
    });
  };

  return (
    <div className={`flex flex-col min-h-screen animated-bg ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50'}`}>
      <div className="container max-w-4xl mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="mb-8 relative">
          <div className="absolute top-0 right-0 flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-10 w-10 bg-white/70 dark:bg-gray-800/70 shadow-md hover:shadow-lg transition-all"
            >
              {theme === 'light' ? <MoonStar size={18} /> : <Sun size={18} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="rounded-full h-10 w-10 bg-white/70 dark:bg-gray-800/70 shadow-md hover:shadow-lg transition-all"
            >
              <Eraser size={18} />
            </Button>
          </div>
          <div className="flex justify-center">
            <Avatar isActive={isActiveAvatar} isThinking={isThinking} />
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col glass-panel rounded-2xl shadow-lg border border-avatar-accent/20">
          <div className="p-4 border-b border-avatar-accent/20 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Zap size={18} className="mr-2 text-avatar-primary" />
              AVATAR Chat
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 chat-container">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center p-4">
                <div className="max-w-md p-6 rounded-2xl bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm border border-avatar-accent/20 shadow-lg">
                  <div className="mb-4 w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-avatar-primary to-avatar-secondary flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 22L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 8H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13 16H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Welcome to AVATAR</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">How can I assist you today?</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  content={message.content} 
                  isUser={message.isUser} 
                  isNew={index === newMessageIndex}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-avatar-accent/20">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask AVATAR a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-avatar-accent border-avatar-accent/20 shadow-sm"
                disabled={isThinking}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isThinking}
                className="bg-gradient-to-br from-avatar-primary to-avatar-secondary hover:opacity-90 transition-opacity"
              >
                <SendHorizontal size={18} className="mr-2" />
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>AVATAR AI • Created with Lovable</p>
      </footer>
    </div>
  );
};

export default ChatInterface;
