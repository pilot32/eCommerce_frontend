import { useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';

import Container from '../components/ui/Container';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import ProductGrid from '../components/product/ProductGrid';

import FilterSidebar from '../components/shop/FilterSidebar';
import MobileFilterSheet from '../components/shop/MobileFilterSheet';
import SortDropdown from '../components/shop/SortDropdown';
import ActiveFilters from '../components/shop/ActiveFilters';

import { useShopProducts } from '../hooks/useShopProducts';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { getDiscountPercent } from '../utils/product';
import { pluralize } from '../utils/format';
import { CATEGORIES, SUBCATEGORY_LOOKUP } from '../constants/shop';

/**
 * Shop — the product listing page. Reads the URL for category / subcategory /
 * filter / search / sort, keeps the meaningful params in sync as the shopper
 * adjusts things (so links stay shareable), and drives the catalogue hook with
 * a single centralised filter object. Infinite scroll loads more on demand.
 */
export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  // --- Read the URL into local working values ----------------------------
  const urlCategory = searchParams.get('category') || '';
  const urlSubcategory = searchParams.get('subcategory') || '';
  const urlFilter = searchParams.get('filter') || ''; // "new" | "sale"
  const urlSearch = searchParams.get('search') || '';
  const urlSort = searchParams.get('sort') || '';

  // filter=new implies the "newest" sort unless the user picked another sort.
  const sort = urlSort || (urlFilter === 'new' ? 'newest' : 'featured');
  const saleOnly = urlFilter === 'sale';

  // --- Local-only filters (size / price / availability live in state) ----
  const [localFilters, setLocalFilters] = useState({
    sizes: [],
    minPrice: undefined,
    maxPrice: undefined,
    inStockOnly: false,
  });

  // The full filter object handed to the data hook. URL-derived values are the
  // source of truth for category/subcategory/search; the rest is local state.
  const filters = useMemo(
    () => ({
      category: urlCategory || undefined,
      subcategories: urlSubcategory ? [urlSubcategory] : [],
      sizes: localFilters.sizes,
      minPrice: localFilters.minPrice,
      maxPrice: localFilters.maxPrice,
      inStockOnly: localFilters.inStockOnly,
      search: urlSearch,
    }),
    [urlCategory, urlSubcategory, urlSearch, localFilters]
  );

  const { products, total, loading, hasMore, loadMore, loadingMore } = useShopProducts({
    filters,
    sort,
  });

  // For the sale view, post-filter the returned products to those on discount.
  const visibleProducts = useMemo(
    () => (saleOnly ? products.filter((p) => getDiscountPercent(p) > 0) : products),
    [products, saleOnly]
  );
  const resultCount = saleOnly
    ? products.filter((p) => getDiscountPercent(p) > 0).length
    : total;

  // --- URL writers (keep meaningful params shareable) --------------------
  // Merge a set of param patches; undefined/empty values are removed.
  const writeParams = useCallback(
    (patch) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          });
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Centralised change handler used by every filter control. It routes
  // category/subcategory/search into the URL and everything else into state.
  const handleFilterChange = useCallback(
    (changePatch) => {
      const paramPatch = {};
      const statePatch = {};

      if ('category' in changePatch) {
        paramPatch.category = changePatch.category || undefined;
        // A category change always clears the (single) subcategory param.
        paramPatch.subcategory = undefined;
      }
      if ('subcategories' in changePatch) {
        // The URL carries a single subcategory; keep the most recent one.
        const list = changePatch.subcategories;
        paramPatch.subcategory = list && list.length ? list[list.length - 1] : undefined;
      }
      if ('search' in changePatch) {
        paramPatch.search = changePatch.search || undefined;
      }
      ['sizes', 'minPrice', 'maxPrice', 'inStockOnly'].forEach((key) => {
        if (key in changePatch) statePatch[key] = changePatch[key];
      });

      if (Object.keys(paramPatch).length) writeParams(paramPatch);
      if (Object.keys(statePatch).length) {
        setLocalFilters((prev) => ({ ...prev, ...statePatch }));
      }
    },
    [writeParams]
  );

  const handleSortChange = useCallback(
    (value) => writeParams({ sort: value }),
    [writeParams]
  );

  const clearAll = useCallback(() => {
    setLocalFilters({
      sizes: [],
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
    });
    // Drop every filter param but preserve an active text search if present.
    writeParams({
      category: undefined,
      subcategory: undefined,
      filter: undefined,
      sort: undefined,
    });
  }, [writeParams]);

  // --- Infinite scroll sentinel -----------------------------------------
  const sentinelRef = useInfiniteScroll(loadMore, { enabled: hasMore && !saleOnly });

  // --- Heading + breadcrumb derived from context -------------------------
  const categoryName = urlCategory
    ? CATEGORIES.find((c) => c.slug === urlCategory)?.name
    : null;
  const subcategoryName = urlSubcategory ? SUBCATEGORY_LOOKUP[urlSubcategory]?.name : null;

  let title = 'Shop All';
  if (urlFilter === 'new') title = 'New Arrivals';
  else if (urlFilter === 'sale') title = 'On Sale';
  else if (urlSearch) title = `Results for “${urlSearch}”`;
  else if (subcategoryName) title = subcategoryName;
  else if (categoryName) title = categoryName;

  const breadcrumbs = [{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }];
  if (categoryName) {
    breadcrumbs.push({
      label: categoryName,
      to: subcategoryName ? `/shop?category=${urlCategory}` : undefined,
    });
  }
  if (subcategoryName) breadcrumbs.push({ label: subcategoryName });

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumb items={breadcrumbs} />

      {/* Page header */}
      <header className="mt-5 animate-fade-up">
        <h1 className="font-heading text-3xl text-ink sm:text-4xl">{title}</h1>
        <p className="mt-2 text-ink-soft">
          {loading
            ? 'Loading our latest pieces…'
            : `${pluralize(resultCount, 'product')} to explore`}
        </p>
      </header>

      {/* Toolbar */}
      <div className="mt-6 flex items-center justify-between gap-4 border-y border-sand/70 py-3">
        <p className="font-accent text-sm text-ink-mute">
          {loading ? '—' : pluralize(resultCount, 'result')}
        </p>
        <div className="flex items-center gap-3">
          <SortDropdown value={sort} onChange={handleSortChange} />
          <Button
            variant="outline"
            leftIcon={<SlidersHorizontal size={18} />}
            onClick={() => setSheetOpen(true)}
            className="lg:hidden"
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Active filter chips */}
      <ActiveFilters
        filters={filters}
        onChange={handleFilterChange}
        onClearAll={clearAll}
        className="mt-4"
      />

      {/* Body: sticky sidebar + results */}
      <div className="mt-8 flex gap-10">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClearAll={clearAll}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {loading ? (
            <ProductGridSkeleton count={9} />
          ) : visibleProducts.length === 0 ? (
            <EmptyState
              icon="SearchX"
              title="No products found"
              description="Try adjusting your filters or search."
              actionLabel="Clear Filters"
              onAction={clearAll}
            />
          ) : (
            <>
              <ProductGrid products={visibleProducts} />

              {/* Infinite scroll sentinel + feedback (not used in sale view) */}
              {!saleOnly && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}

              {loadingMore && (
                <div className="flex items-center justify-center gap-3 py-10 text-ink-mute">
                  <Spinner size={20} className="text-gold-dark" />
                  <span className="font-accent text-sm">Loading more…</span>
                </div>
              )}

              {(saleOnly || !hasMore) && visibleProducts.length > 0 && (
                <p className="py-10 text-center font-accent text-sm text-ink-mute">
                  You have reached the end
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filters */}
      <MobileFilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onClearAll={clearAll}
        resultCount={resultCount}
      />
    </Container>
  );
}
