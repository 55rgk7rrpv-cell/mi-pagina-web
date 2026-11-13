#!/usr/bin/env bash
# Daily BCV rate job (run by the scheduled task "Tasa BCV diaria"), from the maison/ folder.
# 1. fetches and checks today's rate into tasa-bcv/tasa.json (keeps yesterday's file to detect jumps)
# 2. builds the store into artifact/
# 3. prints the JSON files map to publish to the artifact (code + tasa.json; photos are already there)
set -euo pipefail
cd "$(dirname "$0")/.."
export NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt NODE_NO_WARNINGS=1
node scripts/tasa-bcv.mjs tasa-bcv/tasa.json >&2
[ -d node_modules ] || npm ci --no-audit --no-fund >&2
npm run export:artifact >&2
node -e '
const fs=require("fs");const files=JSON.parse(fs.readFileSync("artifact-files.json","utf8"));
const m={};for(const f of files) if(!f.startsWith("catalogo/") && !f.includes("/media/")) m[f]=f;
m["tasa.json"]=require("path").resolve("tasa-bcv/tasa.json");console.log(JSON.stringify(m));'
