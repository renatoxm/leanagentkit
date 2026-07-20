#!/usr/bin/env bash
# Deterministic availability check for the imaginary image-processing service.
# Never assume imaginary is running — always run this before attempting any
# resize/crop/convert/pipeline call.
#
# Usage:
#   ./check_imaginary.sh [base_url]
#
# base_url defaults to http://localhost:9000
#
# Exit codes:
#   0 - reachable and healthy
#   1 - not reachable / not healthy
#
# Output: single-line JSON to stdout (fixed schema — no raw body interpolation), e.g.
#   {"available":true,"url":"http://localhost:9000","http_code":"200"}
#   {"available":false,"url":"http://localhost:9000","http_code":"000","error":"connection refused"}

set -euo pipefail

BASE_URL="${1:-http://localhost:9000}"
TIMEOUT_SECS=3

# Escape a string for use as a JSON string value (no surrounding quotes).
json_escape() {
  local s=${1-}
  s=${s//\\/\\\\}
  s=${s//\"/\\\"}
  s=${s//$'\n'/\\n}
  s=${s//$'\r'/\\r}
  s=${s//$'\t'/\\t}
  printf '%s' "$s"
}

# imaginary exposes GET /health for a lightweight liveness check.
HEALTH_URL="${BASE_URL%/}/health"
URL_JSON=$(json_escape "${BASE_URL}")

if ! command -v curl >/dev/null 2>&1; then
  echo "{\"available\":false,\"url\":\"${URL_JSON}\",\"http_code\":\"000\",\"error\":\"curl not installed\"}"
  exit 1
fi

RESP_FILE=$(mktemp)
ERR_FILE=$(mktemp)
trap 'rm -f "${RESP_FILE}" "${ERR_FILE}"' EXIT

# Do not append via `|| echo` — curl -w may already print 000 on failure.
set +e
HTTP_CODE=$(curl -s -o "${RESP_FILE}" -w "%{http_code}" \
  --max-time "${TIMEOUT_SECS}" "${HEALTH_URL}" 2>"${ERR_FILE}")
curl_rc=$?
set -e

if [ "${curl_rc}" -ne 0 ] || [ -z "${HTTP_CODE}" ]; then
  HTTP_CODE="000"
fi

if [ "${HTTP_CODE}" = "200" ]; then
  echo "{\"available\":true,\"url\":\"${URL_JSON}\",\"http_code\":\"200\"}"
  exit 0
else
  ERR=$(cat "${ERR_FILE}" 2>/dev/null || true)
  ERR=${ERR:-unreachable}
  # Collapse whitespace so error stays one JSON line
  ERR=$(printf '%s' "${ERR}" | tr '\n\r' '  ')
  ERR_JSON=$(json_escape "${ERR}")
  echo "{\"available\":false,\"url\":\"${URL_JSON}\",\"http_code\":\"${HTTP_CODE}\",\"error\":\"${ERR_JSON}\"}"
  exit 1
fi
