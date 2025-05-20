import { useCallback, useState } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import chroma from 'chroma-js';
import { Alert, Button, Container, Group, Stack, Text, TextInput } from '@mantine/core';
import Duration from './Duration';
import { GoalStats } from './useGoalStats';

interface CellResponse {
  name: string;
}

type Props = {
  goalStats: Map<string, GoalStats>;
};

export default function BoardAnalyzer({ goalStats }: Props) {
  const [boardID, setBoardID] = useState<string>('');
  const [board, setBoard] = useState<string[][] | null>(null);

  let scale = null;
  if (board != null) {
    const times = board.flat().map((c) => goalStats.get(c)?.averageDuration ?? 15 * 60 * 1000);
    const max = Math.max(...times);
    const min = Math.min(...times);
    scale = chroma.scale(['green', 'red']).domain([min, max]).mode('lrgb');
  }

  return (
    <Container my="md">
      <Stack>
        <Alert variant="light" color="red" title="Work in progress" icon={<IconInfoCircle />}>
          Board Analyzer is still in development. Board fetching is limited to 50 calls per day.
        </Alert>
        <Group>
          <TextInput
            placeholder="Paste board ID"
            value={boardID}
            onChange={(event) => setBoardID(event.currentTarget.value)}
          />
          <Button
            onClick={async () => {
              // proxy to https://bingosync.com/room/${boardID}/board to get around CORS issues
              const url = `https://ufo50bingo.free.beeceptor.com/room/${boardID}/board`;
              try {
                const response = await fetch(url);
                if (!response.ok) {
                  throw new Error(`Response status: ${response.status}`);
                }

                const rawBoard: CellResponse[] = await response.json();
                const goalNames = rawBoard.map((cell) => cell.name);
                setBoard([
                  goalNames.slice(0, 5),
                  goalNames.slice(5, 10),
                  goalNames.slice(10, 15),
                  goalNames.slice(15, 20),
                  goalNames.slice(20, 25),
                ]);
              } catch (err) {
                if (err instanceof Error) {
                  console.error(err.message);
                }
              }
            }}
          >
            Fetch
          </Button>
        </Group>
        {board != null && scale != null && (
          <table>
            <tbody>
              {board.map((row, idx) => (
                <tr key={idx}>
                  {row.map((cell, idx) => {
                    const averageDuration = goalStats.get(cell)?.averageDuration;
                    return (
                      <td
                        key={idx}
                        style={{
                          border: '1px solid',
                          cursor: 'pointer',
                          maxWidth: '105px',
                          height: '95px',
                          textAlign: 'center',
                          verticalAlign: 'top',
                          overflow: 'hidden',
                          padding: '0 5px',
                          backgroundColor: scale(averageDuration ?? 15 * 60 * 1000),
                        }}
                      >
                        {
                          <Stack>
                            <Text>{cell}</Text>
                            <Text size="xs">
                              {averageDuration == null
                                ? 'N/A'
                                : `${(averageDuration / 60000).toFixed(1)} min`}
                            </Text>
                          </Stack>
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Stack>
    </Container>
  );
}
