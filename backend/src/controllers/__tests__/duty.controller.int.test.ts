import express from 'express';
import request from 'supertest';
import dutyRoutes from '../../routes/duty.routes';
import { testPool } from '../../config/test-db';
import { setCustomPool } from '../../repositories/duty.repository';

// 👇 Set the test DB connection BEFORE importing the service/controller logic
setCustomPool(testPool);

// Set up an isolated Express app for testing
const app = express();
app.use(express.json());

// ✅ Mount the router at root ('/') because the router already includes '/todos'
app.use('/', dutyRoutes);

describe('Integration: dutyController', () => {
  beforeEach(async () => {
    // Clear the table and reset IDs before each test
    await testPool.query('TRUNCATE duties RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await testPool.end();
  });

  it('GET /todos returns an empty list', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /todos creates a new duty', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ name: 'Integration Test' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Integration Test');
  });

  it('PUT /todos/:id updates a duty', async () => {
    const create = await request(app)
      .post('/todos')
      .send({ name: 'Old Name' });

    const res = await request(app)
      .put(`/todos/${create.body.id}`)
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('DELETE /todos/:id removes a duty', async () => {
    const create = await request(app)
      .post('/todos')
      .send({ name: 'To Delete' });

    const res = await request(app).delete(`/todos/${create.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Duty deleted' });

    const after = await request(app).get('/todos');
    expect(after.body).toHaveLength(0);
  });
});
