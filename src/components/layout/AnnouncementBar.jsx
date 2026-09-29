import { useState, useEffect } from 'react';
import { Phone, Truck, RefreshCw } from 'lucide-react';
import Container from '../ui/Container';
import { ANNOUNCEMENTS, BRAND } from '../../constants/brand';

/**
 * Slim top bar: phone (left), a rotating promo message (center),
 * and delivery/returns reassurance (right).
 */
export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length),
      4200
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-maroon text-cream">
      <Container className="flex h-9 items-center justify-between text-xs">
        <a
          href={`tel:${BRAND.phone.replace(/\s/g, '')}`}
          className="hidden items-center gap-1.5 transition-colors hover:text-gold-light sm:flex"
        >
          <Phone size={13} /> {BRAND.phone}
        </a>

        <p
          key={index}
          className="mx-auto animate-fade-in font-accent tracking-wide sm:mx-0 sm:flex-1 sm:text-center"
        >
          {ANNOUNCEMENTS[index]}
        </p>

        <div className="hidden items-center gap-4 sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <Truck size={13} /> Free Delivery
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RefreshCw size={13} /> Easy Returns
          </span>
        </div>
      </Container>
    </div>
  );
}
