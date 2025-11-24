import luciaPhoto from 'figma:asset/ede7be8d9ed69ee2ca87627d3dec480bcab3e0c0.png';
import teyouPhoto from 'figma:asset/4be78cb833af0def95a9d869d925fad3b15fcc3e.png';
import cristinaPhoto from 'figma:asset/33ae26d283ec8d6f2ae53aad8e0dc5edf6b93d6f.png';
import mariaCruzPhoto from 'figma:asset/34c0fafdbce8586ab743502f8126ea51b47e1200.png';
import guilloPhoto from 'figma:asset/ee752b74db9c99858a81a4d09cca6b7369a80ccb.png';
import guillePhoto from 'figma:asset/532a73c5af72d46f8dfad59ba1e2ecb9453e7f11.png';
import oliviaPhoto from 'figma:asset/93bdfc35e8d1d1929b56544e6b85b688cc220a4b.png';
import crespoPhoto from 'figma:asset/e59d4a4aae78709347e935856f71671580f7daa0.png';
import claudiaPhoto from 'figma:asset/a44b80dc9571b827cfd1b3659738dd046d34cbeb.png';
import tinhoPhoto from 'figma:asset/a9a127268c4cea496374880cbb8fd0832609b14c.png';

// Contestant data structure with photos
export interface Contestant {
  name: string;
  photo: string;
}

// Contestants with their photos
export const CONTESTANTS: Contestant[] = [
  { name: "Lucía", photo: luciaPhoto },
  { name: "Teyou", photo: teyouPhoto },
  { name: "Cristina", photo: cristinaPhoto },
  { name: "María Cruz", photo: mariaCruzPhoto },
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
