#!/bin/bash

# The frog shaders are authored for the admin login canvas and served again from
# the docs site's hero. VitePress can only serve files under docs/public, and the
# website container bind-mounts docs alone, so neither a symlink nor a copy step
# reaches across — the files are duplicated on purpose. This fails the build when
# the two copies drift, since a shader edited on one side and not the other shows
# up as two different frogs rather than as an error.
#
# Run with --fix to copy the admin's shaders over the website's.

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="$root_dir/admin/src/assets/shader"
mirror_dir="$root_dir/website/docs/public/shader"
shaders=(frog-face_vert-ready.glsl frog-face_frag-ready.glsl)

if [[ "${1:-}" == "--fix" ]]; then
  mkdir -p "$mirror_dir"
  for shader in "${shaders[@]}"; do
    cp "$source_dir/$shader" "$mirror_dir/$shader"
  done
  echo "Copied ${#shaders[@]} shader(s) to website/docs/public/shader/."
  exit 0
fi

drifted=0
for shader in "${shaders[@]}"; do
  if [[ ! -f "$mirror_dir/$shader" ]]; then
    echo "Missing: website/docs/public/shader/$shader"
    drifted=1
  elif ! diff --unified "$source_dir/$shader" "$mirror_dir/$shader"; then
    echo "Drifted: $shader differs between admin and website"
    drifted=1
  fi
done

if [[ $drifted -ne 0 ]]; then
  echo
  echo "Run 'bash scripts/check-shader-sync.sh --fix' to copy admin's shaders to the website."
  exit 1
fi

echo "Shaders in sync."
