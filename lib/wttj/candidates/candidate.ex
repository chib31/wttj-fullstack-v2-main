defmodule Wttj.Candidates.Candidate do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:position, :status, :email, :job_id]}
  schema "candidates" do
    field :position, :integer
    field :status, Ecto.Enum, values: [:new, :interview, :rejected, :hired], default: :new
    field :email, :string
    field :job_id, :id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(candidate, attrs) do
    candidate
    |> cast(attrs, [:email, :status, :position, :job_id])
    |> validate_required([:email, :status, :position, :job_id])
  end

  def after_insert(job, _delta) do
    WttjWeb.DataChannel.broadcast_update("update", job)
    job
  end

  def after_delete(job, _delta) do
    WttjWeb.DataChannel.broadcast_update("update", job)
    job
  end

  def after_update(job, _delta) do
    WttjWeb.DataChannel.broadcast_update("update", job)
    job
  end
end
