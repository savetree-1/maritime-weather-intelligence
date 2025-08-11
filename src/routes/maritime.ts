import { Router } from 'express';
import { MaritimeController } from '../controllers/MaritimeController';

const router = Router();
const maritimeController = new MaritimeController();

/**
 * @route GET /api/maritime/ports
 * @desc Get all ports
 * @query page - Page number (optional)
 * @query limit - Items per page (optional)
 * @query country - Filter by country (optional)
 */
router.get('/ports', maritimeController.getPorts.bind(maritimeController));

/**
 * @route GET /api/maritime/ports/:id
 * @desc Get port by ID
 */
router.get('/ports/:id', maritimeController.getPortById.bind(maritimeController));

/**
 * @route GET /api/maritime/ports/:id/weather
 * @desc Get current weather for a specific port
 */
router.get('/ports/:id/weather', maritimeController.getPortWeather.bind(maritimeController));

/**
 * @route GET /api/maritime/routes
 * @desc Get all shipping routes
 * @query page - Page number (optional)
 * @query limit - Items per page (optional)
 */
router.get('/routes', maritimeController.getRoutes.bind(maritimeController));

/**
 * @route GET /api/maritime/routes/:id
 * @desc Get route by ID
 */
router.get('/routes/:id', maritimeController.getRouteById.bind(maritimeController));

/**
 * @route GET /api/maritime/routes/:id/weather
 * @desc Get weather conditions along a shipping route
 */
router.get('/routes/:id/weather', maritimeController.getRouteWeather.bind(maritimeController));

/**
 * @route GET /api/maritime/nearby-ports
 * @desc Find ports near coordinates
 * @query lat - Latitude
 * @query lon - Longitude
 * @query radius - Search radius in km (optional, default 100)
 */
router.get('/nearby-ports', maritimeController.getNearbyPorts.bind(maritimeController));

export { router as maritimeRoutes };