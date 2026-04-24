#!/usr/bin/env bash
set -e

mkdir -p clamav

echo "-- Downloading Amazon Linux 2023 container --"
docker pull amazonlinux:2023
docker create -i -t -v /home/docker --name s3-antivirus-builder amazonlinux:2023
docker start s3-antivirus-builder

echo "-- Updating, downloading and unpacking ClamAV and definitions tools --"
# Update base and install build/runtime dependencies
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "\
  set -eux; \
  echo 'fastestmirror=True' >> /etc/dnf/dnf.conf; \
  echo 'max_parallel_downloads=10' >> /etc/dnf/dnf.conf; \
  echo 'timeout=300' >> /etc/dnf/dnf.conf; \
  echo 'retries=10' >> /etc/dnf/dnf.conf; \
  dnf clean all; \
  dnf -y makecache --refresh; \
  dnf -y update\
"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "\
  set -eux; \
  for i in 1 2 3 4 5; do \
    dnf -y install \
  gcc \
  gcc-c++ \
  make \
  cmake \
  ninja-build \
  git \
  rust \
  cargo \
  pkgconf-pkg-config \
  openssl-devel \
  zlib-devel \
  pcre2-devel \
  libxml2-devel \
  bzip2-devel \
  libcurl-devel \
  json-c-devel \
  ncurses-devel \
  tar \
  xz \
  wget \
  ca-certificates \
  findutils && break || (echo 'dnf install failed, retrying...'; dnf clean all; sleep 5); \
  done\
"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "update-ca-trust"
echo "-- Building ClamAV from source (1.0.9) --"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "\
  set -euxo pipefail; \
  CLAMAV_VERSION=1.0.9; \
  CLAMAV_TAG=clamav-\${CLAMAV_VERSION}; \
  echo \"Downloading source from GitHub releases for \${CLAMAV_VERSION}...\"; \
  wget -q https://github.com/Cisco-Talos/clamav/releases/download/\${CLAMAV_TAG}/\${CLAMAV_TAG}.tar.gz -O \${CLAMAV_TAG}.tar.gz; \
  echo 'Extracting...'; \
  tar -xzf \${CLAMAV_TAG}.tar.gz; \
  cd \${CLAMAV_TAG}; \
  echo 'Configuring (CMake)...'; \
  cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr/local -DENABLE_CLAMONACC=OFF -DENABLE_TESTS=OFF -DENABLE_MILTER=OFF -DENABLE_CLAMAV_MILTER=OFF -DENABLE_RAR=OFF; \
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
