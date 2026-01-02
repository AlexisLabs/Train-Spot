import { Router } from 'express';
import * as transitController from '../controllers/transit.controller';

const router = Router();

// Get real-time transit data
router.get('/realtime', transitController.getRealTimeData);

// Get transit data by line (e.g., /api/transit/line/A)
router.get('/line/:lineId', transitController.getLineData);

// Get transit data by station
router.get('/station/:stationId', transitController.getStationData);

// Get all available lines
router.get('/lines', transitController.getAllLines);

// Get all available stations
router.get('/stations', transitController.getAllStations);

export default router;

