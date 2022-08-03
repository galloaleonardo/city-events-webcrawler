import request from 'supertest';

describe('Prefeitura URL Crawler Tests', () => {
  it('Site should return 200', async () => {
    const response = await request(process.env.PREFEITURA_CAMPINAS_URL).get('/');

    expect(response.statusCode).toBe(200);
  });
});
