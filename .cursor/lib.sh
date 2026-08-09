#!/usr/bin/env bash
# Shared helpers for the Cloud Agent environment scripts.
#
# The Resume Builder app (web/) needs a Supabase backend. We run Supabase
# locally via the Supabase CLI, which requires Docker. Docker runs *nested*
# inside the Cloud Agent VM, which needs a couple of non-obvious tweaks:
#   * storage-driver must be fuse-overlayfs (overlay2 can't mount nested here).
#   * net.bridge.bridge-nf-call-iptables must be 0, otherwise bridged
#     container-to-container traffic hits the host's legacy iptables
#     "FORWARD DROP" policy and every inter-service DB connection times out.
#
# We drive Docker and the Supabase CLI through `sudo`: in the build/boot
# environment the daemon socket is only reliably reachable as root even after a
# chmod, so `sudo` is the portable choice. `supa()` wraps the CLI accordingly.
# For interactive convenience we still best-effort open the socket to the
# non-root user (so a plain `docker`/`supabase` works when the group/permission
# race allows it).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export REPO_ROOT

# Run the Supabase CLI from the repo root as root (needs the Docker socket).
supa() {
  (cd "$REPO_ROOT" && sudo supabase "$@")
}

# Start (or reuse) the Docker daemon and apply the nested-container fixes.
ensure_docker() {
  sudo mkdir -p /etc/docker
  if [ ! -s /etc/docker/daemon.json ]; then
    echo '{ "storage-driver": "fuse-overlayfs" }' | sudo tee /etc/docker/daemon.json >/dev/null
  fi

  if ! sudo docker info >/dev/null 2>&1; then
    sudo bash -c 'nohup dockerd >/tmp/dockerd.log 2>&1 &'
    for _ in $(seq 1 60); do
      sudo docker info >/dev/null 2>&1 && break
      sleep 1
    done
  fi

  sudo docker info >/dev/null 2>&1 || {
    echo "dockerd failed to start; see /tmp/dockerd.log" >&2
    tail -20 /tmp/dockerd.log >&2 || true
    return 1
  }

  # Required for nested-container inter-service networking (see header note).
  sudo sysctl -w net.bridge.bridge-nf-call-iptables=0  >/dev/null 2>&1 || true
  sudo sysctl -w net.bridge.bridge-nf-call-ip6tables=0 >/dev/null 2>&1 || true

  # Best-effort: let the non-root user use `docker`/`supabase` without sudo when
  # possible. Not required for the scripts (they use sudo), so never fatal.
  sudo usermod -aG docker "$USER" 2>/dev/null || true
  sudo chmod 666 /var/run/docker.sock 2>/dev/null || true
}

# Write web/.env.local from the running local Supabase stack if it's absent.
# The local keys are the fixed, well-known Supabase dev keys (safe for local
# use only). The file is gitignored.
ensure_env_local() {
  local env_file="$REPO_ROOT/web/.env.local"
  [ -f "$env_file" ] && return 0

  local status anon svc
  status="$(supa status -o env 2>/dev/null || true)"
  anon="$(printf '%s\n' "$status" | sed -n 's/^ANON_KEY="\(.*\)"$/\1/p')"
  svc="$(printf '%s\n' "$status" | sed -n 's/^SERVICE_ROLE_KEY="\(.*\)"$/\1/p')"

  cat >"$env_file" <<EOF
# Local Supabase (from \`supabase start\`). Fixed local dev keys only. Gitignored.
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anon}
SUPABASE_SERVICE_ROLE_KEY=${svc}
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
  echo "Wrote $env_file"
}
