'use strict';

require('@jylups/cmmn-js/dist/assets/diagram-js.css');
require('@jylups/cmmn-js/dist/assets/cmmn-font/css/cmmn-embedded.css');
require('@jylups/cmmn-js/assets/cmmn-js-touch.css');
require('cmmn-js-properties-panel-flowable/styles/properties.less');
require('./styles.css');

var CmmnViewer = require('@jylups/cmmn-js/lib/NavigatedViewer'),
    CmmnModeler = require('@jylups/cmmn-js/lib/Modeler');

// touch editing turns itself on only on touch screens (jylups/cmmn-js-env#55)
var touchModule = require('@jylups/cmmn-js/lib/features/touch');

var propertiesPanelModule = require('cmmn-js-properties-panel-flowable'),
    flowablePropertiesProviderModule = require('cmmn-js-properties-panel-flowable/lib/provider/flowable');

var flowableModdleDescriptor = require('flowable-cmmn-moddle/resources/flowable');

var SAMPLES = require('./samples');

var STORAGE_KEY = 'cmmn-playground';


// elements

var body = document.body,
    canvasEl = document.getElementById('canvas'),
    propertiesEl = document.getElementById('properties'),
    sampleEl = document.getElementById('sample'),
    fileEl = document.getElementById('file'),
    xmlEl = document.getElementById('xml'),
    warningsEl = document.getElementById('warnings'),
    warningCountEl = document.getElementById('warning-count'),
    statusEl = document.getElementById('status');


// state

/**
 * mode: 'viewer' | 'modeler'
 * xml: the diagram as last imported or exported
 * source: where the diagram came from (sample id, file name or 'editor')
 */
var state = restore() || {
  mode: 'modeler',
  xml: SAMPLES[0].xml,
  source: SAMPLES[0].id
};

var instance;


// diagram

function createInstance(mode) {

  if (instance) {
    instance.destroy();
  }

  canvasEl.innerHTML = '';
  propertiesEl.innerHTML = '';

  var options = {
    container: canvasEl,

    // shortcuts work while the canvas has focus (click into the diagram)
    keyboard: { bind: true },
    moddleExtensions: {
      flowable: flowableModdleDescriptor
    },

    // attributes Flowable reads in the Flowable namespace too, which moddle can't
    // type next to the CMMN ones; the properties panel reads them
    problems: {
      ignoredAttributes: [ 'flowable:sentryRef', 'flowable:autoComplete', 'flowable:isBlocking' ]
    }
  };

  if (mode === 'modeler') {
    options.additionalModules = [
      propertiesPanelModule,
      flowablePropertiesProviderModule,
      touchModule
    ];

    options.propertiesPanel = {
      parent: propertiesEl
    };

    instance = new CmmnModeler(options);

    instance.on('commandStack.changed', exportXML);
  } else {
    instance = new CmmnViewer(options);
  }

  // a fixed problem leaves the list
  instance.on('problems.changed', function() {
    showProblems();
  });

  body.setAttribute('data-mode', mode);
}

function importXML(xml, source) {
  state.source = source;
  sampleEl.value = findSample(source) ? source : '';

  instance.importXML(xml, function(err) {
    showProblems(err);

    if (err) {
      // keep the XML that failed so it can be fixed in the editor
      xmlEl.value = xml;
      setStatus('Import failed: ' + err.message, 'error');

      return;
    }

    fitViewport();

    var problemCount = countProblems('error');

    setStatus(
      'Opened ' + describeSource(source) +
      (problemCount ? ' with ' + problemCount + ' problem(s)' : ''),
      problemCount ? 'warning' : 'ok'
    );

    exportXML();
  });
}

/**
 * Zooms to fit after the browser has laid out the canvas. Zooming inside the
 * import callback divides by an empty viewport, and an exception thrown there
 * makes cmmn-js call the callback a second time with the error.
 */
function fitViewport() {
  var current = instance;

  requestAnimationFrame(function() {
    if (current !== instance) {
      return;
    }

    try {
      instance.get('canvas').zoom('fit-viewport');
    } catch (e) {
      console.warn('fit-viewport failed', e);
    }
  });
}

function exportXML() {
  instance.saveXML({ format: true }, function(err, xml) {
    if (err) {
      setStatus('Export failed: ' + err.message, 'error');

      return;
    }

    xmlEl.value = xml;
    state.xml = xml;

    persist();
  });
}

function switchMode(mode) {
  if (mode === state.mode && instance) {
    return;
  }

  state.mode = mode;

  createInstance(mode);
  importXML(state.xml, state.source);
}


// problems and status

/**
 * The problems of the opened model, from the problems service of cmmn-js:
 * what is lost on save or not shown first, then, collapsed, what is kept
 * but not recognised. Selecting a problem selects its element.
 *
 * @param {Error} [err] the error of a failed import
 */
function showProblems(err) {
  var problems = getProblems(),
      errors = problems.filter(function(problem) { return problem.severity === 'error'; }),
      infos = problems.filter(function(problem) { return problem.severity !== 'error'; });

  warningsEl.innerHTML = '';

  if (err) {
    warningsEl.appendChild(problemList([ { message: 'The file could not be opened: ' + err.message } ], 'error'));
  }

  if (errors.length) {
    warningsEl.appendChild(problemList(errors, 'error'));
  }

  if (infos.length) {
    var details = document.createElement('details'),
        summary = document.createElement('summary');

    summary.textContent = infos.length + ' kept but not recognised';

    details.appendChild(summary);
    details.appendChild(problemList(infos, 'info'));

    warningsEl.appendChild(details);
  }

  if (!err && !problems.length) {
    var empty = document.createElement('p');

    empty.className = 'empty';
    empty.textContent = 'No problems.';

    warningsEl.appendChild(empty);
  }

  var count = errors.length + (err ? 1 : 0);

  warningCountEl.textContent = count ? '(' + count + ')' : '';

  if (count) {
    showTab('warnings');
  }
}

