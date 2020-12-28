
#!/bin/bash

# File: ./build-scripts/merge-js.sh
# Allows classes to be authored in separate files but merged into frontend.js
# for linting and transpiling to frontend-es5.js via wpdtrt-npm-scripts.
# This script can be run via npm run merge:js
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x build-scripts/*.sh
# ---

# e: exit the script if any statement returns a non-true return value
# v: print shell input lines as they are read (including all comments!)
set -e

# https://www.cyberciti.biz/faq/bash-read-file-names-from-a-text-file-and-take-action/
# IFS = Internal Field Separator
# -r = newline
# file = variable name

# ===== BACKEND =====

backendJs="${1:-./js/backend.js}"
backendSrc="${1:-./js/backend.txt}"
backendTimestamp=$(date +"/* backend.js - generated %d/%m/%Y at %T from: */")
index=0

# if backendSrc doesn't exist
if [ ! -f "$backendSrc" ]; then
    echo "$0 - File $backendSrc not found.";
    exit 1;
fi

# if backendJs exists empty it, otherwise create it
echo "${backendTimestamp}" > "${backendJs}"

# read file list in backendSrc, copy filename to backendJs
while IFS= read -r file
do
    index=$(($index+1))
    echo "/* $index $file */" >> "${backendJs}"
done < "${backendSrc}"

echo "\r" >> "${backendJs}"

# read file list in backendSrc, copy contents to backendJs
while IFS= read -r file
do
    cat $file >> "${backendJs}"
done < "${backendSrc}"

# ===== FRONTEND =====

frontendJs="${1:-./js/frontend.js}"
frontendSrc="${1:-./js/frontend.txt}"
frontendTimestamp=$(date +"/* frontend.js - generated %d/%m/%Y at %T from: */")
index=0

# if frontendSrc doesn't exist
if [ ! -f "$frontendSrc" ]; then
    echo "$0 - File $frontendSrc not found.";
    exit 1;
fi

# if frontendJs exists empty it, otherwise create it
echo "${frontendTimestamp}" > "${frontendJs}"

# read file list in frontendSrc, copy filename to frontendJs
while IFS= read -r file
do
    index=$(($index+1))
    echo "/* $index $file */" >> "${frontendJs}"
done < "${frontendSrc}"

echo "\r" >> "${frontendJs}"

# read file list in frontendSrc, copy contents to frontendJs
while IFS= read -r file
do
    cat $file >> "${frontendJs}"
done < "${frontendSrc}"
