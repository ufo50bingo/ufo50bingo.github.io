import Dexie, { type EntityTable } from 'dexie';

interface Attempt {
  goal: string;
  startTime: number;
  duration: number;
}

interface AttemptRow extends Attempt {
  id: number;
}

interface GoalSelectionRow {
  goal: string;
}

const db = new Dexie('UFO50BingoDatabase') as Dexie & {
  attempts: EntityTable<AttemptRow, 'id'>;
  unselectedGoals: EntityTable<GoalSelectionRow, 'goal'>;
};

db.version(1).stores({
  attempts: '++id, goal, startTime, duration',
  unselectedGoals: 'goal',
});

export type { Attempt, AttemptRow };
export { db };
