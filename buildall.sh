#!/bin/bash

###
# Setup script to be executed in a bpmn.io project root (some empty folder chosen by YOU)
###

base=`pwd`

echo setup cmmn-js-properties-panel-flowable

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
