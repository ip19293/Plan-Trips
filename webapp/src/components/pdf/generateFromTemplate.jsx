import { PDFDocument,StandardFonts,rgb } from "pdf-lib";
import { saveAs } from "file-saver";

async function generateFromTemplate(trip, driver, vehicle) {
  const existingPdfBytes = await fetch("/templates/duty-daily-form.pdf").then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
   const page = pdfDoc.getPages()[0];
   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

   page.drawText(` ${new Date(trip.start_datetime).getMonth()}`, { x: 230, y: 708, size: 12, font, color: rgb(0,0,0) });
      page.drawText(` ${new Date(trip.start_datetime).getDay()}`, { x: 280, y: 708, size: 12, font, color: rgb(0,0,0) });
            page.drawText(` ${new Date(trip.start_datetime).getFullYear()}`, { x: 310, y: 708, size: 12, font, color: rgb(0,0,0) });
  // page.drawText(`Vehicle: ${vehicle.number}`, { x: 50, y: 700, size: 12, font, color: rgb(0,0,0) });
  // page.drawText(`Trip Start: ${vehicle.number}`, { x: 50, y: 680, size: 12, font, color: rgb(0,0,0) });

  // const yLevels = { off: 620, sleep: 580, drive: 540, on: 500 };
  // const statusColors = { off: rgb(0,0,0), sleep: rgb(0,0,1), drive: rgb(1,0,0), on: rgb(0,1,0) };

  // trip.hos.forEach(segment => {
  //   page.drawLine({
  //     start: { x: segment.startX * 40, y: yLevels[segment.status] },
  //     end: { x: segment.endX * 40, y: yLevels[segment.status] },
  //     thickness: 2,
  //     color: statusColors[segment.status]
  //   });
  // });

  const pdfBytes = await pdfDoc.save();
  saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "logbook.pdf");
}

export default generateFromTemplate;
