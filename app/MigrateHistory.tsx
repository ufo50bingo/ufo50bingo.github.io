'use client';

import { useState } from 'react';
import { Button, Group, Modal, Stack, Table, Text } from '@mantine/core';
import { Attempt, db } from './db';
import { GoalName } from './goals';

// Use the GoalName type to confirm that we're always migrating to a valid goal name
const OLD_GOAL_TO_NEW_GOAL: { [key: string]: GoalName } = {
  'ATTACTICS: Reach Lieutenant in ranked mode': 'ATTACTICS: Reach Lieutenant (50+) in Ranked Mode',
  'AVIANOS: Win the campaign Hatchling game without using any Miracles':
    'AVIANOS: Win the campaign Hatchling game without using any miracles',
  'BARBUTA: Speak to three different Bean NPCs': 'BARBUTA: Speak to 3 different Bean NPCs',
  'BLOCK KOALA: WORM-1234 allowed; Clear 9 story levels':
    'BLOCK KOALA: WORM-1234 allowed; Beat any 9 story levels',
  'BUG HUNTER: Earn 3 kills with one module use': 'BUG HUNTER: Get 3 kills with one module use',
  'BUSHIDO BALL: Gold disk with Default Options': 'BUSHIDO BALL: Gold disk w/ Default Options',
  'BUSHIDO BALL: Win a 16-point match on Hyper speed with all other options default':
    'BUSHIDO BALL: Win a 16-point match on Hyper speed (other options default)',
  'Buy an item from a shop in 10 different games': 'Buy an item from a shop in 10 games',
  'CAMPANELLA 2: Collect two scrolls in a run': 'CAMPANELLA 2: Collect two scrolls in one run',
  'CAMPANELLA 3: Beat Joe Pulp (Stage 3 Boss)': 'CAMPANELLA 3: Beat Joe Pulp (Stage C Boss)',
  'CAMPANELLA: Use BEAN-DRIP; score 6,000+ points':
    'CAMPANELLA: Use BEAN-DRIP; Score 6,000+ points',
  'CARAMEL CARAMEL: TEST-LENS allowed; beat Ghost Planet without using the camera before the boss':
    'CARAMEL CARAMEL: TEST-LENS allowed; Beat Ghost Planet without using the camera before the boss',
  'Collect a beverage in 6 different games': 'Collect a beverage in 6 games',
  'Collect a food item in 8 different games': 'Collect a food item in 8 games',
  'CYBER OWLS: GETM-EOUT allowed; rescue each owl in the mini-game':
    'CYBER OWLS: GETM-EOUT allowed; Rescue each owl in the mini-game',
  'CYBER OWLS: HAWK-BASE allowed; beat Antarctica':
    'CYBER OWLS: HAWK-BASE allowed; Beat Antarctica',
  'DEVILITION: Beat three levels while placing the maximum number of pieces each round':
    'DEVILITION: Beat 3 rounds while placing the maximum number of pieces each round',
  'DEVILITION: Beat 5 rounds': 'DEVILITION: Beat 5 rounds in one run',
  'Find an egg in 10 different games': 'Find an egg in 10 games',
  'FIST HELL: Beat the 4th scare (Boardwalk Bash)': 'FIST HELL: Clear the 4th scare',
  'GRIMSTONE: Have 3 Skills learned at once': 'GRIMSTONE: Learn 3 Skills at once',
  'HYPER CONTENDER: Win 4 fights in a row without rematches on default ring settings':
    'HYPER CONTENDER: Win 4 fights in one tournament on default ring settings',
  'Increase your max HP in 6 games': 'Increase your base HP in 6 games',
  'MORTOL: Beat a level with a total of 30 or more additional lives than you began the run with':
    'MORTOL: Have 50+ Lives (No BENS-MODE)',
  'MORTOL: OPEN-TOMB allowed; clear all world 2 levels':
    'MORTOL: OPEN-TOMB allowed; Clear all world 2 levels',
  'MORTOL: OPEN-TOMB allowed; clear all world 3 levels':
    'MORTOL: OPEN-TOMB allowed; Clear all world 3 levels',
  'OVERBOLD: Cherry disk': 'OVERBOLD: Cherry Disk',
  'PAINT CHASE: Beat 6 levels': 'PAINT CHASE: Beat 6 courses',
  'PAINT CHASE: Beat 7 levels without using power ups (boost pads allowed)':
    'PAINT CHASE: Beat 7 levels without using power-ups (boosting allowed)',
  'PARTY HOUSE: Have 6 star guests on screen at once':
    'PARTY HOUSE: Have 6 star guests in a party at once',
  'PARTY HOUSE: Have 6 trouble on screen at once': 'PARTY HOUSE: Have 6 trouble in a party at once',
  'PARTY HOUSE: Have a party with 4 Celebrities without getting busted':
    'PARTY HOUSE: Have 4 Celebrities in a party at once without getting busted',
  'PILOT PARTY: Collect the Gift in 4 of these 6 games: Campanella 1/2/3, Planet Zoldath, Pilot Quest, The Big Bell Race':
    'PILOT PARTY: Collect 4 gifts: Campanella 1/2/3, Planet Zoldath, Pilot Quest, The Big Bell Race',
  'PINGOLF: Be in first place in the standings immediately after hole 9':
    'PINGOLF: Be in first place immediately after hole 9',
  'PINGOLF: Score -2 or better on three holes':
    'PINGOLF: Score -2 or better on 3 different courses',
  'PINGOLF: Score under par on 5 courses': 'PINGOLF: Under par on 5 courses',
  'RAIL HEIST: LAZY-COPS allowed; beat Root Around while destroying every barrel':
    'RAIL HEIST: LAZY-COPS allowed; Beat Root Around while destroying every barrel',
  'RAIL HEIST: LAZY-COPS allowed; beat Vengeance! and The Final Score':
    'RAIL HEIST: LAZY-COPS allowed; Beat Vengeance! and The Final Score',
  'RAKSHASA: Beat the first Mid Boss w/ 4+ skulls':
    'RAKSHASA: Beat the green bridge mini-boss by arriving w/ 4+ skulls',
  'RAKSHASA: Score 25,000': 'RAKSHASA: Score 25,000 points',
  'ROCK ON! ISLAND: Beat Initial Encounter w/o cavemen':
    'ROCK ON! ISLAND: Beat Initial Encounter without cavemen',
  'ROCK ON! ISLAND: Have 20 chickens in a main level':
    'ROCK ON! ISLAND: Have 20 chickens at once in a main level',
  'VAINGER: Collect 1 keycode': 'VAINGER: Collect a Keycode from a major boss',
  'VAINGER: Get the Force Mod from Verde Sector': 'VAINGER: Obtain the Force Mod from Verde Sector',
  'WARPTANK: Beat any 9 levels and talk to 3 NPCs':
    'WARPTANK: Beat any 9 sectors and speak to 3 NPCs',
  'WARPTANK: SLIM-TANK allowed; clear Riot and Soft Sectors':
    'WARPTANK: SLIM-TANK allowed; beat Riot and Soft Sectors',
};

