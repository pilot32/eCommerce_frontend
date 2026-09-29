import { ArrowRight } from 'lucide-react';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import SmartImage from '../components/ui/SmartImage';
import Icon from '../components/ui/Icon';
import Breadcrumb from '../components/ui/Breadcrumb';
import { BRAND, USPS } from '../constants/brand';

/**
 * About — the Wornora brand-story page. Renders inside StoreLayout (content only).
 * Hero band → the story → values grid → artisans → closing CTA.
 */

// A few "by the numbers" highlights to lend the story warmth and credibility.
const STORY_STATS = [
  { value: '500+', label: 'Artisan partners' },
  { value: '25+', label: 'Craft clusters' },
  { value: '50k+', label: 'Happy women' },
  { value: '100%', label: 'Handcrafted' },
];

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Hero band */}
      <section className="relative">
        <SmartImage
          src="https://loremflickr.com/1600/720/indian,textile,artisan?lock=21"
          alt="Indian artisans working with vibrant handwoven textiles"
          className="h-[58vh] min-h-[420px] w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/20" />
        <Container className="absolute inset-0 flex flex-col justify-end pb-12 sm:pb-16">
          <Breadcrumb
            items={[{ label: 'Home', to: '/' }, { label: 'About' }]}
            className="mb-5 text-cream/70 [&_a]:text-cream/80"
          />
          <p className="mb-3 font-accent text-xs uppercase tracking-[0.22em] text-gold-light">
            Our Story
          </p>
          <h1 className="max-w-3xl font-heading text-4xl text-cream sm:text-5xl lg:text-6xl">
            Crafted in India, worn with pride
          </h1>
          <p className="mt-4 max-w-xl text-base text-cream/85 sm:text-lg">
            {BRAND.tagline} — {BRAND.description}
          </p>
        </Container>
      </section>

      {/* The Wornora story */}
      <Section
        eyebrow="The Wornora Story"
        title="Where heritage meets the everyday"
        subtitle="We began with a simple belief — that the timeless beauty of Indian craftsmanship deserves a place in every modern wardrobe."
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5 text-ink-soft">
            <p>
              Wornora was born from a love letter to desi heritage — to the
              handloom weaver in Banaras, the block printer in Bagru, the
              meenakari jeweller in Jaipur whose hands carry centuries of
              wisdom. Every saree, lehenga, kurti and ornament we offer is a
              small celebration of that living legacy.
            </p>
            <p>
              We work shoulder to shoulder with artisan families across India,
              honouring traditional techniques while shaping silhouettes that
              feel effortless today. The result is clothing and jewellery you
              reach for on festive mornings and quiet evenings alike —
              heirlooms in the making.
            </p>
            <p>
              When you wear Wornora, you carry a story: of slow craft, of fair
              partnerships, and of women who feel beautifully, unapologetically
              themselves.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STORY_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-heading text-3xl text-gold-dark sm:text-4xl">
                    {stat.value}
                  </dd>
                  <p className="mt-1 font-accent text-xs uppercase tracking-[0.12em] text-ink-mute">
                    {stat.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SmartImage
              src="https://loremflickr.com/600/760/saree,textile?lock=22"
              alt="Handwoven saree in rich festive colours"
              className="aspect-[4/5] rounded-image shadow-card"
            />
            <SmartImage
              src="https://loremflickr.com/600/760/indian,jewellery?lock=23"
              alt="Traditional Indian gold jewellery, intricately detailed"
              className="mt-8 aspect-[4/5] rounded-image shadow-card"
            />
          </div>
        </div>
      </Section>

      {/* Values / why Wornora */}
      <div className="bg-heritage">
        <Section
          eyebrow="What We Believe"
          title="The Wornora promise"
          subtitle="A few quiet commitments that guide everything we make and ship."
          center
        >
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {USPS.map((usp) => (
              <li
                key={usp.title}
                className="rounded-card border border-sand/60 bg-cream/80 p-6 text-center shadow-soft backdrop-blur-sm"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-glow text-gold-dark">
                  <Icon name={usp.icon} size={26} strokeWidth={1.6} />
                </div>
                <h3 className="font-heading text-lg text-ink">{usp.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{usp.description}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Our artisans */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <SmartImage
              src="https://loremflickr.com/900/620/artisan,handloom,indian?lock=24"
              alt="An Indian artisan weaving fabric on a traditional handloom"
              className="aspect-[3/2] rounded-image shadow-lift"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-2 font-accent text-xs uppercase tracking-[0.22em] text-gold-dark">
              Our Artisans
            </p>
            <h2 className="font-heading text-3xl text-ink sm:text-4xl">
              The hands behind every piece
            </h2>
            <div className="rule-gold mt-4 w-24" />
            <div className="mt-5 space-y-4 text-ink-soft">
              <p>
                Behind every Wornora creation is a master craftsperson — often
                the latest in a long line of weavers, dyers and metalsmiths.
                We partner directly with these makers, ensuring fair wages,
                safe workspaces and the dignity their artistry deserves.
              </p>
              <p>
                By choosing handcrafted, you help keep these endangered crafts
                alive and thriving for the next generation. That is the kind of
                fashion we are proud to wear.
              </p>
            </div>
            <Button
              to="/about"
              variant="outline"
              className="mt-6"
              rightIcon={<ArrowRight size={18} />}
            >
              Meet our makers
            </Button>
          </div>
        </div>
      </Section>

      {/* Closing CTA */}
      <section className="pb-14 sm:pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-card bg-maroon px-6 py-14 text-center text-cream shadow-card sm:px-12 sm:py-20">
            <p className="mb-3 font-accent text-xs uppercase tracking-[0.22em] text-gold-light">
              Begin Your Story
            </p>
            <h2 className="mx-auto max-w-2xl font-heading text-3xl sm:text-4xl">
              Discover pieces made to be treasured
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-cream/85">
              Explore our handcrafted edit of sarees, lehengas, kurtis and
              heirloom jewellery — and find the one that feels like you.
            </p>
            <Button
              to="/shop"
              variant="primary"
              size="lg"
              className="mt-7"
              rightIcon={<ArrowRight size={18} />}
            >
              Explore the Collection
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
