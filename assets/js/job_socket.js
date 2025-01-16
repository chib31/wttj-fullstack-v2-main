import {Socket} from "phoenix"

let jobsocket = new Socket("ws://localhost:4000/socket")

jobsocket.connect()

let channel = jobsocket.channel("jobs:all", {})

channel.join()
  .receive("ok", () => { console.log("Joined successfully") })
  .receive("error", resp => { console.log("Unable to join", resp) })

channel.on("insert", (payload) => {
  console.log("Received update", payload);
});

export default jobsocket
