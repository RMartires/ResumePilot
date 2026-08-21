#!/usr/bin/env bash
# Per-boot startup for the Resume Builder Cloud Agent.
#
# Runs on every VM start: start the Docker daemon, bring up the local Supabase
# stack (applies migrations + seed to a fresh DB), and make sure web/.env.local
# exists. The Next.js dev server itself is launched as a `terminals` entry so its
# logs stay visible.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib.sh"

echo "== Starting Docker =="
ensure_docker

echo "== Starting local Supabase =="
# `supabase start` is idempotent: it reuses a running stack or starts a fresh one.
supa start

ensure_env_local

echo "== Environment ready: Supabase on http://127.0.0.1:54321 (Studio :54323) =="
