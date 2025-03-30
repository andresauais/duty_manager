import request from 'supertest';
import express from 'express';
import { dutyController } from '../duty.controller';

// Mock the service layer to isolate controller logic
jest.mock('../../services/duty.service');
import { dutyService } from '../../services/duty.service';

const app = express();
app.use(express.json());
app.get('/todos', dutyController.getAll);
app.post('/todos', dutyController.create);
app.put('/todos/:id', dutyController.update);
app.delete('/todos/:id', dutyController.remove);

describe('Duty Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /todos returns a list of duties', async () => {
    const mockDuties = [{ id: 1, name: 'Test Duty' }];
    (dutyService.getAllDuties as jest.Mock).mockResolvedValue(mockDuties);

    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockDuties);
    expect(dutyService.getAllDuties).toHaveBeenCalled();
  });

  it('POST /todos creates a new duty', async () => {
    const newDuty = { id: 2, name: 'New Duty' };
    (dutyService.createDuty as jest.Mock).mockResolvedValue(newDuty);

    const res = await request(app)
      .post('/todos')
      .send({ name: 'New Duty' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(newDuty);
    expect(dutyService.createDuty).toHaveBeenCalledWith('New Duty');
  });

  it('PUT /todos/:id updates an existing duty', async () => {
    const updatedDuty = { id: 1, name: 'Updated Duty' };
    (dutyService.updateDuty as jest.Mock).mockResolvedValue(updatedDuty);

    const res = await request(app)
      .put('/todos/1')
      .send({ name: 'Updated Duty' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedDuty);
    expect(dutyService.updateDuty).toHaveBeenCalledWith(1, { name: 'Updated Duty' });
  });

  it('DELETE /todos/:id deletes a duty', async () => {
    (dutyService.deleteDuty as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app).delete('/todos/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Duty deleted' });
    expect(dutyService.deleteDuty).toHaveBeenCalledWith(1);
  });
});
