#!/bin/sh
set -eu

state_path="${OPS_STATE_PATH:-/tmp/bitora-ops-state.json}"
state_dir="$(dirname "$state_path")"
media_path="${EDITORIAL_MEDIA_PATH:-/tmp/bitora-editorial-media}"

mkdir -p "$state_dir" "$media_path"
if ! su-exec astro test -w "$state_dir"; then
  chown astro:astro "$state_dir"
fi
if ! su-exec astro test -w "$media_path"; then
  chown astro:astro "$media_path"
fi

if [ -n "${DATABASE_URL:-}" ]; then
  su-exec astro npx prisma migrate deploy
fi

exec su-exec astro "$@"
