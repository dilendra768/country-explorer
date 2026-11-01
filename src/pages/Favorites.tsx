import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import { useCountries } from '../api';
import { useStore } from '../store';

export default function Favorites() {
  const favorites = useStore((s) => s.favorites);
  const { data, loading } = useCountries();
  const saved = (data ?? []).filter((c) => favorites.includes(c.code));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Favorites</h1>
      {loading && <p>Loading…</p>}
      {!loading && saved.length === 0 && <p>No favorites yet. Switch to Admin and save a country from its detail page.</p>}
      <ul className="space-y-2">
        {saved.map((c) => (
          <li key={c.code} className="flex items-center gap-3">
            <img src={c.flag} alt="" className="h-5 w-8 rounded-sm object-cover" />
            <Link to={`/countries/${c.code}`} className="font-medium hover:underline">{c.name}</Link>
            <FavoriteButton code={c.code} />
          </li>
        ))}
      </ul>
    </div>
  );
}
