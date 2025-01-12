import { Link as RouterLink } from 'react-router-dom'
import { useJobs } from '../../hooks'
import { Link } from '@welcome-ui/link'
import { deleteJob } from '../../api'
import NewJob from "../../components/NewJob";

function JobIndex() {
  const { isLoading, jobs } = useJobs()

  if (isLoading) {
    return null
  }

  return (
    <>
      <NewJob/>
      <ul>
        {jobs?.map(job =>
          <li key={job.id}>
            <Link as={RouterLink} to={`/jobs/${job.id}`}>
              {job.name}
            </Link>
            <button onClick={() => deleteJob(job.id)}>Delete</button>
          </li>
        )}
      </ul>
    </>
  )
}

export default JobIndex
