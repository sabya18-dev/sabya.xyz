import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hey! I'm Sabya's Chatbot. Ask me anything about the portfolio, skills, or projects!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const genAI = useRef(new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const model = genAI.current.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const chat = model.startChat({
        history: messages
          .filter(msg => msg.sender !== 'bot' || msg.text !== "👋 Hey! I'm Sabya's Chatbot. Ask me anything about the portfolio, skills, or projects!")
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          })),
      });

      const result = await chat.sendMessage(inputValue);
      const responseText = result.response.text();

      const botMessage = {
        id: messages.length + 2,
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-blue to-cyan-500 hover:shadow-lg hover:shadow-blue/50 transition-all duration-300 flex items-center justify-center z-40 hover:scale-110 group"
      >
        {isOpen ? (
          <FaTimes className="text-white text-2xl" />
        ) : (
          <FaRobot className="text-white text-2xl group-hover:scale-125 transition-transform" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 h-screen md:h-[600px] bg-dark border border-blue/30 rounded-2xl shadow-2xl shadow-blue/20 flex flex-col z-50 animate-slideUp overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue to-cyan-500 p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Sabya's Chatbot</h3>
              <p className="text-xs text-blue-100">Powered by Gemini 2.5 Flash</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue/80 text-white rounded-br-none'
                      : 'bg-darkBg/80 text-gray-300 border border-blue/30 rounded-bl-none'
                  } animate-fadeIn`}
                >
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-darkBg/80 text-gray-300 border border-blue/30 px-4 py-2 rounded-2xl rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-blue/30 bg-dark">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me something..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-darkBg/80 border border-blue/30 focus:border-blue focus:outline-none text-white placeholder-gray-500 transition-colors text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-blue to-cyan-500 hover:shadow-lg hover:shadow-blue/50 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <FaPaperPlane />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
