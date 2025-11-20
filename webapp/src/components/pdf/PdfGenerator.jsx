import React from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { saveAs } from "file-saver";

// Composant principal
export default function PdfGenerator({ trip, driver, vehicle, signatureBase64, logoBase64 }) {

  // Générer le PDF
  const generatePdf = async () => {

    // 1. Charger template
    const templateBytes = await fetch("/templates/duty-daily-form.pdf")
      .then(r => r.arrayBuffer());

    const pdfDoc = await PDFDocument.load(templateBytes);

    // 2. Première page
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // ----------- A. LOGO -----------
    if (logoBase64) {
      const logoImg = await pdfDoc.embedPng(logoBase64);
      page.drawImage(logoImg, {
        x: 40,
        y: 760,
        width: 120,
        height: 60
      });
    }

    // ----------- B. INFORMATIONS -----------
    page.drawText(`Driver: ${driver.name}`, { x: 40, y: 700, size: 12, font });
    page.drawText(`License: ${driver.license}`, { x: 40, y: 680, size: 12, font });

    page.drawText(`Vehicle: ${vehicle.number}`, { x: 300, y: 700, size: 12, font });
    page.drawText(`VIN: ${vehicle.vin}`, { x: 300, y: 680, size: 12, font });

    page.drawText(`Trip ID: ${trip.id}`, { x: 40, y: 660, size: 12, font });
    page.drawText(`Date: ${trip.date}`, { x: 40, y: 640, size: 12, font });

    // ----------- C. DESSIN AUTOMATIQUE DU SHELL HOS -----------
    const yLevels = {
      off: 480,
      sleep: 440,
      drive: 400,
      on: 360
    };

    trip.hos.forEach(segment => {
      const y = yLevels[segment.status];
      const startX = 40 + segment.startHour * 25;  // 24h grid
      const endX = 40 + segment.endHour * 25;

      page.drawLine({
        start: { x: startX, y },
        end: { x: endX, y },
        thickness: 2,
        color: rgb(0, 0, 0)
      });
    });

    // ----------- D. SIGNATURE -----------
    if (signatureBase64) {
      const signatureImg = await pdfDoc.embedPng(signatureBase64);
      page.drawImage(signatureImg, {
        x: 40,
        y: 220,
        width: 180,
        height: 70
      });

      page.drawText("Driver Signature", {
        x: 40,
        y: 200,
        size: 10,
        font,
        color: rgb(0.2, 0.2, 0.2)
      });
    }

    // ----------- E. QR CODE -----------
    const qrData = `trip_id=${trip.id}&driver=${driver.name}&vehicle=${vehicle.number}`;
    const qrBase64 = await QRCode.toDataURL(qrData);

    const qrImage = await pdfDoc.embedPng(qrBase64);

    page.drawImage(qrImage, {
      x: 450,
      y: 230,
      width: 100,
      height: 100
    });

    page.drawText("Scan for details", { x: 450, y: 210, size: 10, font });

    // ----------- F. TÉLÉCHARGEMENT -----------
    const pdfBytes = await pdfDoc.save();

    saveAs(
      new Blob([pdfBytes], { type: "application/pdf" }),
      `logbook_${trip.id}.pdf`
    );
  };

  return (
    <button
      onClick={generatePdf}
      style={{
        padding: "12px 18px",
        background: "#0051ff",
        color: "white",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer"
      }}
    >
      Generate Logbook PDF
    </button>
  );
}
