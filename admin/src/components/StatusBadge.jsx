const statusColors = {
  pending: { bg: '#fff3cd', color: '#856404' },
  paid: { bg: '#d4edda', color: '#155724' },
  shipped: { bg: '#cce5ff', color: '#004085' },
  delivered: { bg: '#d1e7dd', color: '#0f5132' },
  cancelled: { bg: '#f8d7da', color: '#721c24' },
};

export default function StatusBadge({ status }) {
  const style = statusColors[status] || statusColors.pending;
  return (
    <span className="status-badge" style={{ background: style.bg, color: style.color }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
