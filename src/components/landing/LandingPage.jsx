import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import TermsPage from '../legal/TermsPage';
import PrivacyPage from '../legal/PrivacyPage';
import CGVPage from '../legal/CGVPage';
import DPAPage from '../legal/DPAPage';
import RulesPage from '../legal/RulesPage';
import heroImg from '../../assets/senegalese_wedding_hero.jpg';

const landingHtml = `
<!-- NAVBAR -->
<nav id="navbar">
  <div class="nav-inner">
    <a class="logo" href="#">
      <svg width="44" height="44" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="#0F172A" stroke="#D4AF37" stroke-width="4"/>
        <ellipse cx="37" cy="57" rx="18" ry="18" fill="none" stroke="#D4AF37" stroke-width="5.5"/>
        <ellipse cx="60" cy="44" rx="18" ry="18" fill="none" stroke="#D4AF37" stroke-width="5.5" opacity="0.8"/>
        <path d="M 37 39 A 18 18 0 0 1 52 43" fill="none" stroke="#D4AF37" stroke-width="6" stroke-linecap="round"/>
        <polygon points="60,20 66,28 60,34 54,28" fill="#FFFBF0"/>
        <circle cx="60" cy="27" r="2.5" fill="#D4AF37"/>
      </svg>
      <span class="logo-text">Wétali</span>
    </a>
    <div class="nav-menu">
      <button class="nav-link" onclick="scrollToId('decouvrir')">Découvrir</button>
      <button class="nav-link" onclick="scrollToId('how-it-works')">Comment ça marche</button>
      <button class="nav-link" onclick="scrollToId('pricing')">Tarifs</button>
      <button class="nav-link" onclick="scrollToId('contact-section')">Contact</button>
      <button class="nav-cta" onclick="openAuth()">Accéder à Wétali</button>
    </div>
    <button class="hamburger" onclick="toggleDrawer()"><span></span><span></span><span></span></button>
  </div>
</nav>

<div id="drawer">
  <button class="drawer-link" onclick="scrollToId('decouvrir')">Découvrir</button>
  <button class="drawer-link" onclick="scrollToId('how-it-works')">Comment ça marche</button>
  <button class="drawer-link" onclick="scrollToId('pricing')">Tarifs</button>
  <button class="drawer-link" onclick="scrollToId('contact-section')">Contact</button>
  <button class="drawer-cta" onclick="openAuth()">Accéder à Wétali</button>
</div>
<div id="drawer-overlay" onclick="toggleDrawer()"></div>

<!-- HERO -->
<section id="hero">
  <div class="bg-glow" style="top:-100px;right:-100px;width:600px;height:600px;background:radial-gradient(circle,rgba(212,175,55,.12) 0%,transparent 70%)"></div>
  <div class="bg-glow" style="bottom:-50px;left:-50px;width:400px;height:400px;background:radial-gradient(circle,rgba(30,58,138,.08) 0%,transparent 70%)"></div>
  <div class="hero-inner">
    <div class="hero-grid">
      <div class="inview inview-hidden" id="hero-text">
        <div class="hero-badge"><span class="hero-badge-dot"></span><span class="hero-badge-text">Matrimonial Premium</span></div>
        <h1 class="hero-title">Wétali.<br><em>Sérieux.</em></h1>
        <p class="hero-desc">Une plateforme matrimoniale pour Sénégalais de la diaspora qui cherchent vraiment leur moitié.</p>
        <div class="hero-features">
          <div class="hero-feature"><span class="hero-feature-icon">✦</span><span class="hero-feature-text">Inscription 100% gratuite</span></div>
          <div class="hero-feature"><span class="hero-feature-icon">◈</span><span class="hero-feature-text">Profils vérifiés & sérieux</span></div>
          <div class="hero-feature"><span class="hero-feature-icon">⬡</span><span class="hero-feature-text">Chat & messagerie sécurisés</span></div>
        </div>
        <div class="hero-cta-wrap">
          <button class="hero-btn" onclick="openAuth()">Créer mon profil gratuit</button>
          <span class="hero-note">Inscription gratuite · Confidentiel · Chat disponible avec abonnement</span>
        </div>
      </div>
      <!-- Image Hero avec fallback élégant -->
      <div class="inview inview-hidden hero-img-wrap" style="transition-delay:.2s">
        <div class="hero-img-border"></div>
        <div class="hero-img-corner" style="top:-16px;left:-16px"></div>
        <div class="hero-img-corner" style="top:-16px;right:-16px"></div>
        <div class="hero-img-corner" style="bottom:-16px;left:-16px"></div>
        <div class="hero-img-corner" style="bottom:-16px;right:-16px"></div>
        <div class="hero-img-box" id="hero-img-box">
          <!-- Fallback visuel élégant toujours visible -->
          <div class="hero-img-fallback" id="hero-fallback">
            <div style="text-align:center;padding:2rem">
              <svg width="120" height="120" viewBox="0 0 100 100" style="margin-bottom:1.5rem">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(212,175,55,0.3)" stroke-width="2"/>
                <ellipse cx="37" cy="57" rx="18" ry="18" fill="none" stroke="#D4AF37" stroke-width="3"/>
                <ellipse cx="60" cy="44" rx="18" ry="18" fill="none" stroke="#D4AF37" stroke-width="3" opacity="0.7"/>
                <path d="M 37 39 A 18 18 0 0 1 52 43" fill="none" stroke="#D4AF37" stroke-width="3.5" stroke-linecap="round"/>
                <polygon points="60,20 66,28 60,34 54,28" fill="rgba(255,251,240,0.8)"/>
                <circle cx="60" cy="27" r="2.5" fill="#D4AF37"/>
              </svg>
              <div style="font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;color:#D4AF37;margin-bottom:.5rem">Wétali</div>
              <div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:rgba(255,251,240,0.7);font-style:italic">L'union dans la dignité</div>
              <div style="margin-top:1.5rem;display:flex;justify-content:center;gap:1rem">
                <div style="text-align:center"><div style="font-size:2rem">👩🏾</div><div style="font-family:'Inter',sans-serif;font-size:.7rem;color:rgba(212,175,55,0.7);margin-top:4px">Mariama · Paris</div></div>
                <div style="width:1px;background:rgba(212,175,55,0.3)"></div>
                <div style="text-align:center"><div style="font-size:2rem">👨🏾</div><div style="font-family:'Inter',sans-serif;font-size:.7rem;color:rgba(212,175,55,0.7);margin-top:4px">Ibrahima · Dakar</div></div>
              </div>
            </div>
          </div>
          <img id="hero-photo"
            src=""
            alt="Couple sénégalais élégant"
            style="opacity:0;position:absolute;inset:0">
          <div class="hero-img-overlay"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- STAT BAR -->
<section id="stat-bar">
  <div class="stat-inner">
    <div class="stat-item inview inview-hidden"><div class="stat-value">2 500+</div><div class="stat-label">Membres actifs</div></div>
    <div class="stat-sep"></div>
    <div class="stat-item inview inview-hidden" style="transition-delay:.15s"><div class="stat-value">500+</div><div class="stat-label">Mariages réussis</div></div>
    <div class="stat-sep"></div>
    <div class="stat-item inview inview-hidden" style="transition-delay:.3s"><div class="stat-value">100%</div><div class="stat-label">Profils vérifiés</div></div>
  </div>
</section>

<!-- FEATURES -->
<section id="decouvrir">
  <div class="features-inner">
    <div class="section-head inview inview-hidden">
      <p class="section-label">Excellence</p>
      <h2 class="section-title">Pourquoi choisir Wétali?</h2>
    </div>
    <div class="features-grid">
      <div class="features-col">
        <div class="feature-card large inview inview-hidden" style="transition-delay:.1s">
          <div class="feature-icon">✦</div>
          <h3 class="feature-card-title large">Profils Vérifiés</h3>
          <p class="feature-card-desc">Chaque membre passe par un processus de vérification rigoureux. Ici, vous rencontrez de vraies personnes avec de vraies intentions.</p>
        </div>
        <div class="offset">
          <div class="feature-card inview inview-hidden" style="transition-delay:.25s">
            <div class="feature-icon gold">◈</div>
            <h3 class="feature-card-title">Matching Intelligent</h3>
            <p class="feature-card-desc">Notre algorithme analyse vos valeurs, votre vision du mariage et votre culture pour vous présenter des profils vraiment compatibles.</p>
          </div>
        </div>
      </div>
      <div class="feature-card large inview inview-hidden" style="transition-delay:.15s">
        <div class="feature-icon">⬡</div>
        <h3 class="feature-card-title large">Chat Sécurisé &amp; Respectueux</h3>
        <p class="feature-card-desc">Échangez en toute confiance dans un environnement modéré. Nos équipes veillent à ce que chaque interaction reste dans le respect et la dignité.</p>
        <div class="feature-highlight"><span></span><span>Modération active 24/7</span></div>
      </div>
    </div>
  </div>
</section>

<!-- VISION -->
<section id="vision">
  <div class="bg-glow" style="top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;background:radial-gradient(circle,rgba(30,58,138,.3) 0%,transparent 70%)"></div>
  <div class="vision-inner">
    <p class="vision-title inview inview-hidden">Pas un swipe.<br><em>Une rencontre.</em></p>
    <p class="vision-desc inview inview-hidden" style="transition-delay:.3s">On a créé Wétali pour ceux qui cherchent une vraie moitié, pas une distraction.</p>
    <div class="vision-line" id="vision-line"></div>
  </div>
</section>

<!-- DEMO -->
<section id="demo">
  <div class="demo-inner">
    <div class="section-head inview inview-hidden">
      <p class="section-label">En action</p>
      <h2 class="section-title" style="font-size:clamp(1.8rem,3.5vw,2.8rem)">Wétali, c'est du respect et de la confiance</h2>
      <p style="font-family:'Inter',sans-serif;font-size:1rem;color:#6B7280;margin-top:.75rem">Regarde comment ça fonctionne</p>
    </div>
    <div class="inview inview-hidden" style="transition-delay:.3s">
      <div class="demo-frame">
        <div class="demo-frame-inner">
          <div class="demo-topbar">
            <div class="demo-dot" style="background:#D4AF37;box-shadow:0 0 6px #D4AF3780"></div>
            <div class="demo-dot" style="background:#C09B2A;box-shadow:0 0 6px #C09B2A80"></div>
            <div class="demo-dot" style="background:#A8891A;box-shadow:0 0 6px #A8891A80"></div>
            <div class="demo-url-bar"><div class="demo-url"><div class="demo-url-dot"></div><span class="demo-url-text">wetali.app</span></div></div>
          </div>
          <div class="demo-screen"><div class="screen-content" id="screen-content"></div></div>
        </div>
      </div>
      <div class="demo-base1"><div></div></div>
      <div class="demo-base2"><div></div></div>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section id="how-it-works">
  <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:1px;height:100%;background:linear-gradient(to bottom,transparent,rgba(212,175,55,.2),transparent)"></div>
  <div class="how-inner">
    <div class="section-head inview inview-hidden">
      <p class="section-label">Le parcours</p>
      <h2 class="section-title" style="color:#FFFBF0;font-size:clamp(1.8rem,3.5vw,2.8rem)">Comment ça marche</h2>
    </div>
    <div class="how-steps">
      <div class="how-line"></div>
      <div class="how-steps-list">
        <div class="how-step inview inview-hidden" style="transition-delay:.15s">
          <div class="how-step-num">01</div>
          <div class="how-step-body"><div class="how-step-head"><span>✍️</span><h3 class="how-step-title">Inscris-toi gratuitement</h3></div><p class="how-step-desc">Crée ton profil complet avec tes valeurs, ta vision du mariage et ta culture. Simple et rapide.</p></div>
        </div>
        <div class="how-step inview inview-hidden" style="transition-delay:.3s">
          <div class="how-step-num">02</div>
          <div class="how-step-body"><div class="how-step-head"><span>🔍</span><h3 class="how-step-title">Découvre des profils compatibles</h3></div><p class="how-step-desc">Notre algorithme te propose des profils vérifiés qui partagent tes valeurs et tes aspirations.</p></div>
        </div>
        <div class="how-step inview inview-hidden" style="transition-delay:.45s">
          <div class="how-step-num">03</div>
          <div class="how-step-body"><div class="how-step-head"><span>💬</span><h3 class="how-step-title">Active ton abonnement pour échanger</h3></div><p class="how-step-desc">Le chat et la messagerie sont disponibles avec un abonnement. Une barrière qui garantit le sérieux de chaque membre.</p></div>
        </div>
        <div class="how-step inview inview-hidden" style="transition-delay:.6s">
          <div class="how-step-num">04</div>
          <div class="how-step-body"><div class="how-step-head"><span>💍</span><h3 class="how-step-title">Rencontre ta moitié</h3></div><p class="how-step-desc">Échangez, découvrez-vous, et construisez quelque chose de beau ensemble.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section id="testimonials">
  <div class="testi-inner">
    <div class="section-head inview inview-hidden">
      <p class="section-label">Témoignages</p>
      <h2 class="section-title">Ils ont trouvé l'amour</h2>
    </div>
    <div class="testi-grid">
      <div class="testi-card tall inview inview-hidden" style="transition-delay:.1s">
        <div class="testi-top-bar"></div>
        <div class="testi-body">
          <div class="testi-big-quote">"</div>
          <p class="testi-text">Wétali m'a aidé à trouver quelqu'un de sérieux. On s'est mariés en juin dernier. Alhamdulillah! L'abonnement vaut vraiment le prix, les profils sont tous vérifiés et les intentions sont claires dès le début.</p>
          <div class="testi-author"><div class="testi-avatar">👩🏾‍🦱</div><div><div class="testi-name">Amara D.</div><div class="testi-loc">Paris, France</div></div></div>
        </div>
      </div>
      <div class="testi-card inview inview-hidden" style="transition-delay:.25s">
        <div class="testi-top-bar"></div>
        <div class="testi-body">
          <div class="testi-big-quote">"</div>
          <p class="testi-text">Enfin une app où les profils sont vrais et les intentions claires!</p>
          <div class="testi-author"><div class="testi-avatar">👩🏾</div><div><div class="testi-name">Sophia K.</div><div class="testi-loc">Montréal, Canada</div></div></div>
        </div>
      </div>
      <div class="testi-card inview inview-hidden" style="transition-delay:.4s">
        <div class="testi-top-bar"></div>
        <div class="testi-body">
          <div class="testi-big-quote">"</div>
          <p class="testi-text">L'abonnement m'a semblé logique — seuls ceux qui cherchent vraiment paient. Ça change tout!</p>
          <div class="testi-author"><div class="testi-avatar">👨🏾</div><div><div class="testi-name">Mamadou S.</div><div class="testi-loc">New York, USA</div></div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PRICING — inscription gratuite, usage payant -->
<section id="pricing">
  <div class="pricing-inner">
    <div class="section-head inview inview-hidden">
      <p class="section-label">Accès</p>
      <h2 class="section-title" style="color:#FFFBF0">Accéder à Wétali</h2>
    </div>
    <p class="pricing-note inview inview-hidden"><strong>L'inscription est entièrement gratuite.</strong><br>Le chat, la messagerie et les échanges sont réservés aux membres abonnés — une garantie de sérieux pour tous.</p>
    <div class="pricing-cards">
      <!-- GRATUIT -->
      <div class="price-card inview inview-hidden" style="transition-delay:.1s">
        <div class="price-name">Inscription</div>
        <div class="price-tagline">Pour commencer</div>
        <div class="price-value">Gratuit <small>pour toujours</small></div>
        <div class="price-section-title">Inclus</div>
        <div class="price-feature"><span class="price-feature-check">✓</span><span class="price-feature-text">Créer ton profil complet</span></div>
        <div class="price-feature"><span class="price-feature-check">✓</span><span class="price-feature-text">Parcourir les profils vérifiés</span></div>
        <div class="price-feature"><span class="price-feature-check">✓</span><span class="price-feature-text">Voir les suggestions de l'algorithme</span></div>
        <div class="price-feature"><span class="price-feature-check">✓</span><span class="price-feature-text">Ajouter en favoris</span></div>
        <div class="price-divider"></div>
        <div class="price-lock-badge">🔒 Nécessite un abonnement</div>
        <div class="price-feature"><span class="price-feature-check locked">✗</span><span class="price-feature-text locked-text">Messagerie &amp; Chat</span></div>
        <div class="price-feature"><span class="price-feature-check locked">✗</span><span class="price-feature-text locked-text">Envoyer des demandes</span></div>
        <div class="price-feature"><span class="price-feature-check locked">✗</span><span class="price-feature-text locked-text">Voir qui t'a liké</span></div>
        <button class="price-btn outline" onclick="openAuth()">Créer mon profil</button>
      </div>
      <!-- PREMIUM -->
      <div class="price-card premium inview inview-hidden" style="transition-delay:.2s">
        <div class="price-badge">✦ ABONNEMENT</div>
        <div class="price-name">Expérience Complète</div>
        <div class="price-tagline">Pour trouver vraiment</div>
        <div class="price-value italic-price">Tarif à venir</div>
        <div class="price-section-title">Tout le gratuit +</div>
        <div class="price-feature"><span class="price-feature-check">✦</span><span class="price-feature-text premium-feat">Chat &amp; messagerie illimités</span></div>
        <div class="price-feature"><span class="price-feature-check">✓</span><span class="price-feature-text premium-feat">Envoyer des demandes</span></div>
        <div class="price-feature"><span class="price-feature-check">✓</span><span class="price-feature-text premium-feat">Voir qui t'a liké</span></div>
        <div class="price-feature"><span class="price-feature-check">✓</span><span class="price-feature-text premium-feat">Profil mis en avant</span></div>
        <div class="price-feature"><span class="price-feature-check">✓</span><span class="price-feature-text premium-feat">Support prioritaire</span></div>
        <button class="price-btn filled" onclick="openAuth()">Je suis intéressé →</button>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section id="faq">
  <div class="faq-inner">
    <div class="section-head inview inview-hidden">
      <h2 class="section-title">Questions fréquentes</h2>
    </div>
    <div class="faq-list">
      <div class="faq-item inview inview-hidden" style="transition-delay:.1s">
        <button class="faq-btn" onclick="toggleFAQ(this)"><span class="faq-q">L'inscription est vraiment gratuite?</span><span class="faq-icon">+</span></button>
        <div class="faq-answer"><div class="faq-answer-inner">Oui, l'inscription et la création de profil sont entièrement gratuites et le resteront toujours. Vous pouvez parcourir les profils et utiliser notre algorithme de matching sans payer. Le chat, la messagerie et l'envoi de demandes nécessitent un abonnement.</div></div>
      </div>
      <div class="faq-item inview inview-hidden" style="transition-delay:.2s">
        <button class="faq-btn" onclick="toggleFAQ(this)"><span class="faq-q">Pourquoi l'abonnement rend le service plus sérieux?</span><span class="faq-icon">+</span></button>
        <div class="faq-answer"><div class="faq-answer-inner">Un abonnement payant garantit que chaque personne qui vous contacte a fait une démarche volontaire et sérieuse. Cela élimine les profils fantaisistes et assure que vos échanges sont toujours avec des personnes réellement motivées.</div></div>
      </div>
      <div class="faq-item inview inview-hidden" style="transition-delay:.3s">
        <button class="faq-btn" onclick="toggleFAQ(this)"><span class="faq-q">Comment se faire vérifier?</span><span class="faq-icon">+</span></button>
        <div class="faq-answer"><div class="faq-answer-inner">Envoyez une pièce d'identité valide via notre formulaire sécurisé. Notre équipe valide votre profil sous 24-48h. La vérification est gratuite et renforce la confiance de la communauté.</div></div>
      </div>
      <div class="faq-item inview inview-hidden" style="transition-delay:.4s">
        <button class="faq-btn" onclick="toggleFAQ(this)"><span class="faq-q">Mes données sont-elles sécurisées?</span><span class="faq-icon">+</span></button>
        <div class="faq-answer"><div class="faq-answer-inner">Absolument. Nous utilisons un chiffrement de bout en bout et ne partageons jamais vos données personnelles avec des tiers. Votre confidentialité est notre priorité absolue.</div></div>
      </div>
      <div class="faq-item inview inview-hidden" style="transition-delay:.5s">
        <button class="faq-btn" onclick="toggleFAQ(this)"><span class="faq-q">Peut-on se désabonner à tout moment?</span><span class="faq-icon">+</span></button>
        <div class="faq-answer"><div class="faq-answer-inner">Oui, vous pouvez vous désabonner à tout moment depuis les paramètres de votre compte. Votre profil reste actif en mode gratuit. Aucun frais caché, aucune contrainte.</div></div>
      </div>
    </div>
  </div>
</section>

<!-- BLOG / MAGAZINE -->
<section id="blog">
  <div class="blog-inner">
    <div class="blog-header inview inview-hidden">
      <div><p class="section-label">Magazine</p><h2 class="section-title" style="font-size:clamp(1.8rem,3vw,2.5rem)">À lire</h2></div>
      <a href="#" class="blog-link">Tous les articles →</a>
    </div>
    <div class="blog-grid">
      <!-- Article 1 — FEATURED -->
      <div class="blog-card featured inview inview-hidden" onclick="openArticle(0)">
        <div class="blog-img-wrap" style="height:280px;background:linear-gradient(135deg,#1E3A8A,#0A1F4A)">
          <div class="blog-emoji-cover" style="font-size:5rem">💍</div>
          <span class="blog-tag">Mariage</span>
          <div class="blog-img-overlay"></div>
        </div>
        <div class="blog-body">
          <h3 class="blog-title big">Les 7 questions essentielles à poser avant de s'engager</h3>
          <p class="blog-excerpt">Avant de prendre une décision aussi importante que le mariage, certaines conversations s'imposent. Voici les sujets que vous devez aborder avec votre prétendant(e) pour éviter les malentendus et construire sur des bases solides.</p>
          <div class="blog-meta"><span class="blog-time">6 min de lecture</span><span class="blog-read">Lire l'article →</span></div>
        </div>
      </div>
      <!-- Article 2 -->
      <div class="blog-card inview inview-hidden" style="transition-delay:.15s" onclick="openArticle(1)">
        <div class="blog-img-wrap short" style="background:linear-gradient(135deg,#2D8659,#1a5c3a)">
          <div class="blog-emoji-cover">✍️</div>
          <span class="blog-tag">Profil</span>
          <div class="blog-img-overlay"></div>
        </div>
        <div class="blog-body">
          <h3 class="blog-title">Comment rédiger un profil matrimonial irrésistible</h3>
          <p class="blog-excerpt">Votre profil est votre première impression. Voici comment présenter votre personnalité, vos valeurs et vos intentions avec authenticité et élégance.</p>
          <div class="blog-meta"><span class="blog-time">4 min de lecture</span><span class="blog-read">Lire →</span></div>
        </div>
      </div>
      <!-- Article 3 -->
      <div class="blog-card inview inview-hidden" style="transition-delay:.3s" onclick="openArticle(2)">
        <div class="blog-img-wrap short" style="background:linear-gradient(135deg,#7C3AED,#4C1D95)">
          <div class="blog-emoji-cover">👁️</div>
          <span class="blog-tag">Sécurité</span>
          <div class="blog-img-overlay"></div>
        </div>
        <div class="blog-body">
          <h3 class="blog-title">5 signes qu'un profil matrimonial est sincère</h3>
          <p class="blog-excerpt">Dans la recherche d'un partenaire sérieux, savoir reconnaître les signaux d'authenticité peut vous éviter de perdre du temps et de l'énergie.</p>
          <div class="blog-meta"><span class="blog-time">5 min de lecture</span><span class="blog-read">Lire →</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA FINAL -->
<section id="cta-final">
  <div class="bg-glow" style="top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:400px;background:radial-gradient(ellipse,rgba(212,175,55,.12) 0%,transparent 70%)"></div>
  <div class="cta-inner">
    <h2 class="cta-title inview inview-hidden">Tu es prêt(e)?</h2>
    <p class="cta-desc inview inview-hidden" style="transition-delay:.2s">Rejoins des milliers de Sénégalais qui cherchent leur moitié sérieusement.<br><strong style="color:#D4AF37">Inscription gratuite.</strong> Chat disponible avec abonnement.</p>
    <div class="cta-btns inview inview-hidden" style="transition-delay:.35s">
      <button class="cta-btn-main" onclick="openAuth()">Créer mon profil gratuit</button>
      <button class="cta-btn-sec" onclick="scrollToId('pricing')">Voir les tarifs</button>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer id="contact-section" class="bg-[#0F172A] text-gray-300 py-16 font-sans border-t-4 border-[#D4AF37]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
      
      <!-- COL 1 -->
      <div class="lg:col-span-1 flex flex-col items-start">
        <a class="flex items-center gap-2 mb-4" href="#" style="text-decoration:none">
          <svg width="40" height="40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="#0F172A" stroke="#D4AF37" stroke-width="4"/>
            <ellipse cx="37" cy="57" rx="18" ry="18" fill="none" stroke="#D4AF37" stroke-width="5.5"/>
            <ellipse cx="60" cy="44" rx="18" ry="18" fill="none" stroke="#D4AF37" stroke-width="5.5" opacity="0.8"/>
            <path d="M 37 39 A 18 18 0 0 1 52 43" fill="none" stroke="#D4AF37" stroke-width="6" stroke-linecap="round"/>
            <polygon points="60,20 66,28 60,34 54,28" fill="#FFFBF0"/>
            <circle cx="60" cy="27" r="2.5" fill="#D4AF37"/>
          </svg>
          <span class="text-white font-serif font-bold text-2xl tracking-wide">Wétali</span>
        </a>
        <p class="text-sm text-gray-400 leading-relaxed mb-6">
          Ta moitié, par confiance et respect. La plateforme matrimoniale sérieuse pour la diaspora sénégalaise.
        </p>
        <button onclick="openAuth()" class="bg-[#D4AF37] hover:bg-[#b8962e] transition-colors text-black font-semibold text-sm py-2.5 px-5 rounded-full mb-6 w-full sm:w-auto text-left flex justify-between items-center group">
          <span>Rejoindre Wétali</span>
          <span class="transform group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <div class="flex items-center gap-2 border border-[#D4AF37]/50 rounded-lg py-2 px-3 bg-transparent">
          <svg class="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">RGPD</span>
            <span class="text-xs text-[#D4AF37] font-semibold leading-none mt-1">100% Conforme</span>
          </div>
        </div>
      </div>

      <!-- COL 2 -->
      <div>
        <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Navigation</h4>
        <ul class="space-y-3 text-sm">
          <li><button onclick="scrollToId('hero')" class="hover:text-[#D4AF37] transition-colors">Accueil</button></li>
          <li><button onclick="scrollToId('how-it-works')" class="hover:text-[#D4AF37] transition-colors">Comment ça marche</button></li>
          <li><button onclick="scrollToId('pricing')" class="hover:text-[#D4AF37] transition-colors">Tarifs</button></li>
          <li><button onclick="scrollToId('blog')" class="hover:text-[#D4AF37] transition-colors">Blog</button></li>
          <li><button onclick="scrollToId('faq')" class="hover:text-[#D4AF37] transition-colors">FAQ</button></li>
          <li><button onclick="scrollToId('contact-section')" class="hover:text-[#D4AF37] transition-colors">Contact</button></li>
        </ul>
      </div>

      <!-- COL 3 -->
      <div>
        <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Rencontre</h4>
        <ul class="space-y-3 text-sm">
          <li><a href="#" class="hover:text-[#D4AF37] transition-colors">Rencontre Paris</a></li>
          <li><a href="#" class="hover:text-[#D4AF37] transition-colors">Rencontre Marseille</a></li>
          <li><a href="#" class="hover:text-[#D4AF37] transition-colors">Rencontre Montréal</a></li>
          <li><a href="#" class="hover:text-[#D4AF37] transition-colors">Rencontre New York</a></li>
          <li><a href="#" class="hover:text-[#D4AF37] transition-colors">Rencontre Londres</a></li>
          <li><a href="#" class="hover:text-[#D4AF37] transition-colors">Rencontre Milan</a></li>
          <li><a href="#" class="hover:text-[#D4AF37] transition-colors">Rencontre Bruxelles</a></li>
          <li class="pt-2"><a href="#" class="text-[#D4AF37] hover:text-white font-medium transition-colors text-xs uppercase tracking-wide">Toutes les villes →</a></li>
        </ul>
      </div>

      <!-- COL 4 -->
      <div>
        <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Légal</h4>
        <ul class="space-y-3 text-sm">
          <li><button onclick="openLegal('rules')" class="hover:text-[#D4AF37] transition-colors text-left w-full">Règlement</button></li>
          <li><button onclick="openLegal('privacy')" class="hover:text-[#D4AF37] transition-colors text-left w-full">Confidentialité</button></li>
          <li><button onclick="openLegal('terms')" class="hover:text-[#D4AF37] transition-colors text-left w-full">Mentions légales</button></li>
          <li><button onclick="openLegal('cgv')" class="hover:text-[#D4AF37] transition-colors text-left w-full">CGV</button></li>
          <li><button onclick="openLegal('dpa')" class="hover:text-[#D4AF37] transition-colors text-left w-full">Accord de traitement (DPA)</button></li>
        </ul>
      </div>

      <!-- COL 5 -->
      <div>
        <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Contact</h4>
        <ul class="space-y-4 text-sm">
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <a href="mailto:contact@wetali.app" class="hover:text-[#D4AF37] transition-colors">contact@wetali.app</a>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span class="text-gray-400">Dakar, Sénégal</span>
          </li>
        </ul>
      </div>
      
    </div>

    <!-- BOTTOM BAR -->
    <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
      <div>© 2026 Wétali. Tous droits réservés.</div>
      <div class="flex items-center gap-1">Fait avec <span class="text-red-500 text-sm">❤️</span> pour la diaspora</div>
      <div>v1.0.0</div>
    </div>
  </div>
</footer>

<!-- AUTH OVERLAY - NOT NEEDED ANYMORE BUT KEPT FOR STRUCTURE IF NEEDED -->
<div id="auth-overlay" style="display:none;"></div>

<!-- ARTICLE MODAL -->
<div id="article-overlay" onclick="handleArticleOverlayClick(event)">
  <div class="article-box" id="article-box">
    <button class="article-close" onclick="closeArticle()">✕</button>
    <div id="article-content"></div>
  </div>
</div>
`;

