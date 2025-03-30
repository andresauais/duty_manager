import { useEffect, useState } from 'react';
import { Duty } from '../models/Duty';
import { fetchDuties, createDuty, updateDuty, deleteDuty } from '../api/duties';
import { message } from 'antd';

export const useDuties = () => {
  const [duties, setDuties] = useState<Duty[]>([]);
  const [editing, setEditing] = useState<Duty | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDuties = async () => {
    setLoading(true);
    try {
      const data = await fetchDuties();
      setDuties(data);
    } catch {
      message.error('Failed to load duties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDuties();
  }, []);

  const handleCreateOrUpdate = async (name: string, id?: number) => {
    try {
      if (id) {
        const updated = await updateDuty(id, { name });
        setDuties((prev) => prev.map((d) => (d.id === id ? updated : d)));
        message.success('Duty updated');
      } else {
        const created = await createDuty(name);
        setDuties((prev) => [...prev, created]);
        message.success('Duty added');
      }
      setEditing(null);
    } catch {
      message.error('Something went wrong');
    }
  };

  const handleEditSave = async (id: number, newName: string) => {
    try {
      const duty = duties.find((d) => d.id === id);
      if (!duty) return;

      const updated = await updateDuty(id, { ...duty, name: newName });
      setDuties((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } catch {
      message.error('Error editing duty');
    }
  };

  const handleToggleComplete = async (duty: Duty) => {
    try {
      const updated = await updateDuty(duty.id!, {
        ...duty,
        completed: !duty.completed,
      });
      setDuties((prev) => prev.map((d) => (d.id === duty.id ? updated : d)));
    } catch {
      message.error('Error toggling complete');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDuty(id);
      setDuties((prev) => prev.filter((d) => d.id !== id));
      message.success('Duty deleted');
    } catch {
      message.error('Failed to delete');
    }
  };

  return {
    duties,
    loading,
    editing,
    handleCreateOrUpdate,
    handleEditSave,
    handleToggleComplete,
    handleDelete,
  };
};
