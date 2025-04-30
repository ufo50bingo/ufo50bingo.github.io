'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@mantine/core';
import { Attempt, db } from './db';

export default function ExportCSV() {
  return <Button onClick={exportCsv}>Export</Button>;
}

async function exportCsv(): Promise<void> {
  const existingRows = await db.attempts.toArray();
  const csv = Papa.unparse(
    existingRows.map((row) => ({
      goal: row.goal,
      startTime: row.startTime,
      duration: row.duration,
    }))
  );
  const blob = new Blob([csv], { type: 'data:text/csv;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = 'ufo50_bingo_export.csv';
  const event = document.createEvent('MouseEvents');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
