import { useEffect, useRef, useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import clsx from 'clsx';
import type { Todo } from '@/types';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    } else {
      setDraft(todo.text);
    }
    setEditing(false);
  };

  const cancel = () => {
    setDraft(todo.text);
    setEditing(false);
  };

  return (
    <li className="group flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition-shadow">
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        className={clsx(
          'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
          todo.completed
            ? 'bg-brand-600 border-brand-600 text-white'
            : 'border-gray-300 hover:border-brand-500'
        )}
      >
        {todo.completed && <Check size={14} strokeWidth={3} />}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') cancel();
          }}
          className="flex-1 px-2 py-1 border border-brand-500 rounded focus:outline-none text-gray-800"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={clsx(
            'flex-1 select-none cursor-pointer break-all',
            todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
          )}
        >
          {todo.text}
        </span>
      )}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {editing ? (
          <>
            <button
              type="button"
              onClick={commit}
              className="p-1.5 rounded hover:bg-gray-100 text-green-600"
              aria-label="Save"
            >
              <Check size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
              onClick={cancel}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-brand-600"
              aria-label="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
