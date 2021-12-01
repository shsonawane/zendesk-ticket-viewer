const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const { createLogger, format, transports } = require('winston');
const middlewares = require('./api/middlewares');
const service = require('./api/service');

const app = express();
const logger = createLogger({
  level: 'debug',
  colorize: true,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info) => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`),
  ),
  transports: [
    new transports.Console({
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
});

// init morgon with winston logger stream to log request.
app.use(morgan('short', {
  stream: {
    write: (message) => {
      logger.info(message);
    },
  },
}));

// cors from express API
app.use(cors());

// convet text response to JSON
app.use(express.json());

// Server static HTML website
app.use('/', express.static(path.join(__dirname, 'public')));

// APIs
app.get('/api/tickets', service.list(logger));
app.get('/api/ticket/:id', service.ticket(logger));

// Middleware to handle errors
app.use(middlewares.notFound(logger));
app.use(middlewares.errorHandler(logger));

module.exports = app;
