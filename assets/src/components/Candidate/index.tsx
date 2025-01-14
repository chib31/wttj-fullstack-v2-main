import { Card } from '@welcome-ui/card'
import { Candidate } from '../../api'
import {useDraggable} from '@dnd-kit/core'

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: candidate.id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Card ref={setNodeRef} style={style} {...listeners} {...attributes} mb={10}>
      <Card.Body>{candidate.position} - {candidate.email}</Card.Body>
    </Card>
  )
}

export default CandidateCard
