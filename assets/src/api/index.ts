type Job = {
  id: string
  name: string
}

export type Candidate = {
  id: number
  email: string
  status: 'new' | 'interview' | 'hired' | 'rejected'
  position: number
}

export const getJobs = async (): Promise<Job[]> => {
  const response = await fetch(`http://localhost:4000/api/jobs`)
  const { data } = await response.json()
  return data
}

export const getJob = async (jobId?: string): Promise<Job | null> => {
  if (!jobId) return null
  const response = await fetch(`http://localhost:4000/api/jobs/${jobId}`)
  const { data } = await response.json()
  return data
}

export const getCandidates = async (jobId?: string): Promise<Candidate[]> => {
  if (!jobId) return []
  const response = await fetch(`http://localhost:4000/api/jobs/${jobId}/candidates`)
  const { data } = await response.json()
  return data
}

export const deleteJob = async (jobId?: string) => {
    const config = {
        method: "DELETE"
    }
    await fetch(`http://localhost:4000/api/jobs/${jobId}`, config)
}

export const createJob = async (name?: string) => {
  const config = {
    method: "POST",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({"job":{"name":name}})
  }
  await fetch(`http://localhost:4000/api/jobs`, config)
}

export const updateCandidate = async (jobId?: string, candidateId?: string, status?: string, position?: number) => {
  const config = {
    method: "PATCH",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({"candidate":{"status":status, "position":position}})
  }
  await fetch(`http://localhost:4000/api/jobs/${jobId}/candidates/${candidateId}`, config)
}
