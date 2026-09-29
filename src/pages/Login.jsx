import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/ui/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SmartImage from '../components/ui/SmartImage';

/**
 * Standalone, brand-styled sign-in page (rendered outside StoreLayout).
 * Two-column split: a full-height fashion image on the left (lg+) and the
 * sign-in form on the right. Preserves the original admin role redirect.
 */
export default function Login() {
  const { token, user, login, isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already signed in → send to the correct side.
  if (token && user) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      addToast('Welcome back!', 'success');

      // Resolve role from the freshest source so admins always reach /admin.
      const role = data?.user?.role || JSON.parse(localStorage.getItem('user') || '{}').role;
      navigate(role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ivory lg:grid lg:grid-cols-2">
      {/* Brand / imagery panel — hidden on small screens */}
      <aside className="relative hidden lg:block">
        <SmartImage
          src="https://loremflickr.com/1200/1600/saree,indian,woman?lock=21"
          alt="Woman in an elegant handcrafted Indian saree"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/40 to-ink/20" />
        <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-14">
          <Logo size="lg" />
          <div className="max-w-md">
            <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold-light">
              Wornora
            </p>
            <p className="mt-3 font-heading text-3xl leading-snug text-cream xl:text-4xl">
              Handcrafted elegance, woven for you.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-cream/80">
              Sign in to revisit your wishlist, track orders and continue your
              journey through India&rsquo;s finest ethnic wear.
            </p>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <section className="flex min-h-screen flex-col px-6 py-10 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between">
          <Logo size="md" to="/" />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-accent text-sm text-ink-soft transition-colors hover:text-gold-dark"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to store
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md animate-fade-up py-10">
            <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold-dark">
              Welcome back
            </p>
            <h1 className="mt-2 font-heading text-3xl text-ink sm:text-4xl">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-ink-mute">
              Enter your details below to continue.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-input border border-maroon/30 bg-maroon/5 px-4 py-3 text-sm text-maroon"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
              <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={<Mail size={18} aria-hidden="true" />}
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                leftIcon={<Lock size={18} aria-hidden="true" />}
              />

              <div className="flex items-center justify-between">
                <label
                  htmlFor="remember"
                  className="flex cursor-pointer items-center gap-2 font-accent text-sm text-ink-soft"
                >
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-sand text-gold accent-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="font-accent text-sm text-gold-dark transition-colors hover:text-gold"
                >
                  Forgot password?
                </a>
              </div>

              <Button type="submit" fullWidth size="lg" loading={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-ink-mute">
              New to Wornora?{' '}
              <Link
                to="/register"
                className="font-accent font-semibold text-gold-dark transition-colors hover:text-gold"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
