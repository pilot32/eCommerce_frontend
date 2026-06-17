import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardIcon from '../assets/icons/dashboard.svg';
import categoriesIcon from '../assets/icons/categories.svg';
import productsIcon from '../assets/icons/products.svg';
import couponIcon from '../assets/icons/coupon.svg';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: dashboardIcon },
  { path: '/admin/categories', label: 'Categories', icon: categoriesIcon },
  { path: '/admin/subcategories', label: 'Subcategories', icon: categoriesIcon },
  { path: '/admin/products', label: 'Products', icon: productsIcon },
  { path: '/admin/coupons', label: 'Coupons', icon: couponIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Wornora</h1>
        <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <img src={item.icon} alt={item.label} className="w-5 h-5 invert opacity-80" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="mb-3 px-4">
          <p className="text-sm font-medium truncate">{user?.name || 'Admin User'}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}