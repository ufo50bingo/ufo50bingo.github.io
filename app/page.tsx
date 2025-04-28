'use client';

import { useState } from 'react';
import { IconDeviceGamepad, IconSettings } from '@tabler/icons-react';
import { Container, Stack, Tabs } from '@mantine/core';
import AllAttempts from './AllAttempts';
import Goal from './Goal';
import { GOALS, TGoal } from './goals';
import Practice from './Practice';
import Settings from './Settings';

function getRandomGoal(): TGoal {
  const groupIdx = Math.floor(Math.random() * GOALS.length);
  const group = GOALS[groupIdx];
  const goalIdx = Math.floor(Math.random() * group.length);
  return group[goalIdx];
}

export default function HomePage() {
  return (
    <Tabs defaultValue="practice">
      <Tabs.List>
        <Tabs.Tab value="practice" leftSection={<IconDeviceGamepad size={12} />}>
          Practice
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings size={12} />}>
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="practice">
        <Practice />
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Settings />
      </Tabs.Panel>
    </Tabs>
  );
}
