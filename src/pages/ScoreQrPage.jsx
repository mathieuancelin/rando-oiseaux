import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function ScoreQrPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1 style={{ marginBottom: 40 }}>Votre score</h1>
      <QRCodeCanvas value={`${window.location.origin}/score`} size={512} />
    </div>
  )
}
