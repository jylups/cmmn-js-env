#!/bin/bash

###
# Setup script to be executed in a bpmn.io project root (some empty folder chosen by YOU)
###

base=`pwd`

echo cloning repositories

git clone git@github.com:bpmn-io/diagram-js.git
git clone git@github.com:bpmn-io/moddle.git
git clone git@github.com:bpmn-io/moddle-xml.git
git clone git@github.com:jylups/cmmn-js.git
git clone git@github.com:jylups/cmmn-moddle.git
git clone git@github.com:jylups/camunda-cmmn-moddle.git
git clone git@github.com:jylups/cmmn-js-properties-panel-flowable.git
git clone git@github.com:jylups/flowable-cmmn-moddle.git

echo done.

echo setup flowable-cmmn-moddle

cd $base/flowable-cmmn-moddle
npm install
npm link

cd $base/cmmn-js-properties-panel-flowable
npm install
npm link

echo setup camunda-cmmn-moddle

cd $base/camunda-cmmn-moddle
npm install
npm link

echo setup diagram-js

cd $base/diagram-js
npm install
npm link


echo setup moddle

cd $base/moddle
npm install
npm link


echo setup moddle-xml

cd $base/moddle-xml
npm link moddle
npm install
npm link


echo setup cmmn-moddle

cd $base/cmmn-moddle
npm link moddle-xml
npm link moddle
npm install
npm link


echo setup cmmn-js

cd $base/cmmn-js
npm install
npm link diagram-js
npm link cmmn-moddle
npm link


cd $base

echo all done.
