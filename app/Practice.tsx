'use client';

import { Dispatch, SetStateAction } from 'react';
import { Container, Stack } from '@mantine/core';
import AllAttempts from './AllAttempts';
import { AttemptRow } from './db';
import Goal from './Goal';
import { GoalStats } from './useGoalStats';

type Props = {
  attempts: AttemptRow[];
  goalStats: Map<string, GoalStats>;
  goToNextGoal: () => void;
  goal: string;
  queue: string[];
  setQueue: Dispatch<SetStateAction<string[]>>;
  setGoal: (goal: string) => void;
};

export default function Practice({
  attempts,
  goalStats,
  goToNextGoal,
  goal,
  queue,
  setQueue,
  setGoal,
}: Props) {
  return (
    <Container my="md">
      <Stack>
        <Goal key={goal} goal={goal} onNext={goToNextGoal} />
        <AllAttempts
          attempts={attempts}
          goalStats={goalStats}
          onRetryGoal={setGoal}
          queue={queue}
          setQueue={setQueue}
        />
      </Stack>
    </Container>
  );
}
