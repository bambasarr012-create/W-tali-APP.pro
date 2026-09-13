import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

const DAILY_LIMIT = 5;

export default function AICoachWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [questionsLeft, setQuestionsLeft] = useState(DAILY_LIMIT);
  const messagesEndRef = useRef(null);

  // Initialize from local storage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedData = JSON.parse(localStorage.getItem('wetali_coach_data')) || {};
    
    if (storedData.date !== today) {
      // Reset for new day
      setQuestionsLeft(DAILY_LIMIT);
      setMessages([
        {
          id: 1,
          sender: 'coach',
          text: "Salam ! Je suis ton Coach Wétali. Je suis là pour t'aider à optimiser ton profil ou te donner des conseils pour engager la conversation dans le respect. Comment puis-je t'aider aujourd'hui ?",
          timestamp: new Date().toISOString()
        }
      ]);
      localStorage.setItem('wetali_coach_data', JSON.stringify({ date: today, left: DAILY_LIMIT }));
    } else {
      setQuestionsLeft(storedData.left);
      const savedMsgs = localStorage.getItem('wetali_coach_msgs');
      if (savedMsgs) {
        setMessages(JSON.parse(savedMsgs));
      }
    }
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('wetali_coach_msgs', JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || questionsLeft <= 0) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    
    const newLeft = questionsLeft - 1;
    setQuestionsLeft(newLeft);
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('wetali_coach_data', JSON.stringify({ date: today, left: newLeft }));

    // Simulate AI Response
    setTimeout(() => {
      let aiText = "C'est une excellente question. Mon conseil : sois authentique et respectueux dans ton approche. Mets en avant tes valeurs partagées.";
      
      const lowerInput = newMsg.text.toLowerCase();
      if (lowerInput.includes('profil')) {
        aiText = "Pour améliorer ton profil, assure-toi d'avoir une belle photo claire et d'avoir rempli ta bio avec sincérité en parlant de ta vision de la famille.";
      } else if (lowerInput.includes('message') || lowerInput.includes('parler')) {
        aiText = "Pour un premier message, le salam est idéal, suivi d'un point commun que tu as remarqué sur son profil (par exemple la même ville ou le même Dahira).";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'coach',
        text: aiText,
        timestamp: new Date().toISOString()
      }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#2D8659] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50 group"
          title="Coach IA"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#D4AF37] border-2 border-[#2D8659]"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-slate-200 overflow-hidden transform transition-all">
          {/* Header */}
          <div className="bg-[#0A2F4A] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Coach Wétali</h3>
                <p className="text-[10px] text-[#A0C0D6] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Assistant IA
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-slate-50 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#0A2F4A] text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                {questionsLeft} conseil{questionsLeft > 1 ? 's' : ''} restant{questionsLeft > 1 ? 's' : ''} aujourd'hui
              </span>
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={questionsLeft <= 0}
                placeholder={questionsLeft > 0 ? "Pose ta question..." : "Limite quotidienne atteinte"}
                className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:border-[#2D8659] disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || questionsLeft <= 0}
                className="p-2 bg-[#2D8659] text-white rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-[#236c47] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
