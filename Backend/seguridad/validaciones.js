const REGLA_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{5,25}$/;
const esTexto = (v) => typeof v === 'string';
const esNombre = (v) => esTexto(v) && REGLA_NOMBRE.test(v.trim());
const esCorreoGmail = (v) => esTexto(v) && v.length <= 50 && 
/^[^\s@]+@gmail\.com$/i.test(v.trim());
const esTelefono55 = (v) => esTexto(v) && /^55\d{8}$/.test(v);
const esIdValido = (v) => typeof v !== 'boolean' && 
Number.isInteger(Number(v)) && Number(v) > 0;
module.exports = { esTexto, esNombre, esCorreoGmail, esTelefono55, esIdValido 
};