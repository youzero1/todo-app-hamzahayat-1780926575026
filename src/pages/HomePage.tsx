import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import TodoInput from '@/components/TodoInput';
import TodoItem from '@/components/TodoItem';
import FilterBar from '@/components/FilterBar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { uid } from '@/lib/id';
import type { Filter, Todo } from '@/types';

export default function HomePage() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos.v1', []);
  const [filter, setFilter] = useState<Filter>('all');

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: uid(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev: Todo[]) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev: Todo[]) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev: Todo[]) => prev.filter((t) => t.id !== id));
  };

  const editTodo = (id: string, text: string) => {
    setTodos((prev: Todo[]) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const clearCompleted = () => {
    setTodos((prev: Todo[]) => prev.filter((t) => !t.completed));
  };

  const filtered = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const remaining = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - remaining;

  return (
    <div className="min-h-full bg-gradient-to-br from-brand-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
              <CheckCircle2 size={28} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Tasks</h1>
          </div>
          <p className="text-gray-500">Stay organized. Get things done.</p>
        </header>

        <div className="bg-white/70 backdrop-blur rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-5 space-y-5">
          <TodoInput onAdd={addTodo} />

          {todos.length > 0 ? (
            <>
              <ul className="space-y-2">
                {filtered.length > 0 ? (
                  filtered.map((t) => (
                    <TodoItem
                      key={t.id}
                      todo={t}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={editTodo}
                    />
                  ))
                ) : (
                  <li className="py-8 text-center text-gray-400">
                    No {filter} tasks.
                  </li>
                )}
              </ul>

              <FilterBar
                filter={filter}
                onChange={setFilter}
                remaining={remaining}
                completedCount={completedCount}
                onClearCompleted={clearCompleted}
              />
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex p-3 rounded-full bg-brand-50 text-brand-600 mb-3">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-gray-500">No tasks yet. Add your first one above!</p>
            </div>
          )}
        </div>

        <footer className="mt-8 text-center text-xs text-gray-400">
          Double-click a task to edit. Your tasks are saved in your browser.
        </footer>
      </div>
    </div>
  );
}
