require('dotenv').config();
const bcrypt = require('bcryptjs');
const conexion = require('./conexion');
const reglas = require('./reglas');

async function crearAdministrador() {
  const correo = 'admin@gmail.com';
  const contrasena = 'Admin12345';

  const cifrada = await bcrypt.hash(contrasena, 10);

  await conexion.query(
    `INSERT INTO musuario
       (id_tipo_usuario, id_alcaldia, id_oficio, nombre, correo,
        contrasena, telefono, curp)
     VALUES ($1, 1, 1, 'Administrador', $2, $3, '5500000000', 'ADMIN0000000000000')
     ON CONFLICT (correo) DO NOTHING`,
    [reglas.ROL_ADMINISTRADOR, correo, cifrada]
  );

  console.log('Administrador listo. Correo: ' + correo + ' | Contraseña: ' + contrasena);
  await conexion.end();
}

crearAdministrador().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});