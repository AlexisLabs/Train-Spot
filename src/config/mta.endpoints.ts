/**
 * MTA Subway Feed Endpoints
 * Each endpoint provides real-time data for specific subway lines
 */

export const MTA_FEED_ENDPOINTS = {
  // B, D, F, M lines
  BDFM: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm',
  
  // A, C, E lines
  ACE: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace',
  
  // G line
  G: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g',
  
  // J, Z lines
  JZ: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz',
  
  // N, Q, R, W lines
  NQRW: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw',
  
  // L line
  L: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l',
  
  // Other lines (1, 2, 3, 4, 5, 6, 7, S)
  DEFAULT: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs',
  
  // Staten Island Railway (SIR)
  SI: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si',
  
  // Subway Alerts (JSON format - no API key required!)
  ALERTS: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json',
} as const;

/**
 * Map individual line letters to their feed endpoint key
 */
export const LINE_TO_FEED_MAP: Record<string, keyof typeof MTA_FEED_ENDPOINTS> = {
  'B': 'BDFM',
  'D': 'BDFM',
  'F': 'BDFM',
  'M': 'BDFM',
  'A': 'ACE',
  'C': 'ACE',
  'E': 'ACE',
  'G': 'G',
  'J': 'JZ',
  'Z': 'JZ',
  'N': 'NQRW',
  'Q': 'NQRW',
  'R': 'NQRW',
  'W': 'NQRW',
  'L': 'L',
  '1': 'DEFAULT',
  '2': 'DEFAULT',
  '3': 'DEFAULT',
  '4': 'DEFAULT',
  '5': 'DEFAULT',
  '6': 'DEFAULT',
  '7': 'DEFAULT',
  'S': 'DEFAULT',
  'SI': 'SI',
};

