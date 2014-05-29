// -- Compile ES6
var traceur = require("traceur");

// Make sure the traceur runtime is loaded
require(require.resolve(traceur.RUNTIME_PATH));

function compileES6(filename, contents) {

  var result = traceur.compile(contents,  { filename: filename, modules: 'inline' });

  if (result.errors.length > 0) {
    throw new Error(result.errors.join("\n"));
  }

  return result.js;
}

// -- Compile JSX
var React = require("react-tools");

// Import everything in the transformer codepath before we add the import hook 
// Based on https://github.com/petehunt/node-jsx
React.transform('');

module.exports = compileJSX;

function compileJSX(filename, src) {
  try {
    return React.transform(src);
  } catch (e) {
    throw new Error('Error transforming ' + filename + ' to JSX: ' + e.toString());
  }
}

var pilequire = require('..');

const EXCLUDE_FILES = /^(?!.*node_modules)/;
function filterFn(module, filename) {
  return EXCLUDE_FILES.test(filename)
}
// Register compilers for .jsx and .js
pilequire.install('.jsx', [compileJSX, compileES6], filterFn);
pilequire.install('.js', compileES6, filterFn);
