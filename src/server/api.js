import express from 'express';

const router = express.Router()

router.get('/oiseaux', (req, res) => {
  res.json({
    oiseaux: [
      { id: 1, name: 'Oiseau 1' },
      { id: 2, name: 'Oiseau 2' },
      { id: 3, name: 'Oiseau 3' },
    ]
  })
})

export default router