import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ChevronDown } from 'lucide-react';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Breadcrumb from '../components/ui/Breadcrumb';
import { useToast } from '../context/ToastContext';
import { BRAND, SOCIAL_LINKS } from '../constants/brand';

/**
 * Contact — intro + contact details / business hours / socials on the left,
 * an accessible contact form on the right, and a small FAQ accordion below.
 * Renders inside StoreLayout (content only).
 */

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: 'Visit us',
    value: BRAND.addressLine,
  },
  {
    icon: Phone,
    label: 'Call us',
    value: BRAND.phone,
    href: `tel:${BRAND.phone.replace(/\s+/g, '')}`,
  },
  {
    icon: Mail,
    label: 'Email us',
    value: BRAND.email,
    href: `mailto:${BRAND.email}`,
  },
];

const BUSINESS_HOURS = [
  { day: 'Monday – Friday', hours: '10:00 AM – 8:00 PM' },
  { day: 'Saturday', hours: '10:00 AM – 6:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Orders are dispatched within 1–2 business days and typically arrive within 4–7 days across India. You will receive tracking details by email and SMS.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer easy 7-day returns and exchange on most items. Pieces should be unworn with original tags. Made-to-order items may have different terms.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Currently we ship across India. International shipping is coming soon — write to us and we will let you know the moment it goes live.',
  },
  {
    q: 'How do I choose the right size?',
    a: 'Each product page includes a detailed size guide with measurements. If you are between sizes or need help, reach out and our team will gladly assist.',
  },
];

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const { addToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Thanks! We will get back to you soon.', 'success');
    setForm(EMPTY_FORM);
  };

  return (
    <div className="animate-fade-in">
      <Container className="pt-8 sm:pt-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
      </Container>

      <Section
        eyebrow="We’d Love to Hear From You"
        title="Get in touch"
        subtitle="Questions about an order, sizing or our craft? Our care team is here to help — reach out and we’ll respond with warmth and care."
      >
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Left — details, hours, socials */}
          <div className="space-y-6 lg:col-span-2">
            <ul className="space-y-4">
              {CONTACT_DETAILS.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <li key={item.label}>
                    <Card className="flex items-start gap-4 p-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-glow text-gold-dark">
                        <ItemIcon size={20} strokeWidth={1.7} />
                      </span>
                      <div>
                        <p className="font-accent text-xs uppercase tracking-[0.14em] text-ink-mute">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-1 block text-ink transition-colors hover:text-gold-dark"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1 text-ink">{item.value}</p>
                        )}
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>

            {/* Business hours */}
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2.5 text-ink">
                <Clock size={18} className="text-gold-dark" strokeWidth={1.7} />
                <h2 className="font-heading text-lg">Business Hours</h2>
              </div>
              <ul className="space-y-2 text-sm">
                {BUSINESS_HOURS.map((row) => (
                  <li key={row.day} className="flex justify-between gap-4">
                    <span className="text-ink-soft">{row.day}</span>
                    <span className="font-medium text-ink">{row.hours}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Socials */}
            <div>
              <h2 className="mb-3 font-accent text-xs uppercase tracking-[0.18em] text-gold-dark">
                Follow our journey
              </h2>
              <nav aria-label="Social media" className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-sand bg-cream text-ink-soft transition-colors hover:border-gold hover:text-gold-dark"
                  >
                    <Icon name={social.icon} size={20} strokeWidth={1.7} />
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="lg:col-span-3">
            <Card className="p-6 sm:p-8">
              <h2 className="font-heading text-2xl text-ink">Send us a message</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Fill in the form below and we’ll be in touch shortly.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Name"
                    id="contact-name"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange('name')}
                    autoComplete="name"
                    required
                  />
                  <Input
                    label="Email"
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    autoComplete="email"
                    required
                  />
                </div>

                <Input
                  label="Subject"
                  id="contact-subject"
                  name="subject"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={handleChange('subject')}
                  required
                />

                <div className="w-full">
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block font-accent text-sm font-medium text-ink-soft"
                  >
                    Message
                    <span className="text-maroon"> *</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Tell us a little more…"
                    value={form.message}
                    onChange={handleChange('message')}
                    required
                    className="w-full resize-y rounded-input border border-sand bg-cream px-4 py-3 text-ink placeholder:text-ink-mute transition-colors duration-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  rightIcon={<Send size={18} />}
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Section>

      {/* FAQ accordion */}
      <div className="bg-heritage">
        <Section
          eyebrow="Good to Know"
          title="Frequently asked questions"
          center
        >
          <ul className="mx-auto max-w-3xl space-y-3">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              const panelId = `faq-panel-${i}`;
              const btnId = `faq-button-${i}`;
              return (
                <li key={faq.q}>
                  <Card className="overflow-hidden">
                    <h3>
                      <button
                        type="button"
                        id={btnId}
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setOpenFaq(open ? -1 : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-accent font-medium text-ink transition-colors hover:text-gold-dark"
                      >
                        {faq.q}
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-gold-dark transition-transform duration-200 ${
                            open ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </h3>
                    {open && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        className="animate-fade-in px-5 pb-5 text-sm text-ink-soft"
                      >
                        {faq.a}
                      </div>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>
      </div>
    </div>
  );
}
