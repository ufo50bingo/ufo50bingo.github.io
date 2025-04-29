import Dexie, { type EntityTable } from 'dexie';

interface Attempt {
  goal: string,
  startTime: number,
  duration: number,
}

interface AttemptRow extends Attempt {
  id: number,
}

const db = new Dexie('UFO50BingoDatabase') as Dexie & {
  attempts: EntityTable<
  AttemptRow,
    'id'
  >;
};

db.version(1).stores({
  attempts: '++id, goal, startTime, duration',
});

export type { Attempt, AttemptRow };
export { db };