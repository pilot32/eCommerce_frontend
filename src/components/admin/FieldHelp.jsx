import { useId, useState } from 'react';
export default function FieldHelp({ label, children }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <span className="relative inline-block ml-2 align-middle">
    <button type="button" aria-label={`About ${label}`} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }} className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-blue-300 text-xs font-bold text-blue-700 hover:bg-blue-50 focus-visible:outline-2">i</button>
    {open && <span id={id} className="absolute left-0 top-7 z-20 block w-56 rounded-lg border border-blue-100 bg-white p-3 text-left text-xs font-normal leading-relaxed text-gray-700 shadow-lg">{children}</span>}
  </span>;
}
