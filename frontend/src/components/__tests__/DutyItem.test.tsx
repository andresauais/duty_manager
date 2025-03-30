import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DutyItem } from '../DutyItem';
import { Duty } from '../../models/Duty';

const mockDuty: Duty = {
  id: 1,
  name: 'Test duty',
  completed: false,
};

const onToggleComplete = vi.fn();
const onDelete = vi.fn();
const onEditSave = vi.fn();

const renderComponent = (duty = mockDuty) =>
	render(
		<DutyItem
			duty={duty}
			onToggleComplete={onToggleComplete}
			onDelete={onDelete}
			onEditSave={onEditSave}
		/>
	);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DutyItem component', () => {
  it('renders the duty name', () => {
    renderComponent();
    expect(screen.getByText('Test duty')).toBeInTheDocument();
  });

  it('calls onToggleComplete when clicking the complete button', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /mark as complete/i }));
    expect(onToggleComplete).toHaveBeenCalledWith(mockDuty);
  });

  it('calls onDelete when clicking the delete button', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(mockDuty.id);
  });

  it('enters edit mode and cancels', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(screen.getByPlaceholderText(/enter duty name/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByPlaceholderText(/enter duty name/i)).not.toBeInTheDocument();
  });

  it('edits and saves new name', async () => {
    renderComponent();

    // Click edit button
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Change input value
    const input = screen.getByPlaceholderText(/enter duty name/i);
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated duty');

    // Click save
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    // Assert save was called correctly
    expect(onEditSave).toHaveBeenCalledWith(mockDuty.id, 'Updated duty');
  });

  it('does not save if input is empty', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const input = screen.getByPlaceholderText(/enter duty name/i);
    fireEvent.change(input, { target: { value: ' ' } }); // whitespace only
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(onEditSave).not.toHaveBeenCalled();
  });
});
