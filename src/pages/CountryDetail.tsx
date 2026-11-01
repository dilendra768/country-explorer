import { Link, useParams } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import { useCountries } from '../api';

export default function CountryDetail() {
  const { countrycode = '' } = useParams();
  const { data, loading, error } = useCountries();
  const country = data?.find((c) => c.code === countrycode.toUpperCase());

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Could not load country data ({error}).</p>;
  if (!country) return <p>Country not found. <Link to="/countries" className="underline">Back to list</Link></p>;

  const rows: [string, string][] = [
    ['Region', country.region],
    ['Subregion', country.subregion || '—'],
    ['Capital', country.capital || '—'],
    ['Population', country.population.toLocaleString('en-US')],
    ['Area', `${country.area.toLocaleString('en-US')} km²`],
    ['Languages', country.languages.join(', ') || '—'],
    ['Currencies', country.currencies.join(', ') || '—'],
  ];

  return (
    <div className="space-y-4">
      <Link to="/countries" className="text-sm text-indigo-600 underline dark:text-indigo-400">← Back to countries</Link>
      <div className="flex flex-wrap items-center gap-4">
        <img src={country.flag} alt={`Flag of ${country.name}`} className="h-20 rounded shadow" />
        <h1 className="text-3xl font-bold">{country.name}</h1>
        <FavoriteButton code={country.code} />
      </div>
      <dl className="grid max-w-xl grid-cols-[8rem_1fr] gap-y-2">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-semibold">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
