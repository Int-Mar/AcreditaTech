// constancia_pdf.js
// Diseño visual de la Pre-Constancia (hoja A4 horizontal).
// Colores tomados del maquetado: azul #1b4b73 y naranja #f7931e.

const path = require("path");

const LOGO_BLANCO = path.join(__dirname, "..", "recursos", "logo-blanco.png");
const LOGO_AZUL = path.join(__dirname, "..", "recursos", "logo-azul.png");

const AZUL = "#1b4b73";
const AZUL_OSC = "#1a364a";
const AZUL_CLA = "#cfe0ee";
const NARANJA = "#f7931e";
const GRIS = "#5d6163";
const GRIS_CLA = "#cccccc";

// Dibuja una columna de dato: etiqueta pequeña arriba y valor abajo
function dibujarDato(doc, etiqueta, valor, x, y, ancho) {
  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(GRIS)
    .text(etiqueta.toUpperCase(), x, y, {
      width: ancho,
      align: "center",
      lineBreak: false,
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(AZUL_OSC)
    .text(valor, x, y + 15, {
      width: ancho,
      align: "center",
      lineBreak: false,
    });
}

// datos: { trabajador, constancia, imagenQr, urlVerificar, emision, vencimiento }
function dibujarConstancia(doc, datos) {
  const {
    trabajador,
    constancia,
    imagenQr,
    urlVerificar,
    emision,
    vencimiento,
  } = datos;
  const W = doc.page.width; // 841.89
  const H = doc.page.height; // 595.28

  // Marca de agua con el logo (muy tenue, al centro)
  doc.save();
  doc.opacity(0.05).image(LOGO_AZUL, (W - 330) / 2, 185, { width: 330 });
  doc.restore();

  // Marco doble
  doc
    .lineWidth(1.5)
    .strokeColor(AZUL)
    .rect(20, 20, W - 40, H - 40)
    .stroke();
  doc
    .lineWidth(0.5)
    .strokeColor("#699cc3")
    .rect(26, 26, W - 52, H - 52)
    .stroke();

  // Banda superior con logo y nombre de la app
  doc.rect(20, 20, W - 40, 100).fill(AZUL);
  doc.image(LOGO_BLANCO, 48, 36, { fit: [90, 70] });
  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor("#ffffff")
    .text("AcreditaTech", 150, 44, { lineBreak: false });
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(AZUL_CLA)
    .text(
      "Preparación para trabajadores de oficio · Ciudad de México",
      150,
      82,
      { lineBreak: false },
    );

  // Folio a la derecha de la banda
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(AZUL_CLA)
    .text("FOLIO", W - 280, 44, {
      width: 232,
      align: "right",
      lineBreak: false,
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(17)
    .fillColor("#ffffff")
    .text(constancia.codigo, W - 280, 58, {
      width: 232,
      align: "right",
      lineBreak: false,
    });

  // Línea naranja de acento
  doc.rect(20, 120, W - 40, 4).fill(NARANJA);

  // Título
  doc
    .font("Helvetica-Bold")
    .fontSize(26)
    .fillColor(AZUL_OSC)
    .text("Pre-Constancia de Preparación", 0, 146, {
      width: W,
      align: "center",
      lineBreak: false,
    });

  doc
    .font("Helvetica")
    .fontSize(12)
    .fillColor(GRIS)
    .text("Se hace constar que", 0, 190, {
      width: W,
      align: "center",
      lineBreak: false,
    });

  // Nombre (se reduce la letra si es muy largo)
  let tamano = 32;
  doc.font("Helvetica-Bold");
  while (
    tamano > 16 &&
    doc.fontSize(tamano).widthOfString(trabajador.nombre) > W - 160
  ) {
    tamano -= 1;
  }
  doc
    .fontSize(tamano)
    .fillColor(AZUL)
    .text(trabajador.nombre, 0, 212, {
      width: W,
      align: "center",
      lineBreak: false,
    });

  doc
    .lineWidth(0.8)
    .strokeColor(GRIS_CLA)
    .moveTo(200, 258)
    .lineTo(W - 200, 258)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(12)
    .fillColor(GRIS)
    .text(
      "completó su preparación autónoma en las evaluaciones técnica y de salud ocupacional.",
      0,
      270,
      { width: W, align: "center", lineBreak: false },
    );

  // Cuatro datos en columnas
  const margen = 60;
  const ancho = (W - margen * 2) / 4;
  dibujarDato(doc, "Oficio", trabajador.nombre_oficio, margen, 322, ancho);
  dibujarDato(
    doc,
    "Alcaldía de trabajo",
    trabajador.nombre_alcaldia,
    margen + ancho,
    322,
    ancho,
  );
  dibujarDato(doc, "Fecha de emisión", emision, margen + ancho * 2, 322, ancho);
  dibujarDato(
    doc,
    "Vigente hasta",
    vencimiento,
    margen + ancho * 3,
    322,
    ancho,
  );

  // Línea separadora
  doc
    .lineWidth(0.5)
    .strokeColor(GRIS_CLA)
    .moveTo(margen, 375)
    .lineTo(W - margen, 375)
    .stroke();

  // Zona inferior: QR a la izquierda y firma a la derecha
  doc.image(imagenQr, margen, 392, { fit: [105, 105] });

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(AZUL_OSC)
    .text("Verifica este documento", margen + 120, 398, { lineBreak: false });
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(GRIS)
    .text("Escanea el código QR o abre:", margen + 120, 415, {
      lineBreak: false,
    });
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(AZUL)
    .text(urlVerificar, margen + 120, 430, { width: 290 });

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(AZUL_OSC)
    .text("Firma digital (HMAC-SHA256)", 470, 398, {
      width: 312,
      lineBreak: false,
    });
  doc
    .font("Courier")
    .fontSize(7.5)
    .fillColor(GRIS)
    .text(constancia.firma_digital, 470, 413, { width: 312 });

  // Aviso legal
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(GRIS)
    .text(
      "Documento informativo de preparación autónoma. No sustituye una certificación oficial de competencias laborales.",
      0,
      536,
      { width: W, align: "center", lineBreak: false },
    );
}

module.exports = { dibujarConstancia };
