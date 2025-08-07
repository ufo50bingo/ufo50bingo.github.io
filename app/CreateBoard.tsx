import { useState } from 'react';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';
import {
  Alert,
  Button,
  Card,
  Container,
  JsonInput,
  SegmentedControl,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { METADATA } from './pastas/metadata';

const options = [...METADATA.map((d) => d.name), 'Custom'];

export default function CreateBoard() {
  const [variant, setVariant] = useState(options[0]);
  const [custom, setCustom] = useState('');
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [isCreationInProgress, setIsCreationInProgress] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const metadata = METADATA.find((d) => d.name === variant);
  const description =
    metadata != null ? (
      <Text size="sm">
        Last synced:{' '}
        {new Date(metadata.update_time * 1000).toLocaleString(undefined, {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
    ) : (
      <JsonInput
        autosize
        label="Add your pasta here:"
        maxRows={12}
        minRows={2}
        onChange={setCustom}
        spellCheck={false}
        validationError="Invalid JSON"
        value={custom}
      />
    );
  return (
    <Container my="md">
      <Card shadow="sm" padding="sm" radius="md" withBorder>
        <Stack gap={8}>
          <Text>
            <strong>Choose your variant</strong>
          </Text>
          <SegmentedControl data={options} onChange={setVariant} value={variant} />
          {description}
          <TextInput
            label="Room name"
            value={roomName}
            onChange={(event) => setRoomName(event.currentTarget.value)}
          />
          <TextInput
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <Button
            disabled={
              isCreationInProgress ||
              roomName === '' ||
              password === '' ||
              (metadata == null && custom === '')
            }
            onClick={async () => {
              setIsCreationInProgress(true);
              const pasta = metadata == null ? custom : JSON.stringify(metadata.pasta);
              try {
                const url = await tryCreate(roomName, password, pasta);
                setError(null);
                setUrl(url);
                setIsCreationInProgress(false);
              } catch (err: any) {
                setIsCreationInProgress(false);
                setUrl('');
                setError(err);
              }
            }}
            color="green"
          >
            Create Bingosync Board
          </Button>
          {url !== '' && (
            <Alert variant="light" color="green" title="Success!" icon={<IconCheck />}>
              Your bingo board is available at{' '}
              <a href={url} target="_blank">
                {url}
              </a>
            </Alert>
          )}
          {error != null && (
            <Alert variant="light" color="red" title="Failure!" icon={<IconExclamationMark />}>
              Failed to create bingo board:
              <br />
              {error.message}
            </Alert>
          )}
        </Stack>
      </Card>
    </Container>
  );
}

async function tryCreate(roomName: string, password: string, pasta: string): Promise<string> {
  const response = await fetch('https://bingosync-proxy-52352836062.us-west1.run.app/create', {
    method: 'POST',
    body: new URLSearchParams({
      room_name: roomName,
      passphrase: password,
      custom_json: pasta,
    }).toString(),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

  const json = await response.json();
  return json.url;
}
