require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conexion = require('./conexion');

const app = express();
app.use(cors({ origin: process.env.URL_PAGINA_WEB }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor de AcreditaTech funcionando' });
});

app.get('/prueba-bd', async (req, res) => {
  try {
    const resultado = await conexion.query('SELECT nombre_oficio FROM coficio');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RUTAS_AQUI
const accesoRutas = require('./rutas/acceso_rutas');
app.use('/api/acceso', accesoRutas);

app.use('/api/acceso', require('./rutas/acceso_rutas'));
app.use('/api/perfil', require('./rutas/perfil_rutas'));
app.use('/api/evaluaciones', require('./rutas/evaluaciones_rutas'));
app.use('/api/salud', require('./rutas/salud_rutas'));
app.use('/api/guias', require('./rutas/guias_rutas'));
app.use('/api/avance', require('./rutas/avance_rutas'));
app.use('/api/constancia', require('./rutas/constancia_rutas'));
app.use('/api/administracion', require('./rutas/administracion_rutas'));

const puerto = process.env.PORT || process.env.PUERTO || 4000;
app.listen(puerto, () => console.log('Servidor en el puerto ' + puerto));