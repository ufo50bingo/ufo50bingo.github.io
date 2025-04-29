'use client';

import { useState } from 'react';
import { Container, Stack } from '@mantine/core';
import AllAttempts from './AllAttempts';
import getRandomGoal from './getRandomGoal';
import Goal from './Goal';
import { RAW_GOALS, TGoal } from './goals';
import useSelectedGoals from './useSelectedGoals';

type Props = {
  goal: string;
  setGoal: (goal: string) => void;
};

export default function Practice({ goal, setGoal }: Props) {
  const selectedGoals = useSelectedGoals();
  return (
    <Container my="md">
      <Stack>
        <Goal key={goal} goal={goal} onNext={() => setGoal(getRandomGoal(selectedGoals))} />
        <AllAttempts onRetryGoal={(newGoal) => setGoal(newGoal)} />
      </Stack>
    </Container>
  );
}
