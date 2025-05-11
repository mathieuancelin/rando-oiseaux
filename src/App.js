import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import ReactMarkdown from 'react-markdown';

import './App.css';

// https://sonotheque.mnhn.fr/

function loadOiseaux() {
  return fetch('/data/oiseaux.json').then(res => res.json());
}

function pickRandomItems(arr, excludeId, n) {
  const filtered = arr.filter(item => item.id !== excludeId);
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function getStorage() {
  return JSON.parse(localStorage.getItem('score') || '{}');
}

function setStorage(storage) {
  localStorage.setItem('score', JSON.stringify(storage));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function OiseauPage() {
  const { uuid } = useParams();
  const [oiseaux, setOiseaux] = useState([]);
  const [oiseau, setOiseau] = useState(null);
  const [showTrivia, setShowTrivia] = useState(false);
  const [answered, setAnswered] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    loadOiseaux().then(data => {
      setOiseaux(data);
      const o = data.find(item => item.id === uuid);
      setOiseau(o);
      const choices = [o, ...pickRandomItems(data, o.id, 2)];
      setChoices(shuffleArray(choices));
      fetchMarkdown(o.infosFile);
      const score = getStorage();
      const current = score[uuid];
      if (current) {
        if (current.correct) {
          setAnswered('correct');
        } else {
          setAnswered('incorrect');
        }
      }
    });
  }, [uuid]);

  const fetchMarkdown = (filePath) => {
    fetch(`/${filePath}`)
      .then(res => res.text())
      .then(setMarkdownContent);
  };

  const handleAnswer = (o) => {
      let score = getStorage();
      score[oiseau.id] = { correct: o.id === oiseau.id, answer: o.id };
      setStorage(score);
    if (o.id === oiseau.id) {
      setAnswered('correct');
    } else {
      setAnswered('incorrect');
    }
  };

  const isCorrect = answered === 'correct';
  const notCorrect = !!answered && answered !== 'correct';

  if (!oiseau) return <div>Chargement...</div>;

  return (
    <div className="container">
      {!answered && <img src={`/${oiseau.imageMystere}`} alt="Oiseau mystère" />}
      {answered && <img src={`/${oiseau.imageNormale}`} alt={oiseau.nom} />}
      {!answered && <h2>Oiseau Mystère</h2>}
      {isCorrect && <h2>Bravo ! C'était {oiseau.nom}</h2>}
      {notCorrect && <h2>Perdu c'était {oiseau.nom}</h2>}
      <audio controls src={`/${oiseau.chant}`}></audio>
      {!answered ? (
        <div>
          {showTrivia && <p>Indice : {oiseau.trivia}</p>}
          {choices.map(o => <button onClick={() => handleAnswer(o)}>{o.nom}</button>)}
          <button onClick={() => setShowTrivia(true)} className="secondary">Plus d'indice</button>
        </div>
      ) : (
        <div>
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

function ScorePage() {
  const [oiseaux, setOiseaux] = useState(null);
  useEffect(() => {
    loadOiseaux().then(data => {
      setOiseaux(data);
    });
  }, []);

  const storage = getStorage();
  const score = Object.values(storage).filter(v => v.correct).length;
  if (!oiseaux) {
    return null;
  }
  return (
    <div>
      <h2>Mon Score</h2>
      <p>Vous avez {score} points !</p>
      <ul>
        {oiseaux.map(value => {
          const resp = storage[value.id];
          if (!resp) {
            return (
              <li>emplacement {value.emplacement} - vous n'avez pas répondu</li>
            )
          }
          const respOiseau = oiseaux.find(o => o.id === resp.answer);
          return (
            <li>emplacement {value.emplacement} - {value.nom} : {resp.correct ? '1' : '0'} point {resp.correct ? '' : `(vous avez répondu ${respOiseau.nom})`}</li>
          )
        })}
      </ul>
    </div>
  );
}

function HomePage() {
  const [oiseaux, setOiseaux] = useState([]);
  useEffect(() => {
    loadOiseaux().then(data => {
      setOiseaux(data);
    });
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>Administration de la Rando des Oiseaux</h2>
      <button onClick={() => localStorage.removeItem('score')}>remise à zéro du jeux (sur cet appareil)</button>
      <a href="https://sonotheque.mnhn.fr/" target="_blank">sonotheque oiseaux</a>
      <div className="qr-container">
        <div className="qr-item">
          <h3>Page de score</h3>
          <QRCodeCanvas value={`${window.location.origin}/score`} size={256} />
          <a style={{ marginTop: 10 }} href={`/score`} target="_blank">voir la page comme un randonneur</a>
          <a style={{ marginTop: 10 }} href={`/qrcode/score`} target="_blank">imprimer l'affiche du QR Code</a>
        </div>
        {oiseaux.map(o => <OiseauQr oiseau={o} />)}
      </div>
    </div>
  );
}

function OiseauQr({ oiseau }) {
  return (
    <div className="qr-item">
      <h3>{oiseau.nom} (emplacement {oiseau.emplacement})</h3>
      <QRCodeCanvas value={`${window.location.origin}/oiseau/${oiseau.id}`} size={256} />
      <a style={{ marginTop: 10 }} href={`/oiseau/${oiseau.id}`} target="_blank">voir la page comme un randonneur</a>
      <a style={{ marginTop: 10 }} href={`/qrcode/${oiseau.id}`} target="_blank">imprimer l'affiche du QR Code</a>
    </div>
  )
}

function QrPage() {
  const { uuid } = useParams();
  const [oiseau, setOiseau] = useState(null);
  useEffect(() => {
    loadOiseaux().then(data => {
      const o = data.find(item => item.id === uuid);
      setOiseau(o);
    });
  }, [uuid]);
  if (!oiseau) {
    return null;
  }
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1 style={{ marginBottom: 40 }}>emplacement {oiseau.emplacement}</h1>
      <QRCodeCanvas value={`${window.location.origin}/oiseau/${oiseau.id}`} size={512} />
    </div>
  )
}

function QrPageScore() {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1 style={{ marginBottom: 40 }}>Votre score</h1>
      <QRCodeCanvas value={`${window.location.origin}/score`} size={512} />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/_admin" element={<HomePage />} />
        <Route path="/oiseau/:uuid" element={<OiseauPage />} />
        <Route path="/qrcode/score" element={<QrPageScore />} />
        <Route path="/qrcode/:uuid" element={<QrPage />} />
        <Route path="/score" element={<ScorePage />} />
      </Routes>
    </Router>
  );
}

export default App;