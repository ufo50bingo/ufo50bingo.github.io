'use client';

import { useState } from 'react';
import { IconPlayerPlay } from '@tabler/icons-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ActionIcon, Checkbox, Container, Table } from '@mantine/core';
import { db } from './db';
import Duration from './Duration';
import { SORTED_FLAT_GOALS } from './goals';
import useGoalStats from './useGoalStats';
import useSelectedGoals from './useSelectedGoals';

type Props = {
  onTryGoal: (goal: string) => void;
};

export default function AllGoals({ onTryGoal }: Props) {
  const attempts = useLiveQuery(() => db.attempts.toArray());
  const goalStats = useGoalStats(attempts);
  const selectedGoals = useSelectedGoals();
  const allChecked = SORTED_FLAT_GOALS.every((goal) => selectedGoals.has(goal.name));
  const allUnchecked = SORTED_FLAT_GOALS.every((goal) => !selectedGoals.has(goal.name));
  return (
    <Container my="md">
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                checked={allChecked}
                indeterminate={!allChecked && !allUnchecked}
                onChange={async (event) => {
                  if (event.currentTarget.checked) {
                    await db.unselectedGoals.clear();
                  } else {
                    await db.unselectedGoals.bulkAdd(
                      SORTED_FLAT_GOALS.filter((goal) => selectedGoals.has(goal.name)).map(
                        (goal) => ({ goal: goal.name })
                      )
                    );
                  }
                }}
              />
            </Table.Th>
            <Table.Th>Goal</Table.Th>
            <Table.Th>Game</Table.Th>
            <Table.Th>Difficulty</Table.Th>
            <Table.Th>Average Time</Table.Th>
            <Table.Th>Tries</Table.Th>
            <Table.Th>Try now</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {SORTED_FLAT_GOALS.map((goal) => {
            const stats = goalStats.get(goal.name);
            const averageDuration = stats?.averageDuration;
            return (
              <Table.Tr key={goal.name}>
                <Table.Td>
                  <Checkbox
                    checked={selectedGoals.has(goal.name)}
                    onChange={async (event) => {
                      if (event.currentTarget.checked) {
                        await db.unselectedGoals.delete(goal.name);
                      } else {
                        await db.unselectedGoals.add({ goal: goal.name });
                      }
                    }}
                  />
                </Table.Td>
                <Table.Td>{goal.name}</Table.Td>
                <Table.Td>{goal.types[0]}</Table.Td>
                <Table.Td>{goal.types[1]}</Table.Td>
                <Table.Td>
                  {averageDuration == null ? '-' : <Duration duration={averageDuration} />}
                </Table.Td>
                <Table.Td>{stats?.count ?? 0}</Table.Td>
                <Table.Td>
                  <ActionIcon onClick={() => onTryGoal(goal.name)}>
                    <IconPlayerPlay size={12} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Container>
  );
}
