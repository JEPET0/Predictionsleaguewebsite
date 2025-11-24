// Contestant data structure with photos
import guillePhoto from '../assets/guille.png';
import crespoPhoto from '../assets/crespo.png';
import cristinaPhoto from '../assets/cristina.png';
import teyouPhoto from '../assets/teyou.png';
import oliviaPhoto from '../assets/olivia.png';
import claudiaPhoto from '../assets/claudia.png';
import tinhoPhoto from '../assets/tinho.png';
import guilloPhoto from '../assets/guillo.png';

export interface Contestant {
  name: string;
  photo?: string;
}

// Contestants with their photos
export const CONTESTANTS: Contestant[] = [
  { name: "Teyou", photo: teyouPhoto },
  { name: "Cristina", photo: cristinaPhoto },
  { name: "Guillo", photo: guilloPhoto },
  { name: "Guille", photo: guillePhoto },
  { name: "Olivia", photo: oliviaPhoto },
  { name: "Crespo", photo: crespoPhoto },
  { name: "Claudia", photo: claudiaPhoto },
  { name: "Tinho", photo: tinhoPhoto },
  // More contestants will be added here
];

// Helper to get contestant by name
export const getContestantByName = (name: string): Contestant | undefined => {
  return CONTESTANTS.find(c => c.name === name);
};

// Helper to get all contestant names (for backward compatibility)
export const getContestantNames = (): string[] => {
  return CONTESTANTS.map(c => c.name);
};
