#!/bin/bash
# bower_dependencies.sh

echo "Please wait $USER,"
echo "Building dependencies for the CAPTEN project..."
echo

bJSON="./bower.json"

echo "Entering the TRY repository..."
cd ./TRY
echo "Running bower install@./TRY repository"
if [[ ! -e "$bJSON" ]]; then
  echo "[@TRY]: bower.json file is missing!"
  echo "[@TRY]: Eventual dependencies will not be built."
else
  bower install -V
fi

echo
echo "Entering the SEED repository..."
cd ../SEED
echo "Running bower install@./TRY repository"
if [[ ! -e "$bJSON" ]]; then
  echo "[@SEED]: bower.json file is missing!"
  echo "[@SEED]: Eventual dependencies will not be built."
else
  bower install -V
fi
