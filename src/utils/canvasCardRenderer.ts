import { Participant } from '../types/participant.ts';
import { COLLEGE_INFO, SYMPOSIUM_INFO } from '../constants/symposiumData.ts';
import { COLLEGE_LOGO_DATA_URL } from '../components/CollegeLogo.tsx';

/**
 * Loads an image from a data URL or image source.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image into canvas'));
    img.src = src;
  });
}

/**
 * Draws rounded rectangle path
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Pure 2D HTML5 Canvas ID Card generator.
 * HORIZONTAL / LANDSCAPE FORMAT for TechSym SaRaYu-26.
 * Includes the official Sengunthar Engineering College logo and strict 2-column details alignment.
 */
export async function renderIdCardToPng(participant: Participant): Promise<string> {
  // Landscape Card Dimensions (1050 x 650)
  const width = 1050;
  const height = 650;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // High-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Card Background
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, 0, 0, width, height, 24);
  ctx.fill();

  // Outer border
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  roundRect(ctx, 2, 2, width - 4, height - 4, 24);
  ctx.stroke();

  // 2. Header Banner (Horizontal format)
  const headerGrad = ctx.createLinearGradient(0, 0, width, 175);
  headerGrad.addColorStop(0, '#0a0f1d');
  headerGrad.addColorStop(0.5, '#0f172a');
  headerGrad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = headerGrad;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(0, 0, width, 170, [24, 24, 0, 0]) : ctx.rect(0, 0, width, 170);
  ctx.fill();

  // Gold accent bottom line for header
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 166, width, 4);

  // Draw Official College Logo in Header
  const logoX = 45;
  const logoY = 28;
  const logoSize = 72;

  try {
    const logoImg = await loadImage(COLLEGE_LOGO_DATA_URL);
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
  } catch (_) {
    // Fallback emblem box if data URL load is delayed
    ctx.fillStyle = '#78350f';
    roundRect(ctx, logoX, logoY, logoSize, logoSize, 14);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 24px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('SEC', logoX + logoSize / 2, logoY + 45);
  }

  // College Name & Accreditation Details (Positioned on the right of the logo)
  const textStartX = logoX + logoSize + 20;

  // Line 1: College Name
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(COLLEGE_INFO.name.toUpperCase(), textStartX, 54);

  // Line 2: Technical Symposium • Autonomous
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('TECHNICAL SYMPOSIUM • AUTONOMOUS', textStartX, 78);

  // Line 3: AICTE, Anna University, NAAC Grade
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  ctx.fillText('Approved by AICTE • Affiliated to Anna University • NAAC "A" Grade', textStartX, 98);

  // Gold separator line inside header
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(45, 116);
  ctx.lineTo(width - 45, 116);
  ctx.stroke();

  // Symposium Name on left
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(SYMPOSIUM_INFO.name, 45, 148);

  // Dates pill badge on right
  const pillW = 210;
  const pillH = 32;
  const pillX = width - 45 - pillW;
  const pillY = 126;
  ctx.fillStyle = '#fbbf24';
  roundRect(ctx, pillX, pillY, pillW, pillH, 8);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 14px monospace, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('30 SEP & 01 OCT 2026', pillX + pillW / 2, pillY + 21);

  // 3. Left Column: Student Photo
  const photoW = 220;
  const photoH = 280;
  const photoX = 45;
  const photoY = 210;

  ctx.save();
  roundRect(ctx, photoX, photoY, photoW, photoH, 16);
  ctx.fillStyle = '#f1f5f9';
  ctx.fill();
  ctx.strokeStyle = '#4338ca';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.clip();

  if (participant.photo) {
    try {
      const studentImg = await loadImage(participant.photo);
      ctx.drawImage(studentImg, photoX, photoY, photoW, photoH);
    } catch (_) {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(photoX, photoY, photoW, photoH);
    }
  }
  ctx.restore();

  // 4. Right Column: Student Details with Strict Two-Column Alignment
  const detailX = 300;
  const detailW = width - detailX - 45;

  // Student Name
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('STUDENT NAME', detailX, 222);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 30px system-ui, -apple-system, sans-serif';
  let displayName = participant.name.toUpperCase();
  if (displayName.length > 30) displayName = displayName.substring(0, 28) + '...';
  ctx.fillText(displayName, detailX, 258);

  // Divider under name
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(detailX, 275);
  ctx.lineTo(detailX + detailW, 275);
  ctx.stroke();

  // Strict Two-Column Layout for Details Rows
  // All labels start at labelX; all values start at valueX!
  const labelX = detailX;
  const valueX = detailX + 185;

  const rows = [
    { label: 'BRANCH / DEPT:', value: participant.department },
    { label: 'YEAR OF STUDY:', value: participant.year },
    { label: 'COLLEGE NAME:', value: participant.college },
    { label: 'PLACE:', value: participant.place || 'Tiruchengode, Namakkal' },
  ];

  const rowStartY = 312;
  const rowSpacing = 52;

  rows.forEach((r, idx) => {
    const currentY = rowStartY + idx * rowSpacing;

    // Label: starts at exact labelX
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(r.label, labelX, currentY);

    // Value: starts at exact valueX
    ctx.fillStyle = idx === 0 ? '#1e1b4b' : '#0f172a';
    ctx.font = idx === 0
      ? '900 17.5px system-ui, -apple-system, sans-serif'
      : 'bold 17px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';

    let val = r.value;
    if (val.length > 46) val = val.substring(0, 44) + '...';
    ctx.fillText(val, valueX, currentY);

    // Divider line between items (properly aligned with equal width)
    if (idx < rows.length - 1) {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(detailX, currentY + 18);
      ctx.lineTo(detailX + detailW, currentY + 18);
      ctx.stroke();
    }
  });

  // 5. Bottom Footer Bar
  const footerH = 46;
  const footerY = height - footerH;

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect
    ? ctx.roundRect(0, footerY, width, footerH, [0, 0, 24, 24])
    : ctx.rect(0, footerY, width, footerH);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, footerY, width, 2);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Sengunthar Engineering College (Autonomous) • Tiruchengode, Tamil Nadu', 45, footerY + 28);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 13px monospace, system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(COLLEGE_INFO.website, width - 45, footerY + 28);

  return canvas.toDataURL('image/png', 1.0);
}
