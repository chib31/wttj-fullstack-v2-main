defmodule WttjWeb.DataChannel do
  use WttjWeb, :channel
  require Logger

  def join("data:all", _message, socket) do
    {:ok, socket}
  end

  def broadcast_update(event, data) do
    Logger.info("#{event} event detected");
    WttjWeb.Endpoint.broadcast("data:all", event, data)
  end
end