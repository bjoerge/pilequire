// Provides an easy way to register a set of source transforms for a file extension
// The transforms are applied in the given order, and each transform passes its resulting source code to the next

var fs = require("fs");

module.exports = { install: pilequire };

function pilequire(extension, compilers, filterFn) {

  if (!Array.isArray(compilers)) {
    compilers = [compilers];
  }

  var originalCompile = (require.extensions[extension] || require.extensions['.js']).bind(require.extensions);

  require.extensions[extension] = function (module, filename) {

    if (filterFn && !filterFn(module, filename)) {
      return originalCompile(module, filename);
    }

    var src = fs.readFileSync(filename, {encoding: 'utf8'});

    var transformed = compilers.reduce(function (src, transformer) {
      return transformer(filename, src);
    }, src);

    module._compile(transformed, filename);
  };
}