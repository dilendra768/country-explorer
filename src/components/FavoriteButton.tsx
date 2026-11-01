import { useStore } from '../store';

export default function FavoriteButton({ code }: { code: string }) {
  const { role, favorites, toggleFavorite } = useStore();
  const saved = favorites.includes(code);

  if (role !== 'admin') {
    return (
      <button disabled className="cursor-not-allowed rounded border px-3 py-1 text-sm opacity-60">
        🔒 Locked
      </button>
    );
  }
  return (
    <button
      onClick={() => toggleFavorite(code)}
      className="rounded border border-amber-500 px-3 py-1 text-sm hover:bg-amber-100 dark:hover:bg-amber-900/40"
    >
      {saved ? '★ Saved' : '☆ Add to favorites'}
    </button>
  );
}
