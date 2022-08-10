import request from 'supertest';

describe('Shows Campinas Crawler Tests', () => {
  it('Site should return 200', async () => {
    const response = await request(process.env.SHOWS_CAMPINAS_BLOG_URL).get(' ');

    expect(response.statusCode).toBe(200);
  });
});
