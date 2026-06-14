import { useState } from 'react';
import { todayKey } from '../domain/date-utils';
import { addDays } from '../domain/week-utils';

interface Props {
  currentDate: string | null;
  onMoveDate: (dueDate: string | null) => void;
}

export function MoveDateChips({ currentDate, onMoveDate }: Props) {
  const [showDateInput, setShowDateInput] = useState(false);
  const today = todayKey();

  return (
    <div className="move-date-panel">
      <div className="move-date-chips" aria-label="Datum verschieben">
        <button type="button" onClick={() => onMoveDate(today)}>
          Heute
        </button>
        <button type="button" onClick={() => onMoveDate(addDays(today, 1))}>
          Morgen
        </button>
        <button type="button" onClick={() => onMoveDate(addDays(today, 7))}>
          Naechste Woche
        </button>
        <button type="button" onClick={() => onMoveDate(null)}>
          Ohne Datum
        </button>
        <button type="button" onClick={() => setShowDateInput((visible) => !visible)}>
          Datum waehlen
        </button>
      </div>
      {showDateInput && (
        <label className="move-date-input">
          Datum
          <input type="date" value={currentDate ?? ''} onChange={(event) => onMoveDate(event.target.value || null)} />
        </label>
      )}
    </div>
  );
}
