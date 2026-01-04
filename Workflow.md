## For the MTA API intergration // data collection 

1. MTA Alerts API integration
Added the alerts endpoint: https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json
- No API key required
- Returns JSON (easy to parse)

2. Service layer (src/services/mta.service.ts)
- getSubwayAlerts() - Fetch all alerts
- getAlertsByLine(lineId) - Filter alerts by subway line
- getActiveAlerts() - Get only currently active alerts

3. TypeScript types (src/types/mta.types.ts)
- Defined types for MTA alert data structures

4. Updated controllers
/api/transit/alerts - Get all subway alerts

/api/transit/realtime - Get active alerts only

/api/transit/line/:lineId - Get alerts for a specific line (e.g., /api/transit/line/F)

- Test your API
With your server running, try these endpoints: 

### this for using it in the broswer to check for the json return 

All alerts: http://localhost:3000/api/transit/alerts

Active alerts: http://localhost:3000/api/transit/realtime

Line-specific alerts: http://localhost:3000/api/transit/line/F (or any line: A, B, C, 1, 2, etc.)


*** These are the next steps to work on ***



















Then open your browser to the URL shown in the terminal (likely http://localhost:3000 or http://localhost:3001).
What you'll see:

- A list of current MTA subway alerts
- Alert types (Delays, Reroute, etc.)
- Affected subway lines (shown as colored badges)
- Auto-refresh every 30 seconds
- The frontend is ready to use. Run both servers and visit the URL. If you want to add features or modify the design, I can help.