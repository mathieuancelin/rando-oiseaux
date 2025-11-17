import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { loadOiseaux, getStorage } from './utils';
import { v4 } from 'uuid';

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
  const [displayEditModel, setDisplayEditModel] = useState(false);
  const [editingOiseau, setEditingOiseau] = useState(null);

  const updateOiseaux = () => {
    loadOiseaux().then(data => {
      setOiseaux(data.oiseaux.sort((a, b) => a.emplacement - b.emplacement));
    });
  }
  
  useEffect(() => {
    updateOiseaux();
  }, [])

  const handleEditSubmit = () => {
    fetch(`/admin/api/oiseaux/${editingOiseau.id}`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editingOiseau)
    }).then(() => {
      setOiseaux([ ...oiseaux, editingOiseau ]);
      setEditingOiseau(null);
      setDisplayEditModel(false);
      updateOiseaux();
    });
  }

  const handleDelete = (o) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet oiseau ?')) {
      fetch(`/admin/api/oiseaux/${(o || editingOiseau).id}`, {
        credentials: 'include',
        method: 'DELETE'
      }).then(() => {
        setOiseaux(oiseaux.filter(o => o.id !== (o || editingOiseau).id));
        setEditingOiseau(null);
        setDisplayEditModel(false);
        updateOiseaux();
      });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <h2>Administration de la Rando des Oiseaux</h2>
      <button className="btn btn-primary" style={{ maxWidth: 320 }} onClick={() => localStorage.removeItem('score')}>remise à zéro du jeux (sur cet appareil)</button>
      
      <h3>Liens utiles</h3>
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

      <h3>Tableau des oiseaux</h3>
      <button className="btn btn-primary" style={{ maxWidth: 320 }} onClick={() => {
        setEditingOiseau({
          id: v4(), 
        });
        setDisplayEditModel(true);
      }}><i className="bi bi-plus" /> Ajouter un oiseau</button>
      <table className="table table-striped table-hover table-bordered" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th scope="col">Emplacement</th>
            <th scope="col">Oiseau</th>
            <th scope="col">Vue joueur</th>
            <th scope="col">Impression QR Code</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr key="score">
            <td></td>
            <td>Page de score (pour les joueurs)</td>
            <td><a href="/score" target="_blank">voir</a></td>
            <td><a href={`/qrcode/score`} target="_blank">imprimer</a></td>
            <td></td>
          </tr>
          {oiseaux.map(o => (
            <tr key={o.id}>
              <td>{o.emplacement}</td>
              <td>{o.nom}</td>
              <td><a href={`/oiseau/${o.id}`} target="_blank">voir</a></td>
              <td><a href={`/qrcode/${o.id}`} target="_blank">imprimer</a></td>
              <td>
                <div className="btn-group">
                  <button type="button" className="btn btn-sm btn-primary" onClick={() => {
                    setEditingOiseau(o)
                    setDisplayEditModel(true)
                  }}><i className="bi bi-pencil" /></button>
                  {!o.static && <button type="button" className="btn btn-sm btn-danger" onClick={() => {
                    console.log(o)
                    setEditingOiseau(o);
                    handleDelete(o);
                  }}><i className="bi bi-trash" /></button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {displayEditModel && (
        <div className="modal d-block fade show" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style={{ background: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Entrez les informations de l'oiseau</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">ID de l'oiseau</label>
                    <input type="text" className="form-control" value={editingOiseau.id} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">L'emplacement de l'oiseau</label>
                    <input type="number" className="form-control" value={editingOiseau.emplacement} onChange={(e) => setEditingOiseau({ ...editingOiseau, emplacement: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Le nom de l'oiseau</label>
                    <input type="text" className="form-control" value={editingOiseau.nom} onChange={(e) => setEditingOiseau({ ...editingOiseau, nom: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">L'image mystère de l'oiseau (URL)</label>
                    <input type="text" className="form-control" value={editingOiseau.imageMystere} onChange={(e) => setEditingOiseau({ ...editingOiseau, imageMystere: e.target.value })} />
                    <button type="button" className="btn btn-primary btn-sm" style={{ width: 200 }} onClick={() => {
                      document.getElementById('file-imageMystere').click();
                    }}><i className="bi bi-upload"></i> charger une image</button>
                    <input type="file" id="file-imageMystere" className="form-control hide" style={{ display: 'none' }} onChange={(e) => {
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      fetch('/admin/api/uploads', {
                        method: 'POST',
                        body: formData
                      }).then(res => res.json()).then(data => {
                        setEditingOiseau({ ...editingOiseau, imageMystere: data.url });
                      });
                    }}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">L'image normale de l'oiseau (URL)</label>
                    <input type="text" className="form-control" value={editingOiseau.imageNormale} onChange={(e) => setEditingOiseau({ ...editingOiseau, imageNormale: e.target.value })} />
                    <button type="button" className="btn btn-primary btn-sm" style={{ width: 200 }} onClick={() => {
                      document.getElementById('file-imageNormale').click();
                    }}><i className="bi bi-upload"></i> charger une image</button>
                    <input type="file" id="file-imageNormale" className="form-control hide" style={{ display: 'none' }} onChange={(e) => {
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      fetch('/admin/api/uploads', {
                        method: 'POST',
                        body: formData
                      }).then(res => res.json()).then(data => {
                        setEditingOiseau({ ...editingOiseau, imageNormale: data.url });
                      });
                    }}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Le chant de l'oiseau (URL)</label>
                    <input type="text" className="form-control" value={editingOiseau.chant} onChange={(e) => setEditingOiseau({ ...editingOiseau, chant: e.target.value })} />
                    <button type="button" className="btn btn-primary btn-sm" style={{ width: 200 }} onClick={() => {
                      document.getElementById('file-chant').click();
                    }}><i className="bi bi-upload"></i> charger une image</button>
                    <input type="file" id="file-chant" className="form-control hide" style={{ display: 'none' }} onChange={(e) => {
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      fetch('/admin/api/uploads', {
                        method: 'POST',
                        body: formData
                      }).then(res => res.json()).then(data => {
                        setEditingOiseau({ ...editingOiseau, chant: data.url });
                      });
                    }}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Le trivia de l'oiseau</label>
                    <textarea className="form-control" value={editingOiseau.trivia} onChange={(e) => setEditingOiseau({ ...editingOiseau, trivia: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Informations de l'oiseau</label>
                    <textarea className="form-control" rows={10} value={editingOiseau.infos} onChange={(e) => setEditingOiseau({ ...editingOiseau, infos: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fichier d'informations de l'oiseau</label>
                    <input type="text" className="form-control" value={editingOiseau.infosFile} onChange={(e) => setEditingOiseau({ ...editingOiseau, infosFile: e.target.value })} />
                    <button type="button" className="btn btn-primary btn-sm" style={{ width: 200 }} onClick={() => {
                      document.getElementById('file-infosFile').click();
                    }}><i className="bi bi-upload"></i> charger une image</button>
                    <input type="file" id="file-infosFile" className="form-control hide" style={{ display: 'none' }} onChange={(e) => {
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      fetch('/admin/api/uploads', {
                        method: 'POST',
                        body: formData
                      }).then(res => res.json()).then(data => {
                        setEditingOiseau({ ...editingOiseau, infosFile: data.url });
                      });
                    }}/>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <div className="btn-group">
                  {!editingOiseau.static && <button type="button" className="btn btn-danger" onClick={handleDelete}>Supprimer</button>}
                  {!editingOiseau.static && <button type="button" className="btn btn-primary" onClick={handleEditSubmit}>Sauvegarder</button>}
                  {editingOiseau.static && <button type="button" className="btn btn-secondary" onClick={() => {
                    setEditingOiseau(null)
                    setDisplayEditModel(false)
                  }}>Fermer</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}