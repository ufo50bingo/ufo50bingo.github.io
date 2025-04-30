'use client';

import { useState } from 'react';
import { Container, Stack } from '@mantine/core';
import AllAttempts from './AllAttempts';
import Goal from './Goal';
import { RAW_GOALS, TGoal } from './goals';
import useSelectedGoals from './useSelectedGoals';

type Props = {
  getRandomGoal: () => string;
  goal: string;
  setGoal: (goal: string) => void;
};

export default function Practice({ getRandomGoal, goal, setGoal }: Props) {
  return (
    <Container my="md">
      <Stack>
        <Goal key={goal} goal={goal} onNext={() => setGoal(getRandomGoal())} />
        <AllAttempts onRetryGoal={(newGoal) => setGoal(newGoal)} />
      </Stack>
    </Container>
  );
}
