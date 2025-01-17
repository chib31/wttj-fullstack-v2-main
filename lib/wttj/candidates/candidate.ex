defmodule Wttj.Candidates.Candidate do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:position, :status, :email, :job_id]}
  schema "candidates" do
    field :position, :float
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

  def after_insert(candidate, _delta) do
    WttjWeb.DataChannel.broadcast_update("update", candidate)
    candidate
  end

  def after_delete(candidate, _delta) do
    WttjWeb.DataChannel.broadcast_update("update", candidate)
    candidate
  end

  def after_update(candidate, _delta) do
    Wttj.Candidates.reorder_positions(candidate.job_id, candidate.status)
    WttjWeb.DataChannel.broadcast_update("update", candidate)
    candidate
  end
end
