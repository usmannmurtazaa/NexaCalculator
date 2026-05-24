import { getStanding } from '../constants/grades';
import { trackExport } from '../firebase/exportTracker';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

function buildPDF(doc, data) {
  const { studentName, studentId, university, semester, date, scale, courses, gpaResult } = data;

  // Ensure courses is an array
  const safeCourses = Array.isArray(courses) ? courses : [];

  // Header
  doc.setFillColor(124, 58, 237);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('NEXA CALCULATOR', 105, 25, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(199, 181, 253);
  doc.text('Academic Excellence Suite', 105, 35, { align: 'center' });

  let yPos = 55;

  // Section title
  doc.setDrawColor(124, 58, 237);
  doc.line(15, yPos - 5, 195, yPos - 5);
  doc.setFontSize(16);
  doc.setTextColor(124, 58, 237);
  doc.text('ACADEMIC RECORD', 105, yPos, { align: 'center' });
  yPos += 12;

  // Student Information
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: ${studentName}`, 25, yPos);
  yPos += 6;
  if (studentId) {
    doc.text(`Student ID: ${studentId}`, 25, yPos);
    yPos += 6;
  }
  if (university) {
    doc.text(`Institution: ${university}`, 25, yPos);
    yPos += 6;
  }
  if (semester) {
    doc.text(`Semester: ${semester}`, 25, yPos);
    yPos += 6;
  }
  doc.text(`Generated: ${date}`, 25, yPos);
  yPos += 12;

  // Course Table
  doc.line(20, yPos, 190, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(124, 58, 237);
  doc.text('Course Details', 20, yPos);
  yPos += 8;

  doc.setFillColor(124, 58, 237);
  doc.rect(20, yPos, 170, 8, 'F');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Course Code', 25, yPos + 5.5);
  doc.text('Credits', 85, yPos + 5.5);
  doc.text('Grade', 115, yPos + 5.5);
  doc.text('Points', 155, yPos + 5.5);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  safeCourses.forEach((course, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 250);
      doc.rect(20, yPos - 4, 170, 7, 'F');
    }
    doc.text(String(course.code || '—'), 25, yPos);
    doc.text(String(course.credits || 0), 85, yPos);
    doc.text(String(course.grade || '—'), 115, yPos);
    doc.text(String(course.points || '0'), 155, yPos);
    yPos += 7;
  });

  // Academic Summary
  yPos += 10;
  doc.setDrawColor(124, 58, 237);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(124, 58, 237);
  doc.text('Academic Summary', 20, yPos);
  yPos += 10;

  doc.setFillColor(249, 248, 255);
  doc.rect(20, yPos - 4, 170, 30, 'F');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.text('GPA', 40, yPos + 3);
  doc.setFontSize(18);
  doc.setTextColor(124, 58, 237);
  doc.text(String(gpaResult?.gpa || '—'), 40, yPos + 15);
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`out of ${scale}`, 40, yPos + 22);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Credits', 105, yPos + 3);
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(String(gpaResult?.credits || 0), 105, yPos + 15);
  doc.setFont('helvetica', 'bold');
  doc.text('Quality Points', 150, yPos + 3);
  doc.setFontSize(14);
  doc.text((gpaResult?.points || 0).toFixed(2), 150, yPos + 15);
  yPos += 40;

  // Standing
  const standing = getStanding(parseFloat(gpaResult?.gpa || 0), scale);
  const [r, g, b] = hexToRgb(standing.color);
  doc.setFillColor(r, g, b);
  doc.rect(20, yPos - 4, 170, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(`Academic Standing: ${standing.t}`, 105, yPos + 3, { align: 'center' });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(124, 58, 237);
    doc.text('Crafted by Usman Murtaza • Nexa Calculator', 105, 290, { align: 'center' });
    doc.text('nexacalculator.netlify.app', 105, 295, { align: 'center' });
  }

  doc.save(`Nexa_Academic_Record_${studentName.replace(/\s+/g, '_')}.pdf`);
}

export async function generatePDF(data) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  buildPDF(doc, data);

  trackExport({
    studentName: data.studentName,
    studentId: data.studentId,
    university: data.university,
    semester: data.semester,
    scale: data.scale,
    gpa: data.gpaResult?.gpa,
    credits: data.gpaResult?.credits,
    date: data.date,
    exportType: 'pdf',
    timestamp: new Date().toISOString(),
    deviceInfo: getDeviceInfo(),
  });
}

function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
}