import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders without an action by default', () => {
    render(<EmptyState title="Leer" text="Keine Eintraege." />);

    expect(screen.getByRole('heading', { name: 'Leer' })).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('can render and execute a primary action', () => {
    const onAction = vi.fn();

    render(<EmptyState title="Leer" text="Keine Eintraege." actionLabel="Aufgabe erstellen" onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: 'Aufgabe erstellen' }));

    expect(onAction).toHaveBeenCalledOnce();
  });
});
