
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Eraser } from 'lucide-react';
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
          content: 'You are a helpful, friendly AI assistant named Inquisitive AI. Provide concise, accurate answers to user questions. Be conversational but efficient.'
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container max-w-4xl mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="mb-6">
          <Avatar isActive={isActiveAvatar} isThinking={isThinking} />
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="font-medium text-gray-800 dark:text-gray-200">Conversation</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearChat}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Eraser size={16} className="mr-1" /> Clear
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 chat-container">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-center p-4">
                <div>
                  <p className="mb-2">No messages yet.</p>
                  <p className="text-sm">Ask me anything using the input below!</p>
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
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                disabled={isThinking}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isThinking}
              >
                <SendHorizontal size={18} className="mr-2" />
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Powered by OpenAI GPT • Created with Lovable</p>
      </footer>
    </div>
  );
};

export default ChatInterface;
