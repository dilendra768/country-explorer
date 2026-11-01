import { useCallback, useEffect, useState } from 'react';

export interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
  subregion: string;
  population: number;
  capital: string;
  area: number;
  languages: string[];
  currencies: string[];
}

const FIELDS = 'name,cca3,flags,region,subregion,population,capital,area,languages,currencies';

// Sources are tried in order. Set VITE_FALLBACK_API_URL in .env to add a second API
// (it should return an array of countries in REST Countries v2 or v3 shape).
const SOURCES: string[] = [
  `https://restcountries.com/v3.1/all?fields=${FIELDS}`,
  ...(import.meta.env.VITE_FALLBACK_API_URL ? [import.meta.env.VITE_FALLBACK_API_URL as string] : []),
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Raw = Record<string, any>;

function names(value: unknown, key: string): string[] {
  if (Array.isArray(value)) return value.map((v: Raw) => v?.[key]).filter(Boolean);
  if (value && typeof value === 'object') return Object.values(value as Raw).map((v) => (typeof v === 'string' ? v : v?.[key])).filter(Boolean);
  return [];
}

// Accepts both REST Countries v3 and v2-style payloads.
function normalize(r: Raw): Country {
  return {
    code: String(r.cca3 ?? r.alpha3Code ?? '').toUpperCase(),
    name: typeof r.name === 'string' ? r.name : r.name?.common ?? 'Unknown',
    flag: r.flags?.svg ?? r.flags?.png ?? r.flag ?? '',
    region: r.region ?? 'Other',
    subregion: r.subregion ?? '',
    population: Number(r.population ?? 0),
    capital: Array.isArray(r.capital) ? r.capital[0] ?? '' : r.capital ?? '',
    area: Number(r.area ?? 0),
    languages: names(r.languages, 'name'),
    currencies: names(r.currencies, 'name'),
  };
}

async function fetchFrom(url: string): Promise<Country[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) throw new Error('Unexpected response');
    return json.map(normalize).filter((c) => c.code).sort((a, b) => a.name.localeCompare(b.name));
  } finally {
    clearTimeout(timer);
  }
}

let cache: Country[] | null = null;

async function loadCountries(): Promise<Country[]> {
  if (cache) return cache;
  let lastError: unknown;
  for (const url of SOURCES) {
    try {
      cache = await fetchFrom(url);
      return cache;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Could not load countries');
}

export function useCountries() {
  const [data, setData] = useState<Country[] | null>(cache);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!cache);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    loadCountries()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!cache) load();
  }, [load]);

  return { data, error, loading, reload: load };
}
