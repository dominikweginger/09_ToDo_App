import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ListFormSheet } from './ListFormSheet';

describe('ListFormSheet', () => {
  it('starts create mode with an empty name, a normal list, and the checklist help text', () => {
    render(<ListFormSheet mode="create" onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText('Listenname')).toHaveValue('');
    expect(screen.getByRole('checkbox', { name: 'Checkliste' })).not.toBeChecked();
    expect(screen.getByText('Aufgaben ohne Datum aus dieser Liste werden nur in der Liste angezeigt.')).toBeInTheDocument();
  });

  it('validates that a list name is required', async () => {
    const onSave = vi.fn();

    render(<ListFormSheet mode="create" onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Bitte gib einen Listennamen ein.');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves a trimmed normal list draft', async () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<ListFormSheet mode="create" onSave={onSave} onCancel={onCancel} />);

    fireEvent.change(screen.getByLabelText('Listenname'), { target: { value: '  Haushalt  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith({ name: 'Haushalt', isChecklist: false }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('saves a checklist draft', async () => {
    const onSave = vi.fn();
    render(<ListFormSheet mode="create" onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Listenname'), { target: { value: 'Einkauf' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Checkliste' }));
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith({ name: 'Einkauf', isChecklist: true }));
  });

  it('prefills edit mode and can disable an existing checklist', async () => {
    const onSave = vi.fn();
    render(<ListFormSheet mode="edit" initialName="Privat" initialIsChecklist onSave={onSave} onCancel={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Liste bearbeiten' })).toBeInTheDocument();
    expect(screen.getByLabelText('Listenname')).toHaveValue('Privat');
    expect(screen.getByRole('checkbox', { name: 'Checkliste' })).toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Checkliste' }));
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith({ name: 'Privat', isChecklist: false }));
  });
});
