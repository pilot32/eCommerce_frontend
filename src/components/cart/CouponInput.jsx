import { useState } from 'react';
import { Tag, Check } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

/**
 * Coupon entry field. When a coupon is `applied` it shows the success
 * message; otherwise it lets the customer type a code and hit Apply.
 * The actual validation lives in the parent (Cart) via `onApply(code)`.
 */
export default function CouponInput({ onApply, applied }) {
  const [code, setCode] = useState('');

  const handleApply = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    onApply(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  if (applied?.coupon) {
    return (
      <div className="flex items-start gap-2 rounded-input border border-teal/40 bg-teal/5 px-3.5 py-3">
        <Check size={18} className="mt-0.5 shrink-0 text-teal" />
        <div className="min-w-0">
          <p className="font-accent text-sm font-semibold text-teal">
            {applied.code} applied
          </p>
          <p className="text-xs text-ink-soft">
            You saved on this order. Discount shown below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end gap-2">
        <Input
          label="Have a coupon?"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          leftIcon={<Tag size={16} />}
          className="uppercase"
          aria-label="Coupon code"
        />
        <Button variant="outline" onClick={handleApply} className="h-[50px] shrink-0">
          Apply
        </Button>
      </div>
      <p className="mt-1.5 text-xs text-ink-mute">
        Try <span className="font-semibold text-gold-dark">FESTIVE20</span> or{' '}
        <span className="font-semibold text-gold-dark">WELCOME10</span>
      </p>
    </div>
  );
}
