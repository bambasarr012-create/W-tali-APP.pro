import React, { useEffect, useRef, useState } from 'react';

// ============================================================
// WÉTALI — LANDING PAGE LUXE
// Bleu Royal #1E3A8A | Or #D4AF37 | Noir #0F172A | Crème #FFFBF0
// ============================================================

// ─── UTILITY: Intersection Observer Hook ───────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── LOGO COMPONENT ────────────────────────────────────────
function WetaliLogo({ size = 'md', light = false }) {
  const sizes = { sm: 32, md: 44, lg: 56 };
  const s = sizes[size] || 44;
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: s, height: s, position: 'relative' }}>
        <svg width={s} height={s} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill={light ? '#FFFBF0' : '#0F172A'} stroke="#D4AF37" strokeWidth="4"/>
          <ellipse cx="37" cy="57" rx="18" ry="18" fill="none" stroke="#D4AF37" strokeWidth="5.5"/>
          <ellipse cx="60" cy="44" rx="18" ry="18" fill="none" stroke="#D4AF37" strokeWidth="5.5" opacity="0.8"/>
          <path d="M 37 39 A 18 18 0 0 1 52 43" fill="none" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round"/>
          <polygon points="60,20 66,28 60,34 54,28" fill={light ? '#0F172A' : '#FFFBF0'}/>
          <circle cx="60" cy="27" r="2.5" fill="#D4AF37"/>
        </svg>
      </div>
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 700,
        fontSize: size === 'sm' ? '1.1rem' : size === 'lg' ? '1.8rem' : '1.4rem',
        color: light ? '#FFFBF0' : '#0F172A',
        letterSpacing: '0.04em'
      }}>
        Wétali
      </span>
    </div>
  );
}

