#!/bin/zsh
cd "${0:A:h}"
SCIENCE_NODE="$(command -v node)"
if [[ -z "$SCIENCE_NODE" ]]; then
 SCIENCE_NODE="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [[ ! -x "$SCIENCE_NODE" ]]; then
 print 'Install Node.js 22.12 or later, then run npm install and npm run dev.'
 read '?Press Enter to close.'
 exit 1
fi
if [[ ! -f node_modules/vite/bin/vite.js ]]; then
 print 'Run npm install in this directory first.'
 read '?Press Enter to close.'
 exit 1
fi
"$SCIENCE_NODE" scripts/prepare-public.mjs
"$SCIENCE_NODE" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5181 --open
