defmodule WttjWeb.DataSocket do
  use Phoenix.Socket

  channel "data:all", WttjWeb.DataChannel
  @impl true
  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  @impl true
  def id(_socket), do: nil
end