// ─── 1. NAVBAR ─────────────────────────────────────────────
function Navbar({ onJoin }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 2rem',
        transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
        background: scrolled ? 'rgba(15,23,42,0.97)' : 'rgba(255,251,240,0.15)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(212,175,55,0.2)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <WetaliLogo size="md" light={scrolled} />

          {/* Desktop Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="lp-hidden-mobile">
            {[['decouvrir','Découvrir'], ['how-it-works','Comment ça marche'], ['contact-section','Contact']].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', fontWeight: 500,
                color: scrolled ? 'rgba(255,251,240,0.85)' : '#0F172A',
                letterSpacing: '0.03em', transition: 'color 0.3s', padding: '4px 0',
              }}
              onMouseEnter={e => e.target.style.color = '#D4AF37'}
              onMouseLeave={e => e.target.style.color = scrolled ? 'rgba(255,251,240,0.85)' : '#0F172A'}
              >{label}</button>
            ))}
            <button id="nav-join-btn" onClick={onJoin} style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)',
              color: '#0F172A', border: 'none', cursor: 'pointer',
              padding: '10px 28px', borderRadius: 50,
              fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '0.9rem',
              letterSpacing: '0.05em', boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 30px rgba(212,175,55,0.6)'; }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 20px rgba(212,175,55,0.4)'; }}
            >Rejoindre</button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: scrolled ? '#FFFBF0' : '#0F172A', padding: 8
          }} className="lp-show-mobile">
            <div style={{ width: 24, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  display: 'block', height: 2, background: 'currentColor', borderRadius: 2,
                  transition: 'all 0.3s',
                  transform: menuOpen && i === 0 ? 'rotate(45deg) translate(5px,5px)' : menuOpen && i === 1 ? 'scaleX(0)' : menuOpen && i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'none'
                }}/>
              ))}
            </div>
          </button>
        </div>
      </nav>

      {/* Side Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 280, zIndex: 999,
        background: '#0F172A', borderLeft: '1px solid rgba(212,175,55,0.3)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', padding: '6rem 2rem 2rem', gap: '1.5rem'
      }}>
        {[['decouvrir','Découvrir'], ['how-it-works','Comment ça marche'], ['contact-section','Contact']].map(([id, label]) => (
          <button key={id} onClick={() => scrollTo(id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', fontWeight: 500,
            color: '#FFFBF0', textAlign: 'left', padding: '12px 0',
            borderBottom: '1px solid rgba(212,175,55,0.15)', transition: 'color 0.3s'
          }}>{label}</button>
        ))}
        <button onClick={() => { onJoin(); setMenuOpen(false); }} style={{
          marginTop: '1rem', background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
          color: '#0F172A', border: 'none', cursor: 'pointer',
          padding: '14px 28px', borderRadius: 50,
          fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '1rem',
        }}>Rejoindre</button>
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.5)' }}/>}

      <style>{`
        .lp-hidden-mobile { display: flex !important; }
        .lp-show-mobile { display: none !important; }
        @media (max-width: 768px) {
          .lp-hidden-mobile { display: none !important; }
          .lp-show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}

// ─── 2. HERO ───────────────────────────────────────────────
function HeroSection({ onStart }) {
  const [ref, inView] = useInView(0.1);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section ref={ref} style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #FFFBF0 0%, #F5EFE0 50%, #EDE4CE 100%)',
      display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative', paddingTop: 72
    }}>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: -50, left: -50, width: 400, height: 400, background: 'radial-gradient(circle, rgba(30,58,138,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}/>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="lp-hero-grid">
          
          {/* LEFT — Text */}
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1)' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
              border: '1px solid rgba(212,175,55,0.4)', borderRadius: 50,
              padding: '6px 16px', marginBottom: '1.5rem'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }}/>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', fontWeight: 600, color: '#B8960C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Matrimonial Premium</span>
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(3.5rem, 7vw, 6rem)', lineHeight: 1.05, color: '#0F172A', margin: '0 0 1.5rem', fontWeight: 700 }}>
              Wétali.<br/>
              <span style={{ color: '#1E3A8A', fontStyle: 'italic' }}>Sérieux.</span>
            </h1>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.15rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 440 }}>
              Une plateforme matrimoniale pour Sénégalais diaspora qui cherchent vraiment.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {[['✦', 'Profils vérifiés'], ['◈', 'Matching intelligent'], ['⬡', 'Chat sécurisé']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#D4AF37', fontSize: '0.9rem' }}>{icon}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
              <button id="hero-start-btn" onClick={onStart} style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #C09B2A 100%)',
                color: '#0F172A', border: 'none', cursor: 'pointer',
                padding: '16px 40px', borderRadius: 50,
                fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '1.05rem',
                letterSpacing: '0.03em', boxShadow: '0 8px 32px rgba(212,175,55,0.45)', transition: 'all 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 48px rgba(212,175,55,0.7)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,175,55,0.45)'; }}
              >Commencer</button>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#9CA3AF', paddingLeft: 8 }}>
                Inscription gratuite · 5 minutes · Confidentiel
              </span>
            </div>
          </div>

          {/* RIGHT — Image */}
          <div style={{
            position: 'relative',
            opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(60px)',
            transition: 'all 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s'
          }}>
            <div style={{ position: 'absolute', inset: -12, border: '3px solid #D4AF37', borderRadius: 24, zIndex: 0, boxShadow: '0 0 40px rgba(212,175,55,0.2), inset 0 0 40px rgba(212,175,55,0.05)' }}/>
            {[{top:-16,left:-16},{top:-16,right:-16},{bottom:-16,left:-16},{bottom:-16,right:-16}].map((pos, i) => (
              <div key={i} style={{ position: 'absolute', ...pos, width: 24, height: 24, border: '3px solid #D4AF37', borderRadius: 4, zIndex: 2 }}/>
            ))}
            <div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '4/5', position: 'relative', zIndex: 1, background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)' }}>
              <img
                src="https://images.unsplash.com/photo-1702985226519-5d8f39a6de1e?w=800&q=80"
                alt="Couple sénégalais élégant en tenue traditionnelle"
                onLoad={() => setImgLoaded(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.8s' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.3) 0%, transparent 60%)' }}/>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .lp-hero-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 768px) {
          .lp-hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
}

