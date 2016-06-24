#!/bin/bash
# bower_dependencies.sh

echo "Please wait $USER,"
echo "Building dependencies for the CAPTEN project..."
echo

bJSON="./bower.json"
ROOTP=`dirname $0`

echo "Entering the TRY repository..."
cd $ROOTP/TRY
echo "[@TRY]: Running bower install..."
if [[ ! -e "$bJSON" ]]; then
  echo "[@TRY]: bower.json file is missing!"
  echo "[@TRY]: Eventual dependencies will not be built."
else
  bower install -V
  echo "[@TRY]: Done."
fi

echo
echo "Entering the SEED repository..."
cd ../$ROOTP/SEED
echo "[@SEED]: Running bower install@..."
if [[ ! -e "$bJSON" ]]; then
  echo "[@SEED]: bower.json file is missing!"
  echo "[@SEED]: Eventual dependencies will not be built."
else
  bower install -V
  echo "[@SEED]: Done."
fi
