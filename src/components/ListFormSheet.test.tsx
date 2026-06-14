import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ListFormSheet } from './ListFormSheet';

describe('ListFormSheet', () => {
  it('validates that a list name is required', async () => {
    const onSave = vi.fn();

    render(<ListFormSheet mode="create" onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Bitte gib einen Listennamen ein.');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves a trimmed new list name', async () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<ListFormSheet mode="create" onSave={onSave} onCancel={onCancel} />);

    fireEvent.change(screen.getByLabelText('Listenname'), { target: { value: '  Haushalt  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith('Haushalt'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('prefills the current name when renaming a list', () => {
    render(<ListFormSheet mode="rename" initialName="Privat" onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Liste umbenennen' })).toBeInTheDocument();
    expect(screen.getByLabelText('Listenname')).toHaveValue('Privat');
  });
});
