const express = require('express');
const path = require('path')
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { createLogger, format, transports } = require('winston');
const logger = createLogger({
    level: 'debug',
    colorize: true,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`)
    ),
    transports: [
        new transports.Console()
    ],
});
const middlewares = require('./middlewares');
const tickets = require('./api/tickets');
const app = express();

//init morgon with winston logger stream to log request.
app.use(morgan("short", {
    stream: {
        write: (message) => {
            logger.info(message);
        }
    }
}));

// using helmet for additional security
app.use(helmet());

// cors from express API 
app.use(cors());

//convet text response to JSON
app.use(express.json());

//Server static HTML website
app.use('/', express.static(path.join(__dirname, 'public')))

//APIs
app.get('/api/tickets', tickets(logger));

//Middleware to handle errors
app.use(middlewares.notFound(logger));
app.use(middlewares.errorHandler(logger));

module.exports = app;
