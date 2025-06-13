import React, { useState } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';
import clsx from 'clsx';

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi! I\'m your HR assistant. I can help you with leave balance, policies, and general HR questions. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your question! This is a demo response. In a real implementation, this would connect to your HR chatbot service.',
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-primary text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center z-50',
          isOpen && 'hidden'
        )}
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Chat window */}
      <div className={clsx(
        'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] max-w-sm sm:w-80 h-[70vh] sm:h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 transition-all duration-300',
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white rounded-t-lg">
          <div className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">HR Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                'flex',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={clsx(
                  'max-w-[85%] px-3 py-2 rounded-lg text-sm',
                  message.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-primary'
                )}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="px-3 py-2 bg-primary text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatbotWidget;