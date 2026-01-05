import { Router } from 'express';
import * as transitController from '../controllers/transit.controller';

const router = Router();

// Get real-time transit data (active alerts)
router.get('/realtime', transitController.getRealTimeData);

// Get all subway alerts
router.get('/alerts', transitController.getAllAlerts);

// Get next train times for a line (e.g., /api/transit/line/A/next?station=Bedford Av)
// MUST come before /line/:lineId to match correctly
router.get('/line/:lineId/next', transitController.getNextTrains);

// Get stations for a line (e.g., /api/transit/line/L/stations)
router.get('/line/:lineId/stations', transitController.getLineStations);

// Get transit data by line (e.g., /api/transit/line/A)
router.get('/line/:lineId', transitController.getLineData);

// Get transit data by station
router.get('/station/:stationId', transitController.getStationData);

// Get all available lines
router.get('/lines', transitController.getAllLines);

// Get all available stations
router.get('/stations', transitController.getAllStations);

export default router;

