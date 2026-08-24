#!/usr/bin/env bash
# One-time environment bootstrap for the Resume Builder Cloud Agent.
#
# With environment builds this runs once to create the baseline snapshot and is
# NOT re-run on every boot, so it does the slow, durable work: install system
# tooling (Docker + Supabase CLI), install app dependencies, and pre-pull the
# Supabase container images (baked into the snapshot for fast boots). Per-boot
# service startup lives in start.sh.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib.sh"

echo "== Installing system packages (Docker, Supabase CLI, psql) =="
if ! command -v docker >/dev/null 2>&1; then
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg |
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" |
    sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  sudo apt-get update -qq
  sudo apt-get install -y -qq \
    docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin \
    fuse-overlayfs postgresql-client
fi
sudo usermod -aG docker "$USER" || true

if ! command -v supabase >/dev/null 2>&1; then
  ver="$(curl -fsSL https://api.github.com/repos/supabase/cli/releases/latest |
    grep -oP '"tag_name": "\K[^"]+')"
  curl -fsSL -o /tmp/supabase.deb \
    "https://github.com/supabase/cli/releases/download/${ver}/supabase_${ver#v}_linux_amd64.deb"
  sudo dpkg -i /tmp/supabase.deb
fi

echo "== Installing web app dependencies =="
npm --prefix "$REPO_ROOT/web" install

echo "== Installing Playwright Chromium (for e2e tests) =="
(cd "$REPO_ROOT/web" && npx --yes playwright install --with-deps chromium) || \
  (cd "$REPO_ROOT/web" && npx --yes playwright install chromium) || \
  echo "Playwright browser install skipped (non-fatal)."

echo "== Pre-pulling Supabase images + validating migrations =="
ensure_docker
# Bring the stack up once so the images are cached in the snapshot and the
# migrations/seed are validated, then tear it down (start.sh brings it up on boot).
supa start || echo "supabase start during install failed (non-fatal; start.sh retries on boot)."
ensure_env_local || true
supa stop --no-backup || true

echo "== Install complete =="
