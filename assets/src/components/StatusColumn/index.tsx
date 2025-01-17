import {useDroppable} from '@dnd-kit/core'
import { Candidate } from "../../api";
import CandidateCardArea from "../CandidateCardArea";
import { Flex } from '@welcome-ui/flex'
import { Badge } from '@welcome-ui/badge'
import { Text } from '@welcome-ui/text'
import { Box } from '@welcome-ui/box'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface StatusColumnProps {
  column: string;
  candidates: Candidate[];
}

export const StatusColumn: React.FC<StatusColumnProps> = ({ column, candidates}) => {
  const {isOver, setNodeRef} = useDroppable({
    id: column,
  });
  const style = {
    border: isOver ? '3px dashed #FFCD00' : undefined
  };

  return (
    <Box ref={setNodeRef}
         style={style}
         key={column}
         w={300}
         border={1}
         backgroundColor="white"
         borderColor="neutral-30"
         borderRadius="md">
      <Flex p={10} borderBottom={1} borderColor="neutral-30" alignItems="center" justify="space-between">
        <Text color="black" m={0} textTransform="capitalize">
          {column}
        </Text>
        <Badge>{(candidates).length}</Badge>
      </Flex>
      <Flex id={column} direction="column" p={10} mb={0}>

        <SortableContext items={candidates} strategy={verticalListSortingStrategy}>
          {(candidates).map((candidate: Candidate) => (
            <CandidateCardArea key={candidate.id} candidate={candidate}/>
          ))}
        </SortableContext>
        <Box id='end'
             ref={setNodeRef}
             style={style}
             minHeight={"5em"}/>
        <Box minHeight={"10em"}/>
      </Flex>
    </Box>
  );
}
