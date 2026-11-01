#!/bin/sh

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
BUILD_DIR="$ROOT_DIR/build"
OUTPUT_DIR="$ROOT_DIR/hostinger-dist"

cd "$ROOT_DIR"
npm run build

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"
cp -R "$BUILD_DIR"/. "$OUTPUT_DIR"/

# iCloud can leave placeholder files beside real assets; never upload them.
find "$OUTPUT_DIR" -name '*.icloud' -type f -delete
find "$OUTPUT_DIR" -type f -name 'index *.html' -delete

test -f "$OUTPUT_DIR/index.html"
test -f "$OUTPUT_DIR/.htaccess"
test -d "$OUTPUT_DIR/static"

cat > "$OUTPUT_DIR/DEPLOYMENT-NOTES.txt" <<'EOF'
Hostinger deployment package generated from the current production build.

Upload every file and folder inside this directory into the domain's
public_html directory. Upload hidden files too, especially .htaccess.

After upload:
- Enable the domain SSL certificate in hPanel.
- Clear Hostinger cache/CDN and browser cache.
- Verify / loads successfully.
- Verify direct route refreshes work, for example /products and /quantum.
- Verify HTTPS redirect and security headers are active.
EOF

printf '%s\n' "Hostinger package ready: $OUTPUT_DIR"