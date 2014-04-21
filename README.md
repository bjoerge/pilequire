# Tranquire

Provides an easy way to install a set of transpilers/compilers/source transforms for a file extension so modules can be compiled on-demand when require()'d.

## Disclaimer
This module relies on the deprecated [require.extensions](http://nodejs.org/api/globals.html#globals_require_extensions).
Even though `require.extensions` is likely to never be removed, don't use `tranquire` for modules that you let others depend on.
Instead, you should compile all source code to javascript up front before publishing.

Use `tranquire` to register a set of source transforms/transpilers to run on a given extension, for example:

`React JSX w/ES6 syntax` => `valid es6` => `valid es5`

```js
var tranquire = require("tranquire");

// Allows you to write React JSX with ECMAScript 6 syntax
tranquire('.jsx', [compileJSX, compileES6]);

// Compiles all other `.js` files from ECMAScript 6 to ECMAScript 5
tranquire('.js', compileES6);

```

The transforms are applied in the given order, and each transform passes its resulting source code to the next.

# Usage

## `tranquire(extension, transform(s), [filterFn])`

Where: 
- `extension` is a string with the file extension to transform, including a leading dot, i.e. `.js` 
- `transform(s)` is either a single function or an array of transform/compile functions with the signature `function(filename, source) {...}`
- `filterFn` is an optional function that is called for every require()d file and should return true or false depending on whether the
file/module should be transformed for not. Use this to e.g. exclude files from the `node_modules` folder:

```js
tranquire('.js', compileES6, function(module, filename) {
  return /^(?!.*node_modules)+.+\.(js|jsx)$/.test(filename)
});
```
