import axios from 'axios';
import { MTA_FEED_ENDPOINTS } from '../config/mta.endpoints';
import { MTAAlertsResponse } from '../types/mta.types';

/**
 * Service to fetch data from MTA APIs
 */
export class MTAService {
  /**
   * Fetch subway alerts from MTA API
   * This endpoint returns JSON and doesn't require an API key
   */
  static async getSubwayAlerts(): Promise<MTAAlertsResponse> {
    try {
      const response = await axios.get<MTAAlertsResponse>(
        MTA_FEED_ENDPOINTS.ALERTS,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch MTA alerts: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get alerts filtered by route/line
   */
  static async getAlertsByLine(lineId: string): Promise<MTAAlertsResponse> {
    const allAlerts = await this.getSubwayAlerts();
    
    // Filter alerts that mention this line
    const filteredAlerts = {
      ...allAlerts,
      entity: allAlerts.entity.filter((alert) => {
        return alert.alert.informed_entity?.some(
          (entity) => entity.route_id === lineId.toUpperCase()
        );
      }),
    };
    
    return filteredAlerts;
  }

  /**
   * Get active alerts (currently active)
   */
  static async getActiveAlerts(): Promise<MTAAlertsResponse> {
    const allAlerts = await this.getSubwayAlerts();
    const now = Math.floor(Date.now() / 1000);
    
    const activeAlerts = {
      ...allAlerts,
      entity: allAlerts.entity.filter((alert) => {
        const activePeriods = alert.alert.active_period || [];
        
        // If no active_period, consider it always active
        if (activePeriods.length === 0) {
          return true;
        }
        
        // Check if any active period includes now
        return activePeriods.some((period) => {
          const start = period.start || 0;
          const end = period.end || Infinity;
          return now >= start && now <= end;
        });
      }),
    };
    
    return activeAlerts;
  }
}

