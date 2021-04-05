module.exports = (app) => {
  const ticketController = require('../controller/api');
  const config = require('../config/config');
  const express = require('express');
  // Routes
  const routes = express.Router();

  // add prefix
  app.use(config.prefix, routes);

  // Create a new ticket
  routes.route('/create').post(ticketController.api.createTicket);
  // app.post('/ticket', ticketController.createTicket);


  // Get all Tickets
  routes.route('/all').get(ticketController.api.getAll);

  // Get a single ticket with Id
  routes.route('/:id').get(ticketController.api.getTicketById);

  // Verify a single ticket with Id, demo purpose only,
  // It is not part of solution
  // not added to swagger
  //routes.route('/verify/:id').get(ticketController.api.verifyTicketOutcomeById);

  // Update lines in  a ticket using Id, Patch - Partial update
  routes.patch('/update/:id', ticketController.api.updateTicketLineById);

  // Check Status of ticket, ticket will be inactive once you invoke this method
  routes.patch('/status/:id', ticketController.api.updateStatusOfTicketById);
};
