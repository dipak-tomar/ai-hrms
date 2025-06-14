import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../stores/authStore';
import { io } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotResponse {
  message: {
    id: string;
    content: string;
    isFromBot: boolean;
    createdAt: string;
  };
  sessionId: string;
}

interface ChatHistoryMessage {
  id: string;
  content: string;
  isFromBot: boolean;
  createdAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;
    
    const socket = io(SOCKET_URL, {
      auth: {
        token
      }
    });
    
    socket.on('connect', () => {
      console.log('Socket connected');
      // Join user-specific room
      socket.emit('join-user', user.id);
    });
    
    socket.on('chatbot-response', (data: ChatbotResponse) => {
      console.log('Received chatbot response:', data);
      if (data.message) {
        const botMessage: Message = {
          id: data.message.id,
          content: data.message.content,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        
        // Set session ID if it's a new session
        if (data.sessionId && !sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem('chatSessionId', data.sessionId);
        }
      }
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });
    
    return () => {
      socket.disconnect();
    };
  }, [user, token, sessionId]);

  // Load chat history when component mounts
  useEffect(() => {
    if (!user) return;
    
    // Check if there's a stored session ID
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      fetchChatHistory(storedSessionId);
    } else {
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        content: "Hi! I'm your HR assistant. I can help you with leave balance, policies, and general HR questions. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat history for a session
  const fetchChatHistory = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      
      const data = await response.json();
      
      if (data.messages && data.messages.length > 0) {
        const formattedMessages: Message[] = data.messages.map((msg: ChatHistoryMessage) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.isFromBot ? 'bot' : 'user',
          timestamp: new Date(msg.createdAt)
        }));
        
        setMessages(formattedMessages);
      } else {
        // Add welcome message if no history
        const welcomeMessage: Message = {
          id: 'welcome',
          content: "Hi! I'm your HR assistant. I can help you with leave balance, policies, and general HR questions. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Add welcome message on error
      const welcomeMessage: Message = {
        id: 'welcome',
        content: "Hi! I'm your HR assistant. I can help you with leave balance, policies, and general HR questions. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  // Create a new chat session
  const createChatSession = async (title: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }
      
      const data = await response.json();
      setSessionId(data.id);
      localStorage.setItem('chatSessionId', data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // If no session exists, create one
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await createChatSession('New Chat');
      }
      
      // Send message to backend
      const response = await fetch(`${API_BASE_URL}/chat/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: currentSessionId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Response will come via WebSocket
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      // Show error message
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
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
                {message.content}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          
          {/* Invisible element for scrolling to bottom */}
          <div ref={messagesEndRef} />
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
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
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