#!/bin/bash

# File: ./scripts/changelog/changelog.sh
#
# Note:
# chmod a+x = Change access permissions of this file, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x scripts/**/*.sh
# ---

# e: exit the script if any statement returns a non-true return value
# v: print shell input lines as they are read (including all comments!)
set -e

# generate changelog

node scripts/helpers/decorate-log.mjs 'changelog' 'changelog' 'generate from commit history' \
&& cd $INIT_CWD \
&& git log --pretty="* [%h] %s" --no-merges $(git describe --tags --abbrev=0 @^)..@ > CHANGELOG.md
