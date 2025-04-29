'use client';

import { useState } from 'react';
import { IconDeviceGamepad, IconFilter, IconSettings } from '@tabler/icons-react';
import { Tabs } from '@mantine/core';
import AllGoals from './AllGoals';
import getRandomGoal from './getRandomGoal';
import Practice from './Practice';
import Settings from './Settings';
import useSelectedGoals from './useSelectedGoals';

export default function HomePage() {
  const selectedGoals = useSelectedGoals();
  const [goal, setGoal] = useState(getRandomGoal(selectedGoals));

  const [activeTab, setActiveTab] = useState<string | null>('practice');
  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="practice" leftSection={<IconDeviceGamepad size={12} />}>
          Practice
        </Tabs.Tab>
        <Tabs.Tab value="allGoals" leftSection={<IconFilter size={12} />}>
          All Goals
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings size={12} />}>
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="practice">
        <Practice goal={goal} setGoal={(goal) => setGoal(goal)} />
      </Tabs.Panel>
      <Tabs.Panel value="allGoals">
        <AllGoals
          onTryGoal={(goal) => {
            setGoal(goal);
            setActiveTab('practice');
          }}
        />
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Settings />
      </Tabs.Panel>
    </Tabs>
  );
}
