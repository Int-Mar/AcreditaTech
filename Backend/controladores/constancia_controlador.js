// constancia_controlador.js
// Pre-Constancia: genera el PDF con QR y permite verificarla con el código.
// La Pre-Constancia es informativa: no sustituye una certificación oficial.

const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const modelo = require("../modelos/constancia_modelo");
const avanceModelo = require("../modelos/avance_modelo");
const reglas = require("../reglas");

const ESTADOS_APROBADOS = ["Aprobado", "Apto"];
const ESTATUS_VENCIDA = "Vencida";

// ── Funciones de apoyo ─────────────────────────────────────────────────────

// Código único de la constancia, por ejemplo ACR-1A2B3C4D
function generarCodigo() {
  return "ACR-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

// Firma digital sencilla (HMAC) con la clave secreta del servidor
function firmar(texto) {
  return crypto
    .createHmac("sha256", process.env.CLAVE_FIRMA)
    .update(texto)
    .digest("hex");
}

// Convierte la fecha de la base a texto legible: 13/11/2026
function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// La vigencia se calcula al consultar: vigente si hoy no pasó del vencimiento
function estaVigente(fecha_vencimiento) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return new Date(fecha_vencimiento) >= hoy;
}

// Busca la evaluación más reciente de un tipo
function buscarEvaluacion(evaluaciones, tipo) {
  return evaluaciones.find((e) => e.tipo_evaluacion === tipo);
}

// ── Descargar PDF ──────────────────────────────────────────────────────────
// GET /api/constancia/pdf  (requiere sesión)
async function descargarPdf(req, res) {
  try {
    const id_usuario = req.usuario.id_usuario;

    const trabajador = await modelo.obtenerDatosTrabajador(id_usuario);
    if (!trabajador) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Regla: solo si aprobó las dos pruebas (Preparación Completada)
    const evaluaciones = await modelo.obtenerEvaluacionesConId(id_usuario);
    const tecnica = buscarEvaluacion(evaluaciones, reglas.TIPO_TECNICA);
    const salud = buscarEvaluacion(evaluaciones, reglas.TIPO_SALUD);
    const completo =
      tecnica &&
      salud &&
      ESTADOS_APROBADOS.includes(tecnica.estado_aprobacion) &&
      ESTADOS_APROBADOS.includes(salud.estado_aprobacion);

    if (!completo) {
      return res.status(403).json({
        mensaje:
          "Debes aprobar las dos evaluaciones para obtener tu Pre-Constancia",
      });
    }

    // Si ya tiene constancia se reutiliza; si no, se crea una nueva
    let constancia = await modelo.buscarConstanciaDeUsuario(id_usuario);

    if (constancia && !estaVigente(constancia.fecha_vencimiento)) {
      await avanceModelo.actualizarEstatus(id_usuario, ESTATUS_VENCIDA);
      return res.status(403).json({
        mensaje: "Tu Pre-Constancia está vencida",
      });
    }

    if (!constancia) {
      const codigo = generarCodigo();
      const fecha = new Date().toISOString().slice(0, 10);
      constancia = await modelo.crearConstancia({
        id_evaluacion: tecnica.id_evaluacion,
        id_usuario,
        codigo,
        meses_vigencia: reglas.MESES_VIGENCIA,
        firma: firmar(`${codigo}|${id_usuario}|${fecha}`),
        url_archivo_pdf: "/api/constancia/pdf",
      });
    }

    // QR que apunta a la página pública de verificación
    const urlVerificar = `${process.env.URL_PAGINA_WEB}/verificar/${constancia.codigo}`;
    const imagenQr = await QRCode.toBuffer(urlVerificar, {
      margin: 1,
      width: 180,
    });

    // ── Armar el PDF ──
    const doc = new PDFDocument({ size: "A4", margin: 60 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="pre-constancia-${constancia.codigo}.pdf"`,
    );
    doc.pipe(res);

    doc.fontSize(24).text("AcreditaTech", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(18).text("Pre-Constancia de Preparación", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12).text("Se hace constar que:", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(20).text(trabajador.nombre, { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(
        "completó su preparación en las evaluaciones técnica y de salud ocupacional.",
        { align: "center" },
      );
    doc.moveDown(1.5);

    doc.fontSize(13);
    doc.text(`Oficio: ${trabajador.nombre_oficio}`);
    doc.text(`Alcaldía de trabajo: ${trabajador.nombre_alcaldia}`);
    doc.text(`Fecha de emisión: ${formatearFecha(constancia.fecha_emision)}`);
    doc.text(`Vigente hasta: ${formatearFecha(constancia.fecha_vencimiento)}`);
    doc.text(`Código: ${constancia.codigo}`);
    doc.moveDown(1);

    doc.image(imagenQr, { fit: [130, 130], align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(9)
      .text("Escanea el código QR para verificar este documento.", {
        align: "center",
      });
    doc.moveDown(1);

    doc
      .fontSize(8)
      .fillColor("#555555")
      .text(`Firma digital: ${constancia.firma_digital}`, { align: "center" });
    doc.moveDown(1);
    doc
      .fontSize(9)
      .fillColor("#000000")
      .text(
        "Este documento es informativo, de preparación autónoma. " +
          "No sustituye una certificación oficial de competencias laborales.",
        { align: "center" },
      );

    doc.end();
  } catch (error) {
    console.error("Error al generar la Pre-Constancia:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ mensaje: "Error al generar la Pre-Constancia" });
    }
  }
}

// ── Verificar (página pública) ─────────────────────────────────────────────
// GET /api/constancia/verificar/:codigo  (SIN sesión)
// Solo regresa: nombre, foto, oficio, alcaldía, estado y vigencia.
async function verificar(req, res) {
  try {
    const constancia = await modelo.buscarPorCodigo(req.params.codigo);

    if (!constancia) {
      return res
        .status(404)
        .json({ mensaje: "No se encontró una Pre-Constancia con ese código" });
    }

    const vigente = estaVigente(constancia.fecha_vencimiento);

    res.json({
      nombre: constancia.nombre,
      foto_url: constancia.foto_url,
      oficio: constancia.nombre_oficio,
      alcaldia: constancia.nombre_alcaldia,
      estado: vigente ? "Vigente" : "Vencida",
      emitida: constancia.fecha_emision,
      vigente_hasta: constancia.fecha_vencimiento,
    });
  } catch (error) {
    console.error("Error al verificar la Pre-Constancia:", error.message);
    res.status(500).json({ mensaje: "Error al verificar la Pre-Constancia" });
  }
}

module.exports = { descargarPdf, verificar };
