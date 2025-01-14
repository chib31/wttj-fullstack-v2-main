import {useDroppable} from '@dnd-kit/core'
import { Candidate } from "../../api";
import CandidateCard from "../Candidate";
import { Flex } from '@welcome-ui/flex'

interface StatusColumnProps {
  id: string;
  candidates: Candidate[];
}

export const StatusColumn: React.FC<StatusColumnProps> = ({ id, candidates}) => {
  const {setNodeRef} = useDroppable({
    id: id,
  });

  return (
    <Flex ref={setNodeRef} direction="column" p={10} pb={0}>
      {candidates.map((candidate: Candidate) => (
        <CandidateCard candidate={candidate}/>
      ))}
    </Flex>
  );
}
