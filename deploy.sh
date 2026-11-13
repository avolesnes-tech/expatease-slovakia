#!/bin/bash
# ExpatBase deploy: SEO build + Cloudflare Pages
set -e
cd "$(dirname "$0")"
node scripts/build-seo.mjs
npx wrangler pages deploy . --project-name=expatease-final "$@"
