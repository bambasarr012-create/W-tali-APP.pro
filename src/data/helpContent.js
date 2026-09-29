import { Camera, CheckCircle, MessageSquare, Clock, ShieldAlert, HeartHandshake, ShieldCheck, Zap, Users, Globe } from 'lucide-react';

export const engagements = [
  { icon: ShieldCheck, title: "Profils vérifiés", desc: "Chaque profil est validé par notre équipe avant d'être visible.", color: "text-[#2D8659]" },
  { icon: Zap, title: "Validation en 12 à 24 h", desc: "Ton profil est examiné rapidement.", color: "text-[#2D8659]" },
  { icon: ShieldAlert, title: "Modération active", desc: "Chaque signalement est examiné par notre équipe.", color: "text-[#2D8659]" },
  { icon: Globe, title: "Ici et au pays", desc: "Paris, Dakar, Montréal, New York et partout dans la diaspora.", color: "text-[#2D8659]" },
];

export const tips = [
  { icon: Camera, title: "Une photo valorisante", desc: "Claire, décente et souriante. Le floutage est possible si tu préfères la discrétion.", color: "bg-blue-50", iconColor: "text-[#0A2F4A]" },
  { icon: CheckCircle, title: "Une bio sincère", desc: "Parle de ton projet de vie et de ton lien avec le Sénégal.", color: "bg-emerald-50", iconColor: "text-[#2D8659]" },
  { icon: MessageSquare, title: "Le premier pas", desc: "Un message respectueux et personnalisé fait toute la différence.", color: "bg-purple-50", iconColor: "text-purple-600" },
  { icon: Clock, title: "Sérieux & courtoisie", desc: "Réponds dans des délais raisonnables, en pensant au décalage horaire.", color: "bg-amber-50", iconColor: "text-[#D4AF37]" },
  { icon: ShieldAlert, title: "Reste prudent", desc: "N'envoie jamais d'argent à une personne rencontrée en ligne.", color: "bg-rose-50", iconColor: "text-rose-600" },
  { icon: HeartHandshake, title: "Implique les tiens", desc: "En parler à ta famille, c'est aussi avancer sereinement.", color: "bg-indigo-50", iconColor: "text-indigo-600" },
];

