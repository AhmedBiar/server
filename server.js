
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());


app.use(cors({
  origin: 'https://proyecto-xhjg.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));


app.options('*', cors());


app.get('/', (req, res) => {
  res.send('API corriendo');
});

app.patch('/estadisticas/:id', (req, res) => {
  res.send(`Actualizando estadística ${req.params.id}`);
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
});





