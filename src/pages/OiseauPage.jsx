import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import ReactMarkdown from 'react-markdown';
import { v4 } from 'uuid';
import { loadOiseau, loadChoices, getStorage, setStorage, shuffleArray } from './utils';

export default function OiseauPage() {

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
      setOiseau(data.oiseau);
      loadChoices(uuid).then(otherChoices => {
        const choices = [data.oiseau, ...otherChoices];
        setChoices(shuffleArray(choices));
        if (data.oiseau.infosFile) {
          fetchMarkdown(data.oiseau.infosFile);
        } else if (data.oiseau.infos) {
          setMarkdownContent(data.oiseau.infos);
        }
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
      {/* on cache l'image pour le moment */}
      {false && !answered && <img src={`/${oiseau.imageNormale}`} alt="Oiseau mystère" style={{ filter: 'blur(20px)' }} />}
      {/* on cache l'image pour le moment */}
      {false && answered && <img src={`/${oiseau.imageNormale}`} alt={oiseau.nom} />}
      {!answered && <h2>Oiseau Mystère</h2>}
      {isCorrect && <h2>Bravo ! C'était {oiseau.nom}</h2>}
      {notCorrect && <h2>Perdu c'était {oiseau.nom}</h2>}
      <audio controls src={`/${oiseau.chant}`}></audio>
      {!answered ? (
        <div>
          {(true || showTrivia) && <p>Indice : {oiseau.trivia}</p>}
          {choices.map(o => <button onClick={() => handleAnswer(o)}>{o.nom}</button>)}
          {false && <button onClick={() => setShowTrivia(true)} className="secondary">Plus d'indice</button>}
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
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Le nom de votre équipe (obligatoire)</label>
                      <input type="text" className="form-control" value={teamInfos.name} onChange={(e) => setTeamInfos({ ...teamInfos, name: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Le nom du chef d'équipe (nécessaire pour participer au concours)</label>
                      <input type="text" className="form-control" value={teamInfos.leaderName} onChange={(e) => setTeamInfos({ ...teamInfos, leaderName: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">L'email du chef d'équipe (nécessaire pour participer au concours)</label>
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