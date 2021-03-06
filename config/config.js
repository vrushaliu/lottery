module.exports = {
  // url: 'mongodb+srv://mongodb:<password>@cluster0.hcen0.mongodb.net/vlottery',
  url: 'mongodb://127.0.0.1:27017/vlottery',
  test_url: 'http://localhost:8080/api/tickets',
  port: Number(process.env.PORT || '8080'),
  prefix: '/api/tickets',
  allowed_values: 3,
  test_post_line_count: 1,
  MODEL_TICKET: 'Ticket',
  MODEL_LINE: 'Line',
  MODEL_VALUE: 'Value',
  ERROR_INVALID_LINE_QUANTITY: 'Invalid ticket line quantity',
  ERROR_INACTIVE_TICKET: 'Ticket is already closed. Please try active ticket',
  ERROR_CREATION: 'Failed to create a ticket, please check with administrators',
  ERROR_FETCHING: 'Error fetching tickets',
};
