import { useToast } from '../context/ToastContext';
import successIcon from '../assets/icons/success.svg';
import errorIcon from '../assets/icons/error.svg';
import warningIcon from '../assets/icons/warning.svg';
import infoIcon from '../assets/icons/info.svg';

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

const icons = {
  success: successIcon,
  error: errorIcon,
  warning: warningIcon,
  info: infoIcon,
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm animate-slide-in ${colors[toast.type]}`}
        >
          <img src={icons[toast.type]} alt={toast.type} className="w-5 h-5 invert" />
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/80 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}