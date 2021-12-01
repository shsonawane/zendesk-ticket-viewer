/* eslint-disable no-console */
const app = require('./app');

let defaultPort = 9000;

/**
 * Create an app listner at declared port.
 * @returns {function: void}
 */
const createListener = (port) => app.listen(port, () => {
  console.log('\n\nOpen this link in browser to view the site\n');
  console.log(`http://localhost:${port}\n\n`);
});

/**
 * Listen to declared port.
 */
if (process.env.PORT) {
  createListener(process.env.PORT);
} else {
  let server = createListener(defaultPort);
  const errorListner = (err) => {
    if (err.code === 'EADDRINUSE') {
      // If declared port is already in use then use different port.
      console.log(`Port ${defaultPort} already in use!`);
      defaultPort += 1;
      console.log(`Trying to listen ${defaultPort} instead...`);
      server = createListener(defaultPort);
      server.on('error', errorListner);
    } else {
      console.error(err);
    }
  };
  server.on('error', errorListner);
}
