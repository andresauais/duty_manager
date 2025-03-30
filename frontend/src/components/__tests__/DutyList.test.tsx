import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DutyList } from '../DutyList';
import * as dutiesApi from '../../api/duties';
import { Duty } from '../../models/Duty';

vi.mock('../../api/duties');

const mockFetchDuties = dutiesApi.fetchDuties as unknown as ReturnType<typeof vi.fn>;
const mockCreateDuty = dutiesApi.createDuty as unknown as ReturnType<typeof vi.fn>;
const mockUpdateDuty = dutiesApi.updateDuty as unknown as ReturnType<typeof vi.fn>;
const mockDeleteDuty = dutiesApi.deleteDuty as unknown as ReturnType<typeof vi.fn>;

const mockDuties: Duty[] = [
  { id: 1, name: 'Duty One', completed: false },
  { id: 2, name: 'Duty Two', completed: true }
];

describe('DutyList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchDuties.mockResolvedValue(mockDuties);
    mockCreateDuty.mockImplementation(async (name) => ({ id: 3, name, completed: false }));
    mockUpdateDuty.mockImplementation(async (id, data) => ({ id, ...data }));
    mockDeleteDuty.mockResolvedValue(undefined);
  });

  it('renders fetched duties', async () => {
    render(<DutyList />);
    await waitFor(() => {
      expect(screen.getByText('Duty One')).toBeInTheDocument();
      expect(screen.getByText('Duty Two')).toBeInTheDocument();
    });
  });

  it('creates a new duty', async () => {
    render(<DutyList />);
    const input = await screen.findByPlaceholderText(/enter duty name/i);
    fireEvent.change(input, { target: { value: 'New Duty' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(mockCreateDuty).toHaveBeenCalledWith('New Duty');
      expect(screen.getByText('New Duty')).toBeInTheDocument();
    });
  });

  it('deletes a duty', async () => {
    render(<DutyList />);
    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i });
    expect(deleteButtons.length).toBeGreaterThan(0);

    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
        expect(screen.queryByText(mockDuties[0].name)).not.toBeInTheDocument();
    });
  });

  it('toggles duty completion', async () => {
    render(<DutyList />);
    const completeButton = await screen.findByRole('button', { name: /mark as complete/i });
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(mockUpdateDuty).toHaveBeenCalledWith(1, {
        ...mockDuties[0],
        completed: true
      });
    });
  });
});
