#!/usr/bin/env bash
# Terminal entry for the Next.js dev server.
#
# The `start` phase (start.sh) normally brings up Docker + local Supabase before
# terminals run. This wrapper is defensive: it waits for Supabase to answer and,
# if it is still down (e.g. the start phase did not run), brings it up itself
# before launching `npm run dev`. `supabase start` is idempotent, so this never
# double-starts a healthy stack.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib.sh"

supabase_up() {
  local code
  code="$(curl -s -o /dev/null -w '%{http_code}' -m 3 http://127.0.0.1:54321/rest/v1/ 2>/dev/null || true)"
  [ -n "$code" ] && [ "$code" != "000" ]
}

# Give the start phase up to ~2 minutes to bring Supabase up.
for _ in $(seq 1 24); do
  supabase_up && break
  sleep 5
done

# Self-heal if Supabase never came up.
if ! supabase_up; then
  echo "Supabase not detected; running start.sh from the dev terminal..."
  bash "$SCRIPT_DIR/start.sh"
fi

ensure_env_local

cd "$REPO_ROOT/web"
exec npm run dev
