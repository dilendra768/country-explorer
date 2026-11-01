import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Countries from './pages/Countries';
import CountryDetail from './pages/CountryDetail';
import Favorites from './pages/Favorites';
import { useStore } from './store';

export default function App() {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/countries/:countrycode" element={<CountryDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<p className="p-8">Page not found.</p>} />
      </Route>
    </Routes>
  );
}
