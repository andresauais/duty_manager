
import { testPool } from '../../config/test-db';
import { Duty } from '../../models/duty.model';

// A real version of the repository, just for test
const dutyRepository = {
  async getAllDuties(): Promise<Duty[]> {
    const result = await testPool.query('SELECT * FROM duties');
    return result.rows;
  },

  async createDuty(name: string): Promise<Duty> {
    const result = await testPool.query(
      'INSERT INTO duties (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  },

  async updateDuty(id: number, duty: Duty): Promise<Duty> {
    const result = await testPool.query(
      'UPDATE duties SET name = $1 WHERE id = $2 RETURNING *',
      [duty.name, id]
    );
    return result.rows[0];
  },

  async deleteDuty(id: number): Promise<void> {
    await testPool.query('DELETE FROM duties WHERE id = $1', [id]);
  }
};

describe('Duty Repository (Integration)', () => {
  beforeEach(async () => {
    await testPool.query('DELETE FROM duties');
  });

  afterAll(async () => {
    await testPool.end();
  });

  it('should create and return a duty', async () => {
    const duty = await dutyRepository.createDuty('Integration Test Duty');
    expect(duty.id).toBeDefined();
    expect(duty.name).toBe('Integration Test Duty');
  });

  it('should return all duties', async () => {
    await dutyRepository.createDuty('Duty A');
    await dutyRepository.createDuty('Duty B');

    const duties = await dutyRepository.getAllDuties();
    expect(duties).toHaveLength(2);
  });

  it('should update a duty', async () => {
    const created = await dutyRepository.createDuty('Original Name');
    const updated = await dutyRepository.updateDuty(created.id!, { name: 'Updated Name' });

    expect(updated.name).toBe('Updated Name');
  });

  it('should delete a duty', async () => {
    const created = await dutyRepository.createDuty('To be deleted');
    await dutyRepository.deleteDuty(created.id!);

    const duties = await dutyRepository.getAllDuties();
    expect(duties).toHaveLength(0);
  });
});
