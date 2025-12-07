import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(express.json());

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://proyecto-xhjg.onrender.com';

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (origin === FRONTEND_ORIGIN) return cb(null, true);
    // if (process.env.NODE_ENV !== 'production') return cb(null, true);
    return cb(new Error('CORS not allowed'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));


app.options('*', cors());

const DB_PATH = './db.json';

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    return { ubicaciones: [], estadisticas: [] };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}


app.get('/', (req, res) => res.send('API funcionando'));


app.get('/ubicaciones', (req, res) => {
  const db = loadDB();
  res.json(db.ubicaciones || []);
});

app.get('/ubicaciones/:id', (req, res) => {
  const db = loadDB();
  const item = (db.ubicaciones || []).find(u => u.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'No encontrada' });
  res.json(item);
});

app.post('/ubicaciones', (req, res) => {
  const db = loadDB();
  const nueva = req.body;
  nueva.id = Date.now().toString();
  db.ubicaciones = db.ubicaciones || [];
  db.ubicaciones.push(nueva);
  saveDB(db);
  res.status(201).json(nueva);
});

app.put('/ubicaciones/:id', (req, res) => {
  const db = loadDB();
  db.ubicaciones = db.ubicaciones || [];
  const idx = db.ubicaciones.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrada' });
  db.ubicaciones[idx] = { ...req.body, id: req.params.id };
  saveDB(db);
  res.json(db.ubicaciones[idx]);
});

app.patch('/ubicaciones/:id', (req, res) => {
  const db = loadDB();
  db.ubicaciones = db.ubicaciones || [];
  const idx = db.ubicaciones.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrada' });
  db.ubicaciones[idx] = { ...db.ubicaciones[idx], ...req.body };
  saveDB(db);
  res.json(db.ubicaciones[idx]);
});

app.delete('/ubicaciones/:id', (req, res) => {
  const db = loadDB();
  db.ubicaciones = db.ubicaciones || [];
  const idx = db.ubicaciones.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrada' });
  const eliminado = db.ubicaciones.splice(idx, 1)[0];
  saveDB(db);
  res.json(eliminado);
});


app.get('/estadisticas', (req, res) => {
  const db = loadDB();
  res.json(db.estadisticas || []);
});

app.get('/estadisticas/:id', (req, res) => {
  const db = loadDB();
  const est = (db.estadisticas || []).find(e => e.id === req.params.id);
  if (!est) return res.status(404).json({ error: 'No encontrada' });
  res.json(est);
});

app.post('/estadisticas', (req, res) => {
  const db = loadDB();
  const nueva = req.body;
  nueva.id = Date.now().toString();
  db.estadisticas = db.estadisticas || [];
  db.estadisticas.push(nueva);
  saveDB(db);
  res.status(201).json(nueva);
});

app.patch('/estadisticas/:id', (req, res) => {
  const db = loadDB();
  db.estadisticas = db.estadisticas || [];
  const idx = db.estadisticas.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrada' });
  db.estadisticas[idx] = { ...db.estadisticas[idx], ...req.body };
  saveDB(db);
  res.json(db.estadisticas[idx]);
});

app.delete('/estadisticas/:id', (req, res) => {
  const db = loadDB();
  db.estadisticas = db.estadisticas || [];
  const idx = db.estadisticas.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrada' });
  const eliminado = db.estadisticas.splice(idx, 1)[0];
  saveDB(db);
  res.json(eliminado);
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
});