export default function LandingPage({ onEnterApp }) {
  const [legalPage, setLegalPage] = useState(null);

  useEffect(() => {
    // Inject fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap';
    document.head.appendChild(link);

    const handleScroll = () => {
      document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('inview-hidden');
          entry.target.classList.add('inview-visible');
          if (entry.target.id === 'vision-line') entry.target.style.width = '80px';
        }
      });
    }, { threshold: 0.15 });

    setTimeout(() => {
      document.querySelectorAll('.inview').forEach(el => observer.observe(el));
      const vl = document.getElementById('vision-line');
      if (vl) observer.observe(vl);

      // Set image dynamically
      const heroEl = document.getElementById('hero-photo');
      if (heroEl) {
        heroEl.onload = () => {
          heroEl.style.opacity = '1';
          const fallback = document.getElementById('hero-fallback');
          if(fallback) fallback.style.display = 'none';
        };
        heroEl.onerror = () => { heroEl.style.display = 'none'; };
        heroEl.src = heroImg;
      }
    }, 100);

    // Global handlers
    window.scrollToId = (id) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('drawer')?.classList.remove('open');
      document.getElementById('drawer-overlay')?.classList.remove('show');
    };

    window.toggleDrawer = () => {
      document.getElementById('drawer')?.classList.toggle('open');
      document.getElementById('drawer-overlay')?.classList.toggle('show');
    };

    window.openAuth = () => {
      onEnterApp();
    };
    window.closeAuth = () => {};

    window.openLegal = (page) => {
      setLegalPage(page);
      window.scrollTo(0, 0);
    };
    window.toggleFAQ = (btn) => {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-btn.open').forEach(b => b.classList.remove('open'));
      if (!isOpen) { answer.classList.add('open'); btn.classList.add('open'); }
    };

    const articles = [
      {
        tag: `Mariage`,
        title: `Les 7 questions essentielles à poser avant de s'engager`,
        meta: `Par l'équipe Wétali · 6 min de lecture · Conseils matrimoniaux`,
        body: `
          <p>Le mariage est l'une des décisions les plus importantes de votre vie. Avant de dire « oui », il est indispensable d'avoir des conversations honnêtes avec votre prétendant(e). Voici les 7 sujets que vous ne devez pas éviter.</p>
          <h3>1. La vision de la famille</h3>
          <p>Souhaitez-vous des enfants ? Combien ? Quel rôle chacun jouera-t-il dans l'éducation ? Ces questions semblent évidentes, mais beaucoup de couples les évitent par gêne — et le regrettent ensuite.</p>
          <h3>2. Le rapport à la religion et aux pratiques</h3>
          <p>Dans la communauté sénégalaise, la foi occupe souvent une place centrale. Comment votre partenaire pratique-t-il l'islam ? Quelle importance accordez-vous au dahira, à la prière en commun, aux fêtes religieuses ? La compatibilité spirituelle est une fondation solide.</p>
          <h3>3. L'organisation financière du foyer</h3>
          <p>Qui gérera les finances ? Les comptes seront-ils partagés ou séparés ? Quelle est la contribution attendue de chacun ? Ces discussions évitent les malentendus et les conflits futurs.</p>
          <h3>4. La relation avec les familles</h3>
          <blockquote>En Afrique, on ne marie pas seulement deux personnes, on unit deux familles.</blockquote>
          <p>Quelle place occupera la belle-famille dans votre vie quotidienne ? Les attentes sont-elles claires des deux côtés ? Discuter de cela en amont évite des tensions inutiles.</p>
          <h3>5. Le lieu de vie</h3>
          <p>Vivrez-vous en France, au Sénégal, ou ailleurs ? L'un de vous prévoit-il de rentrer au pays un jour ? La mobilité géographique peut créer de vraies tensions si elle n'est pas anticipée.</p>
          <h3>6. Les rôles dans le couple</h3>
          <p>Les attentes de chacun concernant les rôles domestiques, professionnels et parentaux doivent être alignées. Évitez les suppositions — exprimez clairement ce que vous attendez.</p>
          <h3>7. La gestion des conflits</h3>
          <p>Tout couple traverse des désaccords. La vraie question est : comment les gérez-vous ? La capacité à communiquer avec respect et à chercher un compromis est la clé de la longévité d'une union.</p>
          <p style="margin-top:1.5rem;padding:1rem;background:rgba(212,175,55,.08);border-radius:12px;border-left:3px solid #D4AF37"><strong>Conclusion :</strong> Ces conversations peuvent sembler difficiles au début, mais elles construisent la confiance. Sur Wétali, nos profils encouragent chaque membre à exprimer clairement ses valeurs et ses attentes dès le départ.</p>
        `
      },
      {
        tag: `Profil`,
        title: `Comment rédiger un profil matrimonial irrésistible`,
        meta: `Par l'équipe Wétali · 4 min de lecture · Conseils pratiques`,
        body: `
          <p>Sur Wétali, votre profil est votre carte de visite. C'est souvent la première — et parfois la seule — chose qu'un prétendant(e) verra avant de décider de vous contacter. Voici comment vous démarquer.</p>
          <h3>Soyez authentique, pas parfait</h3>
          <p>Il est tentant de se présenter sous son meilleur jour en édulcorant la réalité. Mais un profil honnête attire des personnes vraiment compatibles. Mentionnez vos vraies valeurs, votre style de vie actuel, et ce que vous cherchez réellement.</p>
          <h3>Exprimez vos valeurs clairement</h3>
          <p>Au lieu d'écrire « Je suis gentil et sérieux » (ce que tout le monde dit), soyez spécifique :</p>
          <ul>
            <li>« La prière du Fajr est une priorité pour moi »</li>
            <li>« Je suis très attaché à ma famille à Thiès »</li>
            <li>« Je cherche quelqu'un avec qui construire un foyer calme et équilibré »</li>
          </ul>
          <h3>Parlez de votre vision du mariage</h3>
          <p>Décrivez brièvement ce que le mariage représente pour vous. Est-ce un projet de vie commun ? Une alliance de familles ? Une aventure à deux ? Cela aide l'autre à savoir si vos visions sont alignées.</p>
          <h3>La photo : naturelle et respectueuse</h3>
          <p>Une photo claire, souriante, habillée avec élégance fait toute la différence. Évitez les selfies flous ou les photos de groupe où on ne sait pas qui vous êtes. Sur Wétali, les photos sont vérifiées pour garantir l'authenticité.</p>
          <h3>Ce qu'il ne faut pas écrire</h3>
          <blockquote>« Je n'aime pas les jeux » ou « Je cherche quelqu'un de sérieux » — tout le monde le dit. Montrez-le plutôt à travers vos valeurs et vos actions.</blockquote>
          <p>Votre profil doit donner envie d'en savoir plus. La concision et l'authenticité sont vos meilleurs alliés.</p>
        `
      },
      {
        tag: `Sécurité`,
        title: `5 signes qu'un profil matrimonial est sincère`,
        meta: `Par l'équipe Wétali · 5 min de lecture · Sécurité & confiance`,
        body: `
          <p>Dans la recherche d'un partenaire sérieux, savoir reconnaître les profils authentiques est une compétence précieuse. Voici 5 indicateurs fiables.</p>
          <h3>1. Le profil est vérifié ✓</h3>
          <p>Sur Wétali, la vérification d'identité est un gage de sérieux. Un profil vérifié signifie que la personne a accepté de fournir une pièce d'identité et que notre équipe a confirmé son authenticité. C'est le premier filtre de confiance.</p>
          <h3>2. Le profil est complet et cohérent</h3>
          <p>Une personne sérieuse prend le temps de remplir son profil entièrement. Si les informations sont vagues, contradictoires ou superficielles, c'est un signe de manque d'engagement ou d'honnêteté.</p>
          <h3>3. Les intentions sont clairement exprimées</h3>
          <p>Un profil sincère indique clairement ce qu'il recherche : mariage, cadre familial, valeurs religieuses. L'ambiguïté volontaire est souvent un signal d'alerte.</p>
          <h3>4. La communication est respectueuse et progressive</h3>
          <p>Une personne sérieuse ne se précipite pas. Elle prend le temps de se découvrir mutuellement, respecte vos limites et ne demande pas d'informations personnelles (numéro de téléphone, adresse) dès les premiers échanges.</p>
          <h3>5. La famille est mentionnée naturellement</h3>
          <blockquote>Dans notre culture, quelqu'un qui cherche vraiment parle de sa famille, de ses origines, de son environnement — pas uniquement de lui-même.</blockquote>
          <p>Une personne ancrée dans des valeurs familiales saines en parle spontanément. C'est souvent un très bon signe de maturité et de sérieux.</p>
          <h3>Ce que fait Wétali pour vous protéger</h3>
          <ul>
            <li>Vérification d'identité pour chaque membre</li>
            <li>Modération des messages par notre équipe</li>
            <li>Signalement rapide de tout comportement suspect</li>
            <li>Aucune donnée personnelle partagée sans votre accord</li>
          </ul>
          <p style="margin-top:1.5rem;padding:1rem;background:rgba(212,175,55,.08);border-radius:12px;border-left:3px solid #D4AF37">Sur Wétali, votre sécurité n'est pas une option — c'est notre engagement fondamental.</p>
        `
      }
    ];

    window.openArticle = (index) => {
      const a = articles[index];
      const content = document.getElementById('article-content');
      if (content) {
        content.innerHTML = `<span class="article-tag">${a.tag}</span><h1 class="article-title">${a.title}</h1><div class="article-meta">${a.meta}</div><div class="article-body">${a.body}</div>`;
      }
      document.getElementById('article-overlay')?.classList.add('show');
      document.body.style.overflow = 'hidden';
    };

    window.closeArticle = () => {
      document.getElementById('article-overlay')?.classList.remove('show');
      document.body.style.overflow = '';
    };

    window.handleArticleOverlayClick = (e) => {
      if (e.target === document.getElementById('article-overlay')) window.closeArticle();
    };

    const steps = [
      `<div style="text-align:center;animation:fadeIn 1s"><div style="font-family:'Playfair Display',serif;font-size:4rem;font-weight:700;color:#D4AF37;animation:glowPulse 2s infinite">Wétali</div><div style="font-family:'Inter',sans-serif;font-size:1rem;color:rgba(255,251,240,.7);margin-top:8px;letter-spacing:.2em;text-transform:uppercase">Matrimonial Sénégalais</div></div>`,
      `<div style="text-align:center;animation:fadeIn .8s"><div style="font-size:5rem;margin-bottom:16px">👫</div><div style="font-family:'Playfair Display',serif;font-size:1.8rem;color:#FFFBF0;font-weight:600">Pour ceux qui cherchent vraiment</div></div>`,
      `<div style="text-align:center;animation:fadeIn .8s"><div style="width:80px;height:80px;border-radius:50%;margin:0 auto 1rem;background:linear-gradient(135deg,#D4AF37,#8B6914);display:flex;align-items:center;justify-content:center;font-size:2rem;animation:pulseGold 2s infinite">✓</div><div style="font-family:'Playfair Display',serif;font-size:1.6rem;color:#FFFBF0;font-weight:600">Profils Vérifiés</div><div style="font-family:'Inter',sans-serif;font-size:.9rem;color:rgba(255,251,240,.6);margin-top:8px">Inscription gratuite · Chat avec abonnement</div></div>`,
      `<div style="width:80%;display:flex;flex-direction:column;gap:12px;animation:fadeIn .6s"><div style="display:flex;justify-content:flex-end"><div style="background:#1E3A8A;color:#FFFBF0;border-radius:18px 18px 4px 18px;padding:10px 16px;font-family:'Inter',sans-serif;font-size:.85rem;max-width:60%">Salaam, votre profil est remarquable 🌟</div></div><div style="display:flex;justify-content:flex-start"><div style="background:linear-gradient(135deg,#D4AF37,#B8960C);color:#0F172A;border-radius:18px 18px 18px 4px;padding:10px 16px;font-family:'Inter',sans-serif;font-size:.85rem;max-width:60%;font-weight:500">Merci! Raconte-moi ta vision du mariage ✨</div></div><div style="display:flex;justify-content:flex-end"><div style="background:#1E3A8A;color:#FFFBF0;border-radius:18px 18px 4px 18px;padding:10px 16px;font-family:'Inter',sans-serif;font-size:.85rem;max-width:60%">Une union dans le respect et l'amour sincère 💎</div></div></div>`,
      `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:relative;animation:fadeIn .8s"><div style="position:absolute;left:10%;top:20%;font-size:24px;color:#D4AF37;animation:floatHeart 3s 0s infinite ease-in-out">♥</div><div style="position:absolute;left:80%;top:15%;font-size:18px;color:#D4AF37;animation:floatHeart 3s .3s infinite ease-in-out">♥</div><div style="position:absolute;left:20%;top:70%;font-size:22px;color:#D4AF37;animation:floatHeart 3s .6s infinite ease-in-out">♥</div><div style="position:absolute;left:75%;top:65%;font-size:20px;color:#D4AF37;animation:floatHeart 3s .2s infinite ease-in-out">♥</div><div style="font-family:'Playfair Display',serif;font-size:1.5rem;color:#D4AF37;text-align:center">Des connexions sincères<br><span style="font-size:.9rem;color:rgba(255,251,240,.7);font-style:italic">au-delà des apparences</span></div></div>`,
      `<div style="text-align:center;animation:matchPop .6s cubic-bezier(.34,1.56,.64,1)"><div style="display:flex;align-items:center;justify-content:center;margin-bottom:1rem"><div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#D4AF37,#8B6914);display:flex;align-items:center;justify-content:center;font-size:1.5rem;z-index:2;border:3px solid #0F172A">👩🏾</div><div style="margin-left:-10px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#1E3A8A,#0F172A);display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:3px solid #D4AF37">👨🏾</div></div><div style="font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:700;color:#D4AF37;animation:glowPulse 1.5s infinite;letter-spacing:.1em">MATCH!</div><div style="font-family:'Inter',sans-serif;font-size:.85rem;color:rgba(255,251,240,.7);margin-top:8px">Compatibles à 94%</div></div>`
    ];
    let currentStep = 0;
    let demoInterval;
    const nextStep = () => {
      currentStep = (currentStep + 1) % steps.length;
      const sc = document.getElementById('screen-content');
      if (sc) {
        sc.style.opacity = '0';
        setTimeout(() => { sc.innerHTML = steps[currentStep]; sc.style.opacity = '1'; }, 300);
      }
    };

    setTimeout(() => {
      const sc = document.getElementById('screen-content');
      if (sc) sc.innerHTML = steps[0];
      const demoObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => { demoInterval = setInterval(nextStep, 4000); }, 800);
            demoObs.disconnect();
          }
        });
      }, { threshold: 0.2 });
      const demoEl = document.getElementById('demo');
      if (demoEl) demoObs.observe(demoEl);
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      if (demoInterval) clearInterval(demoInterval);
      if (document.head.contains(link)) document.head.removeChild(link);
      
      delete window.scrollToId;
      delete window.toggleDrawer;
      delete window.openAuth;
      delete window.closeAuth;
      delete window.toggleFAQ;
      delete window.openArticle;
      delete window.closeArticle;
      delete window.handleArticleOverlayClick;
      delete window.openLegal;
    };
  }, [onEnterApp]);

  if (legalPage === 'terms') return <TermsPage onBack={() => setLegalPage(null)} />;
  if (legalPage === 'privacy') return <PrivacyPage onBack={() => setLegalPage(null)} />;
  if (legalPage === 'cgv') return <CGVPage onBack={() => setLegalPage(null)} />;
  if (legalPage === 'dpa') return <DPAPage onBack={() => setLegalPage(null)} />;
  if (legalPage === 'rules') return <RulesPage onBack={() => setLegalPage(null)} />;

  return <div dangerouslySetInnerHTML={{ __html: landingHtml }} />;
}
