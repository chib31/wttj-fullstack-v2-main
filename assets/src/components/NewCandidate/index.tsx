import {Modal, useModal} from '@welcome-ui/modal'
import {Button} from '@welcome-ui/button'
import { InputText } from '@welcome-ui/input-text'
import { createCandidate } from "../../api";
import { useState } from 'react';

interface NewCandidateProps {
  jobId?: string;
  nextPosition: number;
}

export const NewCandidate: React.FC<NewCandidateProps> = ({ jobId, nextPosition }) => {
  const modal = useModal()
  const [email, setEmail] = useState("");

  return (
    <>
      <Modal.Trigger as={Button} store={modal}>
        Create New
      </Modal.Trigger>
      <Modal ariaLabel="example" store={modal}>
        <Modal.Content store={modal}>
          <Modal.Body>
            <InputText
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            <Button
              marginTop={10}
              onClick={() => createCandidate(jobId, email, nextPosition)}>
              Create
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}