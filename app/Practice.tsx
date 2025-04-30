'use client';

import { Container, Stack } from '@mantine/core';
import AllAttempts from './AllAttempts';
import { AttemptRow } from './db';
import Goal from './Goal';
import { GoalStats } from './useGoalStats';

type Props = {
  attempts: AttemptRow[];
  goalStats: Map<string, GoalStats>;
  getRandomGoal: () => string;
  goal: string;
  setGoal: (goal: string) => void;
};

export default function Practice({ attempts, goalStats, getRandomGoal, goal, setGoal }: Props) {
  return (
    <Container my="md">
      <Stack>
        <Goal key={goal} goal={goal} onNext={() => setGoal(getRandomGoal())} />
        <AllAttempts
          attempts={attempts}
          goalStats={goalStats}
          onRetryGoal={(newGoal) => setGoal(newGoal)}
        />
      </Stack>
    </Container>
  );
}
