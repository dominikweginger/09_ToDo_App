import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  count: number;
  icon: LucideIcon;
  onClick: () => void;
}

export function DashboardTile({ label, count, icon: Icon, onClick }: Props) {
  return (
    <button type="button" className="dashboard-tile" onClick={onClick}>
      <span className="tile-icon">
        <Icon size={20} aria-hidden="true" />
      </span>
      <span>{label}</span>
      <strong>{count}</strong>
    </button>
  );
}
