import React, { useEffect, useState } from 'react';
import { computeScore, loadScores } from './utils';

export default function AdminScoresPage() {

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
