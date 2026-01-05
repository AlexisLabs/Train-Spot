'use client';

import { useState, useEffect } from 'react';
import { getNextTrainsByLine, getStationsForLine, type NextTrainsResponse, type Station } from '@/lib/api';

export default function Home() {
  const [routeInput, setRouteInput] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [nextTrains, setNextTrains] = useState<NextTrainsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStations, setLoadingStations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch stations when route changes
  useEffect(() => {
    const fetchStations = async () => {
      if (!routeInput.trim()) {
        setStations([]);
        setSelectedStation('');
        return;
      }

      try {
        setLoadingStations(true);
        const data = await getStationsForLine(routeInput.trim().toUpperCase());
        setStations(data.stations);
        setSelectedStation(''); // Reset selection when route changes
      } catch (err) {
        console.error('Failed to fetch stations:', err);
        setStations([]);
      } finally {
        setLoadingStations(false);
      }
    };

    fetchStations();
  }, [routeInput]);

  const handleFetch = async () => {  
    if (!routeInput.trim()) {
      setError('Please enter a route (e.g., A, B, C, 1, 2, etc.)');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getNextTrainsByLine(
        routeInput.trim().toUpperCase(),
        selectedStation || undefined
      );
      setNextTrains(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load times');
      setNextTrains(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  // Using next train times instead of alerts

  return (
    <div 
      className="min-h-screen flex flex-col items-center relative pt-16"
      style={{
        backgroundImage: 'url(/_DSC3466.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div 
        className="absolute inset-0" 
        style={{
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)'
        }}
      />
      <div className="w-full max-w-4xl relative z-10 px-4">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="relative">
          {/* Mounts */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 flex gap-16 sm:gap-32">
            <div 
              className="w-4 h-32 sm:w-6 sm:h-32 rounded-sm shadow-2xl"
              style={{
                background: 'linear-gradient(90deg, #1a1a1a 0%, #404040 50%, #1a1a1a 100%)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(255,255,255,0.1)'
              }}
            />
            <div 
              className="w-4 h-32 sm:w-6 sm:h-32 rounded-sm shadow-2xl"
              style={{
                background: 'linear-gradient(90deg, #1a1a1a 0%, #404040 50%, #1a1a1a 100%)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(255,255,255,0.1)'
              }}
            />
          </div>

          {/* Display */}
          <div 
            className="w-full max-w-225 h-65 sm:h-80 rounded-xl sm:rounded-2xl p-3 sm:p-6 flex items-center justify-center mx-auto"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.9), inset 0 -10px 20px rgba(0,0,0,0.5), inset 0 10px 20px rgba(255,255,255,0.05)'
            }}
          >
            <div 
              className="w-full h-full bg-white rounded-md p-2 sm:p-4 flex flex-col overflow-hidden"
              style={{
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {loading && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading times...</p>
                  </div>
                </div>
              )}

              {!loading && !nextTrains && !error && (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Enter a route below to view upcoming trains</p>
                </div>
              )}

              {!loading && nextTrains && (
                <>
                  {/* Header */}
                  <div className="mb-2 pb-2 border-b border-gray-200 shrink-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900">
                        Route {nextTrains.lineId}{nextTrains.stationName ? ` @ ${nextTrains.stationName}` : nextTrains.stationId ? ` @ ${nextTrains.stationId}` : ''}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white font-bold text-xs sm:text-sm">
                          {nextTrains.lineId}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Showing {nextTrains.times.length} upcoming train{nextTrains.times.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Times Display */}
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {nextTrains.times.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-green-600 font-semibold text-sm">No upcoming trains found</p>
                      </div>
                    ) : (
                      nextTrains.times.map((t, i) => (
                        <div key={i} className="pl-2 py-1 bg-gray-50 rounded flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-700">{t.destination}</span>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-900">{t.minutes} min</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 shrink-0">
                    Last updated: {new Date(nextTrains.timestamp).toLocaleTimeString()}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mt-6 flex flex-col items-center gap-3 px-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-2xl w-full">
            <input
              type="text"
              value={routeInput}
              onChange={(e) => setRouteInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Route (e.g., L, A, 1)"
              className="flex-1 sm:w-32 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
              maxLength={2}
            />
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              disabled={loadingStations || stations.length === 0}
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">All Stations</option>
              {loadingStations && <option value="">Loading stations...</option>}
              {!loadingStations && stations.map((station) => (
                <option key={station.id} value={station.name}>
                  {station.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleFetch}
              disabled={loading || !routeInput.trim()}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              {loading ? 'Loading...' : 'Fetch'}
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            {stations.length > 0 
              ? `${stations.length} stations available on this line`
              : 'Enter a route to see available stations'}
          </p>
        </div>
      </div>
    </div>
  );
}
