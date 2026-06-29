import { cn } from '../../utils/cn';

/**
 * Centered, max-width page container with responsive gutters.
 */
export default function Container({ as: As = 'div', className, children }) {
  return (
    <As className={cn('mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </As>
  );
}
