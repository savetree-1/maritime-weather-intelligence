# Maritime Weather Intelligence

A comprehensive maritime weather intelligence system providing real-time weather data, forecasts, and analytics for maritime operations.

## Features

- 🌊 **Real-time Weather Data**: Current conditions for any location
- 🚢 **Marine Weather**: Specialized maritime weather including wave heights, sea temperature
- 📈 **Weather Forecasts**: Multi-day forecasts for maritime planning
- ⚓ **Port Information**: Database of global ports with weather integration
- 🛳️ **Shipping Routes**: Route planning with weather conditions
- ⚠️ **Weather Alerts**: Critical weather alerts for maritime safety
- 📊 **Historical Data**: Weather history for analysis and planning
- 🔍 **Location-based Services**: Find nearby ports and weather conditions

## Technology Stack

- **Backend**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite (easily replaceable with PostgreSQL/MySQL)
- **Weather Data**: OpenWeatherMap API integration
- **Testing**: Jest with Supertest
- **Code Quality**: ESLint, Prettier
- **Documentation**: Comprehensive API documentation

## Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/savetree-1/maritime-weather-intelligence.git
cd maritime-weather-intelligence
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## Development

### Development Mode

```bash
npm run dev
```

This starts the server with hot reloading using nodemon.

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Health Check
```
GET /health
```

### Weather Endpoints

#### Get Current Weather
```
GET /api/weather/current?lat={latitude}&lon={longitude}
```

#### Get Marine Weather
```
GET /api/weather/marine?lat={latitude}&lon={longitude}
```

#### Get Weather Forecast
```
GET /api/weather/forecast?lat={latitude}&lon={longitude}&days={days}
```

#### Get Weather History
```
GET /api/weather/history?lat={latitude}&lon={longitude}&limit={limit}
```

### Maritime Endpoints

#### Get Ports
```
GET /api/maritime/ports?page={page}&limit={limit}&country={country}
```

#### Get Port by ID
```
GET /api/maritime/ports/{id}
```

#### Get Port Weather
```
GET /api/maritime/ports/{id}/weather
```

#### Get Shipping Routes
```
GET /api/maritime/routes?page={page}&limit={limit}
```

#### Get Route Weather
```
GET /api/maritime/routes/{id}/weather
```

#### Find Nearby Ports
```
GET /api/maritime/nearby-ports?lat={latitude}&lon={longitude}&radius={radius}
```

### Alert Endpoints

#### Get Weather Alerts
```
GET /api/alerts?severity={severity}&type={type}&lat={lat}&lon={lon}&radius={radius}
```

#### Create Weather Alert
```
POST /api/alerts
```

#### Get Alert by ID
```
GET /api/alerts/{id}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | Database path | ./maritime_weather.sqlite |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key | (required) |
| `LOG_LEVEL` | Logging level | info |

### Getting API Keys

1. **OpenWeatherMap**: Register at [openweathermap.org](https://openweathermap.org/api) to get a free API key
2. Add your API key to `.env` file

## Database Schema

The system uses SQLite by default with the following main tables:

- **ports**: Global port information
- **weather_data**: Historical weather data
- **weather_alerts**: Weather alerts and warnings
- **shipping_routes**: Maritime shipping routes

## Sample Data

The system comes with sample data including major global ports:
- Port of Hamburg (Germany)
- Port of Rotterdam (Netherlands)
- Port of Singapore
- Port of Shanghai (China)
- Port of Los Angeles (United States)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and add tests
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit changes: `git commit -am 'Add feature'`
7. Push to branch: `git push origin feature-name`
8. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation
- Review the test files for usage examples

## Roadmap

- [ ] Real-time weather alerts via WebSocket
- [ ] Advanced marine weather models
- [ ] Weather routing optimization
- [ ] Mobile app integration
- [ ] Advanced analytics dashboard
- [ ] Machine learning weather predictions
- [ ] Integration with more weather providers
- [ ] Kubernetes deployment configs
