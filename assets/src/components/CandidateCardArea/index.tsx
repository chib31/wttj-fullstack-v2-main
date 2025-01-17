import { Candidate } from '../../api'
import {useDroppable} from '@dnd-kit/core'
import CandidateCard from "../CandidateCard";

function CandidateCardArea({ candidate }: { candidate: Candidate }) {
  const {isOver, setNodeRef} = useDroppable({
    id: candidate.id,
  });
  const style = {
    border: isOver ? '3px dashed #FFCD00' : undefined
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CandidateCard key={candidate.id} candidate={candidate}/>
    </div>
  )
}

export default CandidateCardArea