/** Main app index file
 * start command -> node index.js
 */

// config file
const config = require('./config/config');
// const routes = require('./routes/routes');
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const route = require('./routes/routes');
const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}


// new feature replacing body parser in express version 4.16+
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// need to work on this more
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// route file
route(app);
// require('node-api-doc-generator')(app,'localhost',config.port);
// start the server
app.listen(config.port, function() {
  console.log(`Listening on port ${config.port}..`);
});
