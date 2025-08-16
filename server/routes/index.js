const express = require('express');
const markersRoutes = require('./markersRoutes');
const moderationRoutes = require('./moderationRoutes');

const router = express.Router();

// Все маршруты для /api/markers
router.use('/markers', markersRoutes);
router.use('/markers', moderationRoutes);

module.exports = router;