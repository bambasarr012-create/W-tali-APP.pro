import React from 'react';
import LegalLayout from './LegalLayout';

export default function RulesPage({ onBack }) {
  return (
    <LegalLayout title="Règlement de la communauté Wétali" onBack={onBack}>
      <p className="text-lg text-gray-600 mb-8">
        Pour garantir un environnement sain, sérieux et respectueux, tous les 
        membres de Wétali s'engagent à respecter les règles suivantes :
      </p>

      <section>
        <ul className="space-y-6">
          <li className="flex flex-col gap-1">
            <h3 className="font-serif text-xl font-bold text-[#0F172A]">1. Un seul profil authentique par personne</h3>
            <p>La création de comptes multiples est interdite et entraînera une suspension immédiate.</p>
          </li>
          <li className="flex flex-col gap-1">
            <h3 className="font-serif text-xl font-bold text-[#0F172A]">2. Photos réelles et récentes</h3>
            <p>L'utilisation de photos de tiers, d'images floues ou générées par IA n'est pas autorisée. Vos photos doivent vous représenter clairement.</p>
          </li>
          <li className="flex flex-col gap-1">
            <h3 className="font-serif text-xl font-bold text-[#0F172A]">3. Informations exactes</h3>
            <p>Votre âge, votre situation personnelle et votre profession doivent correspondre à la réalité.</p>
          </li>
          <li className="flex flex-col gap-1">
            <h3 className="font-serif text-xl font-bold text-[#0F172A]">4. Respect dans les échanges</h3>
            <p>Aucune forme de harcèlement, de propos déplacés ou d'insistance après un refus ne sera tolérée. Tout manquement entraînera une exclusion immédiate.</p>
          </li>
          <li className="flex flex-col gap-1">
            <h3 className="font-serif text-xl font-bold text-[#0F172A]">5. Intentions sérieuses</h3>
            <p>Wétali est une plateforme matrimoniale dédiée à des engagements sérieux (mariage), pas une application de rencontre occasionnelle ("casual").</p>
          </li>
          <li className="flex flex-col gap-1">
            <h3 className="font-serif text-xl font-bold text-[#0F172A]">6. Signalement</h3>
            <p>Tout comportement contraire à ces règles peut et doit être signalé via les paramètres du profil concerné ou en nous contactant.</p>
          </li>
          <li className="flex flex-col gap-1">
            <h3 className="font-serif text-xl font-bold text-[#0F172A]">7. Sanctions</h3>
            <p>Le non-respect de ce règlement peut entraîner un avertissement, une suspension temporaire ou une suppression définitive de votre compte selon la gravité.</p>
          </li>
        </ul>
      </section>
    </LegalLayout>
  );
}
