import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Search input that navigates to the shop with a `search` query param.
 * Used inline in the header (desktop) and inside the mobile nav / search row.
 */
export default function SearchBar({ className, autoFocus = false, onSubmitted }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? `/shop?search=${encodeURIComponent(term)}` : '/shop');
    onSubmitted?.();
  };

  return (
    <form onSubmit={handleSubmit} role="search" className={cn('relative w-full', className)}>
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Search for sarees, lehengas, jewellery…"
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-sand bg-cream pl-11 pr-4 text-sm text-ink placeholder:text-ink-mute focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
      />
    </form>
  );
}