// ─── 3. STAT BAR ───────────────────────────────────────────
function StatBar() {
  const [ref, inView] = useInView(0.3);
  const stats = [
    { value: '2 500+', label: 'Membres actifs' },
    { value: '500+', label: 'Mariages réussis' },
    { value: '100%', label: 'Profils vérifiés' }
  ];
  return (
    <section ref={ref} style={{ background: '#0F172A', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', flexWrap: 'wrap' }}>
        {stats.map((s, i) => (
          <React.Fragment key={s.value}>
            <div style={{
              textAlign: 'center', padding: '0.5rem 3rem',
              opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s`
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: '#D4AF37', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: 'rgba(255,251,240,0.6)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
            </div>
            {i < stats.length - 1 && (
              <div style={{ width: 1, height: 50, background: 'linear-gradient(to bottom, transparent, #D4AF37, transparent)', opacity: 0.5 }}/>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

// ─── 4. FEATURES ───────────────────────────────────────────
function FeatureCard({ icon, title, description, large, tall, accent, highlight, delay, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFFFF', border: `1px solid ${hovered ? accent : 'rgba(212,175,55,0.2)'}`,
        borderRadius: 20, padding: large ? '2.5rem' : '1.75rem',
        minHeight: tall ? 380 : 'auto', position: 'relative', overflow: 'hidden',
        boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px ${accent}30` : '0 4px 20px rgba(0,0,0,0.05)',
        transform: `${inView ? 'translateY(0)' : 'translateY(40px)'} ${hovered ? 'scale(1.015)' : 'scale(1)'}`,
        opacity: inView ? 1 : 0,
        transition: `all 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}s, box-shadow 0.3s, border-color 0.3s`,
        cursor: 'default'
      }}
    >
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        background: `radial-gradient(circle, ${accent}10, transparent 70%)`,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.4s', pointerEvents: 'none'
      }}/>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `linear-gradient(135deg, ${accent}15, ${accent}05)`,
        border: `1px solid ${accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', marginBottom: '1.25rem', color: accent
      }}>{icon}</div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: large ? '1.4rem' : '1.15rem', color: '#0F172A', marginBottom: '0.75rem', fontWeight: 700 }}>{title}</h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.92rem', color: '#6B7280', lineHeight: 1.7 }}>{description}</p>
      {highlight && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: '1.5rem',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
          border: '1px solid rgba(212,175,55,0.3)', borderRadius: 50, padding: '5px 14px'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37' }}/>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: '#B8960C' }}>{highlight}</span>
        </div>
      )}
    </div>
  );
}

function FeaturesSection() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="decouvrir" ref={ref} style={{ background: '#FFFBF0', padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          textAlign: 'center', marginBottom: '4rem',
          opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)'
        }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#D4AF37', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Excellence</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0F172A', fontWeight: 700 }}>Pourquoi choisir Wétali?</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }} className="lp-features-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FeatureCard delay={0.1} inView={inView} icon="✦" title="Profils Vérifiés" description="Chaque membre passe par un processus de vérification rigoureux. Ici, vous rencontrez de vraies personnes avec de vraies intentions." large={true} accent="#1E3A8A"/>
            <div style={{ marginLeft: '2rem' }}>
              <FeatureCard delay={0.25} inView={inView} icon="◈" title="Matching Intelligent" description="Notre algorithme analyse vos valeurs, votre vision du mariage et votre culture pour vous présenter des profils vraiment compatibles." large={false} accent="#D4AF37"/>
            </div>
          </div>
          <FeatureCard delay={0.15} inView={inView} icon="⬡" title="Chat Sécurisé & Respectueux" description="Échangez en toute confiance dans un environnement modéré. Nos équipes veillent à ce que chaque interaction reste dans le respect et la dignité." large={true} tall={true} accent="#1E3A8A" highlight="Modération active 24/7"/>
        </div>
      </div>
      <style>{`
        .lp-features-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 768px) { .lp-features-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── 5. NOTRE VISION ───────────────────────────────────────
function VisionSection() {
  const [ref, inView] = useInView(0.2);
  return (
    <section ref={ref} style={{ background: '#0F172A', padding: '120px 2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(30,58,138,0.3) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', top: 40, right: 60, fontFamily: "'Playfair Display', serif", fontSize: '8rem', color: 'rgba(212,175,55,0.06)', fontWeight: 700, lineHeight: 1, userSelect: 'none' }}>"</div>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 600, lineHeight: 1.2, color: '#FFFBF0',
          opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s cubic-bezier(0.4,0,0.2,1)', letterSpacing: '-0.01em'
        }}>
          Pas un swipe.<br/>
          <span style={{ color: '#D4AF37' }}>Une rencontre.</span>
        </p>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', color: 'rgba(255,251,240,0.7)',
          lineHeight: 1.8, maxWidth: 600, margin: '2rem auto 0',
          opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s cubic-bezier(0.4,0,0.2,1) 0.3s'
        }}>
          On a créé Wétali pour ceux qui cherchent une vraie moitié, pas une distraction.
        </p>
        <div style={{
          width: inView ? 80 : 0, height: 2,
          background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
          margin: '2.5rem auto 0', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1) 0.5s'
        }}/>
      </div>
    </section>
  );
}

