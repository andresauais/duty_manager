// src/api/duties.ts

import { Duty } from "../models/Duty";


const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchDuties(): Promise<Duty[]> {
  const res = await fetch(`${BASE_URL}/todos`);
  if (!res.ok) throw new Error('Failed to fetch duties');
  return res.json();
}

export async function createDuty(name: string): Promise<Duty> {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Failed to create duty');
  return res.json();
}

export const updateDuty = async (id: number, duty: Partial<Duty>) => {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(duty),
  });
  if (!res.ok) throw new Error('Failed to update duty');
  return await res.json();
};


export async function deleteDuty(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete duty');
}
