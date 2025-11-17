import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import AdminPage from './pages/AdminPage';
import AdminScoresPage from './pages/AdminScoresPage';
import OiseauQrPage from './pages/OiseauQrPage';
import ScoreQrPage from './pages/ScoreQrPage';
import OiseauPage from './pages/OiseauPage';
import ScorePage from './pages/ScorePage';

import './App.css';

/*
// https://sonotheque.mnhn.fr/



function OiseauPage() {

  const { uuid } = useParams();
  const [oiseau, setOiseau] = useState(null);
  const [showTrivia, setShowTrivia] = useState(false);
  const [answered, setAnswered] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [choices, setChoices] = useState([]);
  const [displayTeamModal, setDisplayTeamModal] = useState(false);
  const [teamInfos, setTeamInfos] = useState({});

  useEffect(() => {
    loadOiseau(uuid).then(data => {
      setOiseau(data);
      loadChoices(uuid).then(otherChoices => {
        const choices = [data, ...otherChoices];
        setChoices(shuffleArray(choices));
        fetchMarkdown(data.infosFile);
        const score = getStorage();
        if (!score?.team?.name) {
          setDisplayTeamModal(true);
        }
        const current = score[uuid];
        if (current) {
          if (current.correct) {
            setAnswered('correct');
          } else {
            setAnswered('incorrect');
          }
        }
      });
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

  const handleTeamModalSubmit = () => {
    if (!teamInfos.name) {
      alert('Veuillez entrer un nom d\'équipe');
      return;
    }
    let score = getStorage();
    teamInfos.uid = v4();
    score.team = teamInfos;
    setStorage(score);
    setDisplayTeamModal(false);
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
      {displayTeamModal && (
        <>        
          <div className="modal d-block fade show" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style={{ background: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Entrez les informations de votre équipe</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Le nom de votre équipe (obligatoire)</label>
                      <input type="text" className="form-control" value={teamInfos.name} onChange={(e) => setTeamInfos({ ...teamInfos, name: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Le nom du chef d'équipe</label>
                      <input type="text" className="form-control" value={teamInfos.leaderName} onChange={(e) => setTeamInfos({ ...teamInfos, leaderName: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">L'email du chef d'équipe</label>
                      <input type="email" className="form-control" value={teamInfos.leaderEmail} onChange={(e) => setTeamInfos({ ...teamInfos, leaderEmail: e.target.value })} />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={handleTeamModalSubmit}>C'est parti !</button>
                </div>
              </div>
            </div>
          </div>
      </>)}
    </div>
  );
}

function ScorePage() {
  const [oiseaux, setOiseaux] = useState(null);
  useEffect(() => {
    loadOiseaux().then(data => {
      setOiseaux(data.oiseaux);
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
      <div style={{ padding: 20 }}>
      <table className="table table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">Emplacement</th>
            <th scope="col">Réponse correcte</th>
            <th scope="col">Points</th>
          </tr>
        </thead>
        <tbody>
          {oiseaux.map(value => {
          const resp = storage[value.id];
          if (!resp) {
            return (
              <tr>
                <td>{value.emplacement}</td>
                <td>Vous n'avez pas répondu</td>
                <td>0</td>
              </tr>
            )
          }
          const respOiseau = oiseaux.find(o => o.id === resp.answer);
          return (
            <tr>
              <td>{value.emplacement}</td>
              <td>{resp.correct ? '1' : '0'} point {resp.correct ? '' : `(vous avez répondu ${respOiseau.nom})`}</td>
              <td>{resp.correct ? '1' : '0'}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
    </div>
  );
}

function AdminPage() {
  const [oiseaux, setOiseaux] = useState([]);
  useEffect(() => {
    loadOiseaux().then(data => {
      setOiseaux(data.oiseaux);
    });
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>Administration de la Rando des Oiseaux</h2>
      <button style={{ maxWidth: 320 }} onClick={() => localStorage.removeItem('score')}>remise à zéro du jeux (sur cet appareil)</button>
      <a href="/admin/scores" target="_blank">Voir le tableau des scores</a>
      <a href="https://sonotheque.mnhn.fr/" target="_blank">sonotheque oiseaux</a>
      <div className="qr-container">
        <div className="qr-item">
          <h3>Page de score (pour les joueurs)</h3>
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
    loadOiseau(uuid).then(data => {
      setOiseau(data);
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

function AdminScoresPage() {

  const [scores, setScores] = useState([]);

  function updateScores() {
    loadScores().then(data => {
      console.log(data.scores)
      setScores(data.scores);
    });
  }

  useEffect(() => {
    updateScores();
    const interval = setInterval(updateScores, 20000);
    return () => clearInterval(interval);
  }, []);

  if (!scores) {
    return null;
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Tableau des scores</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-primary" style={{ width: 200, maxWidth: 200 }} onClick={() => updateScores()}><i className="bi bi-arrow-clockwise" /> rafraîchir</button>
      </div>
      <table className="table table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Equipe</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          {scores
            .map(score => ({ score: computeScore(score), team: score.team }))
            .sort((a, b) => b.score - a.score).map((score, idx) => {
              return (
                <tr>
                  <th scope="row">{idx + 1}</th>
                  <td>{score?.team?.name}</td>
                  <td>{score.score} points</td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  );
}

function computeScore(score) {
  return Object.values(score).filter(v => v.correct).length;
}*/

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/scores" element={<AdminScoresPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/oiseau/:uuid" element={<OiseauPage />} />
        <Route path="/qrcode/score" element={<ScoreQrPage />} />
        <Route path="/qrcode/:uuid" element={<OiseauQrPage />} />
        <Route path="/score" element={<ScorePage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;