import { ContestantCard } from './ContestantCard';
import { Contestant } from '../utils/contestants';

interface ContestantSelectorProps {
  contestants: Contestant[];
  selectedName?: string;
  onSelect: (name: string) => void;
  mode?: 'single' | 'multiple';
  selectedNames?: string[];
  maxSelections?: number;
}

export function ContestantSelector({ 
  contestants, 
  selectedName,
  selectedNames = [],
  onSelect,
  mode = 'single',
  maxSelections
}: ContestantSelectorProps) {
  const isSelected = (name: string) => {
    if (mode === 'single') {
      return selectedName === name;
    }
    return selectedNames.includes(name);
  };

  const handleClick = (name: string) => {
    if (mode === 'multiple' && maxSelections && selectedNames.length >= maxSelections && !isSelected(name)) {
      return; // Don't allow more selections
    }
    onSelect(name);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {contestants.map((contestant) => (
        <ContestantCard
          key={contestant.name}
          name={contestant.name}
          photo={contestant.photo}
          selected={isSelected(contestant.name)}
          onClick={() => handleClick(contestant.name)}
          size="md"
        />
      ))}
    </div>
  );
}
