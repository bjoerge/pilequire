# Pilequire

Provides an easy way to install a set of transpilers/compilers for a file extension so that modules can be compiled on-demand when 
they are require()'d.

## Disclaimer
This module relies on the deprecated [require.extensions](http://nodejs.org/api/globals.html#globals_require_extensions).
Even though `require.extensions` is likely to never be removed, don't use `pilequire` for modules that you want others to depend on.
Instead, you should compile all source code to javascript up front before publishing.

That said, `require.extensions` is still widely used (e.g. by coffee-script, traceur-compiler, etc.) for these kinds of scenarios,
and I have not been able to find any good replacement. If you know of a better solution, please let me know.

Use `pilequire` to register a set of source transforms/transpilers to run on a given extension, for example:

`React JSX w/ES6 syntax` => `valid es6` => `valid es5`

```js
const pilequire = require("pilequire");

function compileJSX2JS(filename, source) {
  // compile and return jsx
}
function compileES62ES5(filename, source) {
  // compile es6 into es5
}

// Allows you to write React JSX with ECMAScript 6 syntax
pilequire.install('.jsx', [compileJSX2JS, compileES62ES5]);

// Compiles all other `.js` files from ECMAScript 6 to ECMAScript 5
pilequire.install('.js', compileES62ES5);
```

The compile functions are applied in the given order, and the `source` parameter of each is the return value of the previous compile function

# Usage

## `pilequire.install(extension, transform(s), [filterFn])`

Where:
- `extension` is a string with the file extension to transform, including a leading dot, i.e. `.js` 
- `transform(s)` is either a single function or an array of transform/compile functions with the signature `function(filename, source) {...}`
- `filterFn` is an optional function that is called for every require()d file and should return true or false depending on whether the
file/module should be transformed for not. Use this to e.g. exclude files from the `node_modules` folder:

```js
const EXCLUDE_FILES = /^(?!.*node_modules)/
pilequire.install('.js', compileES6, function(module, filename) {
  return EXCLUDE_FILES.test(filename)
});
```

## Full working example

```js
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

// Now the React component written with ES6 and JSX can be require()'d
var SomeComponent = require("./SomeComponent");

// So can regular .js-files with es6 syntax
var moduleWrittenInEs6 = require("./es6module");
```