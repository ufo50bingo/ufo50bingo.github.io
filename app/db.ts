import Dexie, { type EntityTable } from 'dexie';

interface AttemptRow {
  id: number,
  goal: string,
  startTime: number,
  duration: number,
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

export type { AttemptRow };
export { db };