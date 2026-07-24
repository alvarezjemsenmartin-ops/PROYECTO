const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const gemasRouter = require('./routes/gemas');
const app = express();
const SECRET = '2uP27AIF'; 
// Hola profe este archivo es para configurar más espacio en el servidor, esque la imagen se corrompía
// De todas formas, la imagen no puede pesar casi nada porque sino no sirve, sabrá diosito por qué
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static('public'));

app.post('/api/verificatoken', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Sin token' });
  const token = auth.split(' ')[1];
  try {
    jwt.verify(token, SECRET);
    res.json({ ok: true });
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
});
// Rutas de gemas
app.use('/api/gemas', gemasRouter);
// Conectar a MongoDB e iniciar servidor
mongoose.connect('mongodb://localhost:27017/gemasDB')
  .then(() => {
    app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
  })
  .catch(err => console.error('Error MongoDB:', err));