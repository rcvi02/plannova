import * as LucideIcons from 'lucide-react';

export default function IconRenderer({ name, size = 16, className, style }) {
  const IconComponent = LucideIcons[name] || LucideIcons.Book;
  return <IconComponent size={size} className={className} style={style} />;
}
