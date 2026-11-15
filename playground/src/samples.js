'use strict';

// Sample diagrams, read straight from the packages' test fixtures so they
// stay in sync with the workspace sources.

module.exports = [
  {
    id: 'flowable-human-task',
    label: 'Flowable: human task',
    xml: require('cmmn-js-properties-panel-flowable/test/spec/provider/flowable/HumanTask.cmmn')
  },
  {
    id: 'flowable-lifecycle-listeners',
    label: 'Flowable: lifecycle listeners',
    xml: require('cmmn-js-properties-panel-flowable/test/spec/provider/flowable/LifecycleListener.cmmn')
  },
  {
    id: 'flowable-task-listener',
    label: 'Flowable: task listener',
    xml: require('cmmn-js-properties-panel-flowable/test/spec/provider/flowable/TaskListener.cmmn')
  },
  {
    id: 'flowable-not-read',
    label: 'Flowable: parts Flowable does not read',
    xml: require('cmmn-js-properties-panel-flowable/test/spec/provider/flowable/NotReadByFlowable.cmmn')
  },
  {
    id: 'flowable-listener-field-injection',
    label: 'Flowable: listener field injection',
    xml: require('cmmn-js-properties-panel-flowable/test/spec/provider/flowable/ListenerFieldInjection.cmmn')
  },
  {
    id: 'flowable-variable-mapping',
    label: 'Flowable: variable mapping',
    xml: require('cmmn-js-properties-panel-flowable/test/spec/provider/flowable/VariableMapping.cmmn')
  },
  {
    id: 'flowable-callable-extension',
    label: 'Flowable: callable extension',
    xml: require('cmmn-js-properties-panel-flowable/test/spec/provider/flowable/CallableExtension.cmmn')
  },
  {
    id: 'flowable-script',
    label: 'Flowable: script',
    xml: require('cmmn-js-properties-panel-flowable/test/spec/provider/flowable/Script.cmmn')
  },
  {
    id: 'flowable-repeat-on-standard-event',
    label: 'Flowable: repeat on standard event',
    xml: require('cmmn-js-properties-panel-flowable/test/spec/provider/flowable/RepeatOnStandardEvent.cmmn')
  },
  {
    id: 'flowable-case-history-time-to-live',
    label: 'Flowable: case history time to live',
    xml: require('cmmn-js-properties-panel-flowable/test/spec/provider/flowable/CaseHistoryTimeToLive.cmmn')
  },
  {
    id: 'cmmn-simple',
    label: 'CMMN: simple',
    xml: require('@jylups/cmmn-js/test/fixtures/cmmn/simple.cmmn')
  },
  {
    id: 'cmmn-complex',
    label: 'CMMN: complex',
    xml: require('@jylups/cmmn-js/test/fixtures/cmmn/complex.cmmn')
  }
];
