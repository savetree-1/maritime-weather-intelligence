import { Router } from 'express';
import { AlertController } from '../controllers/AlertController';

const router = Router();
const alertController = new AlertController();

/**
 * @route GET /api/alerts
 * @desc Get all active weather alerts
 * @query severity - Filter by severity (optional)
 * @query type - Filter by alert type (optional)
 * @query lat - Latitude for location-based alerts (optional)
 * @query lon - Longitude for location-based alerts (optional)
 * @query radius - Search radius in km (optional, default 50)
 */
router.get('/', alertController.getAlerts.bind(alertController));

/**
 * @route GET /api/alerts/:id
 * @desc Get alert by ID
 */
router.get('/:id', alertController.getAlertById.bind(alertController));

/**
 * @route POST /api/alerts
 * @desc Create a new weather alert
 */
router.post('/', alertController.createAlert.bind(alertController));

/**
 * @route PUT /api/alerts/:id
 * @desc Update an alert
 */
router.put('/:id', alertController.updateAlert.bind(alertController));

/**
 * @route DELETE /api/alerts/:id
 * @desc Delete an alert
 */
router.delete('/:id', alertController.deleteAlert.bind(alertController));

/**
 * @route GET /api/alerts/port/:portId
 * @desc Get alerts affecting a specific port
 */
router.get('/port/:portId', alertController.getPortAlerts.bind(alertController));

/**
 * @route GET /api/alerts/route/:routeId
 * @desc Get alerts affecting a specific shipping route
 */
router.get('/route/:routeId', alertController.getRouteAlerts.bind(alertController));

export { router as alertRoutes };