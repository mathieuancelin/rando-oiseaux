export function loadOiseaux() {
  return fetch('/admin/api/oiseaux', {
    credentials: 'include'
  }).then(res => res.json());
}

export function loadOiseau(id) {
  return fetch(`/api/oiseaux/${id}`).then(res => res.json());
} 

export function loadScores() {
  return fetch('/admin/api/scores', {
    credentials: 'include'
  }).then(res => res.json());
}

export function loadChoices(id) {
  return fetch(`/api/oiseaux/${id}/choices`).then(res => res.json());
}

export function getStorage() {
  return JSON.parse(localStorage.getItem('score') || '{}');
}

export function setStorage(storage) {
  localStorage.setItem('score', JSON.stringify(storage));
  if (storage?.team?.uid) {
    fetch(`/api/scores/${storage?.team?.uid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(storage)
    });
  }
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function computeScore(score) {
  return Object.values(score).filter(v => v.correct).length;
}
