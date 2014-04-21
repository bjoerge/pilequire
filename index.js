// Provides an easy way to register a set of source transforms for a file extension
// The transforms are applied in the given order, and each transform passes its resulting source code to the next

var fs = require("fs");

module.exports = tranquire;

function tranquire(extension, transforms, filterFn) {

  if (!Array.isArray(transforms)) {
    transforms = [transforms];
  }

  var oldHandler = (require.extensions[extension] || require.extensions['.js']).bind(require.extensions);

  require.extensions[extension] = function (module, filename) {

    if (filterFn && !filterFn(module, filename)) {
      return oldHandler(module, filename);
    }

    var src = fs.readFileSync(filename, {encoding: 'utf8'});

    var transformed = transforms.reduce(function (src, transformer) {
      return transformer(filename, src);
    }, src);

    module._compile(transformed, filename);
  };
}