import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Shared text input with label, hint and error states.
 * Always pair with a label for accessibility (auto-linked via id).
 */
const Input = forwardRef(function Input(
  { label, error, hint, leftIcon, rightIcon, className, id, type = 'text', required, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block font-accent text-sm font-medium text-ink-soft">
          {label}
          {required && <span className="text-maroon"> *</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          className={cn(
            'w-full rounded-input border bg-cream px-4 py-3 text-ink placeholder:text-ink-mute',
            'transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            error ? 'border-maroon' : 'border-sand',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-mute">{rightIcon}</span>
        )}
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-maroon">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-mute">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
