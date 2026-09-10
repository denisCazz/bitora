#!/bin/sh
# Invia metriche host (load, RAM, disco, uptime) all'area privata Bitora Ops.
# Uso sul VPS (crontab ogni 5 minuti):
#   OPS_CRON_SECRET=... OPS_INGEST_URL=https://bitora.it/api/ops/vps/ /path/to/ops-vps-agent.sh
set -eu

URL="${OPS_INGEST_URL:-https://bitora.it/api/ops/vps/}"
SECRET="${OPS_CRON_SECRET:-}"

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

payload=$(printf '{"hostname":"%s","load1":%s,"load5":%s,"load15":%s,"cpuCount":%s,"memUsedBytes":%s,"memTotalBytes":%s,"diskUsedBytes":%s,"diskTotalBytes":%s,"swapUsedBytes":%s,"swapTotalBytes":%s,"uptimeSec":%s}' \
  "$hostname_value" "$load1" "$load5" "$load15" "$cpu_count" "$mem_used" "$mem_total" "$disk_used" "$disk_total" "$swap_used" "$swap_total" "$uptime_sec")

curl -fsS -X POST \
  -H "Authorization: Bearer ${SECRET}" \
  -H "Content-Type: application/json" \
  --data "$payload" \
  "$URL"
