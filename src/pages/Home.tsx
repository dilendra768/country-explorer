import { Link, useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import { useCountries } from '../api';
import { useStore } from '../store';

const REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export default function Home() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useCountries();
  const { history, addHistory, clearHistory } = useStore();

  const search = (term: string) => {
    addHistory(term);
    navigate(`/countries?q=${encodeURIComponent(term)}`);
  };

  const totalPop = data?.reduce((sum, c) => sum + c.population, 0) ?? 0;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Explore the world's countries</h1>
        <SearchForm onSearch={search} />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Browse by region:</span>
          {REGIONS.map((r) => (
            <Link key={r} to={`/countries?region=${r}`} className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-indigo-600 hover:text-white dark:border-slate-600">
              {r}
            </Link>
          ))}
        </div>
        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-500 dark:text-slate-400">Recent searches:</span>
            {history.map((h) => (
              <Link key={h} to={`/countries?q=${encodeURIComponent(h)}`} className="rounded bg-slate-200 px-2 py-0.5 dark:bg-slate-700">{h}</Link>
            ))}
            <button onClick={clearHistory} className="text-red-600 underline dark:text-red-400">Clear</button>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Summary</h2>
        {loading && <p>Loading countries…</p>}
        {error && (
          <div className="rounded border border-red-300 bg-red-50 p-3 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200">
            Could not load country data ({error}).{' '}
            <button onClick={reload} className="underline">Retry</button>
          </div>
        )}
        {data && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Countries</p>
              <p className="text-2xl font-bold">{data.length}</p>
            </div>
            <div className="rounded border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total population</p>
              <p className="text-2xl font-bold">{totalPop.toLocaleString('en-US')}</p>
            </div>
            <div className="rounded border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">By region</p>
              <ul className="text-sm">
                {REGIONS.map((r) => (
                  <li key={r}>{r}: {data.filter((c) => c.region === r).length}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
