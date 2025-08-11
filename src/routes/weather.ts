import { Router } from 'express';
import { WeatherController } from '../controllers/WeatherController';

const router = Router();
const weatherController = new WeatherController();

/**
 * @route GET /api/weather/current
 * @desc Get current weather for coordinates
 * @query lat - Latitude
 * @query lon - Longitude
 */
router.get('/current', weatherController.getCurrentWeather.bind(weatherController));

/**
 * @route GET /api/weather/marine
 * @desc Get marine weather conditions
 * @query lat - Latitude
 * @query lon - Longitude
 */
router.get('/marine', weatherController.getMarineWeather.bind(weatherController));

/**
 * @route GET /api/weather/forecast
 * @desc Get weather forecast
 * @query lat - Latitude
 * @query lon - Longitude
 * @query days - Number of days (optional, default 5)
 */
router.get('/forecast', weatherController.getForecast.bind(weatherController));

/**
 * @route GET /api/weather/history
 * @desc Get weather history for location
 * @query lat - Latitude
 * @query lon - Longitude
 * @query limit - Number of records (optional, default 50)
 */
router.get('/history', weatherController.getWeatherHistory.bind(weatherController));

export { router as weatherRoutes };