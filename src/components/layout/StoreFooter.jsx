import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import Container from '../ui/Container';
import Logo from '../ui/Logo';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { BRAND, FOOTER_LINKS, SOCIAL_LINKS } from '../../constants/brand';
import { useToast } from '../../context/ToastContext';

export default function StoreFooter() {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    addToast('Thanks for subscribing to Wornora!', 'success');
    setEmail('');
  };

  return (
    <footer className="mt-auto bg-ink text-cream/80">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-maroon to-[#6e1414]">
        <Container className="grid gap-6 py-10 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="font-heading text-2xl text-cream">Join the Wornora family</h3>
            <p className="mt-1 text-sm text-cream/80">
              Be the first to know about new drops, festive edits & exclusive offers.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2 md:ml-auto">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-11 w-full rounded-btn border border-white/20 bg-white/10 px-4 text-sm text-cream placeholder:text-cream/60 focus:border-gold focus:outline-none"
            />
            <Button type="submit" variant="primary">Subscribe</Button>
          </form>
        </Container>
      </div>

      {/* Main */}
      <Container className="grid grid-cols-2 gap-8 py-14 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-2">
          <Logo size="md" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">{BRAND.description}</p>
          <ul className="mt-5 space-y-2 text-sm text-cream/70">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-gold" /> {BRAND.addressLine}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="shrink-0 text-gold" /> {BRAND.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="shrink-0 text-gold" /> {BRAND.email}
            </li>
          </ul>
        </div>

        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-accent text-sm font-semibold uppercase tracking-wider text-cream">{title}</h4>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-cream/70 transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-cream/60">
            © {BRAND.year} {BRAND.name} · {BRAND.tagline}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream transition-colors hover:bg-gold hover:text-ink"
              >
                <Icon name={social.icon} size={16} />
              </a>
            ))}
          </div>
          <p className="text-xs text-cream/60">Secure payments · UPI · Cards · COD</p>
        </Container>
      </div>
    </footer>
  );
}
