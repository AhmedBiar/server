import express from "express";
import cors from "cors";
import fs from "fs";

import fetch from "node-fetch"; 

app.get("/img/:id", async (req, res) => {
  const db = loadDB();
  const item = db.ubicaciones.find(u => u.id === req.params.id);
  if (!item) return res.status(404).send("No encontrada");

  try {
    const respuesta = await fetch(item.url);
    const buffer = await respuesta.arrayBuffer();
    res.set("Content-Type", respuesta.headers.get("content-type"));
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send("Error cargando imagen");
  }
});

const app = express();
app.use(express.json());

const DB_PATH = "./db.json";

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}


app.use(cors({
  origin: "https://proyecto-xhjg.onrender.com",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204, 
}));


app.get("/", (req, res) => {
  res.send("API funcionando");
});


app.get("/ubicaciones", (req, res) => {
  const db = loadDB();
  res.json(db.ubicaciones);
});

app.get("/ubicaciones/:id", (req, res) => {
  const db = loadDB();
  const item = db.ubicaciones.find(u => u.id === req.params.id);
  if (!item) return res.status(404).json({ error: "No encontrada" });
  res.json(item);
});

app.post("/ubicaciones", (req, res) => {
  const db = loadDB();
  const nueva = { ...req.body, id: Date.now().toString() };
  db.ubicaciones.push(nueva);
  saveDB(db);
  res.status(201).json(nueva);
});

app.put("/ubicaciones/:id", (req, res) => {
  const db = loadDB();
  const idx = db.ubicaciones.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "No encontrada" });

  db.ubicaciones[idx] = { ...req.body, id: req.params.id };
  saveDB(db);
  res.json(db.ubicaciones[idx]);
});

app.patch("/ubicaciones/:id", (req, res) => {
  const db = loadDB();
  const idx = db.ubicaciones.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "No encontrada" });

  db.ubicaciones[idx] = { ...db.ubicaciones[idx], ...req.body };
  saveDB(db);
  res.json(db.ubicaciones[idx]);
});

app.delete("/ubicaciones/:id", (req, res) => {
  const db = loadDB();
  db.ubicaciones = db.ubicaciones.filter(u => u.id !== req.params.id);
  saveDB(db);
  res.json({ mensaje: "Eliminado" });
});

app.get("/estadisticas", (req, res) => {
  const db = loadDB();
  res.json(db.estadisticas);
});

app.get("/estadisticas/:id", (req, res) => {
  const db = loadDB();
  const est = db.estadisticas.find(e => e.id === req.params.id);
  if (!est) return res.status(404).json({ error: "No encontrada" });
  res.json(est);
});

app.patch("/estadisticas/:id", (req, res) => {
  const db = loadDB();
  const idx = db.estadisticas.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "No encontrada" });

  db.estadisticas[idx] = { ...db.estadisticas[idx], ...req.body };
  saveDB(db);
  res.json(db.estadisticas[idx]);
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
});







