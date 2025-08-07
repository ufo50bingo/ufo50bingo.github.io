import { useState } from 'react';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Container,
  JsonInput,
  SegmentedControl,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { Pasta } from './createPasta';
import GameChecker from './GameChecker';
import PastaFilter from './PastaFilter';
import { METADATA } from './pastas/metadata';

const options = [...METADATA.map((d) => d.name), 'Custom'];

export default function CreateBoard() {
  const [variant, setVariant] = useState(options[0]);
  const [custom, setCustom] = useState('');

  const [customizedPasta, setCustomizedPasta] = useState<null | Pasta>(null);

  const [showFilters, setShowFilters] = useState(false);

  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [isLockout, setIsLockout] = useState(true);
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

  const isEligibleForCustomizedPasta = variant === 'Standard' || variant === 'Spicy';
  const isUsingCustomizedPasta = isEligibleForCustomizedPasta && showFilters;

  return (
    <Container my="md">
      <Card shadow="sm" padding="sm" radius="md" withBorder>
        <Stack gap={8}>
          <Text>
            <strong>Choose variant</strong>
          </Text>
          <SegmentedControl data={options} onChange={setVariant} value={variant} />
          {description}
          {metadata != null && isEligibleForCustomizedPasta && (
            <>
              <Checkbox
                checked={showFilters}
                label="Show customization options"
                onChange={(event) => setShowFilters(event.currentTarget.checked)}
              />
              {showFilters && (
                // TODO: Fix up the typing here to get rid of the any
                <PastaFilter pasta={metadata.pasta as any} onChangePasta={setCustomizedPasta} />
              )}
            </>
          )}
          <Text>
            <strong>Configure Room</strong>
          </Text>
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
          <Checkbox
            checked={isLockout}
            label="Lockout"
            onChange={(event) => setIsLockout(event.currentTarget.checked)}
          />
          <Button
            disabled={
              isCreationInProgress ||
              roomName === '' ||
              password === '' ||
              (metadata == null && custom === '') ||
              (isUsingCustomizedPasta && customizedPasta == null)
            }
            onClick={async () => {
              setIsCreationInProgress(true);
              const pasta =
                isUsingCustomizedPasta && customizedPasta != null
                  ? JSON.stringify(customizedPasta)
                  : metadata == null
                    ? custom
                    : JSON.stringify(metadata.pasta);
              try {
                const url = await tryCreate(roomName, password, isLockout, pasta);
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
          {isUsingCustomizedPasta && (
            <Button
              disabled={customizedPasta == null}
              onClick={() => {
                if (customizedPasta != null) {
                  navigator.clipboard.writeText(JSON.stringify(customizedPasta, null, 4));
                }
              }}
            >
              Copy Customized Pasta to Clipboard
            </Button>
          )}
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

async function tryCreate(
  roomName: string,
  password: string,
  isLockout: boolean,
  pasta: string
): Promise<string> {
  const response = await fetch('https://bingosync-proxy-52352836062.us-west1.run.app/create', {
    method: 'POST',
    body: new URLSearchParams({
      room_name: roomName,
      passphrase: password,
      custom_json: pasta,
      lockout_mode: isLockout ? '2' : '1',
    }).toString(),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

  const json = await response.json();
  return json.url;
}
