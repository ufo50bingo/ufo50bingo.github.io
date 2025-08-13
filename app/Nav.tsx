'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  IconBorderAll,
  IconDeviceGamepad,
  IconFilter,
  IconPlaylistAdd,
  IconScript,
  IconSettings,
  IconVs,
} from '@tabler/icons-react';
import { Tabs } from '@mantine/core';

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Tabs value={pathname} onChange={(value) => router.push(value ?? '/')}>
      <Tabs.List>
        <Tabs.Tab value="/" leftSection={<IconVs size={12} />}>
          Create Board
        </Tabs.Tab>
        <Tabs.Tab value="/resources" leftSection={<IconScript size={12} />}>
          Resources
        </Tabs.Tab>
        <Tabs.Tab value="/practice" leftSection={<IconDeviceGamepad size={12} />}>
          Practice
        </Tabs.Tab>
        <Tabs.Tab value="/goals" leftSection={<IconFilter size={12} />}>
          All Goals
        </Tabs.Tab>
        <Tabs.Tab value="/playlist" leftSection={<IconPlaylistAdd size={12} />}>
          Playlist
        </Tabs.Tab>
        <Tabs.Tab value="/settings" leftSection={<IconSettings size={12} />}>
          Settings
        </Tabs.Tab>
        {/* disabling board analyzer until it's ready */}
        {false && (
          <Tabs.Tab value="/boardanalyzer" leftSection={<IconBorderAll size={12} />}>
            Board Analyzer
          </Tabs.Tab>
        )}
      </Tabs.List>
    </Tabs>
  );
}
