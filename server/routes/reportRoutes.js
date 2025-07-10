const express = require('express');
const router = express.Router();
const { generateReport,getAllReports, viewReport }  = require('../controllers/reportController');

router.post('/generate-report', generateReport);
router.get('/reports', getAllReports); // ✅ Show list
router.get('/reports/view/:filename', viewReport);

module.exports = router;
