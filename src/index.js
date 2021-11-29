const app = require('./app');

var port = 5000;

/**
 * Create an app listner at declared port.
 * @returns {function: void}
 */
var createListener = function() {
  return app.listen(port, () => {
    console.log(`\n\nListening: http://localhost:${port}\n\n`);
  });
}

var server = createListener();

server.on('error', function(err) {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} already in use!`);
    port++;
    console.log(`Trying to listen ${port} instead...`);
    server = createListener();
  } else {
    console.error(err);
  }
});
