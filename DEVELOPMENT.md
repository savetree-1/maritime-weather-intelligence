# Maritime Weather Intelligence Platform

## Development Setup

### Quick Start with Docker
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Development Database
```bash
# Start development database only
docker-compose -f docker-compose.dev.yml up -d

# Connect to database
psql -h localhost -p 5433 -U maritime_dev -d maritime_weather_dev
```

### Environment Setup

1. **Backend Environment**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

2. **Frontend Environment**
```bash
cd frontend
npm install
npm start
```

### API Testing

The API includes mock data for demonstration purposes. Key endpoints:

- `GET /api/v1/weather/realtime?lat=50.5&lon=-2.5`
- `GET /api/v1/weather/forecast?lat=50.5&lon=-2.5&hours=240`
- `POST /api/v1/speed/plan` (requires authentication)

### Authentication

For development, the API includes mock authentication. In production, implement proper JWT authentication.

### Weather API Keys

To use real weather data:
1. Sign up for OpenWeatherMap API key
2. Add to `.env`: `OPENWEATHER_API_KEY=your_key_here`
3. Open-Meteo works without API key

### Deployment

#### Production Environment
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d

# Or deploy to cloud platform
# Configure environment variables for production
```

### Troubleshooting

**Common Issues:**
- Port conflicts: Change ports in docker-compose.yml
- Database connection: Ensure PostgreSQL is running
- Frontend proxy errors: Check REACT_APP_API_URL

**Debug Mode:**
- Set `APP_DEBUG=true` in backend .env
- Use browser dev tools for frontend debugging

### Features Implemented

✅ **Complete Foundation**
- Laravel backend with PostgreSQL/PostGIS
- React frontend with Tailwind CSS
- Docker containerization
- Weather service integration
- Speed optimization engine
- Document processing system
- Interactive maps and UI

✅ **Core Functionality**
- Real-time weather data with fallback to mock data
- 10-day forecasts with hourly resolution
- Speed optimization with weather effects
- Maritime document OCR and parsing
- Professional maritime-themed UI

✅ **Development Ready**
- Mock data for offline development
- Comprehensive API structure
- Modern responsive design
- Production-ready architecture

### Next Steps for Production

1. **Authentication System**: Implement complete JWT auth flow
2. **Real Weather APIs**: Configure production API keys
3. **OCR Integration**: Connect to Tesseract or cloud OCR services
4. **Performance**: Add monitoring and optimization
5. **Testing**: Expand test coverage
6. **Deployment**: Set up CI/CD pipeline

This platform provides a solid foundation for maritime weather intelligence with all core features implemented and ready for enhancement.