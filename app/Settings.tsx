'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import { Button, Container, Stack, Text, useMantineColorScheme } from '@mantine/core';
import ExportCSV from './ExportCSV';
import ImportCSV from './ImportCSV';

export default function Practice() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  return (
    <Container my="md">
      <Stack>
        <Button
          leftSection={
            colorScheme === 'dark' ? <IconSun stroke={1.5} /> : <IconMoon stroke={1.5} />
          }
          onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
        >
          {colorScheme === 'dark' ? 'Change to light theme' : 'Change to dark theme'}
        </Button>
        <ExportCSV />
        <ImportCSV />
      </Stack>
    </Container>
  );
}
