#!/bin/bash
RESULT_FILE=$1
CHECK_FOR=$2

if [ -f $RESULT_FILE ]; then
  rm $RESULT_FILE
fi

touch $RESULT_FILE

checksum_file() {
  echo $(openssl md5 $1 | awk '{print $2}')
}

FILES=()

if [[ $CHECK_FOR = "packages" ]]
  while read -r -d ''; do
    FILES+=("$REPLY")
  done < <(find ./packages/*/src/** -name '*' -type f -print0)
then
  while read -r -d ''; do
    FILES+=("$REPLY")
  done < <(find . -name 'package-lock.json' -type f -print0)
fi

# Loop through files and append MD5 to result file
for FILE in ${FILES[@]}; do
	echo $(checksum_file $FILE) >> $RESULT_FILE
done

# Now sort the file so that it is
sort $RESULT_FILE -o $RESULT_FILE
