import { Request, Response } from 'express';
import { dutyService } from '../services/duty.service';

export const dutyController = {
  async getAll(req: Request, res: Response) {
    try {
      const duties = await dutyService.getAllDuties();
      res.json(duties);
    } catch (error) {
      console.error('Error fetching duties:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const duty = await dutyService.createDuty(name);
      res.status(201).json(duty);
    } catch (error) {
      console.error('Error creating duty:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, completed } = req.body;
  
      const duty = await dutyService.updateDuty(id, { name, completed });
      res.json(duty);
    } catch (error) {
      console.error('Error updating duty:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await dutyService.deleteDuty(id);
      res.json({ message: 'Duty deleted' });
    } catch (error) {
      console.error('Error deleting duty:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
