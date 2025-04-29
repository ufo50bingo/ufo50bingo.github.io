'use client';

import { IconDeviceGamepad, IconFilter, IconSettings } from '@tabler/icons-react';
import { Tabs } from '@mantine/core';
import GoalSelection from './GoalSelection';
import Practice from './Practice';
import Settings from './Settings';

export default function HomePage() {
  return (
    <Tabs defaultValue="practice">
      <Tabs.List>
        <Tabs.Tab value="practice" leftSection={<IconDeviceGamepad size={12} />}>
          Practice
        </Tabs.Tab>
        <Tabs.Tab value="goalSelection" leftSection={<IconFilter size={12} />}>
          Goal Selection
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings size={12} />}>
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="practice">
        <Practice />
      </Tabs.Panel>
      <Tabs.Panel value="goalSelection">
        <GoalSelection />
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Settings />
      </Tabs.Panel>
    </Tabs>
  );
}
