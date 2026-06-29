import { useState } from 'react';
import { Mail, Phone, CalendarDays, Pencil } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import SmartImage from '../ui/SmartImage';
import { useToast } from '../../context/ToastContext';

/** Build the initials shown when there is no avatar image. */
function initialsOf(name) {
  return String(name || 'W')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Profile summary card with an "Edit Profile" modal.
 * Editing is local-only (no backend) — Save toasts success and closes.
 */
export default function ProfileInfo({ user }) {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setOpen(false);
    addToast('Profile updated', 'success');
  };

  const details = [
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Phone, label: 'Phone', value: user?.phone },
    { icon: CalendarDays, label: 'Member since', value: user?.memberSince },
  ].filter((item) => item.value);

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24 shrink-0">
          {user?.avatar ? (
            <SmartImage
              src={user.avatar}
              alt={`${user?.name || 'Customer'} profile photo`}
              className="h-24 w-24 rounded-full"
              imgClassName="rounded-full"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gold-glow font-heading text-2xl text-gold-dark">
              {initialsOf(user?.name)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold-dark">
            My Account
          </p>
          <h2 className="mt-1 font-heading text-2xl text-ink sm:text-3xl">
            {user?.name || 'Welcome'}
          </h2>
          {user?.email && <p className="mt-1 text-ink-soft">{user.email}</p>}
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Pencil size={16} />}
          onClick={() => setOpen(true)}
          className="self-start"
        >
          Edit Profile
        </Button>
      </div>

      <dl className="mt-8 grid gap-4 border-t border-sand/70 pt-6 sm:grid-cols-2">
        {details.map(({ icon: DetailIcon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-glow text-gold-dark">
              <DetailIcon size={18} />
            </span>
            <div className="min-w-0">
              <dt className="font-accent text-xs uppercase tracking-[0.15em] text-ink-mute">
                {label}
              </dt>
              <dd className="mt-0.5 truncate text-ink">{value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Profile"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="edit-profile-form">
              Save Changes
            </Button>
          </div>
        }
      >
        <form id="edit-profile-form" onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Your name"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="you@email.com"
            required
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder="+91 00000 00000"
          />
        </form>
      </Modal>
    </Card>
  );
}
