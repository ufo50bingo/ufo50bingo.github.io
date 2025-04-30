'use client';

import { useCallback, useState } from 'react';
import { IconDeviceGamepad, IconFilter, IconSettings } from '@tabler/icons-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Tabs } from '@mantine/core';
import AllGoals from './AllGoals';
import { db } from './db';
import Practice from './Practice';
import Settings, { NextGoalChoice } from './Settings';
import useGoalStats, { GoalStats } from './useGoalStats';
import useSelectedGoals from './useSelectedGoals';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string | null>('practice');
  const [nextGoalChoice, setNextGoalChoice] = useState(NextGoalChoice.RANDOM);

  const attempts = useLiveQuery(() => db.attempts.orderBy('startTime').reverse().toArray()) ?? [];
  const goalStats = useGoalStats(attempts);
  const selectedGoals = useSelectedGoals();

  const getRandomGoal = useCallback(() => {
    switch (nextGoalChoice) {
      case NextGoalChoice.PREFER_FEWER_ATTEMPTS:
        return getGoalPreferFewerAttempts(selectedGoals, goalStats);
      case NextGoalChoice.RANDOM:
      default:
        const items = Array.from(selectedGoals);
        return items[Math.floor(Math.random() * items.length)];
    }
  }, [nextGoalChoice, selectedGoals, goalStats]);
  const [goal, setGoal] = useState(getRandomGoal());
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
        <Practice
          attempts={attempts}
          goalStats={goalStats}
          getRandomGoal={getRandomGoal}
          goal={goal}
          setGoal={(goal) => setGoal(goal)}
        />
      </Tabs.Panel>
      <Tabs.Panel value="allGoals">
        <AllGoals
          attempts={attempts}
          goalStats={goalStats}
          selectedGoals={selectedGoals}
          onTryGoal={(goal) => {
            setGoal(goal);
            setActiveTab('practice');
          }}
        />
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Settings nextGoalChoice={nextGoalChoice} setNextGoalChoice={setNextGoalChoice} />
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
  console.log(goalIndex, allCumulativeWeights, randomWeight);
  return goals[goalIndex];
}
