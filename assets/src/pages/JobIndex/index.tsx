import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@welcome-ui/link'
import { deleteJob, getJobs } from '../../api'
import NewJob from "../../components/NewJob";
import { useState, useEffect } from "react";
import { Socket } from "phoenix";

function JobIndex() {
  type Job = {
    id: string
    name: string
  }

  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchJobs = async () => {
    console.log("Fetching jobs...");
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [refreshKey]);

  useEffect(() => {
    const socket = new Socket("ws://localhost:4000/socket");
    socket.connect();

    const channel = socket.channel("data:all", {});
    channel.join()
      .receive("ok", () => console.log("Connected to WebSocket..."))
      .receive("error", (resp: any) => console.error("Failed to connect to WebSocket", resp));

    channel.on("update", (payload: any) => {
      console.log("Data update notification received:", payload);
      refreshData();
    });

    return () => {
      channel.leave();
      socket.disconnect();
    };
  }, []);

  const refreshData = () => {
    console.log("Refreshing data...");
    setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger re-fetch
  };

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
