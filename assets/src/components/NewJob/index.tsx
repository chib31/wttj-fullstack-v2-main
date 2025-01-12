import {Modal, useModal} from '@welcome-ui/modal'
import {Button} from '@welcome-ui/button'
import { InputText } from '@welcome-ui/input-text'
import {createJob} from "../../api";
import { useState } from 'react';

function NewJob(){
  const modal = useModal()
  const [name, setName] = useState("");

  return (
    <>
      <Modal.Trigger as={Button} store={modal}>
        Create New
      </Modal.Trigger>
      <Modal ariaLabel="example" store={modal}>
        <Modal.Content store={modal}>
          <Modal.Body>
            <InputText
              name="jobTitle"
              placeholder="Job Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              marginTop={10}
              onClick={() => createJob(name)}>
              Create
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default NewJob