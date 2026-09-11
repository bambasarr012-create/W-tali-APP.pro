const fs = require('fs');

let html = fs.readFileSync('landing-preview.html', 'utf8');

const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (cssMatch) {
  fs.writeFileSync('src/components/landing/LandingPage.css', cssMatch[1]);
}

let bodyHtml = html.match(/<body>([\s\S]*?)<\/body>/)[1];

// Extract script data
const scriptMatch = bodyHtml.match(/<script>([\s\S]*?)<\/script>/);
let scriptContent = scriptMatch ? scriptMatch[1] : '';
bodyHtml = bodyHtml.replace(/<script>[\s\S]*?<\/script>/, '');

bodyHtml = bodyHtml.replace(/class=/g, 'className=');
bodyHtml = bodyHtml.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
bodyHtml = bodyHtml.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
bodyHtml = bodyHtml.replace(/<br>/g, '<br />');

bodyHtml = bodyHtml.replace(/stroke-width/g, 'strokeWidth');
bodyHtml = bodyHtml.replace(/stroke-linecap/g, 'strokeLinecap');

bodyHtml = bodyHtml.replace(/onclick="openAuth\(\)"/g, 'onClick={onEnterApp}');
bodyHtml = bodyHtml.replace(/onclick="closeAuth\(\)"/g, 'onClick={closeAuth}');
bodyHtml = bodyHtml.replace(/onclick="scrollToId\('([^']+)'\)"/g, 'onClick={(e) => { e.preventDefault(); scrollToId(\'$1\'); }}');
bodyHtml = bodyHtml.replace(/onclick="toggleDrawer\(\)"/g, 'onClick={toggleDrawer}');
// toggleFAQ(this) needs a ref or event target. In React, we can pass event: onClick={(e) => toggleFAQ(e.currentTarget)}
bodyHtml = bodyHtml.replace(/onclick="toggleFAQ\(this\)"/g, 'onClick={(e) => toggleFAQ(e.currentTarget)}');
bodyHtml = bodyHtml.replace(/onclick="openArticle\((\d+)\)"/g, 'onClick={() => openArticle($1)}');
bodyHtml = bodyHtml.replace(/onclick="closeArticle\(\)"/g, 'onClick={closeArticle}');
bodyHtml = bodyHtml.replace(/onclick="handleArticleOverlayClick\(event\)"/g, 'onClick={handleArticleOverlayClick}');

bodyHtml = bodyHtml.replace(/style="([^"]*)"/g, (match, styleString) => {
  const rules = styleString.split(';').filter(r => r.trim());
  const obj = rules.map(rule => {
    let colonIdx = rule.indexOf(':');
    if (colonIdx === -1) return null;
    let key = rule.substring(0, colonIdx).trim();
    let val = rule.substring(colonIdx + 1).trim();
    let camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    return `${camelKey}: '${val.replace(/'/g, "\\'")}'`;
  }).filter(Boolean).join(', ');
  return `style={{ ${obj} }}`;
});

bodyHtml = bodyHtml.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// Let's grab articles and steps.
let articlesMatch = scriptContent.match(/const articles = (\[[\s\S]*?\]);/);
let articlesJson = articlesMatch ? articlesMatch[1] : '[]';

let stepsMatch = scriptContent.match(/const steps = (\[[\s\S]*?\]);/);
let stepsJson = stepsMatch ? stepsMatch[1] : '[]';

// We need to inject heroImg manually if there's a reference to it
bodyHtml = bodyHtml.replace(/src="\.\/src\/assets\/senegalese_wedding_hero\.jpg"/g, 'src={heroImg}');

const componentCode = `import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import heroImg from '../../assets/senegalese_wedding_hero.jpg';

export default function LandingPage({ onEnterApp }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);

  const articles = ${articlesJson};
  const steps = ${stepsJson};

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('inview-hidden');
          entry.target.classList.add('inview-visible');
          if (entry.target.id === 'vision-line') entry.target.style.width = '80px';
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.inview').forEach(el => observer.observe(el));
    const vl = document.getElementById('vision-line');
    if (vl) observer.observe(vl);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let currentStep = 0;
    const sc = document.getElementById('screen-content');
    if (!sc || steps.length === 0) return;
    
    sc.innerHTML = steps[0];
    let intervalId;

    const nextStep = () => {
      currentStep = (currentStep + 1) % steps.length;
      sc.style.opacity = 0;
      setTimeout(() => { 
        if (sc) {
          sc.innerHTML = steps[currentStep]; 
          sc.style.opacity = 1; 
        }
      }, 300);
    };

    const demoObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            intervalId = setInterval(nextStep, 4000);
          }, 800);
          demoObs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    
    const demoEl = document.getElementById('demo');
    if (demoEl) demoObs.observe(demoEl);

    return () => {
      if (intervalId) clearInterval(intervalId);
      demoObs.disconnect();
    };
  }, [steps]);

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setDrawerOpen(false);
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  
  const closeAuth = () => {
    // We trigger onEnterApp instead of just closing modal to go to React Auth
    onEnterApp();
  };

  const toggleFAQ = (btn) => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains('open');
    document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-btn.open').forEach(b => b.classList.remove('open'));
    if (!isOpen) { answer.classList.add('open'); btn.classList.add('open'); }
  };

  const openArticle = (idx) => setActiveArticle(articles[idx]);
  const closeArticle = () => setActiveArticle(null);
  const handleArticleOverlayClick = (e) => {
    if (e.target.id === 'article-overlay') closeArticle();
  };

  return (
    <div className={\`landing-wrapper \${scrolled ? 'scrolled' : ''}\`}>
      ${bodyHtml.split('\n').join('\n      ')}

      {/* REACT OVERRIDES FOR DYNAMIC PARTS */}
      {drawerOpen && (
        <style>{\`
          #drawer { transform: translateX(0) !important; }
          #drawer-overlay { display: block !important; }
        \`}</style>
      )}
      {scrolled && (
        <style>{\`
          #navbar { background: rgba(15,23,42,.97) !important; border-bottom: 1px solid rgba(212,175,55,.2) !important; box-shadow: 0 4px 30px rgba(0,0,0,.3) !important; }
          #navbar .nav-link { color: rgba(255,251,240,.85) !important; }
          #navbar .hamburger { color: #FFFBF0 !important; }
          #navbar .logo-text { color: #FFFBF0 !important; }
        \`}</style>
      )}
      {activeArticle && (
        <>
          <div id="article-overlay" className="show" onClick={handleArticleOverlayClick} style={{ display: 'flex' }}>
            <div className="article-box" id="article-box">
              <button className="article-close" onClick={closeArticle}>✕</button>
              <div id="article-content">
                <span className="article-tag">{activeArticle.tag}</span>
                <h1 className="article-title">{activeArticle.title}</h1>
                <div className="article-meta">{activeArticle.meta}</div>
                <div className="article-body" dangerouslySetInnerHTML={{ __html: activeArticle.body }}></div>
              </div>
            </div>
          </div>
          <style>{\`body { overflow: hidden !important; }\`}</style>
        </>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/landing/LandingPage.jsx', componentCode);
console.log('Conversion successful!');
