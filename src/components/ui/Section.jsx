import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Container from './Container';
import { cn } from '../../utils/cn';

/**
 * A page section with consistent vertical rhythm and an optional header
 * (eyebrow + title + subtitle, and a "view all" link or centered flourish).
 */
export default function Section({
  eyebrow,
  title,
  subtitle,
  viewAllTo,
  viewAllLabel = 'View All',
  center = false,
  className,
  containerClassName,
  children,
}) {
  const hasHeader = eyebrow || title || subtitle;

  return (
    <section className={cn('py-10 sm:py-14 lg:py-16', className)}>
      <Container className={containerClassName}>
        {hasHeader && (
          <div
            className={cn(
              'mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12',
              center && 'flex-col items-center text-center'
            )}
          >
            <div className={cn(center && 'max-w-2xl')}>
              {eyebrow && (
                <p className="mb-2 font-accent text-xs uppercase tracking-[0.22em] text-gold-dark">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="font-heading text-3xl text-ink sm:text-4xl">{title}</h2>
              )}
              {center && <div className="rule-gold mx-auto mt-4 w-24" />}
              {subtitle && <p className="mt-3 max-w-xl text-ink-soft">{subtitle}</p>}
            </div>

            {viewAllTo && !center && (
              <Link
                to={viewAllTo}
                className="group inline-flex items-center gap-1.5 font-accent text-sm font-medium text-gold-dark transition-colors hover:text-ink"
              >
                {viewAllLabel}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
