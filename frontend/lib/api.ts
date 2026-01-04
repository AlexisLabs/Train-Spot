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

