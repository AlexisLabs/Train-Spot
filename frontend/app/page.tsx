'use client';

import { useState } from 'react';
import { getAlertsByLine, type AlertsResponse } from '@/lib/api';

export default function Home() {
  const [routeInput, setRouteInput] = useState('');
  const [alerts, setAlerts] = useState<AlertsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!routeInput.trim()) {
      setError('Please enter a route (e.g., A, B, C, 1, 2, etc.)');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getAlertsByLine(routeInput.trim().toUpperCase());
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
      setAlerts(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  const getAlertText = (alert: AlertsResponse['alerts'][0]) => {
    return alert.alert.header_text?.translation.find(t => t.language === 'en')?.text || 'No description available';
  };

  const getAlertType = (alert: AlertsResponse['alerts'][0]) => {
    return alert.alert.transit_realtime?.mercury_alert?.alert_type || 'Alert';
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
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
      <div className="w-full max-w-4xl relative z-10">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="relative -mt-92">
          {/* Mounts */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 flex gap-32">
            <div 
              className="w-6 h-32 rounded-sm shadow-2xl"
              style={{
                background: 'linear-gradient(90deg, #1a1a1a 0%, #404040 50%, #1a1a1a 100%)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(255,255,255,0.1)'
              }}
            />
            <div 
              className="w-6 h-32 rounded-sm shadow-2xl"
              style={{
                background: 'linear-gradient(90deg, #1a1a1a 0%, #404040 50%, #1a1a1a 100%)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(255,255,255,0.1)'
              }}
            />
          </div>

          {/* Display */}
          <div 
            className="w-225 h-55 rounded-2xl p-6 flex items-center justify-center mx-auto"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.9), inset 0 -10px 20px rgba(0,0,0,0.5), inset 0 10px 20px rgba(255,255,255,0.05)'
            }}
          >
            <div 
              className="w-full h-full bg-white rounded-md p-4 flex flex-col overflow-hidden"
              style={{
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {loading && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading route information...</p>
                  </div>
                </div>
              )}

              {!loading && !alerts && !error && (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Enter a route below to view alerts</p>
                </div>
              )}

              {!loading && alerts && (
                <>
                  {/* Header */}
                  <div className="mb-2 pb-2 border-b border-gray-200 shrink-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900">
                        Route {routeInput.toUpperCase()}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                          {routeInput.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {alerts.alertCount} alert{alerts.alertCount !== 1 ? 's' : ''} found
                    </p>
                  </div>

                  {/* Alerts Display */}
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {alerts.alertCount === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-green-600 font-semibold text-sm">
                          ✓ No alerts - Service operating normally
                        </p>
                      </div>
                    ) : (
                      alerts.alerts.map((alert, index) => {
                        const alertText = getAlertText(alert);
                        const alertType = getAlertType(alert);

                        return (
                          <div
                            key={alert.id}
                            className="border-l-4 border-blue-600 pl-2 py-1 bg-gray-50 rounded"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-semibold text-blue-600 uppercase">
                                    {alertType}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    #{index + 1}
                                  </span>
                                </div>
                                <p className="text-gray-900 font-medium text-xs leading-tight">
                                  {alertText}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 shrink-0">
                    Last updated: {new Date(alerts.timestamp).toLocaleTimeString()}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mt-6 flex justify-center">
          <div className="flex gap-3 max-w-md">
            <input
              type="text"
              value={routeInput}
              onChange={(e) => setRouteInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter route (e.g., A, B, C)"
              className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              maxLength={2}
            />
            <button
              onClick={handleFetch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Loading...' : 'Fetch'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
