import { CalendarDays, Inbox, ListChecks, Settings } from 'lucide-react';
import { ViewKey } from '../app/App';

interface Props {
  activeView: ViewKey;
  onChange: (view: ViewKey) => void;
}

const items = [
  { key: 'today', label: 'Heute', icon: ListChecks },
  { key: 'calendar', label: 'Kalender', icon: CalendarDays },
  { key: 'inbox', label: 'Inbox', icon: Inbox },
  { key: 'settings', label: 'Mehr', icon: Settings }
] as const;

export function BottomNavigation({ activeView, onChange }: Props) {
  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeView === item.key;
        return (
          <button
            key={item.key}
            type="button"
            className={active ? 'nav-item nav-item-active' : 'nav-item'}
            onClick={() => onChange(item.key)}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
