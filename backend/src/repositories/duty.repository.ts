import { pool as defaultPool } from '../config/db';
import { Duty } from '../models/duty.model';

let activePool = defaultPool;

export function setCustomPool(newPool: typeof defaultPool) {
  activePool = newPool;
}

export const dutyRepository = {
  async getAllDuties(): Promise<Duty[]> {
    const result = await activePool.query('SELECT * FROM duties');
    return result.rows;
  },
  async createDuty(name: string): Promise<Duty> {
    const result = await activePool.query(
      'INSERT INTO duties (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  },
  async updateDuty(id: number, duty: Partial<Duty>): Promise<Duty> {
    const result = await activePool.query(
      'UPDATE duties SET name = $1, completed = $2 WHERE id = $3 RETURNING *',
      [duty.name, duty.completed ?? false, id]
    );
    return result.rows[0];
  },
	
  async deleteDuty(id: number): Promise<void> {
    await activePool.query('DELETE FROM duties WHERE id = $1', [id]);
  }
};
