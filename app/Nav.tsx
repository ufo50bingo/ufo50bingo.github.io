'use client';

import Link from 'next/link';
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
import { Anchor, Group, Tabs } from '@mantine/core';

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Group>
      <Anchor component={Link} href="/">
        {<IconVs size={12} />} Create Board
      </Anchor>
      <Anchor component={Link} href="/resources">
        {<IconScript size={12} />} Resources
      </Anchor>
      <Anchor component={Link} href="/practice">
        {<IconDeviceGamepad size={12} />} Practice
      </Anchor>
      <Anchor component={Link} href="/goals">
        {<IconFilter size={12} />} All Goals
      </Anchor>
      <Anchor component={Link} href="/playlist">
        {<IconPlaylistAdd size={12} />} Playlist
      </Anchor>
      <Anchor component={Link} href="/settings">
        {<IconSettings size={12} />} Settings
      </Anchor>
      {false && (
        <Anchor component={Link} href="/boardanalyzer">
          {<IconBorderAll size={12} />} Board Analyzer
        </Anchor>
      )}
    </Group>
  );
}
