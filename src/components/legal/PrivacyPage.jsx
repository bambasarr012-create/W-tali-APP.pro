import React from 'react';
import LegalLayout from './LegalLayout';

export default function PrivacyPage({ onBack }) {
  return (
    <LegalLayout title="Politique de confidentialité" onBack={onBack}>
      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">1. Données collectées</h2>
        <p>
          Dans le cadre de la création d'un profil matrimonial, nous collectons : 
          prénom, âge, genre, ville, email, téléphone, photos, profession, 
          vision du mariage, et les informations optionnelles que vous choisissez 
          de renseigner (études, dahira, bio, centres d'intérêt).
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">2. Finalité du traitement</h2>
        <p>Ces données sont utilisées exclusivement pour :</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Créer et afficher votre profil aux autres utilisateurs</li>
          <li>Calculer des scores de compatibilité (points communs)</li>
          <li>Permettre la mise en relation et la messagerie</li>
          <li>Assurer la sécurité de la plateforme (vérification des profils)</li>
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">3. Base légale</h2>
        <p>
          Le traitement repose sur votre consentement explicite lors de l'inscription.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">4. Durée de conservation</h2>
        <p>
          Vos données sont conservées tant que votre compte est actif. Vous pouvez 
          demander leur suppression à tout moment via les paramètres ou en nous 
          contactant à <strong>wetalidiaspora@gmail.com</strong>.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">5. Vos droits (RGPD)</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données, vous 
          disposez d'un droit d'accès, de rectification, d'effacement, de limitation 
          et de portabilité de vos données. Vous pouvez exercer ces droits en 
          nous contactant à <strong>wetalidiaspora@gmail.com</strong>.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">6. Partage des données</h2>
        <p>
          Vos données ne sont jamais vendues à des tiers. Elles sont uniquement 
          visibles par les autres utilisateurs vérifiés de la plateforme, selon 
          les paramètres de confidentialité que vous choisissez.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">7. Sécurité</h2>
        <p>
          Nous utilisons des mesures techniques (chiffrement, authentification) 
          pour protéger vos données contre tout accès non autorisé.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">8. Utilisateurs hors Union Européenne</h2>
        <p>
          Si vous résidez hors de l'UE (Canada, USA, etc.), vos données peuvent être 
          traitées conformément aux lois locales applicables en matière de protection 
          des données (ex : Loi 25 au Québec), en plus du RGPD lorsque applicable.
        </p>
      </section>
    </LegalLayout>
  );
}
