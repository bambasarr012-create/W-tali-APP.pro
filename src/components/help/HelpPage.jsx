import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  ChevronRight,
  Mail
} from 'lucide-react';
import { engagements, tips, guides, faqs, SUPPORT_EMAIL } from '../../data/helpContent';

export default function HelpPage() {
  const { setCurrentView } = useApp();
  const [openFaq, setOpenFaq] = useState(null);
  const [openGuide, setOpenGuide] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-bold text-2xl text-[#0A2F4A]">Accompagnement</h1>
          <p className="text-xs text-slate-500">Ton guide pour un mariage sérieux, ici ou au pays</p>
        </div>
      </div>

      {/* Nos engagements */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <h2 className="font-bold text-[#0A2F4A] mb-4">Nos engagements</h2>
        <div className="grid grid-cols-2 gap-4">
          {engagements.map((eng, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <eng.icon className={`w-6 h-6 mb-2 ${eng.color}`} />
              <h3 className="font-bold text-slate-800 text-[13px] leading-tight mb-1">{eng.title}</h3>
              <p className="text-[10px] text-slate-500 leading-tight">{eng.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Les clés de la réussite */}
      <div className="space-y-4">
        <h2 className="font-bold text-[#0A2F4A] flex items-center gap-2">
          Les clés de la réussite
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tips.map((tip, idx) => (
            <div key={idx} className={`${tip.color} p-4 rounded-2xl flex items-start gap-3`}>
              <tip.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tip.iconColor}`} />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{tip.title}</h3>
                <p className="text-[11px] text-slate-600 leading-tight mt-1">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guides pratiques */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <h2 className="font-bold text-[#0A2F4A] flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-[#D4AF37]" />
          Guides pratiques
        </h2>
        <div className="space-y-3">
          {guides.map((guide, idx) => {
            const isOpen = openGuide === idx;
            return (
              <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenGuide(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  <span className="text-sm font-bold text-[#0A2F4A]">{guide.title}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-sm text-slate-600 space-y-3 leading-relaxed">
                    {guide.content.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="font-bold text-[#0A2F4A]">Questions fréquentes</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher une question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-[#2D8659] focus:ring-1 focus:ring-[#2D8659] outline-none transition-all text-sm"
          />
        </div>

        <div className="space-y-6">
          {filteredFaqs.map((category, catIdx) => (
            <div key={catIdx} className="space-y-2">
              <h3 className="font-bold text-slate-800 ml-2 text-sm uppercase tracking-wider">{category.category}</h3>
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
                {category.questions.map((q, qIdx) => {
                  const id = `${catIdx}-${qIdx}`;
                  const isOpen = openFaq === id;
                  return (
                    <div key={qIdx} className="flex flex-col">
                      <button 
                        onClick={() => setOpenFaq(isOpen ? null : id)}
                        className="flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className={`text-sm font-semibold pr-4 ${isOpen ? 'text-[#2D8659]' : 'text-slate-700'}`}>{q.q}</span>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-[#2D8659] flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-slate-600 bg-slate-50 leading-relaxed">
                          {q.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <p className="text-center text-slate-500 py-8">Aucun résultat trouvé pour votre recherche.</p>
          )}
        </div>
      </div>

      {/* Footer Contact */}
      <div className="bg-[#0A2F4A] rounded-3xl p-6 text-center shadow-lg mt-8">
        <h3 className="font-bold text-white mb-2">Tu n'as pas trouvé ta réponse ?</h3>
        <p className="text-sm text-blue-100 mb-4">Notre équipe est là pour t'accompagner dans ta démarche.</p>
        <a 
          href={`mailto:${SUPPORT_EMAIL}`}
          className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B8960C] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md w-full sm:w-auto"
        >
          <Mail className="w-5 h-5" />
          Contacter l'équipe
        </a>
      </div>

    </div>
  );
}