// ─── 6. VIDEO ANIMÉE LUXE ──────────────────────────────────
function AnimatedScreenContent({ step }) {
  const showFrom = (n) => step >= n;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes lp-floatHeart { 0%,100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes lp-pulse-gold { 0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4); } 50% { box-shadow: 0 0 0 12px rgba(212,175,55,0); } }
        @keyframes lp-slideInRight { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes lp-slideInLeft { from { transform: translateX(-60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes lp-matchPop { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
        @keyframes lp-glowPulse { 0%,100% { text-shadow: 0 0 10px rgba(212,175,55,0.5); } 50% { text-shadow: 0 0 30px rgba(212,175,55,1), 0 0 60px rgba(212,175,55,0.5); } }
        @keyframes lp-fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Step 1: Wétali title */}
      {step === 1 && (
        <div style={{ textAlign: 'center', animation: 'lp-fadeIn 1s' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '4rem', fontWeight: 700, color: '#D4AF37', animation: 'lp-glowPulse 2s infinite' }}>Wétali</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: 'rgba(255,251,240,0.7)', marginTop: 8, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Matrimonial Sénégalais</div>
        </div>
      )}
      {/* Step 2: Couple */}
      {step === 2 && (
        <div style={{ textAlign: 'center', animation: 'lp-fadeIn 0.8s' }}>
          <div style={{ fontSize: '5rem', marginBottom: 16 }}>👫</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#FFFBF0', fontWeight: 600 }}>Pour ceux qui cherchent vraiment</div>
        </div>
      )}
      {/* Step 3: Profils Vérifiés */}
      {step === 3 && (
        <div style={{ textAlign: 'center', animation: 'lp-fadeIn 0.8s' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #D4AF37, #8B6914)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', animation: 'lp-pulse-gold 2s infinite'
          }}>✓</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#FFFBF0', fontWeight: 600 }}>Profils Vérifiés</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: 'rgba(255,251,240,0.6)', marginTop: 8 }}>Chaque profil est authentifié par notre équipe</div>
        </div>
      )}
      {/* Step 4: Messages */}
      {step === 4 && (
        <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: 12, animation: 'lp-fadeIn 0.6s' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', animation: 'lp-slideInRight 0.5s' }}>
            <div style={{ background: '#1E3A8A', color: '#FFFBF0', borderRadius: '18px 18px 4px 18px', padding: '10px 16px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', maxWidth: '60%' }}>
              Salaam, votre profil est remarquable 🌟
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start', animation: 'lp-slideInLeft 0.5s 0.3s both' }}>
            <div style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0F172A', borderRadius: '18px 18px 18px 4px', padding: '10px 16px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', maxWidth: '60%', fontWeight: 500 }}>
              Merci! Raconte-moi ta vision du mariage ✨
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', animation: 'lp-slideInRight 0.5s 0.6s both' }}>
            <div style={{ background: '#1E3A8A', color: '#FFFBF0', borderRadius: '18px 18px 4px 18px', padding: '10px 16px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', maxWidth: '60%' }}>
              Une union dans le respect et l'amour sincère 💎
            </div>
          </div>
        </div>
      )}
      {/* Step 5: Floating hearts */}
      {step === 5 && (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', animation: 'lp-fadeIn 0.8s' }}>
          {[[10,20,0,24],[80,15,0.3,18],[20,70,0.6,22],[75,65,0.2,20],[45,10,0.5,16],[90,50,0.4,14]].map(([x,y,d,sz], i) => (
            <div key={i} style={{
              position: 'absolute', left: `${x}%`, top: `${y}%`,
              fontSize: sz, color: '#D4AF37', animation: `lp-floatHeart 3s ${d}s infinite ease-in-out`
            }}>♥</div>
          ))}
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#D4AF37', textAlign: 'center' }}>
            Des connexions sincères<br/><span style={{ fontSize: '0.9rem', color: 'rgba(255,251,240,0.7)', fontStyle: 'italic' }}>au-delà des apparences</span>
          </div>
        </div>
      )}
      {/* Step 6: Profile cards */}
      {step === 6 && (
        <div style={{ display: 'flex', gap: 16, animation: 'lp-fadeIn 0.6s' }}>
          {[{name:'Mariama',age:28,city:'Paris',emoji:'👩🏾'},{name:'Ibrahima',age:32,city:'Dakar',emoji:'👨🏾'}].map((p, i) => (
            <div key={p.name} style={{
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(212,175,55,0.3)', borderRadius: 16,
              padding: '1.25rem', textAlign: 'center', width: 130,
              animation: `lp-slideInLeft 0.5s ${i * 0.2}s both`
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{p.emoji}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#FFFBF0', fontSize: '0.9rem' }}>{p.name}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'rgba(255,251,240,0.6)', marginTop: 2 }}>{p.age} ans · {p.city}</div>
              <div style={{ marginTop: 10, background: 'linear-gradient(135deg, #D4AF37, #B8960C)', borderRadius: 50, padding: '4px 10px', fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 600, color: '#0F172A' }}>Vérifié ✓</div>
            </div>
          ))}
        </div>
      )}
      {/* Step 7: MATCH */}
      {step === 7 && (
        <div style={{ textAlign: 'center', animation: 'lp-matchPop 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #8B6914)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', zIndex: 2, border: '3px solid #0F172A' }}>👩🏾</div>
            <div style={{ marginLeft: -10, width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #1E3A8A, #0F172A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '3px solid #D4AF37' }}>👨🏾</div>
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: '#D4AF37', animation: 'lp-glowPulse 1.5s infinite', letterSpacing: '0.1em' }}>MATCH!</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: 'rgba(255,251,240,0.7)', marginTop: 8 }}>Vous êtes compatibles à 94%</div>
        </div>
      )}
      {/* Step 8: Final CTA */}
      {step === 8 && (
        <div style={{ textAlign: 'center', animation: 'lp-fadeIn 0.8s' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#FFFBF0', fontWeight: 600, marginBottom: '0.5rem' }}>Trouve ta moitié</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: 'rgba(255,251,240,0.7)', marginBottom: '1.5rem' }}>Rejoins des milliers de Sénégalais qui cherchent vraiment</div>
          <div style={{
            display: 'inline-block', background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
            color: '#0F172A', padding: '12px 32px', borderRadius: 50,
            fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '0.95rem',
            animation: 'lp-glowPulse 2s infinite'
          }}>Commencer gratuitement →</div>
        </div>
      )}
    </div>
  );
}

function VideoSection() {
  const [ref, inView] = useInView(0.15);
  const [animStep, setAnimStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);
  const STEP_DURATION = 4000;

  const startAnimation = () => {
    setPlaying(true);
    setAnimStep(1);
  };

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setAnimStep(prev => {
        if (prev >= 8) { setTimeout(() => setAnimStep(1), 1500); return 0; }
        return prev + 1;
      });
    }, STEP_DURATION);
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  useEffect(() => {
    if (inView && !playing) setTimeout(() => startAnimation(), 600);
  }, [inView]);

  return (
    <section ref={ref} style={{ background: 'linear-gradient(180deg, #FFFBF0 0%, #F5EFE0 100%)', padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{
          textAlign: 'center', marginBottom: '4rem',
          opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)'
        }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#D4AF37', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>En action</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0F172A', fontWeight: 700 }}>
            Wétali, c'est du respect et de la confiance
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: '#6B7280', marginTop: '0.75rem' }}>
            Regarde comment ça fonctionne en 30 secondes
          </p>
        </div>

        <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'scale(1)' : 'scale(0.92)', transition: 'all 1s cubic-bezier(0.4,0,0.2,1) 0.3s' }}>
          {/* Gold gradient frame */}
          <div style={{
            position: 'relative', padding: '3px', borderRadius: 24,
            background: 'linear-gradient(135deg, #D4AF37, #8B6914, #D4AF37)',
            boxShadow: '0 0 60px rgba(212,175,55,0.35), 0 30px 80px rgba(0,0,0,0.3)',
          }}>
            <div style={{ background: '#0F172A', borderRadius: 22, overflow: 'hidden' }}>
              {/* Luxury top bar */}
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderBottom: '1px solid rgba(212,175,55,0.3)',
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10
              }}>
                {['#D4AF37', '#C09B2A', '#A8891A'].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}80` }}/>
                ))}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 50, padding: '3px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37' }}/>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: 'rgba(212,175,55,0.8)', letterSpacing: '0.05em' }}>wetali.app</span>
                  </div>
                </div>
              </div>
              {/* Screen */}
              <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', height: 480, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AnimatedScreenContent step={animStep} />
                {!playing && (
                  <button onClick={startAnimation} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer', backdropFilter: 'blur(2px)' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #B8960C)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(212,175,55,0.6)' }}>
                      <div style={{ width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '20px solid #0F172A', marginLeft: 4 }}/>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Laptop base */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: -1 }}>
            <div style={{ width: '60%', height: 14, background: 'linear-gradient(to bottom, #1a1a2e, #0a0a14)', borderRadius: '0 0 8px 8px', borderTop: '1px solid rgba(212,175,55,0.2)' }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '70%', height: 6, background: 'linear-gradient(to bottom, #0a0a14, #050508)', borderRadius: '0 0 4px 4px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}/>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 7. HOW IT WORKS ────────────────────────────────────────
function HowItWorksSection() {
  const [ref, inView] = useInView(0.1);
  const steps = [
    { num: '01', title: "Inscris-toi en 5 min", desc: "Crée ton profil complet avec tes valeurs, ta vision du mariage et ta culture. Simple et rapide.", icon: '✍️' },
    { num: '02', title: "Découvre des compatibles", desc: "Notre algorithme te propose des profils vérifiés qui partagent tes valeurs et tes aspirations.", icon: '🔍' },
    { num: '03', title: "Envoie une demande", desc: "Montre ton intérêt de façon respectueuse. La personne choisit d'accepter ou non.", icon: '💌' },
    { num: '04', title: "Rencontre ta moitié", desc: "Échangez, découvrez-vous, et construisez quelque chose de beau ensemble.", icon: '💍' },
  ];
  return (
    <section id="how-it-works" ref={ref} style={{ background: '#0F172A', padding: '100px 2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 1, height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.2), transparent)' }}/>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#D4AF37', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Le parcours</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#FFFBF0', fontWeight: 700 }}>Comment ça marche</h2>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '2.5rem', top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.4) 10%, rgba(212,175,55,0.4) 90%, transparent)' }}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{
                display: 'flex', alignItems: 'flex-start', gap: '2rem',
                opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-30px)',
                transition: `all 0.8s cubic-bezier(0.4,0,0.2,1) ${0.15 + i * 0.15}s`
              }}>
                <div style={{
                  width: 52, height: 52, minWidth: 52, borderRadius: '50%',
                  border: '2px solid #D4AF37', background: 'rgba(212,175,55,0.1)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 700,
                  color: '#D4AF37', position: 'relative', zIndex: 1, boxShadow: '0 0 20px rgba(212,175,55,0.2)'
                }}>{step.num}</div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: '1.2rem' }}>{step.icon}</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#FFFBF0', fontWeight: 600 }}>{step.title}</h3>
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.92rem', color: 'rgba(255,251,240,0.6)', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. TESTIMONIALS ───────────────────────────────────────
function TestimonialCard({ t, inView, delay, style: styleProp = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFFFF', border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: 20, overflow: 'hidden',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.12), 0 0 0 2px rgba(212,175,55,0.3)' : '0 4px 20px rgba(0,0,0,0.06)',
        transform: `translateY(${inView ? 0 : 40}px) scale(${hovered ? 1.02 : inView ? 1 : 0.97})`,
        opacity: inView ? 1 : 0, transition: `all 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
        ...styleProp
      }}
    >
      <div style={{ height: 4, background: 'linear-gradient(to right, #D4AF37, #1E3A8A)' }}/>
      <div style={{ padding: '1.75rem 2rem' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#D4AF37', lineHeight: 1, marginBottom: '0.5rem', opacity: 0.5 }}>"</div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: '#374151', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '1.5rem' }}>{t.quote}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #1E3A8A, #D4AF37)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px solid rgba(212,175,55,0.3)' }}>{t.emoji}</div>
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#0F172A', fontSize: '0.9rem' }}>{t.name}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#9CA3AF' }}>{t.location}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const [ref, inView] = useInView(0.1);
  const testimonials = [
    { quote: "Wétali m'a aidé à trouver quelqu'un de sérieux. On s'est mariés en juin dernier. Alhamdulillah!", name: "Amara D.", location: "Paris, France", emoji: "👩🏾‍🦱" },
    { quote: "Enfin une app où les profils sont vrais et les intentions claires!", name: "Sophia K.", location: "Montréal, Canada", emoji: "👩🏾" },
    { quote: "Merci pour cette belle plateforme. Tout est fait dans le respect.", name: "Néné B.", location: "Dakar, Sénégal", emoji: "👩🏿" },
  ];
  return (
    <section ref={ref} style={{ background: '#FFFBF0', padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#D4AF37', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Témoignages</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0F172A', fontWeight: 700 }}>Elles ont trouvé l'amour</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gridTemplateRows: 'auto auto', gap: '1.5rem', alignItems: 'start' }} className="lp-testimonials-grid">
          <TestimonialCard t={testimonials[0]} inView={inView} delay={0.1} style={{ gridRow: '1 / span 2' }}/>
          <TestimonialCard t={testimonials[1]} inView={inView} delay={0.25}/>
          <TestimonialCard t={testimonials[2]} inView={inView} delay={0.4}/>
        </div>
      </div>
      <style>{`
        .lp-testimonials-grid { grid-template-columns: 1.4fr 1fr !important; }
        @media (max-width: 768px) { .lp-testimonials-grid { grid-template-columns: 1fr !important; grid-template-rows: auto !important; } }
      `}</style>
    </section>
  );
}

// ─── 9. PRICING ─────────────────────────────────────────────
function PricingSection() {
  const [ref, inView] = useInView(0.1);
  return (
    <section style={{ background: '#0F172A', padding: '100px 2rem' }}>
      <div ref={ref} style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#D4AF37', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Tarifs</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#FFFBF0', fontWeight: 700 }}>Accès à Wétali</h2>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Free */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(212,175,55,0.2)', borderRadius: 24, padding: '2.5rem 2rem', width: 300, marginTop: '2rem',
            opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1) 0.1s'
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#FFFBF0', fontWeight: 600, marginBottom: 8 }}>Découvrir</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#D4AF37', fontWeight: 700, marginBottom: '1.5rem' }}>Gratuit</div>
            {['Profil complet', 'Voir des profils', '5 demandes/jour', 'Chat illimité'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ color: '#D4AF37' }}>✓</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: 'rgba(255,251,240,0.7)' }}>{f}</span>
              </div>
            ))}
            <button style={{ width: '100%', marginTop: '1.5rem', background: 'transparent', border: '1px solid #D4AF37', cursor: 'pointer', padding: '12px', borderRadius: 50, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: '#D4AF37', transition: 'all 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >Commencer</button>
          </div>
          {/* Premium */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30,58,138,0.6), rgba(15,23,42,0.9))',
            border: '1px solid rgba(212,175,55,0.5)', borderRadius: 24, padding: '2.5rem 2rem', width: 300, position: 'relative',
            boxShadow: '0 20px 60px rgba(212,175,55,0.15), 0 0 0 1px rgba(212,175,55,0.1)',
            opacity: inView ? 1 : 0, transform: inView ? 'translateY(-1rem)' : 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s'
          }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0F172A', padding: '4px 20px', borderRadius: 50, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', boxShadow: '0 4px 20px rgba(212,175,55,0.5)', whiteSpace: 'nowrap' }}>✦ PREMIUM</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#FFFBF0', fontWeight: 600, marginBottom: 8 }}>Expérience Complète</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#D4AF37', fontWeight: 700, marginBottom: '1.5rem', fontStyle: 'italic' }}>À déterminer</div>
            {['Tout le plan gratuit +', 'Demandes illimitées', 'Voir qui te like', 'Support VIP'].map((f, i) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ color: '#D4AF37' }}>{i === 0 ? '★' : '✓'}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: 'rgba(255,251,240,0.85)', fontWeight: i === 0 ? 600 : 400 }}>{f}</span>
              </div>
            ))}
            <button style={{ width: '100%', marginTop: '1.5rem', background: 'linear-gradient(135deg, #D4AF37, #B8960C)', border: 'none', cursor: 'pointer', padding: '13px', borderRadius: 50, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', boxShadow: '0 8px 30px rgba(212,175,55,0.4)', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(212,175,55,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,175,55,0.4)'; }}
            >Intéressé? →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 10. FAQ ────────────────────────────────────────────────
