import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/ui/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SmartImage from '../components/ui/SmartImage';

/**
 * Standalone, brand-styled sign-up page (rendered outside StoreLayout).
 * Mirrors the Login split layout; validates the password confirmation
 * client-side before calling the shared register flow.
 */
export default function Register() {
  const { token, user, register, isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already signed in → nothing to register.
  if (token && user) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }

  const validate = () => {
    const errs = {};
    if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (confirm !== password) {
      errs.confirm = 'Passwords do not match.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await register(name, email, password);
      addToast('Account created! Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Registration failed. Please try again.';
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
          src="https://loremflickr.com/1200/1600/lehenga,indian,woman?lock=27"
          alt="Woman wearing a richly embroidered Indian lehenga"
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
              Join Wornora to save your favourites, enjoy faster checkout and
              be first to discover every new festive edit.
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
              Join Wornora
            </p>
            <h1 className="mt-2 font-heading text-3xl text-ink sm:text-4xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-ink-mute">
              It only takes a moment to begin.
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
                label="Full name"
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                leftIcon={<User size={18} aria-hidden="true" />}
              />

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
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                placeholder="At least 6 characters"
                hint={!fieldErrors.password ? 'Use 6 or more characters.' : undefined}
                error={fieldErrors.password}
                leftIcon={<Lock size={18} aria-hidden="true" />}
              />

              <Input
                label="Confirm password"
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  if (fieldErrors.confirm) {
                    setFieldErrors((prev) => ({ ...prev, confirm: undefined }));
                  }
                }}
                placeholder="Re-enter your password"
                error={fieldErrors.confirm}
                leftIcon={<Lock size={18} aria-hidden="true" />}
              />

              <Button type="submit" fullWidth size="lg" loading={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-ink-mute">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-accent font-semibold text-gold-dark transition-colors hover:text-gold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
