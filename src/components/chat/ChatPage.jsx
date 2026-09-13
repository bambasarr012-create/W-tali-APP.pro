import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { subscribeToMessages, sendMessage, markMessagesAsRead, initDemoConversation } from '../../services/chatService';
import { 
  ArrowLeft, 
  Send, 
  Check, 
  CheckCheck, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  MessageCircle, 
  Heart, 
  Info,
  Mic,
  Square
} from 'lucide-react';
import VerifiedBadge from '../common/VerifiedBadge';

export default function ChatPage() {
  const { activeMatch, setCurrentView, viewProfileDetail } = useApp();
  const { userProfile } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const partner = activeMatch?.otherUser || {
    id: "partner_demo",
    prenom: "Aïssatou",
    ville: "Paris",
    profession: "Ingénieure Cybersécurité",
    photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"]
  };

  const chatId = activeMatch?.id || 'match_demo_1';

  useEffect(() => {
    // Initialise une conversation de départ si besoin
    initDemoConversation(chatId, partner.prenom);

    // Écouteur temps réel (Firestore onSnapshot / Local sync)
    const unsubscribe = subscribeToMessages(chatId, (newMsgs) => {
      setMessages(newMsgs);
    });

    // Marquer les messages comme lus
    markMessagesAsRead(chatId, userProfile?.id || 'current_user');

    return () => {
      unsubscribe();
    };
  }, [chatId, partner.prenom, userProfile]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer pour l'enregistrement
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          setIsSending(true);
          await sendMessage(chatId, userProfile?.id || 'current_user', '', { type: 'audio', audioData: reader.result });
          setIsSending(false);
        };
      };
      
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');
    setIsSending(true);

    try {
      await sendMessage(chatId, userProfile?.id || 'current_user', textToSend);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const quickStarters = [
    "Assalamu alaikum wa rahmatullah !",
    "J'aimerais en savoir plus sur votre vision du mariage.",
    "Comment envisagez-vous l'équilibre famille et vie pro ?"
  ];

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 pb-24 h-[calc(100vh-4.5rem)] flex flex-col">
      
      {/* Top Chat Header */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-3 mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('matches')}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Partner Snapshot */}
          <div 
            onClick={() => partner.id && viewProfileDetail(partner)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={partner.photos && partner.photos[0] ? partner.photos[0] : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt={partner.prenom}
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 group-hover:border-[#2D8659] transition-colors"
              />
              {partner.profileStatus === 'verified' && (
                <VerifiedBadge size="sm" className="absolute -top-1 -right-1" />
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
            </div>
            <div>
              <div className="font-bold text-sm text-[#0A2F4A] group-hover:text-[#2D8659] flex items-center gap-1.5 transition-colors">
                <span>{partner.prenom}</span>
                <span className="text-[10px] text-[#2D8659] font-medium bg-[#EAF5EF] px-1.5 py-0.2 rounded-full">
                  {partner.ville}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 truncate max-w-[180px] sm:max-w-xs">
                {partner.profession}
              </div>
            </div>
          </div>
        </div>

        {/* Action / Safety Pill */}
        <div className="flex items-center gap-1 text-[11px] text-[#2D8659] bg-[#EAF5EF] px-2.5 py-1 rounded-full font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Échange Cadré</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-gradient-to-b from-[#F8FAF9] to-white rounded-3xl p-4 sm:p-6 border border-slate-200 overflow-y-auto space-y-4 shadow-inner">
        
        {/* Respect Banner Reminder */}
        <div className="bg-[#EAF5EF] border border-[#2D8659]/20 p-3 rounded-2xl text-center space-y-1">
          <div className="text-xs font-bold text-[#0A2F4A] flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 text-[#2D8659] fill-[#2D8659]" />
            <span>Discussion Matrimoniale Respectueuse</span>
          </div>
          <p className="text-[11px] text-slate-600 max-w-md mx-auto">
            Les échanges doivent s'inscrire dans le respect, la clarté et l'honnêteté des intentions pour la construction d'un foyer.
          </p>
        </div>

        {/* Message Bubbles */}
        {messages.map(msg => {
          const isMe = msg.senderId === (userProfile?.id || 'current_user');

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${
                  isMe
                    ? 'bg-[#0A2F4A] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {msg.type === 'audio' ? (
                  <audio src={msg.audioData} controls className="h-10 w-48 max-w-full" />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
                
                {/* Timestamp & Read Receipts */}
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-mono ${
                    isMe ? 'text-[#A0C0D6]' : 'text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    msg.read ? (
                      <CheckCheck className="w-3.5 h-3.5 text-[#2D8659]" title="Lu" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-slate-400" title="Envoyé" />
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="flex gap-1.5 overflow-x-auto py-2 flex-shrink-0 no-scrollbar">
        {quickStarters.map((starter, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInputText(starter)}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-[#EAF5EF] text-[11px] text-slate-700 hover:text-[#2D8659] border border-slate-200 transition-colors flex-shrink-0"
          >
            {starter}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-1 flex-shrink-0">
        {isRecording ? (
          <div className="flex-1 flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 border border-rose-200 shadow-sm text-rose-600 font-medium text-sm animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              Enregistrement... {formatTime(recordingTime)}
            </div>
            <button 
              type="button" 
              onClick={stopRecording} 
              className="text-rose-600 hover:text-rose-800"
            >
              <Square className="w-5 h-5 fill-rose-600" />
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 p-3.5 rounded-2xl border border-slate-300 focus:border-[#2D8659] focus:ring-2 focus:ring-[#2D8659]/20 text-xs sm:text-sm text-slate-800 outline-none transition-all shadow-sm"
          />
        )}
        
        {!isRecording && !inputText.trim() ? (
          <button
            type="button"
            onClick={startRecording}
            className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#0A2F4A] shadow-sm transition-all flex items-center justify-center flex-shrink-0"
          >
            <Mic className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={(!inputText.trim() && !isRecording) || isSending}
            className="p-3.5 rounded-2xl bg-[#2D8659] hover:bg-[#236c47] text-white shadow-md transition-all disabled:opacity-50 flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </form>

    </div>
  );
}
