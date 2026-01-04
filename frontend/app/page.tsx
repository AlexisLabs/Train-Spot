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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4">
      <div className="w-full max-w-4xl">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Subway Display Board */}
        <div className="w-[900px] h-[220px] bg-neutral-900 rounded-2xl p-6 shadow-2xl mx-auto">
          <div className="w-full h-full bg-white rounded-md shadow-inner border border-gray-300 p-4 flex flex-col overflow-hidden">
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
                <div className="mb-2 pb-2 border-b border-gray-200 flex-shrink-0">
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
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 flex-shrink-0">
                  Last updated: {new Date(alerts.timestamp).toLocaleTimeString()}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Input Section */}
        <div className="mt-6 flex gap-3">
          <input
            type="text"
            value={routeInput}
            onChange={(e) => setRouteInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter route (e.g., A, B, C, 1, 2, Q, etc.)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
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
  );
}
