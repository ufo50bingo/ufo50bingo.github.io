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
import { Game, GAME_NAMES, ORDERED_PROPER_GAMES } from './goals';
import PastaFilter from './PastaFilter';
import { METADATA } from './pastas/metadata';

const options = [...METADATA.map((d) => d.name), 'Game Names', 'Custom'];

export default function CreateBoard() {
  const [variant, setVariant] = useState(options[0]);
  const [custom, setCustom] = useState('');
  const [checkState, setCheckState] = useState<Map<Game, boolean>>(
    new Map(ORDERED_PROPER_GAMES.map((key) => [key, true]))
  );

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
    ) : variant === 'Game Names' ? (
      <GameChecker checkState={checkState} setCheckState={setCheckState} />
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

  // for some reason it doesn't like checkState.values().filter(...)
  let checkedGameCount = 0;
  checkState.forEach((isChecked) => {
    if (isChecked) {
      checkedGameCount += 1;
    }
  });
  const hasLessThan25Games = checkedGameCount < 25;
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
          {metadata != null && (
            <Text size="sm">
              Last synced:{' '}
              {new Date(metadata.update_time * 1000).toLocaleString(undefined, {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          )}
          {(isEligibleForCustomizedPasta || variant === 'Game Names') && (
            <Checkbox
              checked={showFilters}
              label="Show customization options"
              onChange={(event) => setShowFilters(event.currentTarget.checked)}
            />
          )}
          {variant === 'Game Names' && showFilters && (
            <>
              <GameChecker checkState={checkState} setCheckState={setCheckState} />
              {hasLessThan25Games && (
                <Alert
                  variant="light"
                  color="red"
                  title="Error: You must select at least 25 games"
                />
              )}
            </>
          )}
          {metadata != null && isEligibleForCustomizedPasta && showFilters && (
            <PastaFilter
              checkState={checkState}
              setCheckState={setCheckState}
              // TODO: Fix up the typing here to get rid of the any
              pasta={metadata.pasta as any}
              onChangePasta={setCustomizedPasta}
            />
          )}
          {variant === 'Custom' && (
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
              (variant === 'Game Names' && showFilters && hasLessThan25Games) ||
              (variant === 'Custom' && custom === '') ||
              (isUsingCustomizedPasta && customizedPasta == null)
            }
            onClick={async () => {
              setIsCreationInProgress(true);
              const pasta =
                variant === 'Game Names'
                  ? JSON.stringify(
                      showFilters
                        ? Array.from(
                            checkState.entries().filter(([gameKey, checkState]) => checkState)
                          ).map(([gameKey, _]) => ({ name: GAME_NAMES[gameKey] }))
                        : ORDERED_PROPER_GAMES.map((gameKey) => ({ name: GAME_NAMES[gameKey] }))
                    )
                  : isUsingCustomizedPasta && customizedPasta != null
                    ? JSON.stringify(customizedPasta)
                    : metadata == null
                      ? custom
                      : JSON.stringify(metadata.pasta);
              try {
                const url = await tryCreate(
                  roomName,
                  password,
                  variant === 'Game Names',
                  isLockout,
                  pasta
                );
                setError(null);
                setUrl(url);
                setIsCreationInProgress(false);
                window.open(url, '_blank');
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
          {(isUsingCustomizedPasta || (variant === 'Game Names' && showFilters)) && (
            <Button
              disabled={isUsingCustomizedPasta && customizedPasta == null}
              onClick={() => {
                const data =
                  variant === 'Game Names'
                    ? Array.from(
                        checkState.entries().filter(([gameKey, checkState]) => checkState)
                      ).map(([gameKey, _]) => ({ name: GAME_NAMES[gameKey] }))
                    : customizedPasta;
                if (data != null) {
                  navigator.clipboard.writeText(JSON.stringify(data, null, 4));
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
            <Alert
              variant="light"
              color="red"
              title="Failed to create bingo board"
              icon={<IconExclamationMark />}
            >
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
  isGameNames: boolean,
  isLockout: boolean,
  pasta: string
): Promise<string> {
  const response = await fetch('https://bingosync-proxy-52352836062.us-west1.run.app/create', {
    method: 'POST',
    body: new URLSearchParams({
      room_name: roomName,
      passphrase: password,
      nickname: 'ufo50bingobot',
      game_type: '18',
      variant_type: isGameNames ? '172' : '187',
      custom_json: pasta,
      lockout_mode: isLockout ? '2' : '1',
      seed: '',
    }).toString(),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

  const json = await response.json();
  const url = json.url;
  if (url === 'https://www.bingosync.com/') {
    throw new Error('Malformed bingosync request');
  }
  return url;
}
