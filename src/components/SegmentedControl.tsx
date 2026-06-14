interface Option<T extends string> {
  key: T;
  label: string;
}

interface Props<T extends string> {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
}

export function SegmentedControl<T extends string>({ value, options, onChange, ariaLabel, className }: Props<T>) {
  return (
    <div className={`segmented-control${className ? ` ${className}` : ''}`} aria-label={ariaLabel}>
      {options.map((option) => (
        <button key={option.key} type="button" className={value === option.key ? 'segment-active' : ''} onClick={() => onChange(option.key)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
