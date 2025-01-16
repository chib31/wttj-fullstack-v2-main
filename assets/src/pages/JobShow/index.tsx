import { useParams } from 'react-router-dom'
import { useJob, useCandidates } from '../../hooks'
import { Text } from '@welcome-ui/text'
import { Flex } from '@welcome-ui/flex'
import { Box } from '@welcome-ui/box'
import { useMemo } from 'react'
import { Candidate, updateCandidate } from '../../api'
import { Badge } from '@welcome-ui/badge'
import { DndContext, DragOverEvent } from '@dnd-kit/core'
import { StatusColumn } from '../../components/StatusColumn'

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
  const { candidates } = useCandidates(jobId)

  const sortedCandidates = useMemo(() => {
      if (!candidates) return {}

      return candidates.reduce<SortedCandidates>((acc, c: Candidate) => {
        acc[c.status] = [...(acc[c.status] || []), c].sort((a, b) => a.position - b.position)
        return acc
      }, {})
    },
    [candidates]
  )

  return (
    <>
      <Box backgroundColor="neutral-70" p={20} alignItems="center">
        <Text variant="h5" color="white" m={0}>
          {job?.name}
        </Text>
      </Box>

      <Box p={20}>
        <DndContext onDragEnd={handleDragEnd}>
          <Flex gap={10}>
            {COLUMNS.map(column => (
              <Box key={column} w={300} border={1} backgroundColor="white" borderColor="neutral-30" borderRadius="md">
                <Flex p={10} borderBottom={1} borderColor="neutral-30" alignItems="center" justify="space-between">
                  <Text color="black" m={0} textTransform="capitalize">
                    {column}
                  </Text>
                  <Badge>{(sortedCandidates[column] || []).length}</Badge>
                </Flex>
                <StatusColumn id={column} key={column} candidates={sortedCandidates[column] || []}/>
              </Box>
            ))}
          </Flex>
        </DndContext>
      </Box>
    </>
  )

  function handleDragEnd(event: DragOverEvent) {
    const { active, over } = event;
    if (active == null || over == null) {
      return null;
    }

    console.log(event);

    // Hacky (hopefully temporary) solution to setting the order
    const lastPosition = Math.max(...sortedCandidates[over.id].map((c: { position: any }) => c.position));
    console.log(lastPosition);
    updateCandidate(job.id, active.id, over.id, lastPosition + 1);
  }
}

export default JobShow
