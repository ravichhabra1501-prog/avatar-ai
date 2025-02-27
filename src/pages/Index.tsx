
import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import CustomFooter from '@/components/CustomFooter';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <ChatInterface />
      </div>
      <CustomFooter />
    </div>
  );
};

export default Index;
