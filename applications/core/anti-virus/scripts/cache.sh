#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIRECTORY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APPLICATION_DIRECTORY="$(dirname "$SCRIPT_DIRECTORY")"
BINARY_DIRECTORY="$APPLICATION_DIRECTORY/bin"
BUILD_MANIFEST="$BINARY_DIRECTORY/.build-manifest"
BUILD_REVISION="$BINARY_DIRECTORY/.build-revision"

cache_revision() {
  {
    for input in \
      "$APPLICATION_DIRECTORY/build-inputs.env" \
      "$SCRIPT_DIRECTORY/build.sh" \
      "$SCRIPT_DIRECTORY/cache.sh"; do
      sha256sum "$input" | awk '{print $1}'
    done
  } | sha256sum | awk '{print $1}'
}

write_checksums() {
  local file name

  while IFS= read -r -d '' file; do
    name="${file##*/}"
    if [[ ! "$name" =~ ^[A-Za-z0-9._+-]+$ ]]; then
      echo "Unsupported cached binary filename: $name" >&2
      return 1
    fi
    sha256sum "$file" | awk -v name="$name" '{print $1 "  " name}'
  done < <(
    find "$BINARY_DIRECTORY" -mindepth 1 -maxdepth 1 -type f \
      ! -name '.build-manifest' ! -name '.build-revision' -print0 | sort -z
  )
}

validate_required_files() {
  local required

  for required in clamscan freshclam; do
    if [[ ! -f "$BINARY_DIRECTORY/$required" || -L "$BINARY_DIRECTORY/$required" ]]; then
      echo "Missing required ClamAV binary: $required" >&2
      return 1
    fi
    if [[ ! -x "$BINARY_DIRECTORY/$required" ]]; then
      echo "ClamAV binary is not executable: $required" >&2
      return 1
    fi
  done
}

validate_cache() {
  local actual_manifest cached_revision expected_revision invalid_entry

  if [[ ! -d "$BINARY_DIRECTORY" ]]; then
    echo 'ClamAV binary cache is absent' >&2
    return 1
  fi

  invalid_entry="$(
    find "$BINARY_DIRECTORY" -mindepth 1 -maxdepth 1 ! -type f -print -quit
  )"
  if [[ -n "$invalid_entry" ]]; then
    echo "Unsupported entry in ClamAV binary cache: ${invalid_entry##*/}" >&2
    return 1
  fi

  if [[ ! -f "$BUILD_MANIFEST" || -L "$BUILD_MANIFEST" ]]; then
    echo 'ClamAV cache manifest is absent or invalid' >&2
    return 1
  fi
  if [[ ! -f "$BUILD_REVISION" || -L "$BUILD_REVISION" ]]; then
    echo 'ClamAV cache build revision is absent or invalid' >&2
    return 1
  fi

  expected_revision="$(cache_revision)"
  cached_revision="$(< "$BUILD_REVISION")"
  if [[ "$cached_revision" != "$expected_revision" ]]; then
    echo 'ClamAV cache build inputs have changed' >&2
    return 1
  fi

  validate_required_files

  actual_manifest="$(mktemp "${TMPDIR:-/tmp}/clamav-manifest.XXXXXX")"
  trap 'rm -f "$actual_manifest"' RETURN
  write_checksums > "$actual_manifest"
  if [[ ! -s "$actual_manifest" ]] || ! cmp -s "$BUILD_MANIFEST" "$actual_manifest"; then
    echo 'ClamAV cache contents are incomplete or corrupt' >&2
    return 1
  fi
}

write_cache() {
  local manifest_temp revision_temp

  if [[ ! -d "$BINARY_DIRECTORY" ]]; then
    echo 'Cannot record an absent ClamAV binary directory' >&2
    return 1
  fi
  validate_required_files

  manifest_temp="$(mktemp "${TMPDIR:-/tmp}/clamav-manifest.XXXXXX")"
  revision_temp="$(mktemp "${TMPDIR:-/tmp}/clamav-revision.XXXXXX")"
  trap 'rm -f "$manifest_temp" "$revision_temp"' RETURN
  rm -f "$BUILD_MANIFEST" "$BUILD_REVISION"
  write_checksums > "$manifest_temp"
  printf '%s\n' "$(cache_revision)" > "$revision_temp"
  mv "$manifest_temp" "$BUILD_MANIFEST"
  mv "$revision_temp" "$BUILD_REVISION"
  validate_cache
}

case "${1:-validate}" in
  revision)
    cache_revision
    ;;
  validate)
    validate_cache
    ;;
  write)
    write_cache
    ;;
  *)
    echo 'Usage: cache.sh [revision|validate|write]' >&2
    exit 2
    ;;
esac
