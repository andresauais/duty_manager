import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DutyForm } from '../DutyForm';
import { Duty } from '../../models/Duty';

describe('DutyForm', () => {
  const onSubmit = vi.fn();

  beforeEach(() => {
    onSubmit.mockReset();
  });

  it('renders input and submit button', () => {
    render(<DutyForm onSubmit={onSubmit} />);
    expect(screen.getByPlaceholderText(/enter duty name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('validates required input', async () => {
    render(<DutyForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('calls onSubmit with duty name', async () => {
    render(<DutyForm onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText(/enter duty name/i);
    fireEvent.change(input, { target: { value: 'Test Duty' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Test Duty', undefined);
    });
  });

  it('pre-fills input when editing', () => {
    const duty: Duty = { id: 1, name: 'Existing Duty' };
    render(<DutyForm onSubmit={onSubmit} initialValue={duty} />);
    expect(screen.getByDisplayValue('Existing Duty')).toBeInTheDocument();
  });

  it('calls onSubmit with name and id when editing', async () => {
    const duty: Duty = { id: 1, name: 'Old' };
    render(<DutyForm onSubmit={onSubmit} initialValue={duty} />);
    const input = screen.getByPlaceholderText(/enter duty name/i);
    fireEvent.change(input, { target: { value: 'Updated' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Updated', 1);
    });
  });
});
