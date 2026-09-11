import React from 'react';
import LegalLayout from './LegalLayout';

export default function TermsPage({ onBack }) {
  return (
    <LegalLayout title="Mentions légales" onBack={onBack}>
      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">Éditeur du site</h2>
        <p>
          Le site Wétali est édité par [Bamba Sarr / Nom de la structure à préciser], 
          entrepreneur individuel, domicilié à Issy-les-Moulineaux, France.
        </p>
        <p className="mt-2">
          <strong>Email de contact :</strong> bambasarr012@gmail.com
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">Directeur de la publication</h2>
        <p>Bamba Sarr</p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F172A] mb-4">Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus présents sur Wétali (textes, logo, graphismes) est protégé 
          par le droit d'auteur. Toute reproduction, même partielle, est interdite sans 
          autorisation préalable.
        </p>
      </section>
    </LegalLayout>
  );
}
