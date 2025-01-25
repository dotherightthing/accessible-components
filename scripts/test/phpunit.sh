#!/bin/bash

# File: ./scripts/test/phpunit.sh
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

# run phpunit tests
#
# test -x = test that file exists and is executable.
# https://stackoverflow.com/a/592635/6850747
#
# >&2 = send message to stderr
# https://stackoverflow.com/a/55006371/6850747

node scripts/helpers/decorate-log.mjs 'test' 'phpunit' 'run unit tests' \
&& cd $INIT_CWD \
&& test -x ./vendor/bin/phpunit && ./vendor/bin/phpunit --debug --configuration phpunit.xml.dist || echo 'phpunit not found, skipping'
