interface Props {
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, text, actionLabel, onAction }: Props) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{text}</p>
      {actionLabel && onAction && (
        <button type="button" className="primary-button empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
