'use client';

import { useMemo, useState } from 'react';
import { IconChevronDown, IconChevronUp, IconPlayerPlay, IconSelector } from '@tabler/icons-react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ActionIcon,
  Center,
  Checkbox,
  Container,
  Group,
  Table,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { db } from './db';
import Duration from './Duration';
import { compareByDifficulty, SORTED_FLAT_GOALS } from './goals';
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

  const [sortBy, setSortBy] = useState<string>('goal');
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: string) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const sortedRows = useMemo(() => {
    switch (sortBy) {
      case 'goal':
        return reverseSortDirection ? SORTED_FLAT_GOALS.toReversed() : SORTED_FLAT_GOALS;
      case 'difficulty':
        const sortedByDifficulty = SORTED_FLAT_GOALS.toSorted(compareByDifficulty);
        return reverseSortDirection ? sortedByDifficulty.toReversed() : sortedByDifficulty;
      case 'averageDuration':
        const sortedByAverageDuration = SORTED_FLAT_GOALS.toSorted((a, b) => {
          const aDur = goalStats.get(a.name)?.averageDuration;
          const bDur = goalStats.get(b.name)?.averageDuration;
          if (aDur == null || bDur == null) {
            if (aDur == null && bDur != null) {
              return 1;
            } else if (aDur != null && bDur == null) {
              return -1;
            } else {
              return 0;
            }
          } else {
            return aDur - bDur;
          }
        });
        return reverseSortDirection
          ? sortedByAverageDuration.toReversed()
          : sortedByAverageDuration;
      case 'count':
      case 'averageDuration':
        const sortedByCount = SORTED_FLAT_GOALS.toSorted((a, b) => {
          const aCount = goalStats.get(a.name)?.count ?? 0;
          const bCount = goalStats.get(b.name)?.count ?? 0;
          return aCount - bCount;
        });
        return reverseSortDirection ? sortedByCount.toReversed() : sortedByCount;
      default:
        return SORTED_FLAT_GOALS;
    }
  }, [goalStats, sortBy, reverseSortDirection]);

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
            <SortableTh
              sorted={sortBy === 'goal'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('goal')}
            >
              Goal
            </SortableTh>
            <Table.Th>Game</Table.Th>
            <SortableTh
              sorted={sortBy === 'difficulty'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('difficulty')}
            >
              Difficulty
            </SortableTh>
            <SortableTh
              sorted={sortBy === 'averageDuration'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('averageDuration')}
            >
              Average Time
            </SortableTh>
            <SortableTh
              sorted={sortBy === 'count'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('count')}
            >
              Tries
            </SortableTh>
            <Table.Th>Try now</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedRows.map((goal) => {
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

type SortableThProps = {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
};

function SortableTh({ children, reversed, sorted, onSort }: SortableThProps) {
  const Icon = sorted ? (reversed ? IconChevronDown : IconChevronUp) : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group gap={4} wrap="nowrap">
          <Text>{children}</Text>
          <Center>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}
