import request from 'supertest';
import app from '../index';

describe('Maritime Weather Intelligence API', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('service', 'Maritime Weather Intelligence API');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Root Endpoint', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Maritime Weather Intelligence API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
      expect(Array.isArray(response.body.endpoints)).toBe(true);
    });
  });

  describe('Weather Endpoints', () => {
    it('should get current weather for valid coordinates', async () => {
      const response = await request(app)
        .get('/api/weather/current')
        .query({ lat: 53.5511, lon: 9.9937 })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('location');
      expect(response.body.data).toHaveProperty('current');
    });

    it('should return error for missing coordinates', async () => {
      const response = await request(app)
        .get('/api/weather/current')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Maritime Endpoints', () => {
    it('should get list of ports', async () => {
      const response = await request(app)
        .get('/api/maritime/ports')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Alerts Endpoints', () => {
    it('should get list of alerts', async () => {
      const response = await request(app)
        .get('/api/alerts')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Endpoint not found');
    });
  });
});