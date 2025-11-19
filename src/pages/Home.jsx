import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="nav">
            <div className="logo">
              <span className="logo-icon">🦅</span>
              <span className="logo-text">La Rando des Oiseaux</span>
            </div>
            <button className="cta-button primary hide">Commencer une rando</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Explorez la nature, écoutez les oiseaux, testez vos connaissances.
            </h1>
            <p className="hero-subtitle">
              Découvrez une nouvelle façon de randonner avec des jeux de piste sonores 
              qui vous feront reconnaître les oiseaux locaux à partir de leur chant.
            </p>
            <div className="hero-actions hide">
              <button className="cta-button primary large">Télécharger l'app</button>
              <button className="cta-button secondary large">En savoir plus</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="nature-scene">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="qr-code">📱</div>
                  <div className="sound-waves">🎵</div>
                </div>
              </div>
              <div className="birds">🐦 🕊️ 🦜</div>
              <div className="trees">🌲 🌳 🌿</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <h2>Comment ça marche ?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-icon">📱</div>
              <h3>1. Scanner</h3>
              <p>Scannez le QR code à chaque étape de votre randonnée</p>
            </div>
            <div className="step">
              <div className="step-icon">🎧</div>
              <h3>2. Écouter</h3>
              <p>Écoutez le chant mystère et découvrez une anecdote fascinante</p>
            </div>
            <div className="step">
              <div className="step-icon">🤔</div>
              <h3>3. Deviner</h3>
              <p>Identifiez l'oiseau parmi plusieurs propositions et gagnez des points</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="why-section">
        <div className="container">
          <h2>Pourquoi La Rando des Oiseaux ?</h2>
          <div className="benefits-grid">
            <div className="benefit">
              <div className="benefit-icon">🌱</div>
              <h3>Sensibilisation à la nature</h3>
              <p>Développez votre connexion avec l'environnement et apprenez à reconnaître la biodiversité qui vous entoure.</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">🎮</div>
              <h3>Apprentissage ludique</h3>
              <p>Transformez votre randonnée en jeu éducatif où chaque découverte devient une victoire.</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">👥</div>
              <h3>Activité de groupe</h3>
              <p>Partagez des moments uniques en famille ou entre amis, créez des souvenirs inoubliables.</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">🧠</div>
              <h3>Stimulation cognitive</h3>
              <p>Exercez votre mémoire auditive et vos capacités d'observation dans un cadre naturel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Target audience */}
      <section className="audience">
        <div className="container">
          <h2>Pour qui ?</h2>
          <div className="audience-cards">
            <div className="audience-card">
              <div className="card-icon">👨‍👩‍👧‍👦</div>
              <h3>Familles</h3>
              <p>Une activité parfaite pour éveiller la curiosité des enfants et créer des liens intergénérationnels autour de la nature.</p>
            </div>
            <div className="audience-card">
              <div className="card-icon">🏫</div>
              <h3>Groupes scolaires</h3>
              <p>Un outil pédagogique innovant pour les sorties éducatives et l'apprentissage des sciences naturelles.</p>
            </div>
            <div className="audience-card">
              <div className="card-icon">🥾</div>
              <h3>Randonneurs curieux</h3>
              <p>Enrichissez vos sorties nature avec une dimension découverte et défi personnel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt pour votre première rando ornithologique ?</h2>
            <p>Rejoignez des milliers d'amoureux de la nature qui ont déjà adopté La Rando des Oiseaux</p>
            <div className="cta-actions hide">
              <button className="cta-button primary large">Commencer maintenant</button>
              <button className="cta-button outline large">Voir une démo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-icon">🦅</span>
              <span className="logo-text">La Rando des Oiseaux</span>
            </div>
            <p>Découvrez la nature autrement</p>
          </div>
        </div>
      </footer>
    </div>
  );
}