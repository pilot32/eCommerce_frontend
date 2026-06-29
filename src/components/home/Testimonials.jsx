import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../constants/sampleData';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Rating from '../ui/Rating';

/**
 * Customer love — a responsive grid of testimonial cards, each with a star
 * rating, the quote, and the customer's name + location.
 */
export default function Testimonials() {
  return (
    <Section eyebrow="Loved By Many" title="What Our Customers Say" center className="bg-ivory">
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <li key={t.id}>
            <Card className="flex h-full flex-col p-6 sm:p-7">
              <Quote size={28} className="text-gold/60" aria-hidden="true" />
              <Rating value={t.rating} showValue={false} size={16} className="mt-4" />
              <blockquote className="mt-4 flex-1 text-ink-soft">
                <p className="leading-relaxed">{t.text}</p>
              </blockquote>
              <footer className="mt-6 border-t border-sand/70 pt-4">
                <p className="font-heading text-base text-ink">{t.name}</p>
                <p className="font-accent text-xs uppercase tracking-[0.16em] text-gold-dark">
                  {t.location}
                </p>
              </footer>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
