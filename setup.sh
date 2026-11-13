#!/usr/bin/env bash

###
# Sets up the cmmn-js development workspace.
#
# Run it from the root of a cmmn-js-env checkout. It clones the package
# repositories next to this script (skipping any that already exist) and
# installs everything with npm workspaces, so the packages use each other's
# local sources instead of the published versions.
###

set -euo pipefail

cd "$(dirname "$0")"

clone() {
  local repo=$1 branch=$2

  if [ -d "$repo/.git" ]; then
    echo "$repo already cloned (on branch $(git -C "$repo" branch --show-current)), skipping"
  else
    git clone --branch "$branch" "git@github.com:jylups/$repo.git"
  fi
}

echo "cloning repositories"

clone cmmn-moddle master
clone flowable-cmmn-moddle main
clone cmmn-js master
clone cmmn-js-properties-panel-flowable master

echo "installing workspace dependencies"

npm install

echo "building cmmn-js dist (assets used by the properties panel tests)"

npm run build

echo "all done."