export const guides = [
  {
    title: "Rédiger un profil qui te ressemble",
    content: [
      "Pour attirer des profils compatibles, privilégie une photo récente et nette où ton visage est bien visible, avec une tenue correcte. Par exemple, une tenue traditionnelle en photo secondaire est une très belle façon de montrer qui tu es et d'afficher ton ancrage culturel.",
      "Dans ta biographie, n'hésite pas à détailler ton projet de mariage et ce qui compte pour toi au quotidien. Il est aussi essentiel d'expliquer ton lien avec le Sénégal : précises-tu y vivre actuellement, comptes-tu y rentrer dans un projet futur, ou as-tu un rythme de vie partagé entre deux pays ?",
      "Enfin, le maître mot reste la sincérité. Un profil honnête, sans artifice ni exagération, attire naturellement des personnes réellement compatibles avec tes valeurs et ton projet."
    ]
  },
  {
    title: "Aimer entre deux pays",
    content: [
      "Sur Wétali, beaucoup de membres vivent dans des pays différents (France, Canada, USA, Sénégal...). La distance ne doit pas être un frein si la communication est bien établie.",
      "Il est important de tenir compte du décalage horaire et de convenir de moments d'appel réguliers. Pour pallier la distance physique et mieux se connaître, privilégiez les appels vidéo fréquents.",
      "Abordez très tôt la question clé de votre projet commun : où souhaitez-vous vivre après le mariage ? L'un de vous doit-il déménager, ou y a-t-il un projet commun de retour au pays ? Une fois ces bases clarifiées, prenez le temps de vous rencontrer en personne avant de vous engager définitivement."
    ]
  },
  {
    title: "Associer sa famille",
    content: [
      "Dans la culture sénégalaise, la famille occupe souvent une place centrale et essentielle dans la réussite d'un projet de mariage. Il est donc normal d'en discuter ouvertement.",
      "Parles-en avec la personne dès que le sujet vous semble opportun : comment chacun voit-il le rôle de sa propre famille dans votre future union et dans les démarches ?",
      "Quand vous vous sentez prêts et en confiance, n'hésitez pas à présenter la personne à vos proches, par exemple lors d'un appel vidéo organisé. L'important est de toujours respecter le rythme et la sensibilité de chacun."
    ]
  },
  {
    title: "Première rencontre en toute sécurité",
    content: [
      "Avant toute rencontre physique, prenez le temps de faire d'abord un ou plusieurs appels vidéo pour valider que la personne correspond bien à ce que vous attendez et à son profil.",
      "Pour le premier rendez-vous, choisissez toujours de vous retrouver dans un lieu public et fréquenté. Par précaution, prévenez un proche de confiance en lui indiquant le lieu exact et l'heure de votre rencontre.",
      "Si vous voyagez ou vous déplacez loin pour rencontrer la personne, veillez à garder votre propre logement (hôtel, Airbnb, chez des proches) et assurez-vous d'avoir votre billet de retour. Ne partagez pas trop vite des informations sensibles comme votre adresse exacte, votre lieu de travail ou vos détails financiers."
    ]
  },
  {
    title: "Se marier entre deux pays",
    content: [
      "Lorsqu'un mariage implique des personnes vivant dans des pays différents, les démarches administratives dépendent des pays de résidence et des nationalités de chacun.",
      "Renseignez-vous très tôt auprès des sources officielles pour connaître les documents nécessaires : consultez votre consulat, votre ambassade ou le site officiel de votre gouvernement (par exemple, service-public.fr pour la France).",
      "Surtout, méfiez-vous des intermédiaires non officiels qui promettent des facilités administratives, des papiers ou un visa contre des sommes d'argent. Wétali ne fournit pas de conseil juridique. Pour ta situation spécifique, adresse-toi toujours aux autorités compétentes."
    ]
  },
  {
    title: "Découvrir le Pass Wétali+",
    content: [
      "Le Pass Wétali+ est notre abonnement Premium qui t'offre des outils avancés pour accélérer et affiner tes recherches en vue du mariage.",
      "En devenant membre VIP, tu as la possibilité de voir exactement qui a visité ton profil, et tu bénéficies de demandes illimitées pour ne rater aucune opportunité.",
      "Tu profites aussi du Message Flash pour envoyer un message personnalisé avant même l'acceptation, d'un profil vérifié prioritaire pour plus de visibilité, et du badge Premium doré qui atteste de ton sérieux."
    ]
  }
];

