import React from 'react';
import LegalLayout from './LegalLayout';

export default function CGVPage({ onBack }) {
  return (
    <LegalLayout title="Conditions Générales d'Utilisation" onBack={onBack}>
      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">1. Objet</h2>
        <p>
          Les présentes CGU régissent l'utilisation de la plateforme Wétali, un 
          service de mise en relation matrimoniale destiné à la diaspora sénégalaise.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">2. Inscription</h2>
        <p>
          L'inscription est réservée aux personnes majeures (18 ans et plus), 
          célibataires et de bonne foi. Un seul profil par personne est autorisé.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">3. Vérification des profils</h2>
        <p>
          Wétali se réserve le droit de vérifier manuellement chaque profil 
          (pièce d'identité) avant validation, afin de garantir l'authenticité 
          des membres.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">4. Comportement attendu</h2>
        <p>
          Les utilisateurs s'engagent à faire preuve de respect dans leurs échanges. 
          Tout comportement inapproprié (harcèlement, propos déplacés, fausses 
          informations) peut entraîner la suspension ou la suppression du compte, 
          sans préavis ni remboursement le cas échéant.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">5. Tarification</h2>
        <p>
          L'utilisation de base est gratuite. Des fonctionnalités premium 
          (à venir) pourront être proposées moyennant un abonnement, dont les 
          conditions seront communiquées séparément.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">6. Responsabilité</h2>
        <p>
          Wétali est un service de mise en relation. Nous ne pouvons garantir 
          l'exactitude des informations fournies par les utilisateurs ni le 
          succès d'une rencontre. Chaque utilisateur reste seul responsable des 
          décisions prises suite aux échanges sur la plateforme.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">7. Résiliation</h2>
        <p>
          Vous pouvez supprimer votre compte à tout moment depuis les paramètres. 
          Wétali se réserve le droit de suspendre un compte en cas de non-respect 
          des présentes CGU.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">8. Droit applicable</h2>
        <p>
          Les présentes CGU sont soumises au droit français. Tout litige relève 
          de la compétence des tribunaux français, sauf disposition impérative 
          contraire applicable dans le pays de résidence de l'utilisateur.
        </p>
      </section>
    </LegalLayout>
  );
}
