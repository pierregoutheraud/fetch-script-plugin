var http = require('request');
var fs = require('fs');
var path = require('path')
// var assign = require('object-assign');

function FetchScriptPlugin(options) {
  // Setup the plugin instance with options...
}

FetchScriptPlugin.prototype.apply = function(compiler) {

  compiler.plugin('normal-module-factory', function(nmf) {
    nmf.plugin('before-resolve', function(data, cb) {

      var request = data.request
      if (/^http(s?):\/\//.test(request)) {

        // var data = assign(data, {})

        var fileInfos = path.parse(request)
        var fileName = fileInfos.base
        var newFilePath = path.join(data.context, fileName)

        // TODO: Check if file exists with good version (maybe #1.2.3 at end of file for version?)

        console.log('Downloading script ' + fileName + '...');
        http(request, function (error, response, body) {
          console.log('Download complete.');
          console.log('Creating file.');
          fs.writeFile(newFilePath, body, function(err) {
              if (err) return console.log(err);
              console.log("The file was saved.");
              var newRequest = './' + fileName
              data.request = newRequest
              data.dependency.request = newRequest
              data.dependency.userRequest = newRequest
              cb(null, data)
          });
        })

      } else {
        cb(null, data)
      }
    })
  })

  compiler.plugin('done', function() {
    console.log('Fetch script done!');
  });

};

module.exports = FetchScriptPlugin;
