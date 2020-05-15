#!/usr/bin/env bash
set -e
LAMBDA_FILE="lambda.zip"

rm -f ${LAMBDA_FILE}

mkdir -p clamav

echo "-- Downloading AmazonLinux container --"
docker pull amazonlinux
docker create -i -t -v ${PWD}/clamav:/home/docker  --name s3-antivirus-builder amazonlinux
docker start s3-antivirus-builder

echo "-- Updating, downloading and unpacking clamAV and ClamAV update --"
docker exec -it -w /home/docker s3-antivirus-builder yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
docker exec -it -w /home/docker s3-antivirus-builder yum -y install clamav clamav-lib clamav-update json-c pcre2 libxml2 bzip2-libs libtool-ltdl xz-libs
docker exec -it -w /home/docker s3-antivirus-builder /bin/sh -c "echo 'folder content' && ls -la"
docker exec -it -w /home/docker s3-antivirus-builder /bin/sh -c "ldd /usr/bin/clamscan | grep '=>' | grep -v -e '^$' | awk '{print \$3}' | xargs -I % sh -c 'cp %* .'"
docker exec -it -w /home/docker s3-antivirus-builder /bin/sh -c "ldd /usr/bin/freshclam | grep '=>' | grep -v -e '^$' | awk '{print \$3}' | xargs -I % sh -c 'cp %* .'"
docker exec -it -w /home/docker s3-antivirus-builder /bin/sh -c "cp /usr/bin/clamscan ."
docker exec -it -w /home/docker s3-antivirus-builder /bin/sh -c "cp /usr/bin/freshclam ."

docker stop s3-antivirus-builder
docker rm s3-antivirus-builder

mkdir ./bin

echo "-- Copying the executables and required libraries --"
cp clamav/* bin/.

echo "-- Cleaning up ClamAV folder --"
rm -rf clamav