function problemList(problems, kind) {
  var list = document.createElement('ol');

  list.className = 'problem-list ' + kind;

  problems.forEach(function(problem) {
    var item = document.createElement('li');

    item.textContent = problem.message;

    if (problem.element) {
      item.className = 'selectable';
      item.title = 'Select ' + problem.element.id;

      item.addEventListener('click', function() {
        selectElement(problem.element);
      });
    }

    list.appendChild(item);
  });

  return list;
}

function selectElement(element) {
  var selection = instance.get('selection', false),
      canvas = instance.get('canvas');

  if (selection) {
    selection.select(element);
  }

  if (canvas.scrollToElement) {
    canvas.scrollToElement(element);
  }
}

function getProblems() {
  var problems = instance && instance.get('problems', false);

  return problems ? problems.getProblems() : [];
}

function countProblems(severity) {
  return getProblems().filter(function(problem) {
    return problem.severity === severity;
  }).length;
}

function setStatus(message, kind) {
  statusEl.textContent = message;
  statusEl.className = 'status ' + (kind || '');
}


// samples, files and download

function findSample(id) {
  return SAMPLES.filter(function(sample) {
    return sample.id === id;
  })[0];
}

function describeSource(source) {
  var sample = findSample(source);

  return sample ? sample.label : source;
}

function openFile(file) {
  var reader = new FileReader();

  reader.onload = function() {
    importXML(reader.result, file.name);
  };

  reader.onerror = function() {
    setStatus('Could not read ' + file.name, 'error');
  };

  reader.readAsText(file);
}

function download() {
  var problems = instance && instance.get('problems', false),
      removed = problems ? problems.getRemovedOnSave() : [];

  if (removed.length && !window.confirm(
    'Saving removes ' + removed.length + ' part(s) of this model:\n\n' +
    removed.map(function(problem) { return '- ' + problem.message; }).join('\n') +
    '\n\nDownload anyway?'
  )) {
    return;
  }

  var name = findSample(state.source) ? state.source + '.cmmn' : String(state.source || 'diagram');

  if (!/\.(cmmn|xml)$/.test(name)) {
    name += '.cmmn';
  }

  var link = document.createElement('a');

  link.href = URL.createObjectURL(new Blob([ xmlEl.value ], { type: 'application/xml' }));
  link.download = name;
  link.click();

  URL.revokeObjectURL(link.href);
}


// persistence across reloads (the dev server reloads on every source change)

function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // storage unavailable; the diagram is only lost on reload
  }
}

function restore() {
  try {
    var stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY));

    return stored && stored.xml ? stored : null;
  } catch (e) {
    return null;
  }
}


// tabs

function showTab(name) {
  document.querySelectorAll('[data-tab]').forEach(function(tab) {
    tab.classList.toggle('active', tab.getAttribute('data-tab') === name);
  });

  document.querySelectorAll('[data-pane]').forEach(function(pane) {
    pane.hidden = pane.getAttribute('data-pane') !== name;
  });
}


// wiring

SAMPLES.forEach(function(sample) {
  var option = document.createElement('option');

  option.value = sample.id;
  option.textContent = sample.label;

  sampleEl.appendChild(option);
});

var customOption = document.createElement('option');

customOption.value = '';
customOption.textContent = '(file or editor)';
customOption.disabled = true;

sampleEl.appendChild(customOption);

sampleEl.addEventListener('change', function() {
  var sample = findSample(sampleEl.value);

  if (sample) {
    importXML(sample.xml, sample.id);
  }
});

document.getElementById('open').addEventListener('click', function() {
  fileEl.click();
});

fileEl.addEventListener('change', function() {
  if (fileEl.files[0]) {
    openFile(fileEl.files[0]);
  }

  fileEl.value = '';
});

document.querySelectorAll('[data-mode]').forEach(function(button) {
  button.addEventListener('click', function() {
    switchMode(button.getAttribute('data-mode'));
  });
});

document.getElementById('download').addEventListener('click', download);

document.getElementById('import-xml').addEventListener('click', function() {
  importXML(xmlEl.value, 'editor');
});

document.querySelectorAll('[data-tab]').forEach(function(tab) {
  tab.addEventListener('click', function() {
    showTab(tab.getAttribute('data-tab'));
  });
});

document.addEventListener('dragover', function(event) {
  event.preventDefault();
  body.classList.add('dragging');
});

document.addEventListener('dragleave', function(event) {
  if (!event.relatedTarget) {
    body.classList.remove('dragging');
  }
});

document.addEventListener('drop', function(event) {
  event.preventDefault();
  body.classList.remove('dragging');

  var file = event.dataTransfer.files[0];

  if (file) {
    openFile(file);
  }
});


// start

showTab('xml');
createInstance(state.mode);
importXML(state.xml, state.source);

// expose for debugging in the browser console
window.cmmnPlayground = {
  get instance() {
    return instance;
  },
  state: state
};
