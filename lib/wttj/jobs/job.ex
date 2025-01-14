defmodule Wttj.Jobs.Job do
  use Ecto.Schema
  import Ecto.Changeset
  require Logger

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

  def after_insert(job, %EctoHooks.Delta{}) do
    Logger.info(job)
    job
  end
end
