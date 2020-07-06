while read -r -d ''; do
  sed -i 's/\/home\/runner\/work\/platform\/platform\//\/github\/workspace\//g' $REPLY
done < <(find ./applications/*/*/coverage -name 'lcov.info' -type f -print0)

while read -r -d ''; do
  sed -i 's/\/home\/runner\/work\/platform\/platform\//\/github\/workspace\//g' $REPLY
done < <(find ./packages/*/coverage -name 'lcov.info' -type f -print0)
