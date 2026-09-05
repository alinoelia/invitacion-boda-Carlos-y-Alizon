import React, { useState, useEffect, useRef } from 'react';

// <!-- Chosen Palette: Warm Botanical Gold & Dusty Navy Envelope (Cream #FDFBF7, Navy #1E2A38, Olive Green #4A5D4E, Gold #B9975B) -->
// <!-- Application Structure Plan: Single-page interactive wedding invitation in the exact requested section sequence: Envelope -> Hero -> Wedding Date & Countdown Timer -> Our Story -> Event Venues -> Dress Code & Parking -> Gifts -> RSVP Confirmation -> Footer. -->
// <!-- Visualization & Content Choices: Background Overlay Image + HTML5 Canvas Ambient Gold Dust -> Goal: Premium Personal Botanical Frame -> Confirming NO SVG used for charts, NO Mermaid JS used. -->
// <!-- CONFIRMATION: NO SVG graphics used for charts. NO Mermaid JS used. -->

const YOUTUBE_VIDEO_ID = '62rgRxlM4-E';
const WEDDING_DATE = new Date('2026-09-25T10:00:00').getTime();

export default function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [copyToast, setCopyToast] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [ytLoaded, setYtLoaded] = useState(false);

  // Estado del contador regresivo
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const canvasRef = useRef(null);
  const iframeRef = useRef(null);

  const MAP_CIVIL_URL = "https://maps.app.goo.gl/jzpFW5Zhnu2wCA7a8";
  const MAP_PARTY_URL = "https://maps.app.goo.gl/F5rqpJMmnavyeFaL7";
  const RSVP_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeqxsdil72th0qM3a1FdRg3Tu_G12p6nRu1ojYVOaTH-uaf_A/viewform?usp=sharing&ouid=109043025376688988862";

  // Cargar FontAwesome para íconos
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }, []);

  // Lógica de la Cuenta Regresiva
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = WEDDING_DATE - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Canvas: Polvo Dorado Mágico Ambiental
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleColors = ['#d4af37', '#b9975b', '#ffe082', '#e6c875', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.6,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        speedY: (Math.random() * 0.3 + 0.1) * -1,
        speedX: Math.random() * 0.2 - 0.1,
        pulse: Math.random() * 0.02 + 0.005
      });
    }

    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(Date.now() * p.pulse) * 0.008;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.85, p.alpha));
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#d4af37';
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [envelopeOpened]);

  const handleOpenEnvelope = () => {
    setIsOpening(true);

    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`;
      setYtLoaded(true);
      setIsPlaying(true);
    }

    setTimeout(() => {
      setEnvelopeOpened(true);
      setIsOpening(false);
    }, 1000);
  };

  const toggleMusic = () => {
    if (!ytLoaded) {
      if (iframeRef.current) {
        iframeRef.current.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`;
      }
      setYtLoaded(true);
      setIsPlaying(true);
    } else {
      const nextState = !isPlaying;
      setIsPlaying(nextState);
      if (iframeRef.current) {
        const command = nextState ? 'playVideo' : 'pauseVideo';
        iframeRef.current.contentWindow.postMessage(`{"event":"command","func":"${command}","args":""}`, '*');
      }
    }
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyToast(`¡${label} copiado con éxito!`);
    setTimeout(() => setCopyToast(''), 3000);
  };

  const formatTwoDigits = (num) => String(num).padStart(2, '0');

  return (
    <div className="main-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Cinzel:wght@400;500;600&display=swap');

        :root {
          --bg-color: #f6f3ed;
          --card-bg: rgba(255, 255, 255, 0.94);
          --text-main: #2c3e35;
          --text-muted: #5a6b61;
          --navy-dark: #1e2a38;
          --olive-dark: #4a5d4e;
          --olive-hover: #38473b;
          --gold-accent: #b9975b;
          --gold-border: rgba(185, 151, 91, 0.35);
          --font-serif: 'Playfair Display', serif;
          --font-script: 'Great Vibes', cursive;
          --font-cinzel: 'Cinzel', serif;
          --font-sans: 'Montserrat', sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: #eae5db;
          color: var(--text-main);
          font-family: var(--font-sans);
          overflow-x: hidden;
          line-height: 1.6;
        }

        .main-wrapper {
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          background-color: var(--bg-color);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          border-left: 1px solid rgba(185, 151, 91, 0.2);
          border-right: 1px solid rgba(185, 151, 91, 0.2);
        }

        .bg-frame-overlay {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          z-index: 1;
          opacity: 0.85;
          mix-blend-mode: multiply;
        }

        /* ✉️ PANTALLA SOBRE VIRTUAL DE BIENVENIDA */
        .envelope-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background-color: #f5f1e8;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.9s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.9s ease;
          overflow: hidden;
        }

        .envelope-overlay.opening {
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
        }

        .envelope-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .envelope-line-top-left {
          position: absolute; top: 0; left: 0; width: 50%; height: 50%;
          border-bottom: 1px solid rgba(185, 151, 91, 0.35);
          transform: skewY(26deg); transform-origin: top left;
        }

        .envelope-line-top-right {
          position: absolute; top: 0; right: 0; width: 50%; height: 50%;
          border-bottom: 1px solid rgba(185, 151, 91, 0.35);
          transform: skewY(-26deg); transform-origin: top right;
        }

        .envelope-line-bottom-left {
          position: absolute; bottom: 0; left: 0; width: 50%; height: 50%;
          border-top: 1px solid rgba(185, 151, 91, 0.25);
          transform: skewY(-22deg); transform-origin: bottom left;
        }

        .envelope-line-bottom-right {
          position: absolute; bottom: 0; right: 0; width: 50%; height: 50%;
          border-top: 1px solid rgba(185, 151, 91, 0.25);
          transform: skewY(22deg); transform-origin: bottom right;
        }

        .wax-seal-btn {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e2a38 0%, #151f2b 100%);
          color: #ffffff;
          border: 2px solid rgba(212, 175, 55, 0.6);
          box-shadow: 0 12px 30px rgba(21, 31, 43, 0.35), 0 0 0 8px rgba(255, 255, 255, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          z-index: 10;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
        }

        .wax-seal-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 16px 36px rgba(21, 31, 43, 0.45), 0 0 0 10px rgba(255, 255, 255, 0.8);
        }

        .canvas-container {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .header-music-bar {
          position: fixed;
          top: 16px; left: 16px;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          padding: 6px 14px 6px 8px;
          border-radius: 40px;
          border: 1px solid rgba(185, 151, 91, 0.25);
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
        }

        .music-play-btn {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--olive-dark);
          color: white; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform 0.2s ease;
        }

        /* 1. HERO SECTION CORREGIDA */
        .hero-section-nos-casamos {
          position: relative;
          z-index: 10;
          padding: 300px 10px 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .script-nos-casamos {
          font-family: var(--font-script);
          font-size: 80px;
          color: var(--gold-accent);
          line-height: 1;
          margin-bottom: 30px;
        }

        .hero-names-title {
          font-family: var(--font-serif);
          font-size: 80px;
          color: var(--text-main);
          letter-spacing: 0.5px;
          line-height: 1.1;
          font-weight: 500;
          margin-bottom: 14px;
        }

        .hero-quote-sub {
          font-family: var(--font-sans);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #55665c;
          max-width: 440px;
          line-height: 1.8;
          font-weight: 500;
          margin-top: 50px;
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(4px);
          padding: 10px 18px;
          border-radius: 20px;
          border: 1px solid rgba(185, 151, 91, 0.15);
        }

        .content-section {
          padding: 80px 24px;
          position: relative;
          z-index: 10;
          border-top: 1px solid rgba(185, 151, 91, 0.15);
        }

        .section-header { text-align: center; margin-bottom: 28px; }

        .section-tag {
          font-family: var(--font-cinzel);
          font-size: 12px;
          letter-spacing: 3px;
          color: var(--text-main);
          text-transform: uppercase;
          display: block;
          font-weight: 600;
        }

        .section-script-title {
          font-family: var(--font-script);
          font-size: 44px;
          color: var(--gold-accent);
          line-height: 1.1;
          display: block;
        }

        /* Botones Redondeados */
        .btn-olive {
          background-color: var(--olive-dark);
          color: #ffffff;
          border: none;
          padding: 14px 32px;
          font-family: var(--font-cinzel);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(74, 93, 78, 0.18);
        }

        .btn-olive:hover {
          background-color: var(--olive-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(56, 71, 59, 0.28);
        }

        /* 2. NUEVO CONTADOR ESTILO ELEGANTE DE LA IMAGEN */
        .countdown-display {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 12px;
          margin: 18px auto 0;
          max-width: 380px;
        }

        .countdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 58px;
        }

        .countdown-digit {
          font-family: var(--font-serif);
          font-size: 52px;
          font-weight: 400;
          color: #1e2a38;
          line-height: 1;
          letter-spacing: 1px;
        }

        .countdown-colon {
          font-family: var(--font-serif);
          font-size: 38px;
          color: #a3b1bf;
          line-height: 1.1;
          margin-top: 2px;
        }

        .countdown-label {
          font-family: var(--font-sans);
          font-size: 10px;
          letter-spacing: 2.5px;
          color: #8c9ba5;
          text-transform: uppercase;
          margin-top: 8px;
          font-weight: 500;
        }

        /* 3. HISTORIA - TIMELINE */
        .timeline-container {
          position: relative;
          max-width: 500px;
          margin: 0 auto;
        }

        .timeline-container::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 20px;
          bottom: 20px;
          width: 1.5px;
          transform: translateX(-50%);
          background: linear-gradient(to bottom, transparent 0%, rgba(185, 151, 91, 0.4) 15%, rgba(185, 151, 91, 0.5) 85%, rgba(74, 93, 78, 0.6) 100%);
        }

        .timeline-item {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 32px;
        }

        .timeline-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f6f3ed;
          border: 1px solid rgba(185, 151, 91, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .timeline-dot-inner {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--gold-accent);
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          max-width: 650px;
          margin: 0 auto;
        }

        .event-card {
          background: var(--card-bg);
          border-radius: 24px;
          padding: 32px 24px;
          text-align: center;
          border: 1px solid var(--gold-border);
          box-shadow: 0 10px 30px rgba(74, 93, 78, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          backdrop-filter: blur(8px);
        }

        .info-card {
          background: var(--card-bg);
          border-radius: 28px;
          padding: 36px 28px;
          text-align: center;
          border: 1px solid var(--gold-border);
          box-shadow: 0 12px 35px rgba(74, 93, 78, 0.06);
          max-width: 580px;
          margin: 0 auto;
          backdrop-filter: blur(8px);
        }

        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(44, 62, 53, 0.65);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
        }

        .modal-box {
          background: #ffffff;
          border-radius: 28px;
          max-width: 480px; width: 100%;
          padding: 30px; position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        footer {
          padding: 32px 20px;
          text-align: center;
          font-family: var(--font-cinzel);
          font-size: 11px;
          letter-spacing: 2px;
          color: var(--navy-dark);
          border-top: 1px solid var(--gold-border);
          position: relative; z-index: 10;
        }

        @media (max-width: 480px) {
          .hero-names-title { font-size: 11vw; }
          .script-nos-casamos { font-size: 10vw; }
          .countdown-digit { font-size: 32px; }
          .countdown-colon { font-size: 24px; }
          .countdown-item { min-width: 42px; }
        }
      `}</style>

      {/* Reproductor de audio YouTube Oculto */}
      <iframe
        ref={iframeRef}
        title="YouTube Background Music"
        style={{ display: 'none', width: '1px', height: '1px' }}
        allow="autoplay"
      />

      {/* ✉️ SOBRE DE ENTRADA VIRTUAL */}
      {!envelopeOpened && (
        <div className={`envelope-overlay ${isOpening ? 'opening' : ''}`}>
          <div className="envelope-lines">
            <div className="envelope-line-top-left"></div>
            <div className="envelope-line-top-right"></div>
            <div className="envelope-line-bottom-left"></div>
            <div className="envelope-line-bottom-right"></div>
          </div>

          <button className="wax-seal-btn" onClick={handleOpenEnvelope}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', letterSpacing: '2px', fontWeight: 500, marginBottom: '3px' }}>C & A</span>
            <div style={{ width: '24px', height: '1px', background: 'rgba(212, 175, 55, 0.7)', margin: '2px 0 4px' }}></div>
            <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '2.5px', color: '#d4af37', fontWeight: 600 }}>ABRIR</span>
          </button>
        </div>
      )}

      {/* Imagen PNG de Fondo Marco Floral */}
      <img
        src={`${import.meta.env.BASE_URL}fondo.svg`}
        alt="Fondo Marco Floral"
        className="bg-frame-overlay"
        onError={(e) => { e.target.style.display = 'none'; }}
      />

      {/* Canvas Animado: Polvo Dorado */}
      <div className="canvas-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Reproductor Flotante de Música */}
      <div className="header-music-bar">
        <button className="music-play-btn" onClick={toggleMusic}>
          <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-music'} text-xs`}></i>
        </button>
        <div style={{ fontSize: '11px' }}>
          <div style={{ color: '#888', fontSize: '10px' }}>Nuestra canción</div>
          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
            Dance With Me - <span style={{ color: 'var(--gold-accent)' }}>Bruno Mars</span>
          </div>
        </div>
      </div>

      {/* 1. NOS CASAMOS (HERO - AJUSTADO) */}
      <section className="hero-section-nos-casamos">
        <h2 className="script-nos-casamos">Nos Casamos</h2>
        <h1 className="hero-names-title">Carlos y Alizon</h1>

        <p className="hero-quote-sub">
          HAY HISTORIAS QUE, AUN A LA DISTANCIA, ENCUENTRAN SIEMPRE EL CAMINO DE REGRESO.
        </p>

        <a href="#contador" style={{ marginTop: '20px', color: 'var(--gold-accent)', fontSize: '16px' }}>
          <i className="fa-solid fa-chevron-down animate-bounce"></i>
        </a>
      </section>

      {/* 2. FECHA DE NUESTRA BODA Y CONTADOR DE DÍAS (ESTILO NUEVO DE LA IMAGEN) */}
      <section id="contador" className="content-section" style={{ background: 'rgba(247, 243, 235, 0.3)' }}>
        <div className="info-card">
          <div className="section-header" style={{ marginBottom: '12px' }}>
            <span className="section-tag" style={{ fontSize: '12px' }}>FECHA DE NUESTRA BODA</span>
            <span className="section-script-title" style={{ fontSize: '42px', marginTop: '-4px' }}>25 de Septiembre de 2026</span>
          </div>

          <div className="countdown-display">
            <div className="countdown-item">
              <span className="countdown-digit">{formatTwoDigits(timeLeft.days)}</span>
              <span className="countdown-label">DÍAS</span>
            </div>
            <span className="countdown-colon">:</span>
            <div className="countdown-item">
              <span className="countdown-digit">{formatTwoDigits(timeLeft.hours)}</span>
              <span className="countdown-label">HS</span>
            </div>
            <span className="countdown-colon">:</span>
            <div className="countdown-item">
              <span className="countdown-digit">{formatTwoDigits(timeLeft.minutes)}</span>
              <span className="countdown-label">MIN</span>
            </div>
            <span className="countdown-colon">:</span>
            <div className="countdown-item">
              <span className="countdown-digit">{formatTwoDigits(timeLeft.seconds)}</span>
              <span className="countdown-label">SEG</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NUESTRA HISTORIA */}
      <section id="historia" className="content-section">
        <div className="section-header">
          <span className="section-tag">NUESTRA</span>
          <span className="section-script-title">historia</span>
          <div style={{ color: 'var(--gold-accent)', fontSize: '11px', margin: '4px 0 10px' }}>
            <i className="fa-regular fa-heart"></i>
          </div>
          <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            Hay historias que, aun a la distancia, encuentran siempre el camino de regreso.
          </p>
        </div>

        <div className="timeline-container">
          <div className="timeline-item">
            <div className="timeline-dot"><div className="timeline-dot-inner"></div></div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gold-accent)', letterSpacing: '1.5px' }}>22 · 08 · 2020</span>
            <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '13px', color: 'var(--text-main)', marginTop: '2px', fontWeight: 600 }}>EL COMIENZO</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '280px', marginTop: '2px' }}>Dos personas se encontraron y comenzó nuestra historia.</p>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"><div className="timeline-dot-inner"></div></div>
            <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>LOS AÑOS</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '280px', marginTop: '2px' }}>Risas, aprendizajes, sueños y muchos momentos compartidos.</p>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"><div className="timeline-dot-inner"></div></div>
            <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>LA DISTANCIA</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '280px', marginTop: '2px' }}>Kilómetros que nos separaron, pero nunca nuestros corazones.</p>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"><div className="timeline-dot-inner"></div></div>
            <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>VOLVER A ELEGIRNOS</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '280px', marginTop: '2px' }}>El amor siempre encuentra la forma de quedarse.</p>
          </div>

          <div className="timeline-item" style={{ marginBottom: 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--olive-dark)', color: '#fff', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '8px', boxShadow: '0 4px 10px rgba(74, 93, 78, 0.3)' }}>
              <i className="fa-solid fa-heart" style={{ fontSize: '11px', margin: 'auto' }}></i>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--olive-dark)', letterSpacing: '1.5px' }}>25 · 09 · 2026</span>
            <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '13px', color: 'var(--olive-dark)', fontWeight: 700, marginTop: '2px' }}>NUESTRO SÍ</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '280px', marginTop: '2px' }}>El comienzo de nuestro <strong>para siempre</strong>.</p>
          </div>
        </div>
      </section>

      {/* 4. LUGAR DEL CIVIL Y CELEBRACIÓN */}
      <section className="content-section" style={{ background: 'rgba(247, 243, 235, 0.2)' }}>
        <div className="section-header">
          <span className="section-tag">NUESTRO</span>
          <span className="section-script-title">gran día</span>
          <div style={{ color: 'var(--gold-accent)', fontSize: '11px', margin: '4px 0 10px' }}>
            <i className="fa-regular fa-heart"></i>
          </div>
        </div>

        <div className="events-grid">
          <div className="event-card">
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#f7f3eb', color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px', border: '1px solid rgba(185, 151, 91, 0.3)' }}>
              <i className="fa-regular fa-sun"></i>
            </div>
            <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '14px', letterSpacing: '1.5px', color: 'var(--text-main)', fontWeight: 600 }}>CEREMONIA CIVIL</h3>
            <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '13px', color: 'var(--gold-accent)', fontWeight: 600, margin: '6px 0 10px' }}>10:00 AM</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '22px' }}>Av. Vicente López 2050<br />Recoleta, Buenos Aires</p>
            <a href={MAP_CIVIL_URL} target="_blank" rel="noopener noreferrer" className="btn-olive">
              <i className="fa-solid fa-location-dot"></i>
              <span>VER UBICACIÓN</span>
            </a>
          </div>

          <div className="event-card">
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--text-main)', color: '#f4efe6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
              <i className="fa-regular fa-moon"></i>
            </div>
            <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '14px', letterSpacing: '1.5px', color: 'var(--text-main)', fontWeight: 600 }}>CELEBRACIÓN</h3>
            <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '13px', color: 'var(--gold-accent)', fontWeight: 600, margin: '6px 0 10px' }}>21:00 PM</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '22px' }}>Salón de Eventos Jamaica<br />Av. F. F. de la Cruz 6000, Buenos Aires</p>
            <a href={MAP_PARTY_URL} target="_blank" rel="noopener noreferrer" className="btn-olive">
              <i className="fa-solid fa-location-dot"></i>
              <span>VER UBICACIÓN</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. DRESS CODE Y ESTACIONAMIENTO */}
      <section className="content-section">
        <div className="info-card">
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#f7f3eb', color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 16px', border: '1px solid rgba(185, 151, 91, 0.3)' }}>
            <i className="fa-solid fa-user-tie"></i>
          </div>

          <span className="section-tag" style={{ fontSize: '11px' }}>CÓDIGO DE VESTIMENTA</span>
          <span className="section-script-title" style={{ fontSize: '42px', marginTop: '-4px' }}>Semi Formal</span>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.7' }}>
            Queremos que te sientas radiante y cómodo/a para celebrar y bailar toda la noche con nosotros.
          </p>
          <p style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', marginTop: '4px' }}>
            (Reservamos amablemente el color blanco para la novia)
          </p>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed rgba(185, 151, 91, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-main)' }}>
            <i className="fa-solid fa-square-parking" style={{ fontSize: '20px', color: 'var(--gold-accent)' }}></i>
            <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-cinzel)', letterSpacing: '1px' }}>
              ESTACIONAMIENTO DISPONIBLE EN EL LUGAR
            </span>
          </div>
        </div>
      </section>

      {/* 7. CONFIRMACIÓN DE ASISTENCIA */}
      <section className="content-section">
        <div className="info-card">
          <div className="section-header" style={{ marginBottom: '16px' }}>
            <span className="section-tag" style={{ fontSize: '12px' }}>¿NOS ACOMPAÑÁS?</span>
            <span className="section-script-title" style={{ fontSize: '46px', marginTop: '-4px' }}>Confirmación</span>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '28px' }}>
            Tu presencia es uno de los regalos más importantes que podemos recibir. Por favor confirmá tu asistencia antes del 13 de septiembre de 2026.
          </p>

          <a href={RSVP_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn-olive" style={{ width: '100%', maxWidth: '340px' }}>
            <i className="fa-regular fa-envelope" style={{ fontSize: '14px' }}></i>
            <span>CONFIRMAR ASISTENCIA AQUÍ ↗</span>
          </a>
        </div>
      </section>

      {/* 6. REGALOS */}
      <section className="content-section" style={{ background: 'rgba(247, 243, 235, 0.2)' }}>
        <div className="info-card">
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#f7f3eb', color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 16px', border: '1px solid rgba(185, 151, 91, 0.3)' }}>
            <i className="fa-solid fa-gift"></i>
          </div>

          <span className="section-tag" style={{ fontSize: '11px' }}>¿QUERES HACERNOS UN REGALO?</span>
          <span className="section-script-title" style={{ fontSize: '42px', marginTop: '-4px' }}>Regalos</span>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '12px 0 24px', lineHeight: '1.7' }}>
            Lo más importante es compartir este día con ustedes. Si desean hacernos un regalo, pueden ayudarnos a cumplir nuestro próximo sueño: construir juntos nuestro hogar y comenzar una nueva etapa en España. 🇪🇸
          </p>

          <button className="btn-olive" onClick={() => setActiveModal('gift')}>
            <i className="fa-solid fa-gift"></i>
            <span>VER DATOS</span>
          </button>
        </div>
      </section>

      <footer>
        CARLOS & ALIZON · 25 DE SEPTIEMBRE DE 2026
      </footer>

      {/* MODAL DE DATOS PARA REGALO */}
      {activeModal === 'gift' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', color: '#888', cursor: 'pointer' }} onClick={() => setActiveModal(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h3 className="section-tag" style={{ fontSize: '14px', marginBottom: '6px', textAlign: 'center' }}>DATOS BANCARIOS</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px', textAlign: 'center' }}>
              Agradecemos profundamente tu aporte para nuestro nuevo comienzo en España.
            </p>

            {/* Cuenta Argentina */}
            <div style={{ background: '#fdfaf5', padding: '16px', borderRadius: '16px', border: '1px solid var(--gold-border)', marginBottom: '14px' }}>
              <strong style={{ fontSize: '11px', fontFamily: 'var(--font-cinzel)', color: 'var(--text-main)', display: 'block' }}>CUENTA BANCARIA (ARGENTINA)</strong>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>Titular: Alizon Noelia Gamboa Garcia | Galicia</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '8px 12px', borderRadius: '10px', marginTop: '8px', fontFamily: 'monospace', fontSize: '11px', border: '1px solid #eee' }}>
                <span>CBU: 0070160630004049743653</span>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gold-accent)' }} onClick={() => handleCopy('0070160630004049743653', 'CBU')}>
                  <i className="fa-regular fa-copy"></i>
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '8px 12px', borderRadius: '10px', marginTop: '6px', fontFamily: 'monospace', fontSize: '11px', border: '1px solid #eee' }}>
                <span>ALIAS: alizonYcarlos.gal</span>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gold-accent)' }} onClick={() => handleCopy('alizonYcarlos.gal', 'Alias')}>
                  <i className="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>

            {copyToast && (
              <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '12px', fontSize: '12px', textAlign: 'center', marginTop: '14px', border: '1px solid #c8e6c9' }}>
                {copyToast}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}