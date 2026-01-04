import { Request, Response } from 'express';
import { MTAService } from '../services/mta.service';

/**
 * Get all subway alerts
 * GET /api/transit/alerts
 */
export const getAllAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await MTAService.getSubwayAlerts();
    res.json({
      message: 'All subway alerts',
      timestamp: new Date().toISOString(),
      alertCount: alerts.entity.length,
      alerts: alerts.entity
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch alerts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get active real-time transit alerts
 * GET /api/transit/realtime
 */
export const getRealTimeData = async (req: Request, res: Response) => {
  try {
    const alerts = await MTAService.getActiveAlerts();
    res.json({
      message: 'Active real-time transit alerts',
      timestamp: new Date().toISOString(),
      alertCount: alerts.entity.length,
      alerts: alerts.entity
    });
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch real-time data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get transit alerts for a specific line
 * GET /api/transit/line/:lineId
 */
export const getLineData = async (req: Request, res: Response) => {
  try {
    const { lineId } = req.params;
    
    const alerts = await MTAService.getAlertsByLine(lineId);
    res.json({
      message: `Alerts for line ${lineId}`,
      lineId: lineId.toUpperCase(),
      alertCount: alerts.entity.length,
      alerts: alerts.entity
    });
  } catch (error) {
    console.error('Error fetching line data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch line data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get transit data for a specific station
 * GET /api/transit/station/:stationId
 */
export const getStationData = async (req: Request, res: Response) => {
  try {
    const { stationId } = req.params;
    
    // TODO: Fetch data for specific station from MTA API
    res.json({
      message: `Data for station ${stationId}`,
      stationId,
      data: []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch station data' });
  }
};

/**
 * Get all available transit lines
 * GET /api/transit/lines
 */
export const getAllLines = async (req: Request, res: Response) => {
  try {
    // TODO: Fetch list of all lines from MTA API
    res.json({
      message: 'All available lines',
      lines: []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lines' });
  }
};

/**
 * Get all available stations
 * GET /api/transit/stations
 */
export const getAllStations = async (req: Request, res: Response) => {
  try {
    // TODO: Fetch list of all stations from MTA API
    res.json({
      message: 'All available stations',
      stations: []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
};

