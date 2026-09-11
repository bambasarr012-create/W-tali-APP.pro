import React from 'react';
import LegalLayout from './LegalLayout';

export default function DPAPage({ onBack }) {
  return (
    <LegalLayout title="Accord de traitement des données (DPA)" onBack={onBack}>
      <p className="text-lg text-gray-600 mb-8">
        Ce document complète notre Politique de confidentialité et précise les 
        modalités techniques de traitement des données à caractère personnel.
      </p>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">1. Sous-traitants</h2>
        <p>
          Wétali fait appel aux prestataires suivants pour le fonctionnement de 
          la plateforme :
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Vercel Inc.</strong> (hébergement)</li>
          <li><strong>Firebase / Google Cloud</strong> (base de données, authentification, stockage des photos)</li>
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">2. Transferts de données</h2>
        <p>
          Certaines données peuvent être hébergées sur des serveurs situés hors 
          de l'Union Européenne. Dans ce cas, des garanties appropriées (clauses 
          contractuelles types de la Commission Européenne) sont mises en œuvre 
          par nos prestataires.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">3. Sécurité des données</h2>
        <p>
          Chiffrement des données en transit (HTTPS), authentification sécurisée, 
          accès restreint aux données par notre équipe.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">4. Notification de violation</h2>
        <p>
          En cas de violation de données susceptible d'engendrer un risque pour 
          vos droits et libertés, nous nous engageons à vous en informer dans 
          les meilleurs délais, conformément à la réglementation applicable.
        </p>
      </section>
    </LegalLayout>
  );
}
