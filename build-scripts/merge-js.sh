
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

cat ./js/classes/_config.js ./js/classes/*.js ./js/init.js > ./js/frontend.js
