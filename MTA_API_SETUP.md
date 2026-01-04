# MTA API Setup Guide

## Overview
The MTA provides real-time transit data through GTFS-Realtime feeds (Protocol Buffers format).

## Getting Started

### 1. Get Your API Key
- Visit: **https://www.mta.info/developers**
- Register for an account
- Request an API key
- You'll need to provide: `x-api-key` header in requests

### 2. Available Data Feeds
The MTA provides real-time data for:
- **Subway Lines** (Multiple feed IDs)
- **Buses** (Bus Time API)
- **Service Alerts**

### 3. API Endpoint Structure
Base URL: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/`

**Subway Feed Endpoints:**
- **BDFM lines** (B, D, F, M): `nyct%2Fgtfs-bdfm`
- **ACE lines** (A, C, E): `nyct%2Fgtfs-ace`
- **G line**: `nyct%2Fgtfs-g`
- **JZ lines** (J, Z): `nyct%2Fgtfs-jz`
- **NQRW lines** (N, Q, R, W): `nyct%2Fgtfs-nqrw`
- **L line**: `nyct%2Fgtfs-l`
- **Default** (1, 2, 3, 4, 5, 6, 7, S): `nyct%2Fgtfs`
- **Staten Island** (SI): `nyct%2Fgtfs-si`

Full URLs:
- BDFM: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm`
- ACE: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace`
- G: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g`
- JZ: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz`
- NQRW: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw`
- L: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l`
- Default: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs`
- SI: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si`

### 4. Data Format
- Format: **Protocol Buffers (protobuf)**
- You'll need to parse the binary data
- Requires the `gtfs-realtime.proto` file

## Required Packages
- `protobufjs` - Parse Protocol Buffer data
- `axios` or `node-fetch` - Make HTTP requests
- OR consider: `mta-gtfs` (npm package) - Wrapper library

## Example Request Structure
```typescript
const response = await axios.get(
  'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs',
  {
    headers: { 'x-api-key': 'YOUR_API_KEY' },
    responseType: 'arraybuffer'
  }
);
```

## Next Steps
1. Register and get your API key
2. Install required packages
3. Set up environment variables for API key
4. Create service layer to fetch/parse data
5. Integrate into your controllers

## Resources
- Official Docs: https://www.mta.info/developers
- GTFS-Realtime Spec: https://gtfs.org/reference/realtime/
- npm package option: https://www.npmjs.com/package/mta-gtfs

