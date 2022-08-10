import request from 'supertest';

describe('Brasuca Crawler Tests', () => {
  it('Site should return 200', async () => {
    const response = await request(process.env.BRASUCA_URL).get('/');

    expect(response.statusCode).toBe(200);
  });
});
