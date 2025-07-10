// controllers/reportController.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Report = require('../models/Report');

const generateReport = async (req, res) => {
  try {
    const { data } = req.body;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `report-${timestamp}.pdf`;
    const filepath = path.join(__dirname, `../reports/${filename}`);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filepath));

    doc.fontSize(20).text('📊 CryptoPulse Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated at: ${new Date().toLocaleString()}`);
    doc.moveDown();

    data.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name}`);
      doc.text(`   Price: $${item.price}`);
      doc.text(`   Change: ${item.change}%`);
      doc.text(`   Volume: $${item.volume}`);
      doc.moveDown();
    });

    doc.end();

    // ✅ Save in MongoDB
    const reportEntry = new Report({ data, filename });
    await reportEntry.save();

    res.json({ filename });
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};


const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }); // Latest first
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

const viewReport = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, `../reports/${filename}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
};


module.exports = {generateReport,getAllReports, viewReport};