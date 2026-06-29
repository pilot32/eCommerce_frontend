import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Star } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import EmptyState from '../ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import { SAMPLE_ADDRESSES } from '../../constants/sampleData';

const EMPTY_FORM = {
  label: '',
  name: '',
  phone: '',
  line: '',
  city: '',
  state: '',
  pincode: '',
};

let tempId = 0;

/**
 * Saved-address book. State is seeded from sample data and managed locally
 * (add / edit / delete / set-default) — no backend; each action toasts.
 */
export default function AddressManager() {
  const { addToast } = useToast();
  const [addresses, setAddresses] = useState(SAMPLE_ADDRESSES);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (address) => {
    setEditingId(address.id);
    const { id, isDefault, ...fields } = address;
    setForm(fields);
    setOpen(true);
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    addToast('Address removed', 'info');
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    addToast('Default address updated', 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...form } : a))
      );
      addToast('Address updated', 'success');
    } else {
      const newAddress = {
        ...form,
        id: `addr-new-${++tempId}`,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddress]);
      addToast('Address added', 'success');
    }
    setOpen(false);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-heading text-2xl text-ink">Saved Addresses</h2>
        <Button size="sm" leftIcon={<Plus size={16} />} onClick={openAdd}>
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon="MapPin"
          title="No saved addresses"
          description="Add a delivery address to make checkout faster."
          actionLabel="Add New Address"
          onAction={openAdd}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className="flex flex-col p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-glow text-gold-dark">
                  <MapPin size={16} />
                </span>
                <h3 className="font-heading text-lg text-ink">{address.label}</h3>
                {address.isDefault && <Badge variant="gold">Default</Badge>}
              </div>

              <div className="flex-1 text-sm text-ink-soft">
                <p className="font-medium text-ink">{address.name}</p>
                <p className="mt-1">{address.line}</p>
                <p>
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="mt-1 text-ink-mute">{address.phone}</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-sand/70 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Pencil size={14} />}
                  onClick={() => openEdit(address)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => handleDelete(address.id)}
                >
                  Delete
                </Button>
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Star size={14} />}
                    onClick={() => handleSetDefault(address.id)}
                    className="ml-auto"
                  >
                    Set Default
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? 'Edit Address' : 'Add New Address'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="address-form">
              {editingId ? 'Save Changes' : 'Add Address'}
            </Button>
          </div>
        }
      >
        <form id="address-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Label"
            value={form.label}
            onChange={handleChange('label')}
            placeholder="Home, Work…"
            required
          />
          <Input
            label="Full Name"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Recipient name"
            required
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder="+91 00000 00000"
            required
          />
          <Input
            label="Address Line"
            value={form.line}
            onChange={handleChange('line')}
            placeholder="House no., street, area"
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="City"
              value={form.city}
              onChange={handleChange('city')}
              placeholder="City"
              required
            />
            <Input
              label="State"
              value={form.state}
              onChange={handleChange('state')}
              placeholder="State"
              required
            />
          </div>
          <Input
            label="Pincode"
            value={form.pincode}
            onChange={handleChange('pincode')}
            placeholder="000000"
            required
          />
        </form>
      </Modal>
    </div>
  );
}
