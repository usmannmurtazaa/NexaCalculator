import { getStanding } from './grades'; // corrected path

// ── Colour helpers ────────────────────────────────────────────────
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b];
}

// ── Main builder ──────────────────────────────────────────────────
async function buildPDF(doc, data) {
  const {
    studentName = 'Student',
    studentId = '',
    university = '',
    semester = '',
    date = new Date().toLocaleDateString(),
    scale = '4.0',
    courses = [],
    gpaResult = {},
  } = data;

  const primary = [124, 58, 237];    // Nexa purple
  const primaryLight = [167, 139, 250];
  const darkText = [40, 40, 40];
  const mutedText = [100, 100, 100];
  const bgLight = [249, 248, 255];
  const white = [255, 255, 255];
  const border = [200, 200, 220];

  let yPos = 30;

  // ── Helper: add page with header if overflow ────────────────
  const checkPageBreak = (neededSpace = 10) => {
    if (yPos + neededSpace > 275) {
      doc.addPage();
      addHeader(doc, data, yPos = 30);
    }
  };

  const addHeader = (docInstance, d, startY) => {
    // Top banner
    docInstance.setFillColor(...primary);
    docInstance.rect(0, 0, 210, 35, 'F');
    docInstance.setFont('helvetica', 'bold');
    docInstance.setTextColor(...white);
    docInstance.setFontSize(22);
    docInstance.text('NEXA CALCULATOR', 105, 22, { align: 'center' });
    docInstance.setFontSize(10);
    docInstance.setTextColor(...primaryLight);
    docInstance.text('Academic Excellence Suite', 105, 30, { align: 'center' });
  };

  // Initial header
  addHeader(doc, data, yPos);

  // Document title
  checkPageBreak(25);
  yPos += 20;
  doc.setDrawColor(...primary);
  doc.setLineWidth(0.5);
  doc.line(15, yPos - 10, 195, yPos - 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primary);
  doc.text('ACADEMIC RECORD', 105, yPos, { align: 'center' });
  yPos += 15;

  // ── Student Information ──────────────────────────────────────
  checkPageBreak(60);
  doc.setFontSize(11);
  doc.setTextColor(...primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 20, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  doc.text(`Name: ${studentName}`, 25, yPos);
  yPos += 7;
  if (studentId) { doc.text(`Student ID: ${studentId}`, 25, yPos); yPos += 7; }
  if (university) { doc.text(`Institution: ${university}`, 25, yPos); yPos += 7; }
  if (semester) { doc.text(`Semester: ${semester}`, 25, yPos); yPos += 7; }
  doc.text(`Generated: ${date}`, 25, yPos);
  yPos += 12;

  // ── Course table ─────────────────────────────────────────────
  checkPageBreak(30);
  doc.setDrawColor(...border);
  doc.line(20, yPos, 190, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primary);
  doc.text('Course Details', 20, yPos);
  yPos += 8;

  // Table header
  checkPageBreak(10);
  doc.setFillColor(...primary);
  doc.rect(20, yPos, 170, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(...white);
  doc.text('Course Code', 25, yPos + 5.5);
  doc.text('Credits', 80, yPos + 5.5);
  doc.text('Grade', 115, yPos + 5.5);
  doc.text('Points', 155, yPos + 5.5);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  const safeCourses = Array.isArray(courses) ? courses : [];
  safeCourses.forEach((course, index) => {
    checkPageBreak(7);
    if (yPos > 250) {
      doc.addPage();
      addHeader(doc, data, yPos = 30);
      // Re-draw header row
      doc.setFillColor(...primary);
      doc.rect(20, yPos, 170, 8, 'F');
      doc.setFontSize(9);
      doc.setTextColor(...white);
      doc.text('Course Code', 25, yPos + 5.5);
      doc.text('Credits', 80, yPos + 5.5);
      doc.text('Grade', 115, yPos + 5.5);
      doc.text('Points', 155, yPos + 5.5);
      yPos += 10;
    }
    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(...bgLight);
      doc.rect(20, yPos - 4, 170, 7, 'F');
    }
    doc.setFontSize(10);
    doc.text(String(course.code || '—'), 25, yPos);
    doc.text(String(course.credits ?? 0), 80, yPos);
    doc.text(String(course.grade || '—'), 115, yPos);
    doc.text(String(course.points ?? '0'), 155, yPos);
    yPos += 7;
  });

  // ── Academic Summary ─────────────────────────────────────────
  checkPageBreak(30);
  yPos += 10;
  doc.setDrawColor(...border);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primary);
  doc.text('Academic Summary', 20, yPos);
  yPos += 10;

  // GPA box
  checkPageBreak(40);
  doc.setFillColor(...bgLight);
  doc.roundedRect(20, yPos - 4, 55, 28, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...mutedText);
  doc.text('GPA', 35, yPos + 2);
  doc.setFontSize(18);
  doc.setTextColor(...primary);
  doc.text(String(gpaResult?.gpa || '—'), 35, yPos + 14);
  doc.setFontSize(9);
  doc.setTextColor(...mutedText);
  doc.text(`out of ${scale}`, 35, yPos + 22);

  // Credits box
  doc.setFillColor(...bgLight);
  doc.roundedRect(80, yPos - 4, 55, 28, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...mutedText);
  doc.text('Total Credits', 95, yPos + 2);
  doc.setFontSize(14);
  doc.setTextColor(...darkText);
  doc.text(String(gpaResult?.credits ?? 0), 95, yPos + 14);

  // Quality Points box
  doc.setFillColor(...bgLight);
  doc.roundedRect(140, yPos - 4, 50, 28, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...mutedText);
  doc.text('Quality Pts', 155, yPos + 2);
  doc.setFontSize(14);
  doc.setTextColor(...darkText);
  const points = gpaResult?.points != null ? parseFloat(gpaResult.points).toFixed(2) : '0.00';
  doc.text(points, 155, yPos + 14);
  yPos += 35;

  // Standing
  const gpaNumeric = parseFloat(gpaResult?.gpa || '0');
  const standing = getStanding(gpaNumeric, scale);
  const [sr, sg, sb] = hexToRgb(standing.color);
  doc.setFillColor(sr, sg, sb);
  doc.roundedRect(20, yPos - 4, 170, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...white);
  doc.text(`Academic Standing: ${standing.t}`, 105, yPos + 3, { align: 'center' });
  yPos += 20;

  // ── Footer ──────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(...primary);
    doc.text('Crafted by Usman Murtaza • Nexa Calculator', 105, 291, { align: 'center' });
    doc.text('nexacalculator.netlify.app', 105, 296, { align: 'center' });
  }

  // Save
  const sanitizedName = (studentName || 'Student').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  doc.save(`Nexa_Academic_Record_${sanitizedName}.pdf`);
}

// ── Public API ─────────────────────────────────────────────────
export async function generatePDF(data) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    await buildPDF(doc, data);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Could not generate PDF. Please try again.');
  }
}