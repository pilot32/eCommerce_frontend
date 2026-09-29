import { USPS } from '../../constants/brand';
import Section from '../ui/Section';
import Icon from '../ui/Icon';

/**
 * Warm feature strip of the brand USPs — each shown as a gold-glow icon medallion
 * with a title and short description.
 */
export default function WhyShopWithUs() {
  return (
    <Section
      eyebrow="The Wornora Promise"
      title="Why Shop With Us"
      center
      className="bg-beige"
    >
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {USPS.map((usp) => (
          <li key={usp.title} className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-glow text-gold-dark shadow-soft">
              <Icon name={usp.icon} size={28} />
            </span>
            <h3 className="mt-5 font-heading text-lg text-ink">{usp.title}</h3>
            <p className="mt-2 max-w-xs text-sm text-ink-soft">{usp.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
