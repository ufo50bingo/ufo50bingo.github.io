'use client';

import { SetStateAction, useMemo, useState } from 'react';
import { IconBrandMantine, IconRefresh, IconX } from '@tabler/icons-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ActionIcon, Button, Group, Modal, Table, Tooltip } from '@mantine/core';
import { AttemptRow, db } from './db';
import Duration from './Duration';
import useGoalStats from './useGoalStats';

type Props = {
  onRetryGoal: (goal: string) => any;
};

export default function AllAttempts({ onRetryGoal }: Props) {
  const attempts = useLiveQuery(() => db.attempts.orderBy('startTime').reverse().toArray());

  const goalStats = useGoalStats(attempts);

  const [deletingAttempt, setDeletingAttempt] = useState<AttemptRow | null>(null);

  return (
    <>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Goal</Table.Th>
            <Table.Th>Time</Table.Th>
            <Table.Th>Average Time</Table.Th>
            <Table.Th>Tries</Table.Th>
            <Table.Th>Started At</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {attempts?.map((attempt) => {
            const stats = goalStats.get(attempt.goal);
            const averageDuration = stats?.averageDuration;
            return (
              <Table.Tr key={attempt.id}>
                <Table.Td>{attempt.goal}</Table.Td>
                <Table.Td>
                  <Duration duration={attempt.duration} />
                </Table.Td>
                <Table.Td>
                  {averageDuration == null ? '-' : <Duration duration={averageDuration} />}
                </Table.Td>
                <Table.Td>{stats?.count ?? 0}</Table.Td>
                <Table.Td>
                  {new Date(attempt.startTime).toLocaleString(undefined, {
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                  })}
                </Table.Td>
                <Table.Td>
                  <Group>
                    <Tooltip label="Attempt this goal again">
                      <ActionIcon>
                        <IconRefresh onClick={() => onRetryGoal(attempt.goal)} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete this attempt">
                      <ActionIcon onClick={() => setDeletingAttempt(attempt)} color="red">
                        <IconX />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      <Modal
        centered={true}
        onClose={() => setDeletingAttempt(null)}
        opened={deletingAttempt != null}
        title="Confirm Deletion"
      >
        Are you sure you want to delete this attempt? This is not reversible.
        <Group mt="lg" justify="flex-end">
          <Button onClick={() => setDeletingAttempt(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (deletingAttempt != null) {
                db.attempts.delete(deletingAttempt.id);
              }
              setDeletingAttempt(null);
            }}
            color="red"
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
