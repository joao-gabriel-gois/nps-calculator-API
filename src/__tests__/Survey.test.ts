import request from 'supertest';
import { app } from '../app';

import createConnection from '../database';

describe("Survets", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  it('Should be able to create a new survey', async () => {
    const response = await request(app).post('/surveys')
      .send({
        title: 'survey test',
        description: 'survey to evaluate service quality'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it('Should be able to create a new survey', async () => {
    await request(app).post('/surveys')
      .send({
        title: 'survey test',
        description: 'survey to evaluate service quality'
      });
      
    const response = await request(app).get('/surveys');
    
    const { status, body } = response;

    expect(status).toBe(200);
    expect(body[0].title).toEqual('survey test');
    expect(body[0].description).toEqual('survey to evaluate service quality');
  });
})
