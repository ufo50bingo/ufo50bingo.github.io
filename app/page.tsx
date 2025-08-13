'use client';

import { useCallback, useState } from 'react';
import {
  IconBorderAll,
  IconDeviceGamepad,
  IconFilter,
  IconPlaylistAdd,
  IconScript,
  IconSettings,
  IconVs,
} from '@tabler/icons-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Tabs } from '@mantine/core';
import AllGoals from './AllGoals';
import BoardAnalyzer from './BoardAnalyzer';
import CreateBoard from './CreateBoard';
import { db } from './db';
import Playlist from './Playlist';
import Practice from './Practice';
import Resources from './Resources';
import Settings, { NextGoalChoice } from './Settings';
import useGoalStats, { GoalStats } from './useGoalStats';
import useSelectedGoals from './useSelectedGoals';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string | null>('createBoard');

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="createBoard" leftSection={<IconVs size={12} />}>
          Create Board
        </Tabs.Tab>
        <Tabs.Tab value="resources" leftSection={<IconScript size={12} />}>
          Resources
        </Tabs.Tab>
        <Tabs.Tab value="practice" leftSection={<IconDeviceGamepad size={12} />}>
          Practice
        </Tabs.Tab>
        <Tabs.Tab value="allGoals" leftSection={<IconFilter size={12} />}>
          All Goals
        </Tabs.Tab>
        <Tabs.Tab value="playlist" leftSection={<IconPlaylistAdd size={12} />}>
          Playlist
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings size={12} />}>
          Settings
        </Tabs.Tab>
        {/* disabling board analyzer until it's ready */}
        {false && (
          <Tabs.Tab value="boardAnalyzer" leftSection={<IconBorderAll size={12} />}>
            Board Analyzer
          </Tabs.Tab>
        )}
      </Tabs.List>

      <Tabs.Panel value="createBoard">
        <CreateBoard />
      </Tabs.Panel>
      <Tabs.Panel value="resources">
        <Resources />
      </Tabs.Panel>
      <Tabs.Panel value="practice">
        <Practice />
      </Tabs.Panel>
      <Tabs.Panel value="allGoals">
        <AllGoals />
      </Tabs.Panel>
      <Tabs.Panel value="playlist">
        <Playlist />
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Settings />
      </Tabs.Panel>
      <Tabs.Panel value="boardAnalyzer">
        <BoardAnalyzer />
      </Tabs.Panel>
    </Tabs>
  );
}

function getGoalPreferFewerAttempts(
  selectedGoals: Set<string>,
  goalStats: Map<string, GoalStats>
): string {
  const goals = Array.from(selectedGoals);

  let cumulativeWeight = 0;
  const allCumulativeWeights: number[] = [];
  goals.forEach((goal) => {
    const count = goalStats.get(goal)?.count ?? 0;
    // if the goal hasn't been done before, it's weighted 4 times as heavily as a single completion
    const weight = count === 0 ? 4 : 1 / count;
    cumulativeWeight += weight;
    allCumulativeWeights.push(cumulativeWeight);
  });

  const randomWeight = Math.random() * cumulativeWeight;

  const goalIndex = allCumulativeWeights.findIndex((cutoff) => cutoff >= randomWeight);
  return goals[goalIndex];
}
