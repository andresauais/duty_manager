import { testPool } from '../../config/test-db';
import { setCustomPool } from '../../repositories/duty.repository';

setCustomPool(testPool);

import { dutyService } from '../duty.service';

describe('Integration: dutyService', () => {
  beforeEach(async () => {
    await testPool.query('TRUNCATE duties RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await testPool.end();
  });

  it('should create and return a duty', async () => {
    const newDuty = await dutyService.createDuty('Test Service Create');

    expect(newDuty).toHaveProperty('id');
    expect(newDuty.name).toBe('Test Service Create');
  });

  it('should return all duties', async () => {
    await dutyService.createDuty('First');
    await dutyService.createDuty('Second');

    const all = await dutyService.getAllDuties();

    expect(all).toHaveLength(2);
    expect(all.map(d => d.name)).toEqual(expect.arrayContaining(['First', 'Second']));
  });

  it('should update a duty', async () => {
    const created = await dutyService.createDuty('Original');
    const updated = await dutyService.updateDuty(created.id!, { name: 'Updated' });

    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe('Updated');
  });

  it('should delete a duty', async () => {
    const duty = await dutyService.createDuty('To delete');
    await dutyService.deleteDuty(duty.id!);

    const remaining = await dutyService.getAllDuties();
    expect(remaining).toHaveLength(0);
  });
});
