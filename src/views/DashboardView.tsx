import { CalendarDays, Flag, Flame, Rows3, Sun } from 'lucide-react';
import { DashboardTile } from '../components/DashboardTile';
import { ListRow } from '../components/ListRow';
import { TodoList } from '../domain/list-model';
import { SmartViewKey, getSmartViewCounts } from '../domain/smart-view-service';
import { Task } from '../domain/task-model';

interface Props {
  tasks: Task[];
  lists: TodoList[];
  onOpenSmartView: (view: SmartViewKey) => void;
  onOpenList: (listId: string) => void;
}

const tiles = [
  { key: 'today', label: 'Heute', icon: Sun },
  { key: 'planned', label: 'Geplant', icon: CalendarDays },
  { key: 'this-week', label: 'Diese Woche', icon: Rows3 },
  { key: 'next-week', label: 'Naechste Woche', icon: CalendarDays },
  { key: 'flagged', label: 'Markiert', icon: Flag },
  { key: 'urgent', label: 'Dringend', icon: Flame }
] as const;

export function DashboardView({ tasks, lists, onOpenSmartView, onOpenList }: Props) {
  const counts = getSmartViewCounts(tasks);
  return (
    <section className="view">
      <header className="view-header">
        <h1>SoloTodo</h1>
        <p>Deine lokalen Aufgaben im Ueberblick.</p>
      </header>
      <div className="dashboard-grid">
        {tiles.map((tile) => (
          <DashboardTile key={tile.key} label={tile.label} count={counts[tile.key]} icon={tile.icon} onClick={() => onOpenSmartView(tile.key)} />
        ))}
      </div>
      <section className="section-block">
        <div className="section-head">
          <h2>Meine Listen</h2>
        </div>
        <div className="list-stack">
          {lists.map((list) => (
            <ListRow key={list.id} list={list} count={tasks.filter((task) => task.listId === list.id && task.status === 'open').length} onOpen={() => onOpenList(list.id)} />
          ))}
        </div>
      </section>
    </section>
  );
}
