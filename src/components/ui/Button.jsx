import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';

/**
 * Shared button. Renders a <Link> when `to` is set, an <a> when `href` is set,
 * otherwise a <button>. Variants follow DESIGN.md (primary / secondary / outline)
 * plus ghost & light helpers.
 *
 * Colour choices meet WCAG AA: dark ink text on gold (~6:1), cream on maroon.
 */
const VARIANTS = {
  primary: 'bg-gold text-ink hover:bg-gold-dark shadow-gold hover:shadow-lift',
  secondary: 'bg-maroon text-cream hover:bg-[#731515] shadow-card hover:shadow-lift',
  outline: 'border border-gold text-ink hover:bg-gold-glow',
  ghost: 'text-ink hover:bg-beige',
  light: 'bg-cream text-ink border border-sand hover:border-gold',
};

const SIZES = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm', // 44px — meets minimum touch target
  lg: 'h-12 px-8 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  to,
  href,
  type = 'button',
  className,
  children,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-accent font-semibold rounded-btn whitespace-nowrap',
    'transition-all duration-200 ease-out select-none active:scale-[0.98]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className
  );

  const content = (
    <>
      {loading && <Spinner size={16} className="-ml-0.5" />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  );

  if (to && !disabled && !loading) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href && !disabled && !loading) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
