import { ImageWithFallback } from './figma/ImageWithFallback';
import { User } from 'lucide-react';

interface ContestantCardProps {
  name: string;
  photo?: string;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function ContestantCard({ 
  name, 
  photo, 
  selected = false, 
  onClick,
  size = 'md',
  showName = true 
}: ContestantCardProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div 
      className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${
        onClick ? 'hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
      <div 
        className={`${sizeClasses[size]} rounded-2xl overflow-hidden border-4 transition-all ${
          selected 
            ? 'border-pink-500 shadow-xl shadow-pink-300 scale-105' 
            : 'border-white/70 hover:border-pink-300'
        }`}
      >
        {photo ? (
          <ImageWithFallback
            src={photo}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <User className="w-8 h-8 text-slate-400" />
          </div>
        )}
      </div>
      {showName && (
        <span className={`${textSizeClasses[size]} text-center max-w-[100px] truncate ${
          selected ? 'text-pink-700 font-bold' : 'text-slate-700'
        }`}>
          {name}
        </span>
      )}
    </div>
  );
}
