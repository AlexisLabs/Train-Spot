const fs = require('fs');
const path = require('path');

// Parse CSV file
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i];
    });
    return obj;
  });
}

// Get GTFS data directory
const gtfsDir = '/Users/yahel.martinez/Downloads/gtfs_subway';

// Parse files
console.log('Parsing GTFS files...');
const stops = parseCSV(path.join(gtfsDir, 'stops.txt'));
const trips = parseCSV(path.join(gtfsDir, 'trips.txt'));
const stopTimes = parseCSV(path.join(gtfsDir, 'stop_times.txt'));

// Build route to stops mapping
console.log('Building route to stops mapping...');
const routeToStops = {};

// Group stop_times by trip_id
const tripStops = {};
stopTimes.forEach(st => {
  if (!tripStops[st.trip_id]) {
    tripStops[st.trip_id] = [];
  }
  tripStops[st.trip_id].push(st.stop_id);
});

// Map trips to routes
trips.forEach(trip => {
  const routeId = trip.route_id;
  if (!routeToStops[routeId]) {
    routeToStops[routeId] = new Set();
  }
  
  // Add all stops for this trip
  const stopsForTrip = tripStops[trip.trip_id] || [];
  stopsForTrip.forEach(stopId => {
    // Remove direction suffix (N/S) to get base station ID
    const baseStopId = stopId.replace(/[NS]$/, '');
    routeToStops[routeId].add(baseStopId);
  });
});

// Convert Sets to Arrays and sort
Object.keys(routeToStops).forEach(routeId => {
  routeToStops[routeId] = Array.from(routeToStops[routeId]).sort();
});

// Build station info map (base ID to name)
const stationInfo = {};
stops.forEach(stop => {
  // Only process parent stations (location_type = 1) or stations without parent
  if (stop.location_type === '1' || !stop.parent_station) {
    const baseStopId = stop.stop_id.replace(/[NS]$/, '');
    if (!stationInfo[baseStopId] || stop.location_type === '1') {
      stationInfo[baseStopId] = {
        id: baseStopId,
        name: stop.stop_name,
        lat: parseFloat(stop.stop_lat),
        lon: parseFloat(stop.stop_lon)
      };
    }
  }
});

// Build final mapping: route -> stations with full info (sorted north to south)
const lineStations = {};
Object.keys(routeToStops).forEach(routeId => {
  lineStations[routeId] = routeToStops[routeId]
    .map(stopId => stationInfo[stopId])
    .filter(station => station) // Remove any undefined entries
    .sort((a, b) => b.lat - a.lat); // Sort by latitude descending (north to south)
});

// Output TypeScript file
const outputContent = `/**
 * MTA Subway Station Mappings
 * Generated from GTFS static data
 * Maps subway lines to their stations with IDs and names
 */

export interface Station {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export const LINE_STATIONS: Record<string, Station[]> = ${JSON.stringify(lineStations, null, 2)};

/**
 * Get stations for a specific line
 */
export function getStationsForLine(lineId: string): Station[] {
  return LINE_STATIONS[lineId.toUpperCase()] || [];
}

/**
 * Find station ID by name (case-insensitive partial match)
 */
export function findStationByName(lineId: string, stationName: string): Station | undefined {
  const stations = getStationsForLine(lineId);
  const searchTerm = stationName.toLowerCase();
  return stations.find(station => 
    station.name.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get all unique stations across all lines
 */
export function getAllStations(): Station[] {
  const allStations = new Map<string, Station>();
  Object.values(LINE_STATIONS).forEach(stations => {
    stations.forEach(station => {
      allStations.set(station.id, station);
    });
  });
  return Array.from(allStations.values()).sort((a, b) => a.name.localeCompare(b.name));
}
`;

const outputPath = path.join(__dirname, '..', 'src', 'config', 'mta.stations.ts');
fs.writeFileSync(outputPath, outputContent);

console.log(`✅ Generated station mappings: ${outputPath}`);
console.log(`📊 Total lines: ${Object.keys(lineStations).length}`);
console.log(`📍 Total unique stations: ${Object.keys(stationInfo).length}`);
Object.keys(lineStations).forEach(line => {
  console.log(`   ${line}: ${lineStations[line].length} stations`);
});
