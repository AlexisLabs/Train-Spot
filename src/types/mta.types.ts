/**
 * TypeScript types for MTA API responses
 */

export interface MTAAlert {
  id: string;
  alert: {
    active_period?: Array<{
      start?: number;
      end?: number;
    }>;
    informed_entity?: Array<{
      agency_id?: string;
      route_id?: string;
      stop_id?: string;
    }>;
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
    transit_realtime?: {
      mercury_alert?: {
        created_at?: number;
        updated_at?: number;
        alert_type?: string;
        display_before_active?: number;
        human_readable_active_period?: {
          translation: Array<{
            text: string;
            language: string;
          }>;
        };
      };
    };
  };
}

export interface MTAAlertsResponse {
  header: {
    gtfs_realtime_version: string;
    incrementality: string;
    timestamp: number;
  };
  entity: MTAAlert[];
}

