defmodule Wttj.Jobs.Job do
  use Ecto.Schema
  import Ecto.Changeset
  require Logger

  @derive {Jason.Encoder, only: [:name]}
  schema "jobs" do
    field :name, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(job, attrs) do
    job
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end

  def after_insert(job, _delta) do
    Logger.info("insert event occurred...")
    WttjWeb.JobChannel.broadcast_update("insert", job)
    job
  end

  def after_delete(job, _delta) do
    Logger.info("delete event occurred...")
    WttjWeb.JobChannel.broadcast_update("delete", job)
    job
  end
end
