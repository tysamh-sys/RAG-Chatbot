import { useState, useRef, useEffect } from 'react';
import { Send, FileText, Users, Calculator, Calendar, Menu, X, Moon, Sun } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour! Je suis votre assistant RAG pour les responsabilités du Gérant d'une SUARL tunisienne. Comment puis-je vous aider aujourd'hui?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const sidebarSections = [
    {
      id: 1,
      title: 'Legal Responsibilities',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      title: 'Human Resources & Asset Management',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 3,
      title: 'Fiscal & Social Obligations',
      icon: Calculator,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 4,
      title: 'Monthly/Quarterly/Annual Tasks',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    const newMessage: Message = {
      id: messages.length + 1,
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userText }),
      });
      const data = await response.json();

      const botResponse: Message = {
        id: messages.length + 2,
        text: data.answer || "Désolé, une erreur s'est produite lors de la génération de la réponse.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorResponse: Message = {
        id: messages.length + 2,
        text: "Erreur de connexion au serveur RAG.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionClick = async (sectionTitle: string) => {
    if (isLoading) return;

    // Auto-close sidebar on mobile after clicking
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    const newMessage: Message = {
      id: messages.length + 1,
      text: `Dites-m'en plus sur: ${sectionTitle}`,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const encodedSection = encodeURIComponent(sectionTitle);
      const response = await fetch(`/api/chat/section/${encodedSection}`);
      const data = await response.json();

      const botResponse: Message = {
        id: messages.length + 2,
        text: data.answer || "Désolé, aucune donnée trouvée pour cette section.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error fetching section data:', error);
      const errorResponse: Message = {
        id: messages.length + 2,
        text: "Erreur de connexion au serveur RAG.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`size-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-4 md:px-6 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`md:hidden p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
          >
            {sidebarOpen ? <X size={24} className={darkMode ? 'text-gray-200' : 'text-gray-900'} /> : <Menu size={24} className={darkMode ? 'text-gray-200' : 'text-gray-900'} />}
          </button>
          <h1 className={`text-xl md:text-2xl ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>RAG Gérant Assistant</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} hidden sm:block`}>SUARL Tunisia</div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 ${darkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'} rounded-lg transition-colors`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 fixed md:relative z-30 w-72 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transition-transform duration-300 h-full`}
        >
          <div className="p-4 md:p-6">
            <h2 className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Main Sections</h2>
            <div className="space-y-2">
              {sidebarSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.title)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors text-left group`}
                  >
                    <div className={`${darkMode ? 'bg-gray-700' : section.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className={section.color} size={20} />
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex-1`}>
                      {section.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-center`}>
              Developed by Sameh Otay
            </p>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className={`md:hidden fixed inset-0 ${darkMode ? 'bg-black/40' : 'bg-black/20'} z-20`}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <main className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-4">
               {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : darkMode
                          ? 'bg-gray-800 text-gray-200 border border-gray-700'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">
                      {message.text}
                    </p>
                    <p
                      className={`text-xs mt-1 ${message.sender === 'user'
                          ? 'text-blue-100'
                          : darkMode
                            ? 'text-gray-500'
                            : 'text-gray-400'
                        }`}
                    >
                      {message.timestamp.toLocaleTimeString('fr-TN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} px-4 py-4 md:px-8`}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-2 md:gap-3">
                <div className={`flex-1 ${darkMode ? 'bg-gray-700 border-gray-600 focus-within:border-blue-500 focus-within:ring-blue-900' : 'bg-gray-50 border-gray-200 focus-within:border-blue-500 focus-within:ring-blue-100'} rounded-2xl border focus-within:ring-2 transition-all`}>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez votre question sur les responsabilités du Gérant..."
                    className={`w-full px-4 py-3 bg-transparent resize-none outline-none text-sm md:text-base max-h-32 ${darkMode ? 'text-gray-200 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
                    rows={1}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 md:p-3.5 rounded-2xl transition-colors flex-shrink-0"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2 text-center`}>
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}