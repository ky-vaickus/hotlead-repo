import React, { useState, useRef, useEffect } from 'react';
import { AgentType, Message, Candidate } from '../types';
import { ArrowLeft, Send, Upload, User, Mail, Phone, Linkedin, X, Download, ArrowRight, ShieldAlert, Briefcase } from 'lucide-react';
import { generateAgentResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  agentType: AgentType;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ agentType, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSales = agentType === AgentType.SALES;

  const suggestions = [
    isSales ? "How do I find decision makers?" : "How accurate is candidate matching?",
    isSales ? "Can I export leads to Salesforce?" : "What data is included in profiles?",
    isSales ? "What's the pricing model?" : "Can this integrate with our ATS?",
    isSales ? "How accurate is the contact info?" : "What's the cost per hire?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Format history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const response = await generateAgentResponse(text, history, agentType);
      
      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, newModelMessage]);
      if (response.candidates && response.candidates.length > 0) {
        setCandidates(response.candidates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Determine layout: centered if no candidates, split if candidates exist
  const hasResults = candidates.length > 0;

  return (
    <div className="flex h-screen bg-brand-offwhite overflow-hidden font-sans text-brand-black">
      
      {/* Main Chat Area */}
      <div className={`flex flex-col h-full transition-all duration-700 ease-out ${hasResults ? 'w-full lg:w-1/2 border-r border-gray-200' : 'w-full max-w-5xl mx-auto'}`}>
        
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 bg-brand-offwhite/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center text-gray-500 hover:text-brand-black transition-colors font-medium font-mono text-sm uppercase tracking-wide"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <h1 className="text-2xl font-serif font-bold text-brand-black">
              {isSales ? 'Sales Agent' : 'Recruiting Agent'}
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              {isSales ? 'Sales' : 'Recruiting'} mode (100%)
            </p>
          </div>

          {/* Guest Mode Badge - Moved to Top Right */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-orange-200 text-orange-600 text-xs font-medium shadow-sm hover:bg-orange-50 transition-colors cursor-pointer">
            <ShieldAlert size={12} />
            <span>Guest Mode</span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 scroll-smooth">
          
          {/* Empty State / Welcome */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-10 animate-fade-in">
              <div className="text-center space-y-4">
                <h2 className="text-5xl md:text-6xl font-serif text-brand-black">
                  {isSales ? 'Sales Agent' : 'Recruiting Agent'}
                </h2>
                <p className="text-xl text-gray-500 font-light font-serif italic max-w-lg mx-auto">
                  {isSales 
                    ? 'Discover companies and decision makers ready to buy.'
                    : 'Help you source qualified candidates from top companies for your open positions'}
                </p>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSendMessage(s)}
                    className="px-6 py-3 rounded-full border border-brand-purple/20 bg-white text-gray-700 hover:border-brand-purple hover:text-brand-purple transition-all text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-8 pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[80%] p-5 rounded-2xl rounded-tr-sm text-white bg-brand-gradient shadow-xl shadow-brand-purple/10">
                    <p className="text-lg leading-relaxed font-light">{msg.text}</p>
                  </div>
                ) : (
                  <div className="max-w-[90%] bg-transparent p-0">
                     <p className="text-xl leading-relaxed text-brand-black whitespace-pre-wrap font-serif">
                       {msg.text}
                     </p>
                  </div>
                )}
              </div>
            ))}
             {isTyping && (
                <div className="flex justify-start animate-pulse">
                   <div className="flex gap-2 p-2">
                     <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                     <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                     <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                   </div>
                </div>
             )}
            <div ref={messagesEndRef} />
          </div>

        </div>

        {/* Input Area */}
        <div className="p-8 bg-brand-offwhite border-t border-gray-100">
           {/* File Upload Placeholder */}
           {messages.length === 0 && (
             <div className="mb-8 border-2 border-dashed border-brand-purple/20 rounded-2xl bg-white/50 h-40 flex flex-col items-center justify-center text-gray-400 transition-colors hover:bg-white hover:border-brand-purple/40 cursor-pointer group">
                <Upload className="w-8 h-8 mb-3 text-brand-purple/50 group-hover:text-brand-purple group-hover:scale-110 transition-all" />
                <span className="font-medium text-base text-gray-600">Drop resume here or click to upload</span>
                <span className="text-sm text-gray-400 mt-1">PDF or TXT (Max 10MB)</span>
             </div>
           )}

           <div className="relative shadow-sm rounded-2xl bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-brand-purple/20 focus-within:border-brand-purple transition-all duration-300">
             <input 
               type="text"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder="How can I help?"
               className="w-full px-6 py-5 pr-16 rounded-2xl outline-none text-gray-800 placeholder-gray-400 bg-transparent text-lg font-light"
             />
             <button 
               onClick={() => handleSendMessage()}
               disabled={!inputValue.trim() && !isTyping}
               className={`absolute right-3 top-3 p-3 rounded-xl transition-all duration-300 ${inputValue.trim() ? 'bg-brand-gradient text-white shadow-lg shadow-brand-purple/20 transform hover:scale-105' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
             >
               <Send size={20} className={inputValue.trim() ? "ml-0.5" : ""} />
             </button>
           </div>
        </div>

      </div>

      {/* Candidate Results Panel (Sliding in) */}
      {hasResults && (
         <div className="w-full lg:w-1/2 bg-white h-full flex flex-col border-l border-gray-100 shadow-[0_0_50px_rgba(0,0,0,0.05)] animate-in slide-in-from-right duration-700 z-10">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
               <h2 className="text-2xl font-serif font-bold text-brand-black">Candidate Results</h2>
               <div className="flex gap-2 text-gray-400">
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-brand-purple"><Download size={20} /></button>
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-brand-black"><X size={20} onClick={() => setCandidates([])}/></button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FAFAFA]">
               {candidates.map((candidate, index) => (
                 <div key={candidate.id} className="flex gap-6 items-start animate-in slide-in-from-bottom-4 fade-in duration-700" style={{animationDelay: `${index * 150}ms`, animationFillMode: 'both'}}>
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-brand-gradient shadow-md mt-6">
                      {index + 1}
                    </div>

                    {/* Card */}
                    <div className="group relative flex-1">
                      {/* Gradient Border Effect for first item */}
                      <div className={`absolute -inset-[1px] rounded-[1.2rem] bg-gradient-to-r ${index === 0 ? 'from-brand-purple to-brand-teal opacity-100' : 'from-transparent to-transparent opacity-0'} transition-opacity duration-300`} />
                      
                      <div className="relative bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-purple/10 transition-all duration-300">
                        <div className="flex gap-5">
                            <div className="w-20 h-20 rounded-2xl bg-brand-offwhite flex items-center justify-center text-gray-300 flex-shrink-0 overflow-hidden relative">
                              {/* Simple initial based avatar if no image */}
                              <span className="text-2xl font-serif text-brand-purple font-bold absolute z-10">
                                {candidate.name.charAt(0)}
                              </span>
                              <div className="absolute inset-0 bg-brand-purple/5"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-serif font-bold text-brand-black truncate">{candidate.name}</h3>
                              <p className="text-gray-600 font-medium truncate">{candidate.title}</p>
                              <p className="text-gray-400 text-sm mt-0.5">{candidate.company}</p>

                              <div className="mt-5 space-y-3">
                                  {candidate.experience && (
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                      <Briefcase size={15} className="text-brand-teal" />
                                      <span className="font-medium text-brand-black/70">{candidate.experience}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-brand-black transition-colors">
                                    <Mail size={15} className="text-gray-400" />
                                    <span className="font-light truncate">{candidate.email || "email@example.com"}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-brand-black transition-colors">
                                    <Phone size={15} className="text-gray-400" />
                                    <span className="font-light truncate">{candidate.phone || "+1 (555) 000-0000"}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-brand-black transition-colors">
                                    <Linkedin size={15} className="text-gray-400" />
                                    <span className="font-light truncate text-brand-purple underline decoration-transparent hover:decoration-brand-purple transition-all cursor-pointer">
                                      {candidate.linkedin?.replace('https://', '') || "linkedin.com"}
                                    </span>
                                  </div>
                              </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                            <div className="text-xs font-semibold uppercase tracking-wider text-brand-purple bg-brand-purple/5 px-3 py-1.5 rounded-full">
                              Match: 9{9-index}%
                            </div>
                            <button className="text-sm font-medium text-gray-400 hover:text-brand-purple flex items-center gap-1 transition-colors group-hover/btn:translate-x-1">
                              View full profile <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
               <div className="h-20" /> {/* Bottom spacer */}
            </div>
         </div>
      )}
    </div>
  );
};

export default ChatInterface;