export const faqs = [
  {
    category: "Premiers pas sur Wétali",
    questions: [
      { q: "Comment fonctionne Wétali ?", a: "Tu crées ton profil, notre équipe le vérifie, puis tu peux explorer les profils, envoyer des invitations et échanger avec les personnes qui les acceptent. Wétali est pensé pour les Sénégalais de la diaspora et du pays qui cherchent le mariage." },
      { q: "Pourquoi mon profil doit-il être validé ?", a: "Chaque profil est vérifié pour écarter les faux comptes et garder une communauté sérieuse. La validation prend généralement entre 12 et 24 heures." },
      { q: "Je vis à l'étranger, puis-je rencontrer quelqu'un au Sénégal (ou l'inverse) ?", a: "Oui. Wétali réunit des membres en Europe, en Amérique du Nord et au Sénégal. Tu peux filtrer les profils par pays de résidence dans Explorer." },
      { q: "Wétali est-il fait pour les rencontres légères ?", a: "Non. Wétali est réservé aux personnes qui cherchent le mariage. Les comportements irrespectueux peuvent être signalés et entraîner la suspension du compte." },
      { q: "Wétali respecte-t-il nos valeurs ?", a: "Wétali est une plateforme orientée mariage : échanges respectueux, aucun contenu inapproprié toléré, modération active et possibilité de flouter tes photos. Chacun reste libre d'associer sa famille à sa démarche." }
    ]
  },
  {
    category: "Profil & photos",
    questions: [
      { q: "Comment ajouter ou changer mes photos ?", a: "Va dans Espace, puis Paramètres & Profil. Tu peux ajouter de 1 à 5 photos ; la première est ta photo principale." },
      { q: "Comment flouter mes photos ?", a: "Dans Espace > Préférences & Sécurité (Paramètres), active l'option 'Visibilité des photos' (Flouter mes photos). C'est une fonctionnalité liée au respect de ta confidentialité, permettant de cacher tes photos aux non-matchs." },
      { q: "Quelles photos choisir ?", a: "Une photo récente et nette où ton visage est bien visible, avec une tenue correcte. Évite les photos de groupe, les lunettes de soleil et les filtres trop marqués." },
      { q: "Pourquoi ma photo a-t-elle été refusée ?", a: "Les photos floues, de groupe, sans visage visible, avec une tenue inappropriée ou qui ne sont pas de toi sont refusées." },
      { q: "Comment écrire une bonne bio ?", a: "Parle de ton projet de vie, de ce qui compte pour toi et de ton lien avec le Sénégal. Reste simple et sincère." }
    ]
  },
  {
    category: "Invitations & échanges",
    questions: [
      { q: "Comment envoyer une invitation ?", a: "Sur le profil d'un membre, clique sur le bouton vert 'Envoyer une invitation'. Tu pourras y joindre un Message Flash si tu es membre Premium." },
      { q: "Combien d'invitations puis-je envoyer ?", a: "L'accès standard offre un nombre limité d'invitations pour privilégier la qualité. Le Pass Wétali+ permet d'en envoyer davantage (en illimité)." },
      { q: "Pourquoi je ne peux pas écrire à quelqu'un ?", a: "La messagerie ne s'ouvre que lorsque la personne accepte ton invitation (c'est un Match). Cela garantit des échanges mutuellement consentis." },
      { q: "Comment écrire un bon premier message ?", a: "Salue la personne, présente-toi en une phrase et fais référence à un élément de son profil. Évite les messages copiés-collés." },
      { q: "Mon invitation a été refusée, que faire ?", a: "Ne le prends pas personnellement, cela fait partie de la démarche. Respecte sa décision et continue d'explorer." }
    ]
  },
  {
    category: "Sécurité & arnaques",
    questions: [
      { q: "Quelqu'un me demande de l'argent, que faire ?", a: "N'envoie jamais d'argent (Wave, Orange Money, Western Union, virement...) à une personne rencontrée sur Wétali, quelle que soit l'histoire racontée. Signale le profil immédiatement." },
      { q: "Quelqu'un me parle très vite de visa ou de papiers, est-ce normal ?", a: "Un projet de mariage sincère ne commence pas par une demande de visa, d'hébergement ou de papiers. Prends ton temps, parles-en à tes proches et signale tout comportement suspect." },
      { q: "Comment signaler un profil ?", a: "Appuie sur le bouton 'Signaler' (l'icône d'alerte/drapeau) présent sur le profil d'un membre ou dans la messagerie, puis choisis le motif. Notre équipe examine chaque signalement." },
      { q: "Qui peut voir mon profil ?", a: "Uniquement les membres connectés de Wétali. Ton profil n'apparaît pas sur les moteurs de recherche." },
      { q: "Comment préparer une première rencontre ?", a: "Commence par des appels vidéo, rencontrez-vous dans un lieu public et préviens un proche. Consulte notre guide 'Première rencontre en toute sécurité'." }
    ]
  },
  {
    category: "Pass Wétali+",
    questions: [
      { q: "Quels sont les avantages du Pass Wétali+ ?", a: "Le Pass Wétali+ débloque la possibilité de voir qui a visité ton profil, le Message Flash pour envoyer un message avant l'acceptation, des demandes illimitées, un profil vérifié prioritaire et le badge Premium." }
    ]
  },
  {
    category: "Mon compte & mes données",
    questions: [
      { q: "Comment modifier mes informations ?", a: "Va dans Espace, puis clique sur l'une des rubriques de la section 'Mon Profil Wétali' (Mes Photos, Mon Identité, Situation actuelle, etc.) pour faire tes modifications." },
      { q: "Comment supprimer mon compte ?", a: "Rends-toi dans Espace, fais défiler vers le bas, et clique sur le bouton rouge 'Supprimer mon compte / Réinitialiser les données'. Cette action est irréversible." },
      { q: "Que faites-vous de mes données ?", a: "Tout est expliqué dans notre politique de confidentialité. Tes informations sont sécurisées et ne sont pas vendues à des tiers." }
    ]
  }
];

export const SUPPORT_EMAIL = "contact@wetali.com";
