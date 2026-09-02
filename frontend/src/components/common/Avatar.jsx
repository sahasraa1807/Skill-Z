function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

const COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500',
  'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500'
];

function colorForName(name) {
  if (!name) return COLORS[0];
  const idx = name.charCodeAt(0) % COLORS.length;
  return COLORS[idx];
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl'
};

export default function Avatar({ name, src, user, size = 'md', className = '' }) {
  const displayName = name || user?.name || user?.username || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '');
  const displaySrc = src || user?.avatarUrl;

  if (displaySrc) {
    return (
      <img
        src={displaySrc}
        alt={displayName}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
      />
    );
  }
  return (
    <div className={`rounded-full flex items-center justify-center text-white font-semibold ${colorForName(displayName)} ${sizes[size]} ${className}`}>
      {getInitials(displayName)}
    </div>
  );
}
