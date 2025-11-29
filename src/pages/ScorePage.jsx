import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import ReactMarkdown from 'react-markdown';
import { v4 } from 'uuid';
import { getStorage, loadPublicOiseaux } from './utils';

export default function ScorePage() {
  
  const [oiseaux, setOiseaux] = useState(null);

  const update = () => {
    loadPublicOiseaux().then(data => {
      setOiseaux(data.oiseaux);
    });
  };

  const raz = () => {
    if (!window.confirm('Voulez-vous vraiment remettre à zéro votre score ?')) {
      return;
    }
    localStorage.removeItem('score');
    update();
  };

  useEffect(() => {
    update();
  }, []);

  const storage = getStorage();
  const score = Object.values(storage).filter(v => v.correct).length;
  if (!oiseaux) {
    return null;
  }
  return (
    <div>
      <h2>Mon Score</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-primary" style={{ width: 200, maxWidth: 200 }} onClick={() => update()}><i className="bi bi-arrow-clockwise" /> rafraîchir</button>
        <button type="button" className="btn btn-danger" style={{ width: 300, maxWidth: 300 }} onClick={() => raz()}><i className="bi bi-trash" /> remise à zéro de mon score</button>
      </div>
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
          {oiseaux.sort((a, b) => a.emplacement - b.emplacement).map(value => {
          const resp = storage[value.id];
          if (!resp) {
            return (
              <tr>
                <td>{value.emplacement}</td>
                <td>Vous n'avez pas répondu</td>
                <td>0 point</td>
              </tr>
            )
          }
          const respOiseau = oiseaux.find(o => o.id === resp.answer);
          return (
            <tr>
              <td>{value.emplacement}</td>
              <td>{resp.correct ? 'oui' : 'non'}{resp.correct ? '' : `, vous avez répondu ${respOiseau.nom}`}</td>
              <td>{resp.correct ? '1 point' : '0 point'}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
    </div>
  );
}
