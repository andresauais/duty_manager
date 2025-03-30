import { Duty } from "../models/duty.model";
import { dutyRepository } from "../repositories/duty.repository";


export const dutyService = {
  async getAllDuties(): Promise<Duty[]> {
    return dutyRepository.getAllDuties();
  },

  async createDuty(name: string): Promise<Duty> {
    return dutyRepository.createDuty(name);
  },

  async updateDuty(id: number, duty: Partial<Duty>): Promise<Duty> {
    return dutyRepository.updateDuty(id, duty);
  },

  async deleteDuty(id: number): Promise<void> {
    return dutyRepository.deleteDuty(id);
  }
};
