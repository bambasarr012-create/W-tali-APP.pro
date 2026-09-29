import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Lightbulb, 
  Camera, 
  CheckCircle, 
  MessageSquare, 
  Clock, 
  Users, 
  ShieldCheck, 
  Zap, 
  Star,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen
} from 'lucide-react';

export default function HelpPage() {
  const { setCurrentView } = useApp();
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tips = [
    { icon: Camera, title: "Une photo valorisante", desc: "Une photo claire, décente et souriante inspire confiance (floutage possible)", color: "bg-blue-50", iconColor: "text-blue-500" },
    { icon: CheckCircle, title: "Une bio sincère", desc: "Les profils complétés avec honnêteté génèrent 5x plus d'affinités", color: "bg-emerald-50", iconColor: "text-emerald-500" },
    { icon: MessageSquare, title: "Le premier pas", desc: "Un premier message respectueux et personnalisé fait toute la différence", color: "bg-purple-50", iconColor: "text-purple-500" },
    { icon: Clock, title: "Sérieux & courtoisie", desc: "Répondez dans les délais par respect pour vos interlocuteurs", color: "bg-amber-50", iconColor: "text-amber-500" },
  ];

  const stats = [
    { icon: Users, value: "10K+", label: "Membres", color: "text-[#2D8659]" },
    { icon: ShieldCheck, value: "100%", label: "Vérifiés", color: "text-[#2D8659]" },
    { icon: Zap, value: "24h", label: "Validation", color: "text-[#2D8659]" },
    { icon: Star, value: "4.8", label: "Note", color: "text-[#2D8659]" },
  ];

  const faqs = [
    {
      category: "Vos premiers pas sur Wétali",
      questions: [
        { q: "Comment fonctionne Wétali ?", a: "Wétali vous présente des profils partageant vos valeurs. Si l'intérêt est mutuel, vous pouvez échanger dans le respect de l'éthique musulmane." },
        { q: "Comment mon profil est-il validé ?", a: "Pour garantir la sécurité et le sérieux de la communauté, chaque profil est examiné et vérifié manuellement par nos modérateurs." },
        { q: "Wétali est-il vraiment halal ?", a: "Absolument. La plateforme intègre des fonctionnalités (floutage de photos, modération stricte) pensées pour faciliter une rencontre en vue du mariage." }
      ]
    },
    {
      category: "Confidentialité & Apparence",
      questions: [
        { q: "Comment ajouter ma photo ?", a: "Rendez-vous dans 'Mes Préférences' puis 'Mes Photos' pour gérer votre galerie publique." },
        { q: "Comment flouter mes photos ?", a: "La fonction de protection des photos vous permet de flouter vos images pour les profils avec lesquels vous n'avez pas de connexion (Fonctionnalité Premium)." }
      ]
    },
    {
      category: "Invitations & Pass Premium",
      questions: [
        { q: "Combien d'invitations puis-je envoyer ?", a: "L'accès standard offre un quota limité pour privilégier la qualité à la quantité. Passez Premium pour des invitations illimitées." },
        { q: "Quels sont les avantages du Premium ?", a: "Filtres avancés sur la pratique religieuse, accès à la liste de vos visiteurs, invitations supplémentaires et gestion de la confidentialité !" }
      ]
    }
  ];

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
          <p className="text-xs text-slate-500">Votre guide bienveillant sur Wétali</p>
        </div>
      </div>

      {/* Conseils rapides */}
      <div className="space-y-4">
        <h2 className="font-bold text-[#0A2F4A] flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#D4AF37]" />
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

      {/* Stats */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex justify-between items-center px-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="flex justify-center mb-1"><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
            <div className="font-black text-lg text-[#0A2F4A] leading-none">{stat.value}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Guides rapides */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <h2 className="font-bold text-[#0A2F4A] flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-[#D4AF37]" />
          Guides pratiques
        </h2>
        <div className="space-y-2">
          {["Rédiger un profil authentique", "Trouver l'âme sœur (Mektoub)", "Préparer sa première rencontre", "Découvrir le Pass Wétali+"].map((guide, idx) => (
            <button key={idx} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors text-sm font-semibold text-slate-700">
              {guide}
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
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
              <h3 className="font-bold text-slate-800 ml-2">{category.category}</h3>
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
                        <div className="px-4 pb-4 text-sm text-slate-600 bg-slate-50">
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

    </div>
  );
}

const ChevronRight = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>;
