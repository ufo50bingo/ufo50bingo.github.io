'use client';

import { Dispatch, SetStateAction } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { IconGripVertical, IconPlayerPlay, IconX } from '@tabler/icons-react';
import { ActionIcon, Container, Table } from '@mantine/core';
import { useListState } from '@mantine/hooks';

type Props = {
  queue: string[];
  setQueue: Dispatch<SetStateAction<string[]>>;
};

export default function Playlist({ queue, setQueue }: Props) {
  return (
    <Container my="md">
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          const reorderedQueue = [...queue];
          const goal = queue[source.index];
          reorderedQueue.splice(source.index, 1);
          reorderedQueue.splice(destination?.index ?? 0, 0, goal);
          console.log(reorderedQueue);
          setQueue(reorderedQueue);
        }}
      >
        <Table striped highlightOnHover withTableBorder>
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                {queue.map((goal, idx) => {
                  return (
                    <Draggable key={idx} index={idx} draggableId={idx.toString()}>
                      {(provided) => (
                        <Table.Tr ref={provided.innerRef} {...provided.draggableProps}>
                          <Table.Td>
                            <div {...provided.dragHandleProps}>
                              <IconGripVertical size={16} />
                            </div>
                          </Table.Td>
                          <Table.Td>{idx + 1}</Table.Td>
                          <Table.Td>{goal}</Table.Td>
                          <Table.Td>
                            <ActionIcon onClick={() => {}} color="red">
                              <IconX size={16} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Table.Tbody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </Container>
  );
}
