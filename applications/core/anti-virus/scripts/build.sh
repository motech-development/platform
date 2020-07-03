#!/usr/bin/env bash
set -e

mkdir -p clamav

echo "-- Downloading AmazonLinux container --"
docker pull amazonlinux
docker create -i -t -v /home/docker --name s3-antivirus-builder amazonlinux
docker start s3-antivirus-builder

echo "-- Updating, downloading and unpacking clamAV and ClamAV update --"
docker exec -t -w /home/docker s3-antivirus-builder yum clean all
docker exec -t -w /home/docker s3-antivirus-builder yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
docker exec -t -w /home/docker s3-antivirus-builder yum -y install clamav clamav-lib clamav-update json-c pcre2 libxml2 bzip2-libs libtool-ltdl xz-libs
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "echo 'folder content' && ls -la"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "ldd /usr/bin/clamscan | grep '=>' | grep -v -e '^$' | awk '{print \$3}' | xargs -I % sh -c 'cp %* .'"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "ldd /usr/bin/freshclam | grep '=>' | grep -v -e '^$' | awk '{print \$3}' | xargs -I % sh -c 'cp %* .'"
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "cp /usr/bin/clamscan ."
docker exec -t -w /home/docker s3-antivirus-builder /bin/sh -c "cp /usr/bin/freshclam ."

docker cp s3-antivirus-builder:/home/docker clamav

docker stop s3-antivirus-builder
docker rm s3-antivirus-builder

mkdir ./bin

echo "-- Copying the executables and required libraries --"
cp clamav/docker/* bin/.

echo "-- Cleaning up ClamAV folder --"
rm -rf clamav
