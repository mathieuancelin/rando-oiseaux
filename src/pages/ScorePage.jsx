import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import ReactMarkdown from 'react-markdown';
import { v4 } from 'uuid';
import { loadOiseaux, getStorage } from './utils';

export default function ScorePage() {
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
