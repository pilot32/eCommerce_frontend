import { cn } from '../../utils/cn';

/**
 * Generic surface card with soft rounded corners and warm shadow.
 * Pass `hover` to enable the lift-on-hover interaction.
 */
export default function Card({ as: As = 'div', hover = false, className, children, ...props }) {
  return (
    <As
      className={cn(
        'rounded-card border border-sand/60 bg-cream shadow-soft',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
        className
      )}
      {...props}
    >
      {children}
    </As>
  );
}
