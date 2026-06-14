#!/usr/bin/env bash
#
# Copies the freshly-built release APK into ./dist (replacing any previous one)
# and installs it on the connected device with adb. Run this after a release
# build so you always have a clean, shareable APK in dist/ to side-load onto
# other devices for testing.
#
# Usage: npm run apk:install   (or: bash scripts/release-apk.sh)

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APK_SOURCE="$ROOT/android/app/build/outputs/apk/release/app-release.apk"
DIST_DIR="$ROOT/dist"
APK_DEST="$DIST_DIR/polaris-release.apk"

if [ ! -f "$APK_SOURCE" ]; then
  echo "Release APK not found at:"
  echo "  $APK_SOURCE"
  echo "Build it first with: npm run release:android"
  exit 1
fi

mkdir -p "$DIST_DIR"
cp -f "$APK_SOURCE" "$APK_DEST"
echo "Copied release APK -> $APK_DEST"

if command -v adb >/dev/null 2>&1; then
  echo "Installing on the connected device..."
  adb install -r "$APK_DEST"
  echo "Done."
else
  echo "adb not found on PATH — skipped install."
  echo "The shareable APK is ready at: $APK_DEST"
fi
