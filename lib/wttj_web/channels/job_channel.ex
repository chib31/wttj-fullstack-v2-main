defmodule WttjWeb.JobChannel do
  use WttjWeb, :channel

  def join("jobs:all", _message, socket) do
    {:ok, socket}
  end

  def broadcast_update(event, data) do
    WttjWeb.Endpoint.broadcast("jobs:all", event, data)
  end
end