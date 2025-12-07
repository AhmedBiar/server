import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors()); 
app.use(express.json());


app.use(express.static(path.join(process.cwd(), "public")));


const dbPath = path.join(process.cwd(), "db.json");


function readDB() {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}


app.get("/ubicaciones", (req, res) => {
  const db = readDB();
  res.json(db.ubicaciones || []);
});

app.get("/estadisticas/:id", (req, res) => {
  const db = readDB();
  const stat = db.estadisticas?.find(s => s.id === parseInt(req.params.id));
  if (!stat) return res.status(404).json({ error: "No encontrado" });
  res.json(stat);
});

app.patch("/estadisticas/:id", (req, res) => {
  const db = readDB();
  const index = db.estadisticas?.findIndex(s => s.id === parseInt(req.params.id));
  if (index === undefined || index === -1)
    return res.status(404).json({ error: "No encontrado" });

  db.estadisticas[index] = { ...db.estadisticas[index], ...req.body };
  writeDB(db);
  res.json(db.estadisticas[index]);
});


app.get("/", (req, res) => {
  res.send("Servidor Express activo. Endpoints: /ubicaciones, /estadisticas/:id");
});


app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
});





