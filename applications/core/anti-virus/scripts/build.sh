#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIRECTORY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APPLICATION_DIRECTORY="$(dirname "$SCRIPT_DIRECTORY")"
cd "$APPLICATION_DIRECTORY"

source ./build-inputs.env

if ./scripts/cache.sh validate; then
  echo "-- Using validated cached ClamAV binaries --"
  exit 0
fi

rm -rf bin
mkdir -p clamav

echo "-- Downloading Amazon Linux 2023 container --"
docker pull "$AMAZON_LINUX_IMAGE"
docker create -i -t -v /home/docker --name s3-antivirus-builder "$AMAZON_LINUX_IMAGE"
docker start s3-antivirus-builder

echo "-- Downloading and unpacking ClamAV build tools --"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "\
  set -eux; \
  echo 'fastestmirror=True' >> /etc/dnf/dnf.conf; \
  echo 'max_parallel_downloads=10' >> /etc/dnf/dnf.conf; \
  echo 'timeout=300' >> /etc/dnf/dnf.conf; \
  echo 'retries=10' >> /etc/dnf/dnf.conf; \
  dnf clean all; \
  dnf -y makecache --refresh\
"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "\
  set -eux; \
  for i in 1 2 3 4 5; do \
    dnf -y install $CLAMAV_BUILD_PACKAGES \
      && break || (echo 'dnf install failed, retrying...'; dnf clean all; sleep 5); \
  done\
"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "update-ca-trust"
echo "-- Building ClamAV from source ($CLAMAV_VERSION) --"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "\
  set -euxo pipefail; \
  CLAMAV_SOURCE_SHA256='$CLAMAV_SOURCE_SHA256'; \
  CLAMAV_VERSION='$CLAMAV_VERSION'; \
  CLAMAV_TAG=clamav-\${CLAMAV_VERSION}; \
  echo \"Downloading source from GitHub releases for \${CLAMAV_VERSION}...\"; \
  wget -q https://github.com/Cisco-Talos/clamav/releases/download/\${CLAMAV_TAG}/\${CLAMAV_TAG}.tar.gz -O \${CLAMAV_TAG}.tar.gz; \
  echo \"\${CLAMAV_SOURCE_SHA256}  \${CLAMAV_TAG}.tar.gz\" | sha256sum --check -; \
  echo 'Extracting...'; \
  tar -xzf \${CLAMAV_TAG}.tar.gz; \
  cd \${CLAMAV_TAG}; \
  echo 'Configuring (CMake)...'; \
  cmake -S . -B build -G Ninja $CLAMAV_CMAKE_OPTIONS; \
  echo 'Building...'; \
  cmake --build build -j; \
  echo 'Installing...'; \
  cmake --install build; \
  echo 'Built ClamAV'; \
  ls -la /usr/local/bin \
"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "echo 'folder content' && ls -la"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "ldd /usr/local/bin/clamscan | grep '=>' | grep -v -e '^$' | awk '{print \$3}' | xargs -I % sh -c 'cp %* .'"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "ldd /usr/local/bin/freshclam | grep '=>' | grep -v -e '^$' | awk '{print \$3}' | xargs -I % sh -c 'cp %* .'"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "cp /usr/local/bin/clamscan ."
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "cp /usr/local/bin/freshclam ."

docker cp s3-antivirus-builder:/home/docker clamav

docker stop s3-antivirus-builder
docker rm s3-antivirus-builder

mkdir ./bin

echo "-- Copying the executables and required libraries --"
find clamav/docker -maxdepth 1 -type f -exec cp {} bin/. \;

echo "-- Cleaning up ClamAV folder --"
rm -rf clamav

./scripts/cache.sh write
