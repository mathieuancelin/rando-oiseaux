import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { loadOiseaux, getStorage } from './utils';

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


export default function AdminPage() {
  const [oiseaux, setOiseaux] = useState([]);
  const storage = getStorage();
  useEffect(() => {
    loadOiseaux().then(data => {
      setOiseaux(data.oiseaux);
    });
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <h2>Administration de la Rando des Oiseaux</h2>
      <button className="btn btn-primary" style={{ maxWidth: 320 }} onClick={() => localStorage.removeItem('score')}>remise à zéro du jeux (sur cet appareil)</button>
      <table className="table table-striped table-hover table-bordered" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Lien</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tableau des scores</td>
            <td><a href="/admin/scores" target="_blank">voir</a></td>
          </tr>
          <tr>
            <td>Sonotheque des oiseaux</td>
            <td><a href="https://sonotheque.mnhn.fr/" target="_blank">Voir</a></td>
          </tr>
        </tbody>
      </table>

      <table className="table table-striped table-hover table-bordered" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th scope="col">Oiseau</th>
            <th scope="col">Vue joueur</th>
            <th scope="col">Vue impression</th>
          </tr>
        </thead>
        <tbody>
          <tr key="score">
            <td>Page de score (pour les joueurs)</td>
            <td><a href="/score" target="_blank">voir</a></td>
            <td><a href={`/qrcode/score`} target="_blank">imprimer</a></td>
          </tr>
          {oiseaux.map(o => (
            <tr key={o.id}>
              <td>{o.nom}</td>
              <td><a href={`/oiseau/${o.id}`} target="_blank">voir</a></td>
              <td><a href={`/qrcode/${o.id}`} target="_blank">imprimer</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}