import { useToast } from '../context/ToastContext';

export default function Toast() {
  const { toast } = useToast();

  return (
    <div className={`toast ${toast.visible ? 'show' : ''}`} id="toast">
      <div className="toast-dot"></div>
      <span>{toast.message}</span>
    </div>
  );
}
