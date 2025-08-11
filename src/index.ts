import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { weatherRoutes } from './routes/weather';
import { maritimeRoutes } from './routes/maritime';
import { alertRoutes } from './routes/alerts';
import { errorHandler } from './middleware/errorHandler';
import { DatabaseService } from './services/DatabaseService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
DatabaseService.initialize();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Maritime Weather Intelligence API' 
  });
});

// API Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/maritime', maritimeRoutes);
app.use('/api/alerts', alertRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Maritime Weather Intelligence API',
    version: '1.0.0',
    endpoints: [
      '/api/weather',
      '/api/maritime', 
      '/api/alerts',
      '/health'
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌊 Maritime Weather Intelligence API running on port ${PORT}`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  console.log(`📊 API documentation at http://localhost:${PORT}/`);
});

export default app;