function FAQSection() {
  const [ref, inView] = useInView(0.1);
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Comment se faire vérifier?", a: "Envoyez une pièce d'identité valide via notre formulaire sécurisé. Notre équipe valide votre profil sous 24-48h. La vérification est gratuite." },
    { q: "Mes données sont-elles sûres?", a: "Absolument. Nous utilisons un chiffrement de bout en bout et ne partageons jamais vos données personnelles avec des tiers. Votre confidentialité est notre priorité." },
    { q: "Comment fonctionne l'algorithme?", a: "Notre algorithme analyse vos valeurs, votre vision du mariage, votre dahira, votre région d'origine et vos centres d'intérêt pour vous proposer des profils vraiment compatibles." },
    { q: "Puis-je modifier mon profil?", a: "Oui, à tout moment. Connectez-vous et accédez aux paramètres de votre profil pour modifier vos informations, photos et préférences." },
  ];
  return (
    <section ref={ref} style={{ background: '#FFFBF0', padding: '100px 2rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0F172A', fontWeight: 700 }}>Questions? Réponses.</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ border: '1px solid rgba(212,175,55,0.2)', borderRadius: 16, overflow: 'hidden', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: `all 0.7s cubic-bezier(0.4,0,0.2,1) ${0.1 + i * 0.1}s` }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: open === i ? 'rgba(212,175,55,0.08)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.3s' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: open === i ? '#1E3A8A' : '#0F172A' }}>{faq.q}</span>
                <span style={{ color: '#D4AF37', fontSize: '1.2rem', transition: 'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'rotate(0)', display: 'inline-block' }}>+</span>
              </button>
              <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
                <div style={{ padding: '0 1.5rem 1.25rem' }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.7 }}>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 11. BLOG ───────────────────────────────────────────────
function BlogCard({ post, inView, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20, overflow: 'hidden', background: '#FFFFFF',
        boxShadow: hovered ? '0 24px 60px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.06)',
        transform: `translateY(${inView ? (hovered ? -6 : 0) : 40}px)`,
        opacity: inView ? 1 : 0, transition: `all 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}s`, cursor: 'pointer'
      }}
    >
      <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
        <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.6s' }}/>
        <div style={{ position: 'absolute', top: 16, left: 16 }}>
          <span style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0F172A', padding: '4px 12px', borderRadius: 50, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{post.tag}</span>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)' }}/>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.4 }}>{post.title}</h3>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1rem' }}>{post.excerpt}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#9CA3AF' }}>{post.readTime} de lecture</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#1E3A8A', fontWeight: 600 }}>Lire →</span>
        </div>
      </div>
    </div>
  );
}

