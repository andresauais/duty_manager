import { dutyRepository } from '../duty.repository';
import { pool } from '../../config/db';
import { Duty } from '../../models/duty.model';

jest.mock('../../config/db', () => {
  return {
    pool: {
      query: jest.fn()
    }
  };
});

describe('Duty Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAllDuties should return duties from the database', async () => {
    const mockDuties: Duty[] = [{ id: 1, name: 'Test Duty' }];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockDuties });

    const result = await dutyRepository.getAllDuties();
    expect(result).toEqual(mockDuties);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM duties');
  });

  it('createDuty should insert and return a new duty', async () => {
    const newDuty: Duty = { id: 2, name: 'New Duty' };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [newDuty] });

    const result = await dutyRepository.createDuty('New Duty');
    expect(result).toEqual(newDuty);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO duties (name) VALUES ($1) RETURNING *',
      ['New Duty']
    );
  });

  it('updateDuty should update and return the duty', async () => {
    const updatedDuty: Duty = { id: 1, name: 'Updated Duty' };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [updatedDuty] });
  
    const result = await dutyRepository.updateDuty(1, { name: updatedDuty.name });
    expect(result).toEqual(updatedDuty);
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE duties SET name = $1, completed = $2 WHERE id = $3 RETURNING *',
      [updatedDuty.name, updatedDuty.completed ?? false, 1]
    );
  });
  

  it('deleteDuty should call the delete query', async () => {
    (pool.query as jest.Mock).mockResolvedValue({});

    await dutyRepository.deleteDuty(1);
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM duties WHERE id = $1', [1]);
  });
});
