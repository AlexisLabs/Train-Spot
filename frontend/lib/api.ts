/**
 * API utility functions to interact with the MTA API backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Alert {
  id: string;
  alert: {
    header_text?: {
      translation: Array<{
        text: string;
        language: string;
      }>;
    };
    description_text?: {
      translation: Array<{
        text: string;
        language: string;
      }>;
    };
    informed_entity?: Array<{
      route_id?: string;
      stop_id?: string;
    }>;
    transit_realtime?: {
      mercury_alert?: {
        alert_type?: string;
        updated_at?: number;
      };
    };
  };
}

export interface AlertsResponse {
  message: string;
  timestamp: string;
  alertCount: number;
  alerts: Alert[];
}

/**
 * Fetch all subway alerts
 */
export async function getAllAlerts(): Promise<AlertsResponse> {
  const response = await fetch(`${API_URL}/api/transit/alerts`, {
    cache: 'no-store', // Always fetch fresh data
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }
  
  return response.json();
}

/**
 * Fetch active alerts only
 */
export async function getActiveAlerts(): Promise<AlertsResponse> {
  const response = await fetch(`${API_URL}/api/transit/realtime`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch active alerts');
  }
  
  return response.json();
}

/**
 * Fetch alerts for a specific line
 */
export async function getAlertsByLine(lineId: string): Promise<AlertsResponse> {
  const response = await fetch(`${API_URL}/api/transit/line/${lineId}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch alerts for line ${lineId}`);
  }
  
  return response.json();
}

/**
 * Fetch next train times for a specific line (mocked fallback)
 * Replace this with a real backend endpoint when available: /api/transit/line/:lineId/next
 */
export interface NextTrain {
  destination: string;
  minutes: number; // minutes until arrival
}

export interface Station {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface StationsResponse {
  message: string;
  lineId: string;
  count: number;
  stations: Station[];
}

export interface NextTrainsResponse {
  message: string;
  timestamp: string;
  lineId: string;
  stationId?: string;
  stationName?: string;
  times: NextTrain[];
}

export async function getNextTrainsByLine(lineId: string, stationIdOrName?: string): Promise<NextTrainsResponse> {
  const url = stationIdOrName 
    ? `${API_URL}/api/transit/line/${lineId}/next?station=${encodeURIComponent(stationIdOrName)}`
    : `${API_URL}/api/transit/line/${lineId}/next`;
  
  const resp = await fetch(url, { cache: 'no-store' });
  
  if (!resp.ok) {
    throw new Error(`Failed to fetch trains for line ${lineId}`);
  }
  
  return resp.json();
}

/**
 * Fetch stations for a specific line
 */
export async function getStationsForLine(lineId: string): Promise<StationsResponse> {
  const response = await fetch(`${API_URL}/api/transit/line/${lineId}/stations`, {
    cache: 'force-cache', // Stations don't change frequently
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stations for line ${lineId}`);
  }
  
  return response.json();
}

