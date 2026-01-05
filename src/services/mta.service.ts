import axios from 'axios';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { MTA_FEED_ENDPOINTS, LINE_TO_FEED_MAP } from '../config/mta.endpoints';
import { getStationsForLine, findStationByName, type Station } from '../config/mta.stations';
import { MTAAlertsResponse, NextTrainsResponse, NextTrain } from '../types/mta.types';

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

  /**
   * Get stations for a specific line
   * @param lineId - The subway line (e.g., 'L', 'A', '1')
   */
  static getStationsForLine(lineId: string): Station[] {
    return getStationsForLine(lineId);
  }

  /**
   * Get next train times for a specific line using GTFS-realtime feed
   * @param lineId - The subway line (e.g., 'L', 'A', '1')
   * @param stationIdOrName - Optional station ID (e.g., 'L08') or name (e.g., 'Bedford Av')
   */
  static async getNextTrainsByLine(lineId: string, stationIdOrName?: string): Promise<NextTrainsResponse> {
    try {
      const upperLineId = lineId.toUpperCase();
      const feedKey = LINE_TO_FEED_MAP[upperLineId];
      
      if (!feedKey) {
        throw new Error(`Unknown line: ${lineId}`);
      }

      // Try to resolve station name to ID if provided
      let stationId: string | undefined;
      let stationName: string | undefined;
      if (stationIdOrName) {
        // Check if it looks like a station ID (alphanumeric, no spaces)
        if (/^[A-Z0-9]+$/i.test(stationIdOrName)) {
          stationId = stationIdOrName.toUpperCase();
        } else {
          // Try to find station by name
          const station = findStationByName(upperLineId, stationIdOrName);
          if (station) {
            stationId = station.id;
            stationName = station.name;
          } else {
            throw new Error(`Station "${stationIdOrName}" not found on line ${upperLineId}`);
          }
        }
      }

      const feedUrl = MTA_FEED_ENDPOINTS[feedKey];
      const apiKey = process.env.MTA_API_KEY;

      // Fetch GTFS-realtime feed (API key is optional now)
      const headers: any = {};
      if (apiKey) {
        headers['x-api-key'] = apiKey;
      }

      const response = await axios.get(feedUrl, {
        headers,
        responseType: 'arraybuffer',
      });

      // Parse Protocol Buffer data
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
        new Uint8Array(response.data)
      );

      // Initialize variables
      const now = Math.floor(Date.now() / 1000); // Current time in Unix timestamp (seconds)
      const trains: NextTrain[] = [];

      console.log(`Processing feed for line: ${upperLineId}${stationId ? `, station: ${stationId}` : ''}`);
      console.log('Current timestamp:', now);
      console.log('Total entities in feed:', feed.entity.length);
      
      // Debug: Log unique station IDs in the feed
      const stationIds = new Set<string>();
      feed.entity.forEach(entity => {
        entity.tripUpdate?.stopTimeUpdate?.forEach(stop => {
          if (stop.stopId) stationIds.add(stop.stopId);
        });
      });
      console.log(`Unique station IDs in feed: ${Array.from(stationIds).sort().join(', ')}`);

      // Process trip updates
      const seenTrips = new Set<string>(); // Track trips we've already processed to avoid duplicates
      
      for (const entity of feed.entity) {
        if (!entity.tripUpdate) continue;
        
        const trip = entity.tripUpdate.trip;
        if (trip?.routeId !== upperLineId) continue;

        // Get stop time updates (arrivals)
        const stopTimeUpdates = entity.tripUpdate.stopTimeUpdate || [];
        
        // If filtering by station, find only that station's stop
        // If not filtering, get the next upcoming stop for this trip
        let relevantStop = null;
        
        if (stationId) {
          // Find the specific station in this trip
          relevantStop = stopTimeUpdates.find(stop => 
            stop.stopId && stop.stopId.includes(stationId)
          );
        } else {
          // Get the next upcoming stop (first future stop in the trip)
          for (const stop of stopTimeUpdates) {
            const timeUpdate = stop.departure || stop.arrival;
            if (!timeUpdate?.time) continue;
            
            // Parse arrival time
            let arrivalTime: number;
            if (typeof timeUpdate.time === 'number') {
              arrivalTime = timeUpdate.time;
            } else if (typeof timeUpdate.time === 'object' && timeUpdate.time !== null) {
              const longObj = timeUpdate.time as any;
              arrivalTime = longObj.toNumber?.() || Number(longObj.toString?.()) || Number(longObj);
            } else {
              arrivalTime = Number(timeUpdate.time);
            }
            
            // If this stop is in the future, use it
            if (arrivalTime > now) {
              relevantStop = stop;
              break; // Take the first future stop
            }
          }
        }
        
        // If we found a relevant stop, process it
        if (relevantStop) {
          const timeUpdate = relevantStop.departure || relevantStop.arrival;
          if (!timeUpdate?.time) continue;

          // arrival.time can be a number or Long object from protobuf
          let arrivalTime: number;
          if (typeof timeUpdate.time === 'number') {
            arrivalTime = timeUpdate.time;
          } else if (typeof timeUpdate.time === 'object' && timeUpdate.time !== null) {
            // Handle Long object from protobuf - use toNumber() if available
            const longObj = timeUpdate.time as any;
            arrivalTime = longObj.toNumber?.() || Number(longObj.toString?.()) || Number(longObj);
          } else {
            arrivalTime = Number(timeUpdate.time);
          }
          
          // Skip if in the past
          if (arrivalTime <= now) {
            continue;
          }
          
          const minutesUntil = Math.max(0, Math.floor((arrivalTime - now) / 60));

          // Create a unique key for this trip to avoid duplicates
          const tripKey = `${trip.tripId}-${relevantStop.stopId}`;
          if (seenTrips.has(tripKey)) {
            continue;
          }
          seenTrips.add(tripKey);

          // Extract destination from trip headsign or stop ID
          const destination = (trip as any).tripHeadsign || 
                            (relevantStop.stopId?.includes('N') ? 'Uptown' : 'Downtown');
          
          trains.push({
            destination,
            minutes: minutesUntil,
            routeId: upperLineId,
          });
        }
      }

      console.log(`Found ${trains.length} trains for line ${upperLineId}${stationId ? ` at station ${stationId}` : ''}`);

      // Sort by arrival time and take first 5
      const sortedTrains = trains
        .sort((a: NextTrain, b: NextTrain) => a.minutes - b.minutes)
        .slice(0, 5);

      return {
        message: `Next trains for line ${upperLineId}${stationName || stationId ? ` at ${stationName || stationId}` : ''}`,
        timestamp: new Date().toISOString(),
        lineId: upperLineId,
        stationId: stationId || undefined,
        stationName: stationName || undefined,
        times: sortedTrains,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch MTA real-time data: ${error.message}`);
      }
      throw error;
    }
  }
}

