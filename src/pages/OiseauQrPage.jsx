import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { loadOiseau } from './utils';

export default function OiseauQrPage() {
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