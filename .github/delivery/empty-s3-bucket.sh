#!/usr/bin/env bash

set -euo pipefail

bucket_uri="${1:-}"
if [[ $# -ne 1 || ! "$bucket_uri" =~ ^s3://([^/]+)$ ]]; then
  echo 'Usage: empty-s3-bucket.sh s3://bucket-name' >&2
  exit 2
fi
bucket_name="${BASH_REMATCH[1]}"

if output="$(aws s3api head-bucket --bucket "$bucket_name" 2>&1)"; then
  aws s3 rm "$bucket_uri" --recursive
elif [[ "$output" == *"(404)"* || "$output" == *"Not Found"* || "$output" == *"NoSuchBucket"* ]]; then
  echo "Bucket $bucket_uri is already missing."
else
  echo "$output" >&2
  exit 1
fi
