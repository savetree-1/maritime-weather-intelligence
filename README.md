# Maritime Weather Intelligence Platform

A comprehensive maritime-focused weather intelligence platform that provides real-time alerts, 10-day forecasts, and actionable speed recommendations to optimize safety, fuel consumption, and schedule adherence for vessels and voyage planners.

## 🌊 Features

### Weather Intelligence
- **Real-time Weather Data**: Integration with OpenWeatherMap, Open-Meteo, and NOAA/GFS APIs
- **10-Day Forecasts**: 240-hour detailed forecasts with hourly resolution
- **Interactive Maps**: Leaflet-based weather visualization with overlays
- **Weather Alerts**: Real-time maritime weather warnings and notifications

### Speed Optimization Engine
- **Route-based Optimization**: Advanced algorithm with discrete candidate approach
- **Fuel Calculations**: Weather-adjusted fuel consumption estimates
- **Safety Monitoring**: Multi-factor safety scoring and threshold monitoring
- **Speed Recommendations**: Segment-by-segment speed advisory with explanations

### Document Processing
- **OCR Pipeline**: Extract text from maritime documents (PDF, JPG, PNG)
- **Clause Extraction**: Automated parsing of Statement of Facts, Charter Party agreements
- **NLP Processing**: Maritime-specific term recognition and data extraction
- **Document Management**: Upload, process, and manage maritime documentation

### User Interface
- **Maritime Theme**: Professional dark UI with navy, teal, and coral color palette
- **Glass Morphism**: Modern card-based layout with backdrop blur effects
- **Responsive Design**: Desktop and mobile-optimized interface
- **Interactive Components**: Time sliders, map controls, and real-time updates

## 🏗️ Technical Architecture

### Backend (Laravel)
- **Framework**: Laravel 10 with PHP 8.1
- **Database**: PostgreSQL with PostGIS extension for spatial data
- **Cache**: Redis for weather data and performance optimization
- **Authentication**: JWT-based authentication with role-based access
- **APIs**: RESTful API design with comprehensive validation

### Frontend (React)
- **Framework**: React 18 with modern hooks and context
- **Styling**: Tailwind CSS with custom maritime theme
- **Maps**: Leaflet integration for interactive weather visualization
- **State Management**: React hooks with service layer architecture
- **Routing**: React Router for single-page application navigation

### Database Schema
```sql
- users (authentication and roles)
- vessels (ship specifications and fuel parameters)
- routes (geometry and sample points)
- plans (optimization results)
- documents (uploaded files and parsed content)
- weather_samples (normalized weather data)
- alerts (weather warnings and notifications)
```

### API Endpoints
```
GET  /api/v1/weather/realtime?lat={}&lon={}
GET  /api/v1/weather/forecast?lat={}&lon={}&hours=240
GET  /api/v1/weather/route?route_id={}&departure_time={}
GET  /api/v1/alerts?bbox=lat1,lon1,lat2,lon2
POST /api/v1/speed/plan
GET  /api/v1/speed/plans/{plan}
POST /api/v1/docs/upload
GET  /api/v1/docs/status/{jobId}
GET  /api/v1/docs
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- PHP 8.1+ (for local development)

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/savetree-1/maritime-weather-intelligence.git
cd maritime-weather-intelligence
```

2. **Start with Docker Compose**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Database: PostgreSQL on port 5432
- Redis: Available on port 6379

### Manual Setup

#### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
APP_NAME="Maritime Weather Intelligence"
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_DATABASE=maritime_weather
DB_USERNAME=maritime_user
DB_PASSWORD=maritime_pass
REDIS_HOST=redis
OPENWEATHER_API_KEY=your_api_key_here
JWT_SECRET=your-jwt-secret
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Weather API Configuration
- **OpenWeatherMap**: Sign up at https://openweathermap.org/api
- **Open-Meteo**: Free tier available (no API key required)
- **NOAA/GFS**: Integration ready for future implementation

## 📊 Speed Optimization Algorithm

The platform uses a sophisticated speed optimization algorithm:

### Candidate Generation
```javascript
candidates = [0.6×svc, 0.8×svc, 1.0×svc, 1.1×svc]
```

### Optimization Function
```javascript
minimize: FuelCost + λ·DelayCost + SafetyPenalty
```

### Weather Effects
- **Wind Resistance**: Speed factor based on wind conditions
- **Wave Impact**: Sea state effects on vessel performance  
- **Visibility**: Safety-based speed limitations
- **Fuel Consumption**: Cubic relationship with weather resistance

## 🗂️ Document Processing Capabilities

### Supported Document Types
- **Statement of Facts (SoF)**: Voyage completion documentation
- **Charter Party**: Commercial agreements and terms
- **Voyage Orders**: Operational instructions and requirements
- **General Maritime**: Bills of lading, certificates, reports

### Extraction Features
- **OCR Text Extraction**: High-accuracy text recognition
- **Maritime Clause Parsing**: Automated identification of key terms
- **Data Normalization**: Structured data output
- **Confidence Scoring**: Processing quality metrics

## 🌍 Weather Data Sources

### Primary Sources
- **OpenWeatherMap**: Real-time conditions and short-term forecasts
- **Open-Meteo**: Extended forecasts up to 16 days
- **NOAA/GFS**: Marine weather and wave data

### Data Normalization
- Unified data schema across all sources
- Automatic fallback and redundancy
- Cache optimization for performance
- Real-time data validation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: User, operator, and admin roles
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API endpoint protection
- **File Security**: Safe document upload and processing

## 🎨 UI/UX Design

### Maritime Color Palette
- **Navy (#05223B)**: Primary background and headers
- **Teal (#0FA3A3)**: Interactive elements and highlights  
- **Coral (#FF6B61)**: Alerts and critical information

### Design Principles
- **Glass Morphism**: Modern translucent card design
- **Responsive Layout**: Mobile-first responsive design
- **Accessibility**: ARIA labels and keyboard navigation
- **Micro-interactions**: Smooth animations and transitions

## 🚢 Maritime-Specific Features

### Vessel Management
- Comprehensive vessel specifications
- Fuel consumption parameters
- Performance characteristics
- Service speed optimization

### Route Planning
- Geographic route definition
- Sample point generation
- Weather correlation
- Distance and timing calculations

### Operational Intelligence
- Real-time decision support
- Fuel vs. time optimization
- Safety threshold monitoring
- Regulatory compliance

## 📈 Performance Optimizations

### Backend
- Redis caching for weather data
- Database indexing for spatial queries
- API response compression
- Background job processing

### Frontend
- Component lazy loading
- Memoized calculations
- Efficient re-rendering
- Optimized asset delivery

## 🧪 Testing

### Backend Testing
```bash
cd backend
php artisan test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Integration Testing
- API endpoint testing
- Weather service integration
- Document processing pipeline
- User interface functionality

## 📚 API Documentation

Detailed API documentation is available at `/api/documentation` when running the development server. The API follows RESTful conventions with comprehensive error handling and validation.

### Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation and FAQ

## 🏆 Acknowledgments

- OpenWeatherMap for weather data API
- Open-Meteo for free weather forecasting
- Leaflet for interactive mapping
- React and Laravel communities
- Maritime industry professionals for domain expertise

---

**Maritime Weather Intelligence Platform** - Optimizing maritime operations through intelligent weather analysis and speed recommendations.
