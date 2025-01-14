defmodule Wttj.Repo do
  use EctoHooks.Repo,
    otp_app: :wttj,
    adapter: Ecto.Adapters.Postgres
end
