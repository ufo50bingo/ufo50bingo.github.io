import { RAW_GOALS } from './rawGoals';

export const ORDERED_GAMES = [
  'barbuta',
  'bughunter',
  'ninpek',
  'paintchase',
  'magicgarden',
  'mortol',
  'velgress',
  'planetzoldath',
  'attactics',
  'devilition',
  'kickclub',
  'avianos',
  'mooncat',
  'bushidoball',
  'blockkoala',
  'camouflage',
  'campanella',
  'golfaria',
  'thebigbellrace',
  'warptank',
  'waldorfsjourney',
  'porgy',
  'oniondelivery',
  'caramelcaramel',
  'partyhouse',
  'hotfoot',
  'divers',
  'railheist',
  'vainger',
  'rockonisland',
  'pingolf',
  'mortolii',
  'fisthell',
  'overbold',
  'campanella2',
  'hypercontender',
  'valbrace',
  'rakshasa',
  'starwaspir',
  'grimstone',
  'lordsofdiskonia',
  'nightmanor',
  'elfazarshat',
  'pilotquest',
  'miniandmax',
  'combatants',
  'quibblerace',
  'seasidedrive',
  'campanella3',
  'cyberowls',
  'general',
] as const;
export type Game = (typeof ORDERED_GAMES)[number];

export const ORDERED_DIFFICULTY = ['easy', 'medium', 'hard', 'veryhard', 'general'] as const;
export type Difficulty = (typeof ORDERED_DIFFICULTY)[number];

export type GoalName = (typeof RAW_GOALS)[number][number]['name'];

export type TGoal = {
  readonly name: GoalName;
  readonly types: readonly [Game, Difficulty];
};

// this also verifies that all Game and Difficulty options are consistent between the ordered
// arrays in this file and the values in RAW_GOALS
export const SORTED_FLAT_GOALS: ReadonlyArray<TGoal> = RAW_GOALS.flat().toSorted((a, b) => {
  const gameDiff = ORDERED_GAMES.indexOf(a.types[0]) - ORDERED_GAMES.indexOf(b.types[0]);
  if (gameDiff !== 0) {
    return gameDiff;
  }
  const difficultyDiff = compareByDifficulty(a, b);
  if (difficultyDiff != 0) {
    return difficultyDiff;
  }
  return a.name.localeCompare(b.name);
});

export function compareByDifficulty(a: TGoal, b: TGoal): number {
  return ORDERED_DIFFICULTY.indexOf(a.types[1]) - ORDERED_DIFFICULTY.indexOf(b.types[1]);
}
