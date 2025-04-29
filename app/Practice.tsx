'use client';

import { useState } from 'react';
import { Container, Stack } from '@mantine/core';
import AllAttempts from './AllAttempts';
import Goal from './Goal';
import { RAW_GOALS, TGoal } from './goals';

function getRandomGoal(): TGoal {
  const groupIdx = Math.floor(Math.random() * RAW_GOALS.length);
  const group = RAW_GOALS[groupIdx];
  const goalIdx = Math.floor(Math.random() * group.length);
  return group[goalIdx];
}

export default function Practice() {
  const [goal, setGoal] = useState(getRandomGoal().name);
  return (
    <Container my="md">
      <Stack>
        <Goal key={goal} goal={goal} onNext={() => setGoal(getRandomGoal().name)} />
        <AllAttempts onRetryGoal={(newGoal) => setGoal(newGoal)} />
      </Stack>
    </Container>
  );
}
