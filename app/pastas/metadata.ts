import { BLITZ } from './blitz';
import { NOZZLO } from './nozzlo';
import { SPICY } from './spicy';
import { STANDARD } from './standard';

export const METADATA = [
  {
    name: 'Standard',
    update_time: 1754538492,
    pasta: STANDARD,
  },
  {
    name: 'Blitz',
    update_time: 1754538492,
    pasta: BLITZ,
  },
  {
    name: 'Spicy',
    update_time: 1754538492,
    pasta: SPICY,
  },
  {
    name: 'Nozzlo',
    update_time: 1754538492,
    pasta: NOZZLO,
  },
] as const;
