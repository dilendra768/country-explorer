import { Link, NavLink, Outlet } from 'react-router-dom';
import { useStore, type Role } from '../store';

export default function Layout() {
  const { role, setRole, theme, toggleTheme } = useStore();
  const link = ({ isActive }: { isActive: boolean }) =>
    `px-2 py-1 rounded ${isActive ? 'font-semibold underline' : 'hover:underline'}`;

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="mr-4 text-lg font-bold">🌍 Country Explorer</Link>
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/countries" className={link}>Countries</NavLink>
          <NavLink to="/favorites" className={link}>Favorites</NavLink>
          <div className="ml-auto flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              Role
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-700"
              >
                <option value="guest">Guest</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <button
              onClick={toggleTheme}
              className="rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-600"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </nav>
      </header>
      {role === 'guest' && (
        <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
          🔒 You are browsing as a Guest. Switch to Admin to save countries to Favorites.
        </div>
      )}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
