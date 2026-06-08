import clsx from 'clsx';
import type { Filter } from '@/types';

type FilterBarProps = {
  filter: Filter;
  onChange: (f: Filter) => void;
  remaining: number;
  completedCount: number;
  onClearCompleted: () => void;
};

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function FilterBar({
  filter,
  onChange,
  remaining,
  completedCount,
  onClearCompleted,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 pt-2">
      <span>
        {remaining} item{remaining === 1 ? '' : 's'} left
      </span>

      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange(f.value)}
            className={clsx(
              'px-3 py-1 rounded-md transition-colors',
              filter === f.value
                ? 'bg-white text-brand-700 shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-800'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
        className="text-gray-500 hover:text-red-600 disabled:opacity-40 disabled:hover:text-gray-500"
      >
        Clear completed
      </button>
    </div>
  );
}
