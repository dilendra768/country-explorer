import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CountryTable from '../components/CountryTable';
import SearchForm from '../components/SearchForm';
import { useCountries } from '../api';
import { useStore } from '../store';

export default function Countries() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get('q') ?? '';
  const region = params.get('region') ?? '';
  const { data, loading, error, reload } = useCountries();
  const addHistory = useStore((s) => s.addHistory);

  const filtered = (data ?? []).filter(
    (c) => (!region || c.region === region) && (!q || c.name.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Countries{region && ` in ${region}`}{q && ` matching “${q}”`}
      </h1>
      <SearchForm
        key={q}
        initial={q}
        onSearch={(term) => {
          addHistory(term);
          navigate(`/countries?q=${encodeURIComponent(term)}${region ? `&region=${region}` : ''}`);
        }}
      />
      {(q || region) && <Link to="/countries" className="text-sm text-indigo-600 underline dark:text-indigo-400">Clear filters</Link>}
      {loading && <p>Loading countries…</p>}
      {error && (
        <p className="text-red-700 dark:text-red-300">
          Could not load country data ({error}). <button onClick={reload} className="underline">Retry</button>
        </p>
      )}
      {data && (filtered.length ? <CountryTable key={`${q}-${region}`} data={filtered} /> : <p>No countries found.</p>)}
    </div>
  );
}
