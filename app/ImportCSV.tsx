'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import {
  Button,
  Container,
  FileInput,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { Attempt, db } from './db';

export default function ImportCSV() {
  const [isImporting, setIsImporting] = useState(false);
  const [csv, setCsv] = useState<File | null>(null);
  const [behavior, setBehavior] = useState('merge');

  return (
    <>
      <Button onClick={() => setIsImporting(true)}>Import history from CSV</Button>
      <Modal
        centered={true}
        onClose={() => setIsImporting(false)}
        opened={isImporting}
        title="Import from CSV"
      >
        <Stack>
          <Text>You may want to export your data to CSV first.</Text>
          <FileInput accept="text/csv" value={csv} onChange={setCsv} label="Select CSV" />
          <SegmentedControl
            value={behavior}
            onChange={setBehavior}
            data={[
              { label: 'Merge with existing history', value: 'merge' },
              { label: 'Replace existing history', value: 'replace' },
            ]}
          />
          <Group mt="lg" justify="flex-end">
            <Button onClick={() => setIsImporting(false)}>Cancel</Button>
            <Button
              disabled={csv == null}
              onClick={async () => {
                if (csv == null) {
                  throw new Error('csv should not be null');
                }
                const rows = await parseCSV(csv);
                await updateDB(rows, behavior === 'merge');
              }}
              color="green"
            >
              Import
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

async function parseCSV(csv: File): Promise<Attempt[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Attempt>(csv, {
      dynamicTyping: true,
      header: true,
      complete: (results) => {
        const fields = results.meta.fields;
        if (
          fields == null ||
          fields.length != 3 ||
          fields[0] != 'goal' ||
          fields[1] != 'startTime' ||
          fields[2] != 'duration'
        ) {
          console.error('Unexpected CSV format', fields);
          reject(Error('Unexpected CSV format'));
        }
        resolve(results.data);
      },
      error: reject,
    });
  });
}

async function updateDB(csvRows: Attempt[], shouldMerge: boolean): Promise<void> {
  console.log(csvRows);
  if (shouldMerge) {
    const existingRows = await db.attempts.toArray();
    const existingRowsJsonSet = new Set();
    existingRows.forEach((row) =>
      existingRowsJsonSet.add(
        JSON.stringify({
          goal: row.goal,
          startTime: row.startTime,
          duration: row.duration,
        })
      )
    );
    const newRows = csvRows.filter((row) => !existingRowsJsonSet.has(JSON.stringify(row)));
    await db.attempts.bulkAdd(newRows);
  } else {
    await db.attempts.clear();
    await db.attempts.bulkAdd(csvRows);
  }
}