function BlogSection() {
  const [ref, inView] = useInView(0.1);
  const posts = [
    { title: "Comment rédiger un profil irrésistible", excerpt: "Un bon profil, c'est la première impression. Voici comment présenter votre personnalité, vos valeurs et vos intentions avec authenticité.", img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=700&q=80", tag: "Conseils", readTime: "4 min" },
    { title: "Signes que quelqu'un est vraiment sérieux", excerpt: "Au-delà des mots, certains comportements révèlent des intentions sincères. Découvrez les indices qui font la différence.", img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=700&q=80", tag: "Relations", readTime: "5 min" },
  ];
  return (
    <section ref={ref} style={{ background: '#F5EFE0', padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem', opacity: inView ? 1 : 0, transition: 'all 0.8s' }}>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#D4AF37', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Magazine</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#0F172A', fontWeight: 700 }}>À lire</h2>
          </div>
          <a href="#blog" style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#1E3A8A', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid #1E3A8A' }}>Tous les articles →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="lp-blog-grid">
          {posts.map((post, i) => <BlogCard key={i} post={post} inView={inView} delay={i * 0.2}/>)}
        </div>
      </div>
      <style>{`
        .lp-blog-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 768px) { .lp-blog-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── 12. CTA FINAL ──────────────────────────────────────────
function CTASection({ onStart }) {
  const [ref, inView] = useInView(0.2);
  return (
    <section ref={ref} style={{ background: '#0F172A', padding: '120px 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          color: '#FFFBF0', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.1,
          opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1)'
        }}>Tu es prêt?</h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', color: 'rgba(255,251,240,0.7)', marginBottom: '3rem', lineHeight: 1.7,
          opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1) 0.2s'
        }}>Rejoins les milliers de Sénégalais qui cherchent leur moitié.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1) 0.35s' }}>
          <button id="cta-start-btn" onClick={onStart} style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', border: 'none', cursor: 'pointer', padding: '16px 40px', borderRadius: 50, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F172A', boxShadow: '0 0 40px rgba(212,175,55,0.4)', transition: 'all 0.3s', animation: 'lp-goldGlow 2.5s infinite' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(212,175,55,0.7)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(212,175,55,0.4)'; }}
          >Commencer</button>
          <button id="cta-contact-btn" style={{ background: 'transparent', border: '1px solid rgba(255,251,240,0.4)', cursor: 'pointer', padding: '16px 40px', borderRadius: 50, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '1rem', color: '#FFFBF0', transition: 'all 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#D4AF37'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,251,240,0.4)'; e.currentTarget.style.color = '#FFFBF0'; }}
          >Parler à quelqu'un</button>
        </div>
      </div>
      <style>{`
        @keyframes lp-goldGlow {
          0%,100% { box-shadow: 0 0 40px rgba(212,175,55,0.4); }
          50% { box-shadow: 0 0 70px rgba(212,175,55,0.7), 0 0 120px rgba(212,175,55,0.2); }
        }
      `}</style>
    </section>
  );
}

// ─── 13. FOOTER ─────────────────────────────────────────────
function Footer() {
  return (
    <footer id="contact-section" style={{ background: '#FFFBF0', borderTop: '1px solid rgba(212,175,55,0.2)', padding: '4rem 2rem 2rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <WetaliLogo size="lg" />
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#6B7280', fontStyle: 'italic', letterSpacing: '0.05em' }}>Matrimonial sénégalais.</p>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', margin: '1.25rem auto 0' }}/>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem', textAlign: 'center' }} className="lp-footer-grid">
          {[
            { title: 'Utilisation', links: ["S'inscrire", 'Se connecter', 'Mon profil', 'Confidentialité'] },
            { title: 'Infos', links: ['À propos', 'Blog', 'Presse', 'Conditions'] },
            { title: 'Contact', links: ['contact@wetali.app', 'Instagram', 'Facebook', 'Twitter'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#0F172A', marginBottom: '1rem', fontSize: '0.95rem' }}>{col.title}</div>
              {col.links.map(link => (
                <div key={link} style={{ marginBottom: '0.6rem' }}>
                  <a href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#6B7280', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#D4AF37'}
                  onMouseLeave={e => e.target.style.color = '#6B7280'}
                  >{link}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(212,175,55,0.15)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#9CA3AF' }}>
            © 2026 Wétali &nbsp;|&nbsp;
            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Confidentialité</a>
            &nbsp;|&nbsp;
            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Terms</a>
          </p>
        </div>
      </div>
      <style>{`
        .lp-footer-grid { grid-template-columns: repeat(3, 1fr) !important; }
        @media (max-width: 768px) { .lp-footer-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; } }
      `}</style>
    </footer>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────
export default function LandingPage({ onEnterApp }) {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap';
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      <Navbar onJoin={onEnterApp} />
      <HeroSection onStart={onEnterApp} />
      <StatBar />
      <FeaturesSection />
      <VisionSection />
      <VideoSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <BlogSection />
      <CTASection onStart={onEnterApp} />
      <Footer />
    </div>
  );
}
