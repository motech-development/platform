#!/usr/bin/env bash
set -euo pipefail

AMAZON_LINUX_IMAGE='amazonlinux@sha256:ceeab7e010ed03ea155cfbbfd7140672eba5a49e1110b8b4ed35342312c3f21a'
BUILD_MANIFEST='bin/.build-revision'
CLAMAV_SOURCE_SHA256='5d3a20633bd589f612a71905a4fb50c1ee857cfbe6c72644368cac0030a1eeb4'
CLAMAV_VERSION='1.0.9'
build_revision="$(sha256sum "$0" | awk '{print $1}')"

if [[ -x bin/clamscan && -x bin/freshclam && -f "$BUILD_MANIFEST" ]]; then
  cached_revision="$(< "$BUILD_MANIFEST")"
  if [[ "$cached_revision" == "$build_revision" ]]; then
    echo "-- Using validated cached ClamAV binaries --"
    exit 0
  fi
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
    dnf -y install \
      gcc-11.5.0-5.amzn2023.0.5 \
      gcc-c++-11.5.0-5.amzn2023.0.5 \
      make-1:4.3-5.amzn2023.0.2 \
      cmake-3.22.2-1.amzn2023.0.6 \
      ninja-build-1.10.2-2.amzn2023.0.3 \
      git-2.50.1-1.amzn2023.0.1 \
      rust-1.94.0-1.amzn2023.0.2 \
      cargo-1.94.0-1.amzn2023.0.2 \
      pkgconf-pkg-config-1.8.0-4.amzn2023.0.2 \
      openssl-devel-1:3.5.5-1.amzn2023.0.4 \
      zlib-devel-1.2.11-33.amzn2023.0.6 \
      pcre2-devel-10.40-1.amzn2023.0.3 \
      libxml2-devel-2.10.4-1.amzn2023.0.18 \
      bzip2-devel-1.0.8-6.amzn2023.0.2 \
      libcurl-devel-8.17.0-1.amzn2023.0.2 \
      json-c-devel-0.14-8.amzn2023.0.2 \
      ncurses-devel-6.6-1.amzn2023.0.1 \
      tar-2:1.34-1.amzn2023.0.4 \
      xz-5.2.5-9.amzn2023.0.2 \
      wget-1.21.3-1.amzn2023.0.4 \
      ca-certificates-2025.2.76-1.0.amzn2023.0.2 \
      findutils-1:4.8.0-2.amzn2023.0.2 \
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

printf '%s\n' "$build_revision" > "$BUILD_MANIFEST"
