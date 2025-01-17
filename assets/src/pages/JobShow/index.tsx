import { useParams } from 'react-router-dom'
import { useJob } from '../../hooks'
import { Text } from '@welcome-ui/text'
import { Flex } from '@welcome-ui/flex'
import { Box } from '@welcome-ui/box'
import { useMemo } from 'react'
import { Candidate, getCandidates, updateCandidate } from '../../api'
import { DndContext, DragOverEvent, closestCenter, useSensors, useSensor, KeyboardSensor, PointerSensor }
  from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState, useEffect } from "react";
import { Socket } from "phoenix";
import { StatusColumn } from "../../components/StatusColumn";

type Statuses = 'new' | 'interview' | 'hired' | 'rejected'
const COLUMNS: Statuses[] = ['new', 'interview', 'hired', 'rejected']

interface SortedCandidates {
  new?: Candidate[]
  interview?: Candidate[]
  hired?: Candidate[]
  rejected?: Candidate[]
}

function JobShow() {
  const { jobId } = useParams()
  const { job } = useJob(jobId)

  if (jobId == null) {
    return null;
  }

  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const sortedCandidates = useMemo(() => {
      if (!candidates) return {}

      return candidates.reduce<SortedCandidates>((acc, c: Candidate) => {
        acc[c.status] = [...(acc[c.status] || []), c].sort((a, b) => a.position - b.position)
        return acc
      }, {})
    },
    [candidates]
  )

  const fetchCandidates = async (jobId?: string) => {
    setLoading(true);
    try {
      const data = await getCandidates(jobId);
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(jobId);
  }, []);

  useEffect(() => {
    fetchCandidates(jobId);
  }, [refreshKey]);

  useEffect(() => {
    const socket = new Socket("ws://localhost:4000/socket");
    socket.connect();

    const channel = socket.channel("data:all", {});
    channel.join()
      .receive("ok", () => console.log("Connected to WebSocket..."))
      .receive("error", (resp: any) => console.error("Failed to connect to WebSocket", resp));

    channel.on("update", (_payload: any) => {
      console.log("Data update notification received:");
      refreshData();
    });

    return () => {
      channel.leave();
      socket.disconnect();
    };
  }, []);

  const refreshData = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger re-fetch
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isLoading) {
    return null
  }

  function handleDragEnd(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id;

    if (typeof overId === "string") {
      handleMoveColumn(active, overId as Statuses);
    } else {
      handleReorderColumn(active, overId as number);
    }
  }

  function handleReorderColumn(active: any, overId: number) {
    if (active.id === overId) {
      return null;

    } else {
      // dragged over a specific candidate
      const overCandidate = candidates.find(c => c.id === overId);
      if (overCandidate == undefined) {
        return null;
      }
      const overPosition = overCandidate.position;
      const candidatesInColumn = sortedCandidates[active.status as Statuses] || [];
      for (const c of candidatesInColumn) {
        if (c.position >= overPosition) {
          // move everything else down
          if (c.status === active.status && c.position < active.position) {
            // if moved from same different column no need to move candidates if already lower
            updateCandidate(jobId, c.id.toString(), c.status, c.position + 1);
          }
        }
      }
      updateCandidate(jobId, active.id.toString(), overCandidate.status, overPosition - 0.5);

    }
  }

  function handleMoveColumn(active: any, newStatus: Statuses) {
    if (active.status === newStatus) {
      // same column, no change
      return null;

    } else {
      // wasn't dragged into a specific location, so just calculate next available position
      const candidatesInColumn = sortedCandidates[newStatus] || [];
      let lastPosition: number;
      if (candidatesInColumn.length == 0) {
        lastPosition = 0;
      } else {
        lastPosition = Math.max(...candidatesInColumn.map((c: { position: any }) => c.position));
      }
      updateCandidate(jobId, active.id as string, newStatus, lastPosition + 1);
    }
  }

  return (
    <>
      <Box backgroundColor="neutral-70" p={20} alignItems="center">
        <Text variant="h5" color="white" m={0}>
          {job?.name}
        </Text>
      </Box>

      <Box p={20}>
        <DndContext onDragEnd={handleDragEnd}
                    collisionDetection={closestCenter}
                    sensors={sensors}>
          <Flex gap={10}>
            {COLUMNS.map(column => (
              <StatusColumn key={column} column={column} candidates={sortedCandidates[column] || []}/>
            ))}
          </Flex>
        </DndContext>
      </Box>
    </>
  )
}

export default JobShow
