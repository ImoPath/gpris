interface StatusBadgeProps {
  status: 'needs-focus' | 'on-track' | 'on-target';
  text: string;
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
  const colors = {
    'needs-focus': 'bg-red-500',
    'on-track': 'bg-orange-500',
    'on-target': 'bg-green-600'
  };

  const labels = {
    'needs-focus': 'NEEDS FOCUS',
    'on-track': 'ON TRACK',
    'on-target': 'ON TARGET'
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      <span className={`${colors[status]} text-white text-xs font-bold px-3 py-1 rounded`}>
        {labels[status]}
      </span>
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
}
