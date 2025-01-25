#!/bin/bash

# File: ./scripts/postuninstall/config.sh
#
# Note:
# chmod a+x = Change access permissions of install.sh, to 'e[x]ecutable' for '[a]ll users'
#
# Example:
# ---
# chmod a+x install.sh
# sh install.sh
# ---

# e: exit the script if any statement returns a non-true return value
# v: print shell input lines as they are read (including all comments!)
set -e

# -f: force - don't throw an error if the file doesn't exist (e.g. css not compiled)
node scripts/helpers/decorate-log.mjs 'postuninstall' 'config' 'remove files from host repository' \
&& cd $INIT_CWD \
&& rm -rf config/naturaldocs \
&& rm -rf css \
&& rm -rf docs \
&& rm -rf release* \
&& rm -f .babelrc \
&& rm -f .browserslistrc \
&& rm -f .eslintrc \
&& rm -rf .github \
&& rm -f .stylelint* \
&& rm -f js/*-es5.js \
&& rm -f nodemon.json \
&& rm -f phpcs.xml \
&& rm -f phpunit.xml.dist \
&& rm -f postcss.config.js