export default function MigrateHistory() {
  const [isMigrating, setIsMigrating] = useState(false);
  return (
    <>
      <Button onClick={() => setIsMigrating(true)}>Migrate</Button>
      <Modal
        centered={true}
        onClose={() => setIsMigrating(false)}
        opened={isMigrating}
        title="Migrate history for renamed goals"
      >
        <Stack>
          <Text>
            This will update your attempt history to account for goals which were renamed without
            substantially changing their meaning. The following changes will be made:
          </Text>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Old</Table.Th>
                <Table.Th>New</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {Object.entries(OLD_GOAL_TO_NEW_GOAL).map((entry) => (
                <Table.Tr key={entry[0]}>
                  <Table.Td>{entry[0]}</Table.Td>
                  <Table.Td>{entry[1]}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Group mt="lg" justify="flex-end">
            <Button onClick={() => setIsMigrating(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                await migrate();
                setIsMigrating(false);
              }}
              color="green"
            >
              Migrate
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

async function migrate(): Promise<void> {
  const attemptsToUpdate = await db.attempts
    .where('goal')
    .anyOfIgnoreCase(Object.keys(OLD_GOAL_TO_NEW_GOAL))
    .toArray();
  const updates = attemptsToUpdate.map((attempt) => ({
    key: attempt.id,
    changes: {
      goal: OLD_GOAL_TO_NEW_GOAL[attempt.goal],
    },
  }));
  await db.attempts.bulkUpdate(updates);
}
