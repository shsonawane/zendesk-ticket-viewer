const app = require('./app');

var defaultPort = 5000;

/**
 * Create an app listner at declared port.
 * @returns {function: void}
 */
var createListener = function (port) {
  return app.listen(port, () => {
    console.log(`\n\nListening: http://localhost:${port}\n\n`);
  });
}

/**
 * Listen to declared port.
 */
if (process.env.PORT) {
  createListener(process.env.PORT);
} else {
  var server = createListener(defaultPort);
  var errorListner = function (err) {
    if (err.code === 'EADDRINUSE') {
      // If declared port is already in use then use different port.
      console.log(`Port ${defaultPort} already in use!`);
      defaultPort++;
      console.log(`Trying to listen ${defaultPort} instead...`);
      server = createListener(defaultPort);
      server.on('error', errorListner);
    } else {
      console.error(err);
    }
  }
  server.on('error', errorListner);
}
