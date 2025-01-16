defmodule WttjWeb.JobChannel do
  use WttjWeb, :channel
  require Logger

  def join("jobs:all", _message, socket) do
    {:ok, socket}
  end

  def broadcast_update(event, data) do
    Logger.info("#{event} event detected");
    WttjWeb.Endpoint.broadcast("jobs:all", event, data)
  end
end