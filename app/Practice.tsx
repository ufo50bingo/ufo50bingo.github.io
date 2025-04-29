'use client';

import { useState } from 'react';
import { Container, Stack } from '@mantine/core';
import AllAttempts from './AllAttempts';
import Goal from './Goal';
import { RAW_GOALS, TGoal } from './goals';
import useSelectedGoals from './useSelectedGoals';

function getRandomGoal(goals: Set<string>): string {
  const items = Array.from(goals);
  return items[Math.floor(Math.random() * items.length)];
}

export default function Practice() {
  const selectedGoals = useSelectedGoals();
  const [goal, setGoal] = useState(getRandomGoal(selectedGoals));
  return (
    <Container my="md">
      <Stack>
        <Goal key={goal} goal={goal} onNext={() => setGoal(getRandomGoal(selectedGoals))} />
        <AllAttempts onRetryGoal={(newGoal) => setGoal(newGoal)} />
      </Stack>
    </Container>
  );
}
