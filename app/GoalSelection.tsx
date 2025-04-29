'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Checkbox, Container, Table } from '@mantine/core';
import { db } from './db';
import Duration from './Duration';
import { SORTED_FLAT_GOALS } from './goals';
import useGoalStats from './useGoalStats';
import useSelectedGoals from './useSelectedGoals';

export default function GoalSelection() {
  const attempts = useLiveQuery(() => db.attempts.toArray());
  const goalStats = useGoalStats(attempts);
  const selectedGoals = useSelectedGoals();
  return (
    <Container my="md">
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Goal</Table.Th>
            <Table.Th>Game</Table.Th>
            <Table.Th>Difficulty</Table.Th>
            <Table.Th>Average Time</Table.Th>
            <Table.Th>Tries</Table.Th>
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
                    aria-label="Select row"
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
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Container>
  );
}
