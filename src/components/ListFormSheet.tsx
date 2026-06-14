import { FormEvent, useEffect, useId, useState } from 'react';
import { X } from 'lucide-react';

type Mode = 'create' | 'rename';

interface Props {
  mode: Mode;
  initialName?: string;
  onSave: (name: string) => Promise<void> | void;
  onCancel: () => void;
}

function unknownErrorToMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  return 'Liste konnte nicht gespeichert werden.';
}

export function ListFormSheet({ mode, initialName = '', onSave, onCancel }: Props) {
  const nameId = useId();
  const titleId = useId();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(initialName);
    setError(null);
    setIsSaving(false);
  }, [initialName, mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedName = name.trim();
    if (!normalizedName) {
      setError('Bitte gib einen Listennamen ein.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave(normalizedName);
      onCancel();
    } catch (saveError) {
      setError(unknownErrorToMessage(saveError));
      setIsSaving(false);
    }
  }

  const title = mode === 'create' ? 'Neue Liste' : 'Liste umbenennen';

  return (
    <div className="sheet-backdrop" onClick={onCancel}>
      <form className="list-form-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()}>
        <div className="sheet-head">
          <div>
            <h2 id={titleId}>{title}</h2>
            <p>Listenname</p>
          </div>
          <button type="button" className="icon-button" onClick={onCancel} aria-label="Schliessen" title="Schliessen">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <label htmlFor={nameId}>
          Listenname
          <input
            id={nameId}
            name="listName"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError(null);
            }}
            autoFocus
            maxLength={80}
            autoComplete="off"
          />
        </label>

        {error && (
          <div className="error-box" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="sheet-actions">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={isSaving}>
            Abbrechen
          </button>
          <button type="submit" className="primary-button" disabled={isSaving}>
            {isSaving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </form>
    </div>
  );
}
