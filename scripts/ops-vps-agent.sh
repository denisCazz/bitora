#!/bin/sh
# Invia metriche host (load, RAM, disco, uptime) all'area privata Bitora Ops.
# Uso sul VPS (crontab ogni 5 minuti):
#   OPS_CRON_SECRET=... OPS_INGEST_URL=https://bitora.it/api/ops/vps/ /path/to/ops-vps-agent.sh
set -eu

URL="${OPS_INGEST_URL:-https://bitora.it/api/ops/vps/}"
SECRET="${OPS_CRON_SECRET:-}"
BACKUP_PATHS="${OPS_BACKUP_PATHS:-}"

if [ -z "$SECRET" ]; then
  echo "OPS_CRON_SECRET mancante" >&2
  exit 1
fi

hostname_value="$(hostname 2>/dev/null || echo vps)"
cpu_count="$(getconf _NPROCESSORS_ONLN 2>/dev/null || echo 1)"
uptime_sec="$(awk '{print int($1)}' /proc/uptime 2>/dev/null || echo 0)"

load1=0
load5=0
load15=0
if [ -r /proc/loadavg ]; then
  load1="$(awk '{print $1}' /proc/loadavg)"
  load5="$(awk '{print $2}' /proc/loadavg)"
  load15="$(awk '{print $3}' /proc/loadavg)"
fi

mem_total=0
mem_available=0
swap_total=0
swap_free=0
if [ -r /proc/meminfo ]; then
  mem_total="$(awk '/MemTotal:/ {print $2 * 1024}' /proc/meminfo)"
  mem_available="$(awk '/MemAvailable:/ {print $2 * 1024}' /proc/meminfo)"
  swap_total="$(awk '/SwapTotal:/ {print $2 * 1024}' /proc/meminfo)"
  swap_free="$(awk '/SwapFree:/ {print $2 * 1024}' /proc/meminfo)"
fi
mem_used=$((mem_total - mem_available))
swap_used=$((swap_total - swap_free))

disk_total=0
disk_used=0
if command -v df >/dev/null 2>&1; then
  disk_total="$(df -Pk / | awk 'NR==2 {print $2 * 1024}')"
  disk_used="$(df -Pk / | awk 'NR==2 {print $3 * 1024}')"
fi

json_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

backup_json() {
  result=""
  old_ifs="$IFS"
  IFS=","
  for entry in $BACKUP_PATHS; do
    [ -n "$entry" ] || continue
    name="${entry%%=*}"
    path="${entry#*=}"
    [ "$name" != "$path" ] || continue
    latest=""
    if [ -d "$path" ]; then
      latest="$(find "$path" -type f -printf '%T@|%s|%p\n' 2>/dev/null | sort -nr | sed -n '1p')"
    elif [ -f "$path" ]; then
      latest="$(stat -c '%Y|%s|%n' "$path" 2>/dev/null || true)"
    fi
    ok=false
    at=0
    size=0
    restore_at=0
    detail="Nessun file trovato"
    if [ -n "$latest" ]; then
      IFS="|" read -r at size latest_path <<EOF
$latest
EOF
      at="${at%%.*}000"
      ok=true
      detail="$latest_path"
    fi
    marker="$path/.restore-verified"
    [ -d "$path" ] || marker="${path}.restore-verified"
    if [ -f "$marker" ]; then
      restore_at="$(stat -c '%Y000' "$marker" 2>/dev/null || echo 0)"
    fi
    item=$(printf '{"id":"%s","name":"%s","path":"%s","ok":%s,"lastBackupAt":%s,"sizeBytes":%s,"restoreVerifiedAt":%s,"detail":"%s"}' \
      "$(json_escape "$name")" "$(json_escape "$name")" "$(json_escape "$path")" "$ok" "$at" "$size" "$restore_at" "$(json_escape "$detail")")
    result="${result}${result:+,}${item}"
  done
  IFS="$old_ifs"
  printf '[%s]' "$result"
}

service_json() {
  result=""
  if command -v docker >/dev/null 2>&1; then
    rows="$(docker ps -a --format '{{.ID}}|{{.Names}}|{{.Image}}|{{.State}}' 2>/dev/null || true)"
    while IFS="|" read -r id name image status; do
      [ -n "$id" ] || continue
      inspect="$(docker inspect -f '{{.Created}}|{{.RestartCount}}' "$id" 2>/dev/null || echo '|0')"
      IFS="|" read -r created restarts <<EOF
$inspect
EOF
      created_at=0
      if [ -n "$created" ]; then
        created_at="$(date -d "$created" +%s000 2>/dev/null || echo 0)"
      fi
      item=$(printf '{"id":"%s","name":"%s","image":"%s","status":"%s","createdAt":%s,"restartCount":%s}' \
        "$(json_escape "$id")" "$(json_escape "$name")" "$(json_escape "$image")" "$(json_escape "$status")" "$created_at" "${restarts:-0}")
      result="${result}${result:+,}${item}"
    done <<EOF
$rows
EOF
  fi
  printf '[%s]' "$result"
}

backups="$(backup_json)"
services="$(service_json)"
payload=$(printf '{"hostname":"%s","load1":%s,"load5":%s,"load15":%s,"cpuCount":%s,"memUsedBytes":%s,"memTotalBytes":%s,"diskUsedBytes":%s,"diskTotalBytes":%s,"swapUsedBytes":%s,"swapTotalBytes":%s,"uptimeSec":%s,"backups":%s,"services":%s}' \
  "$(json_escape "$hostname_value")" "$load1" "$load5" "$load15" "$cpu_count" "$mem_used" "$mem_total" "$disk_used" "$disk_total" "$swap_used" "$swap_total" "$uptime_sec" "$backups" "$services")

curl -fsS -X POST \
  -H "Authorization: Bearer ${SECRET}" \
  -H "Content-Type: application/json" \
  --data "$payload" \
  "$URL"
