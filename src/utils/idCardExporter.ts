import { jsPDF } from 'jspdf';
import { Participant } from '../types/participant.ts';
import { renderIdCardToPng } from './canvasCardRenderer.ts';

/**
 * Downloads the ID Card as a high-resolution PNG image directly using
 * pure 2D Canvas rendering (zero external network fetch, zero CSS parsing).
 * Produces horizontal / landscape ID card.
 */
export async function downloadIdCardAsImage(
  participant: Participant,
  fileName: string
): Promise<string> {
  const dataUrl = await renderIdCardToPng(participant);

  try {
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 200);
  } catch (err) {
    console.warn('Programmatic download blocked by browser sandbox:', err);
  }

  return dataUrl;
}

/**
 * Downloads the ID Card as a printable PDF in HORIZONTAL / LANDSCAPE orientation.
 */
export async function downloadIdCardAsPdf(
  participant: Participant,
  fileName: string
): Promise<void> {
  const dataUrl = await renderIdCardToPng(participant);

  // Landscape ID card dimensions (140mm x 90mm)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [140, 90],
  });

  // Scale and center landscape image on page
  pdf.addImage(dataUrl, 'PNG', 4, 4, 132, 82);
  pdf.save(`${fileName}.pdf`);
}

/**
 * Triggers standard browser print dialog for the ID card.
 */
export function printIdCard(): void {
  window.print();
}
