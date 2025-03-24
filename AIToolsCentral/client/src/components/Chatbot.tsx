import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Bot, User, Send, BellRing, AlertCircle, Search } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import aiData from '@/data/aiData.json';
import { Category, Tool, Resource } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface Message {
  text: string;
  isUser: boolean;
  isMenu?: boolean;
  isNotification?: boolean;
  options?: Array<{
    text: string;
    value: string;
  }>;
}

interface SearchResult {
  type: 'tool' | 'resource';
  name: string;
  url: string;
  category?: string;
}

const Chatbot: React.FC = () => {
  const { chatbotOpen, setChatbotOpen } = useAppContext();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hello! Welcome to PoornaGPT. How can I help you today?", 
      isUser: false,
      isMenu: true,
      options: [
        { text: "Explore AI Tools", value: "explore" },
        { text: "Find Deployment Options", value: "deployment" },
        { text: "Search All Resources", value: "search" },
        { text: "Learn about PoornaGPT", value: "about" }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
  };

  const minimizeChatbot = () => {
    setChatbotOpen(false);
  };

  const searchTools = (query: string): SearchResult[] => {
    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // If query directly mentions an AI tool by name, prioritize that match
    if (normalizedQuery.includes('ai') || normalizedQuery.includes('model')) {
      // Specific AI models and tools to match
      const commonAIQueries = [
        { name: 'ChatGPT', match: ['chatgpt', 'gpt', 'openai'] },
        { name: 'GPT-4', match: ['gpt-4', 'gpt4'] },
        { name: 'Claude', match: ['claude', 'anthropic'] },
        { name: 'Gemini', match: ['gemini', 'google ai'] },
        { name: 'Llama', match: ['llama', 'meta ai'] },
        { name: 'DALL-E', match: ['dall-e', 'dalle', 'image'] },
        { name: 'Midjourney', match: ['midjourney', 'mid journey'] },
        { name: 'Stable Diffusion', match: ['stable diffusion', 'stability'] },
        { name: 'Whisper', match: ['whisper', 'speech'] },
        { name: 'Langchain', match: ['langchain', 'chain'] }
      ];

      for (const aiTool of commonAIQueries) {
        if (aiTool.match.some(term => normalizedQuery.includes(term))) {
          // Search for this specific AI tool in our categories
          let found = false;
          
          aiData.categories.forEach(category => {
            category.tools.forEach(tool => {
              if (tool.name.toLowerCase().includes(aiTool.name.toLowerCase())) {
                results.push({
                  type: 'tool',
                  name: tool.name,
                  url: tool.url,
                  category: category.name
                });
                found = true;
              }
            });
          });

          // If not found in our specific categories, still add as a result with "Coming Soon"
          if (!found) {
            results.push({
              type: 'tool',
              name: aiTool.name,
              url: '#',
              category: 'Coming Soon'
            });
          }
        }
      }
      
      // If we found specific AI matches, return them
      if (results.length > 0) {
        return results;
      }
    }

    // Otherwise, continue with general search
    // Search in categories and tools
    aiData.categories.forEach(category => {
      category.tools.forEach(tool => {
        if (tool.name.toLowerCase().includes(normalizedQuery)) {
          results.push({
            type: 'tool',
            name: tool.name,
            url: tool.url,
            category: category.name
          });
        }
      });
    });

    // Search in datasets
    const datasets = aiData.datasets as Array<{name: string, url: string}>;
    datasets.forEach(dataset => {
      if (dataset.name.toLowerCase().includes(normalizedQuery)) {
        results.push({
          type: 'resource',
          name: dataset.name,
          url: dataset.url,
          category: 'datasets'
        });
      }
    });

    // Search in databases
    const databases = aiData.databases as Array<{name: string, url: string}>;
    databases.forEach(database => {
      if (database.name.toLowerCase().includes(normalizedQuery)) {
        results.push({
          type: 'resource',
          name: database.name,
          url: database.url,
          category: 'databases'
        });
      }
    });

    // Search in hosting
    const hosting = aiData.hosting as Array<{name: string, url: string}>;
    hosting.forEach(host => {
      if (host.name.toLowerCase().includes(normalizedQuery)) {
        results.push({
          type: 'resource',
          name: host.name,
          url: host.url,
          category: 'hosting'
        });
      }
    });

    return results;
  };

  const addMenuResponse = (category: string) => {
    let responseText = '';
    let options: Array<{text: string, value: string}> = [];

    switch (category) {
      case 'explore':
        responseText = "Which AI category would you like to explore?";
        options = aiData.categories.map(cat => ({
          text: cat.name,
          value: `category_${cat.name}`
        }));
        break;
      case 'deployment':
        responseText = "Here are deployment options I can tell you about:";
        options = [
          { text: "Frontend Deployment", value: "frontend_deploy" },
          { text: "Backend Deployment", value: "backend_deploy" },
          { text: "Database Hosting", value: "database_hosting" },
          { text: "Serverless Options", value: "serverless" }
        ];
        break;
      case 'search':
        responseText = "What would you like to search for? Type anything related to AI tools or resources.";
        break;
      case 'about':
        setMessages(prev => [
          ...prev,
          {
            text: "PoornaGPT is a comprehensive hub for AI-related resources and tools. We've categorized over 200 AI tools across multiple categories, along with datasets, databases, and hosting resources. You can explore by category, search for specific tools, or ask me for recommendations!",
            isUser: false
          }
        ]);
        return;
      case 'frontend_deploy':
        responseText = "Popular frontend deployment platforms:";
        aiData.hosting.slice(0, 7).forEach(host => {
          responseText += `\n• ${host.name}: ${host.url}`;
        });
        break;
      case 'backend_deploy':
        responseText = "Popular backend deployment platforms:";
        const backendPlatforms = aiData.hosting.slice(7, 15);
        backendPlatforms.forEach(host => {
          responseText += `\n• ${host.name}: ${host.url}`;
        });
        break;
      case 'database_hosting':
        responseText = "Popular database solutions:";
        aiData.databases.slice(0, 7).forEach(db => {
          responseText += `\n• ${db.name}: ${db.url}`;
        });
        break;
      case 'serverless':
        responseText = "Serverless deployment options:";
        const serverlessPlatforms = [
          "AWS Lambda", "Google Cloud Functions", "Azure Functions", 
          "Vercel Serverless", "Netlify Functions", "Cloudflare Workers"
        ];
        serverlessPlatforms.forEach(platform => {
          responseText += `\n• ${platform}`;
        });
        break;
      default:
        if (category.startsWith('category_')) {
          const categoryName = category.replace('category_', '');
          const categoryData = aiData.categories.find(cat => cat.name === categoryName);
          
          if (categoryData) {
            responseText = `Here are some popular ${categoryName} tools:`;
            categoryData.tools.slice(0, 7).forEach(tool => {
              responseText += `\n• ${tool.name}: ${tool.url}`;
            });
          } else {
            responseText = "I couldn't find information about that category.";
          }
        } else {
          responseText = "I'm not sure what you're looking for. Please try again.";
        }
    }

    setMessages(prev => [
      ...prev,
      {
        text: responseText,
        isUser: false,
        isMenu: options.length > 0,
        options: options.length > 0 ? options : undefined
      }
    ]);
  };

  const handleOptionClick = (option: string) => {
    setMessages(prev => [...prev, { text: option.split('_').join(' ').replace(/category /g, ''), isUser: true }]);
    addMenuResponse(option);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (!message) return;

    // Add user message
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setInputValue('');

    // Check if the query contains AI model names or directly mentions an AI tool
    const lowerMessage = message.toLowerCase();
    if (
      lowerMessage.includes('chatgpt') || 
      lowerMessage.includes('gpt') || 
      lowerMessage.includes('claude') ||
      lowerMessage.includes('gemini') ||
      lowerMessage.includes('llama') ||
      lowerMessage.includes('dall-e') ||
      lowerMessage.includes('midjourney') ||
      lowerMessage.includes('whisper')
    ) {
      const results = searchTools(message);
      
      if (results.length > 0) {
        let responseText = `Here's what I found about "${message}":\n\n`;
        
        results.forEach(result => {
          if (result.category === 'Coming Soon') {
            responseText += `• ${result.name}: Coming soon! We'll notify you when it's available.\n`;
            
            // Show toast for "Coming Soon" items
            toast({
              title: "AI Tool Coming Soon",
              description: `${result.name} will be available soon!`,
              variant: "default",
              duration: 5000,
              action: (
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Coming soon</span>
                </div>
              ),
            });
            
          } else {
            responseText += `• ${result.name} (${result.category}): ${result.url}\n`;
          }
        });
        
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              text: responseText,
              isUser: false
            }
          ]);
        }, 1000);
      } else {
        // Handle AI model that wasn't found
        setPendingRequests(prev => [...prev, message]);
        
        // Show toast notification
        toast({
          title: "AI Tool Coming Soon",
          description: `"${message}" will be available soon!`,
          variant: "default",
          duration: 5000,
          action: (
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Coming soon</span>
            </div>
          ),
        });
        
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              text: `I couldn't find specific information about "${message}". I've added this to our list of requested AI tools and we'll notify you when it becomes available.`,
              isUser: false,
              isNotification: true
            }
          ]);
        }, 1000);
      }
      return;
    }
    
    // Check if it's a search query
    if (message.toLowerCase().includes('search') || messages.some(m => m.text.includes("What would you like to search for?"))) {
      const searchQuery = message.toLowerCase().replace('search', '').replace('for', '').trim();
      const results = searchTools(searchQuery);

      if (results.length > 0) {
        let responseText = `Here are the results for "${searchQuery}":\n\n`;
        
        results.slice(0, 5).forEach(result => {
          responseText += `• ${result.name} (${result.category}): ${result.url}\n`;
        });
        
        if (results.length > 5) {
          responseText += `\nAnd ${results.length - 5} more results.`;
        }
        
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              text: responseText,
              isUser: false
            }
          ]);
        }, 1000);
      } else {
        // Add to pending requests and show notification
        setPendingRequests(prev => [...prev, searchQuery]);
        
        // Show toast notification
        toast({
          title: "Resource not found",
          description: `"${searchQuery}" will be available soon!`,
          variant: "default",
          duration: 5000,
          action: (
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Coming soon</span>
            </div>
          ),
        });
        
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              text: `I couldn't find any results for "${searchQuery}". I've added this to our list of requested resources and we'll notify you when they become available.`,
              isUser: false,
              isNotification: true
            }
          ]);
        }, 1000);
      }
      return;
    }

    // Response for general questions
    setTimeout(() => {
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        setMessages(prev => [
          ...prev,
          {
            text: "Hello! How can I help you today?",
            isUser: false,
            isMenu: true,
            options: [
              { text: "Explore AI Tools", value: "explore" },
              { text: "Find Deployment Options", value: "deployment" },
              { text: "Search All Resources", value: "search" },
              { text: "Learn about PoornaGPT", value: "about" }
            ]
          }
        ]);
      } else if (
        lowerMessage.includes('thank') || 
        lowerMessage.includes('thanks') || 
        lowerMessage.includes('appreciated')
      ) {
        setMessages(prev => [
          ...prev,
          {
            text: "You're welcome! Is there anything else I can help you with?",
            isUser: false
          }
        ]);
      } else if (
        lowerMessage.includes('tools') || 
        lowerMessage.includes('ai') || 
        lowerMessage.includes('explore')
      ) {
        addMenuResponse('explore');
      } else if (
        lowerMessage.includes('deploy') || 
        lowerMessage.includes('hosting') || 
        lowerMessage.includes('server')
      ) {
        addMenuResponse('deployment');
      } else {
        setMessages(prev => [
          ...prev,
          {
            text: "I'm not sure I understand. Would you like to try one of these options?",
            isUser: false,
            isMenu: true,
            options: [
              { text: "Explore AI Tools", value: "explore" },
              { text: "Find Deployment Options", value: "deployment" },
              { text: "Search All Resources", value: "search" },
              { text: "Learn about PoornaGPT", value: "about" }
            ]
          }
        ]);
      }
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot Toggle Button */}
      <button
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg text-white flex items-center justify-center transition-all duration-200"
        onClick={toggleChatbot}
        aria-label={chatbotOpen ? 'Close chatbot' : 'Open chatbot'}
      >
        {chatbotOpen ? <X size={24} /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>}
      </button>
      
      {/* Chatbot Dialog */}
      {chatbotOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200">
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <h3 className="font-medium">PoornaGPT Assistant</h3>
            <button 
              className="text-white hover:text-gray-200 focus:outline-none"
              onClick={minimizeChatbot}
              aria-label="Minimize chatbot"
            >
              <Minus size={18} />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start ${message.isUser ? 'justify-end' : ''}`}
              >
                {!message.isUser && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white">
                      <Bot size={16} />
                    </div>
                  </div>
                )}
                <div className={`${
                  message.isUser 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                } rounded-lg py-2 px-4 max-w-xs ${message.isUser ? 'ml-3' : ''}`}>
                  {message.isNotification && (
                    <div className="flex items-center mb-2 text-yellow-500">
                      <BellRing size={16} className="mr-1" />
                      <span className="text-xs font-medium">Request Pending</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{message.text}</p>
                  
                  {message.isMenu && message.options && (
                    <div className="mt-3 flex flex-col space-y-2">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          className="text-left px-3 py-1.5 rounded-md text-sm bg-white dark:bg-gray-600 text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-500 transition-colors"
                          onClick={() => handleOptionClick(option.value)}
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {message.isUser && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300">
                      <User size={16} />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <form className="flex" onSubmit={handleSubmit}>
              <input
                type="text"
                className="flex-1 rounded-l-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary transition-colors"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-4 rounded-r-md transition-colors"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
