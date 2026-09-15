#!/bin/sh
set -eu

state_path="${OPS_STATE_PATH:-/tmp/bitora-ops-state.json}"
state_dir="$(dirname "$state_path")"

mkdir -p "$state_dir"
if ! su-exec astro test -w "$state_dir"; then
  chown astro:astro "$state_dir"
fi

exec su-exec astro "$@"
