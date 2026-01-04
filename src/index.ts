import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import transitRoutes from './routes/transit.routes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'MTA API - Real-time Transit Data',
    status: 'running',
    endpoints: {
      health: '/health',
      transit: '/api/transit'
    }
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

// Transit routes - mount at /api/transit
app.use('/api/transit', transitRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚇 MTA API server is running on http://localhost:${PORT}`);
});

