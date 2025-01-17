defmodule Wttj.Candidates do
  require Logger

  @moduledoc """
  The Candidates context.
  """

  import Ecto.Query, warn: false
  alias Wttj.Repo

  alias Wttj.Candidates.Candidate

  @doc """
  Returns the list of candidates.

  ## Examples

      iex> list_candidates()
      [%Candidate{}, ...]

  """
  def list_candidates(job_id) do
    query = from c in Candidate, where: c.job_id == ^job_id
    Repo.all(query)
  end

  @doc """
  Gets a single candidate.

  Raises `Ecto.NoResultsError` if the Candidate does not exist.

  ## Examples

      iex> get_candidate!(123)
      %Candidate{}

      iex> get_candidate!(456)
      ** (Ecto.NoResultsError)

  """
  def get_candidate!(job_id, id), do: Repo.get_by!(Candidate, id: id, job_id: job_id)

  @doc """
  Creates a candidate.

  ## Examples

      iex> create_candidate(%{field: value})
      {:ok, %Candidate{}}

      iex> create_candidate(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_candidate(attrs \\ %{}) do
    %Candidate{}
    |> Candidate.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a candidate.

  ## Examples

      iex> update_candidate(candidate, %{field: new_value})
      {:ok, %Candidate{}}

      iex> update_candidate(candidate, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_candidate(%Candidate{} = candidate, attrs) do
    candidate
    |> Candidate.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking candidate changes.

  ## Examples

      iex> change_candidate(candidate)
      %Ecto.Changeset{data: %Candidate{}}

  """
  def change_candidate(%Candidate{} = candidate, attrs \\ %{}) do
    Candidate.changeset(candidate, attrs)
  end

  def reorder_positions(jobId, status) do

    # Subquery to calculate the new positions using ROW_NUMBER()
    subquery =
      from c in Candidate,
           where: c.status == ^status,
           where: c.job_id == ^jobId,
           select: %{
             id: c.id,
             row_number: fragment("ROW_NUMBER() OVER (ORDER BY ?)", c.position)
           }
    Logger.info("subquery fetched...");

    # Now join onto the subquery results and replace position with a nice ordered integer
    update_query =
      from c in Candidate,
           join: s in subquery(subquery),
           on: s.id == c.id,
           update: [set: [position: s.row_number]]

    Logger.info("update query run...");

    # Execute the update
    case Repo.update_all(update_query, []) do
      {count, _} ->
        Logger.info("#{count} rows updated successfully")
        :ok

      {:error, reason} ->
        Logger.info(reason, label: "Update Error")
        {:error, reason}
    end
  end
end
