import adillaPhoto from '../assets/team/adilla.jpeg';
import douglasPhoto from '../assets/team/douglas.jpeg';
import eduardoPhoto from '../assets/team/eduardo.jpeg';
import jaldsonPhoto from '../assets/team/jaldson.jpeg';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
};

export const team: TeamMember[] = [
  {
    id: 'douglas-phelipe',
    name: 'Douglas Phelipe',
    role: 'Desenvolvedor',
    photoUrl: douglasPhoto,
  },
  {
    id: 'jaldson-arthur',
    name: 'Jaldson Arthur',
    role: 'Desenvolvedor',
    photoUrl: jaldsonPhoto,
  },
  {
    id: 'marcilio',
    name: 'Marcílio',
    role: 'Desenvolvedor',
    photoUrl:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcilio&backgroundColor=e8ded8',
  },
  {
    id: 'maria-adilla',
    name: 'Maria Ádilla',
    role: 'Desenvolvedora',
    photoUrl: adillaPhoto,
  },
  {
    id: 'luiz-eduardo',
    name: 'Luiz Eduardo',
    role: 'Desenvolvedor',
    photoUrl: eduardoPhoto,
  },
];