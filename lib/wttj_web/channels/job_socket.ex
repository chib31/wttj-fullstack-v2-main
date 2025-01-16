defmodule WttjWeb.JobSocket do
  use Phoenix.Socket

  channel "jobs:all", WttjWeb.JobChannel
  @impl true
  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  @impl true
  def id(_socket), do: nil
end
