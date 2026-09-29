import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Package, Heart, MapPin, LogOut, ArrowRight } from 'lucide-react';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import ProductGrid from '../components/product/ProductGrid';
import ProfileInfo from '../components/profile/ProfileInfo';
import OrderHistory from '../components/profile/OrderHistory';
import AddressManager from '../components/profile/AddressManager';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { orderApi } from '../services/orderApi';
import { SAMPLE_USER } from '../constants/sampleData';
import { pluralize } from '../utils/format';
import { cn } from '../utils/cn';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
];

/**
 * Account dashboard — a tabbed view (Profile / Orders / Wishlist / Addresses)
 * with a logout action. Falls back to SAMPLE_USER for display so the page is
 * always reviewable even when no one is signed in.
 */
export default function Profile() {
  const { user, token, logout } = useAuth();
  const { items, wishlistCount } = useWishlist();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = TABS.some((tab) => tab.id === searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const displayUser = user || SAMPLE_USER;

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (TABS.some((tab) => tab.id === requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!token || activeTab !== 'orders') return;

    let active = true;
    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const response = await orderApi.getMine();
        const list = response.data.orders || response.data || [];
        if (active) setOrders(Array.isArray(list) ? list : []);
      } catch (err) {
        if (active) {
          setOrders([]);
          addToast(err.response?.data?.message || 'Could not load orders', 'error');
        }
      } finally {
        if (active) setOrdersLoading(false);
      }
    };

    loadOrders();
    return () => { active = false; };
  }, [token, activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'profile' ? {} : { tab: tabId });
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out', 'info');
    navigate('/');
  };

  return (
    <Container className="py-10 sm:py-14">
      <header className="mb-8">
        <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold-dark">
          My Account
        </p>
        <h1 className="mt-2 font-heading text-3xl text-ink sm:text-4xl">
          Hello, {displayUser.name?.split(' ')[0] || 'there'}
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Side / top navigation */}
        <nav aria-label="Account sections" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex h-11 w-full items-center gap-3 whitespace-nowrap rounded-btn px-4 font-accent text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                      isActive
                        ? 'bg-gold text-ink shadow-soft'
                        : 'text-ink-soft hover:bg-beige'
                    )}
                  >
                    <TabIcon size={18} />
                    {tab.label}
                  </button>
                </li>
              );
            })}
            <li className="shrink-0 lg:mt-2 lg:border-t lg:border-sand/70 lg:pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 w-full items-center gap-3 whitespace-nowrap rounded-btn px-4 font-accent text-sm font-medium text-maroon transition-colors hover:bg-maroon/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                <LogOut size={18} />
                Logout
              </button>
            </li>
          </ul>
        </nav>

        {/* Active panel */}
        <div className="min-w-0">
          {activeTab === 'profile' && <ProfileInfo user={displayUser} />}

          {activeTab === 'orders' && (
            <OrderHistory orders={orders} loading={ordersLoading} signedIn={Boolean(token)} />
          )}

          {activeTab === 'wishlist' && (
            <section aria-label="Wishlist preview">
              {wishlistCount === 0 ? (
                <Card className="p-2">
                  <EmptyState
                    icon="Heart"
                    title="Your wishlist is empty"
                    description="Save your favourite pieces to find them here later."
                    actionLabel="Explore Collection"
                    actionTo="/shop"
                  />
                </Card>
              ) : (
                <div>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-ink-soft">
                      {pluralize(wishlistCount, 'saved item')}
                    </p>
                    <Button
                      to="/wishlist"
                      variant="outline"
                      size="sm"
                      rightIcon={<ArrowRight size={16} />}
                    >
                      View Full Wishlist
                    </Button>
                  </div>
                  <ProductGrid products={items.slice(0, 3)} />
                </div>
              )}
            </section>
          )}

          {activeTab === 'addresses' && <AddressManager />}
        </div>
      </div>
    </Container>
  );
}
