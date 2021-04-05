/** API controller test cases
 * https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai
 * https://blog.bitsrc.io/build-a-unit-testing-suite-with-mocha-and-mongoose-eba06c3b3625
 * https://medium.com/nongaap/beginners-guide-to-writing-mongodb-mongoose-unit-tests-using-mocha-chai-ab5bdf3d3b1d
 * Testing MongoDB with Mocha
 * https://www.freecodecamp.org/news/how-to-make-a-promise-out-of-a-callback-function-in-javascript-d8ec35d1f981/
*/

process.env.NODE_ENV = 'test';
const config = require('../config/config');
require('../controller/api');
const request = require('request');
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
// const { expect } = require('chai');


describe('Post Tickets', function() {
  const url = config.test_url+'/create';
  it('Generate valid ticket', function() {
    request.post({
      headers: {
        'Content-Type': 'application/json'},
      url: url,
      body: '{ "lineQuantity": 2 }',
    },
    function(error, response, body) {
      const ticketsResponse = JSON.parse(response.body);

      // check status
      const status = response.statusCode;
      expect(status).to.equal(201);

      // check if ticket is set to active state
      const active = ticketsResponse.ticket.active;
      expect(active).to.equal(true);
    },
    );
  });

  it('Invalid input type, passing sting instead of number', function() {
    delay(500);
    request.post({
      headers: {
        'Content-Type': 'application/json'},
      url: url,
      body: '{ "lineQuantity": "2a" }',
    },
    function(error, response, body) {
      // check status
      const status = response.statusCode;
      expect(status).to.equal(400);
    },
    );
  });

  it('Invalid JSON', function() {
    delay(500);
    request.post({
      headers: {
        'Content-Type': 'application/json'},
      url: url,
      body: '{ "lineQuantity: 2 }',
    },
    function(error, response, body) {
      // check status
      const status = response.statusCode;
      expect(status).to.equal(400);
    },
    );
  });

  it('Invalid input in the body, lines instead of lineQuantity', function() {
    request.post({
      headers: {
        'Content-Type': 'application/json'},
      url: url,
      body: '{ lines: 2 }',
    },
    function(error, response, body) {
      // check status
      const status = response.statusCode;
      expect(status).to.equal(400);
    },
    );
  });

  it('Invalid content', function() {
    request.post({
      headers: {
        'Content-Type': 'application/xml'},
      url: url,
      body: '<lineQuantity>2</lineQuantity>',
    },
    function(error, response, body) {
      // check status
      const status = response.statusCode;
      expect(status).to.equal(400);
    },
    );
  });
});

// getAll test cases
describe('Get All Tickets', function() {
  const url = config.test_url+'/all';
  delay(150);
  it('Check 200 Status', function() {
    request(url,
        function(error, response, body) {
          // check status
          const status = response.statusCode;
          expect(status).to.equal(200);
        },
    );
  });

  it('Verify JSON ticket(first)', function() {
    delay(100);
    request(url,
        function(error, response, body) {
          const ticketsResponse = JSON.parse(response.body);

          // check status
          const status = response.statusCode;
          expect(status).to.equal(200);

          // get lineCount
          const lineCount = ticketsResponse.tickets[0].lineCount;
          expect(lineCount).to.not.equal(null);
          expect(lineCount).to.be.gte(1); // atleast 1
        },
    );
  });

  it('Return valid JSON', function() {
    delay(1000);
    request(url,
        function(error, response, body) {
          // check status
          const status = response.statusCode;
          expect(status).to.equal(200);

          const ticketsResponse = JSON.parse(response.body);
          // get lineCount
          const lineCount = ticketsResponse.tickets[0].lineCount;
          expect(lineCount).to.not.equal(null);
        },
    );
  });
});

describe('Get Ticket by id', function() {
  // Create ticket
  it('Get invalid ticket', function() {
    delay(100);
    const ticketId = '606abc5dacd95539824ce0';
    // adding id
    const url = config.test_url + '\/' + ticketId;
    // Get request based on newly created ticket id
    request(url,
        function(error, response, body) {
          // check status
          const status = response.statusCode;
          expect(status).to.equal(400);
        },
    );
  });


  it('Get valid ticket', async function() {
    delay(1000);
    const ticketId = await getNewTicketId();


    // This method will set ticket to inactive

    const getIdurl = config.test_url + '/' + ticketId;
    delay(100);

    await refreshAllTicket();
    delay(200);
    console.log('In between');
    request(getIdurl,
        function(error, response, body) {
          // check status
          const status = response.statusCode;
          expect(status).to.equal(200);

          const ticketsResponse = JSON.parse(response.body);

          console.log('after expect');
          // get lineCount
          const lineCount = ticketsResponse.ticket.lineCount;
          // default used while creating ticket
          expect(lineCount).to.equal(config.test_post_line_count);
        },
    );
  });
});

describe('Add lines', async function() {
  delay(1000);
  it('Add lines to Active ticket', async function() {
    const ticketId = await getNewTicketId();
    // This method will set ticket to inactive
    delay(100);
    await refreshAllTicket();
    delay(200);
    console.log('In between');

    // This method will set ticket to inactive
    updateTicketWithLines(ticketId, function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      ticketJSON = JSON.parse(response.body);
      console.log('updated ticket line count ' + ticketJSON.ticket.lineCount);
      const lineCount = ticketJSON.ticket.lineCount;
      // default value used while creating new ticket and updating lines,
      // so result should be twice
      expect(lineCount).to.equal(2*config.test_post_line_count);
    });
  });

  it('Add line to Inactive ticket', async function() {
    const ticketId = await getNewTicketId();

    await refreshAllTicket();

    console.log('In between');
    // This method will set ticket to inactive
    setTicketStatus(ticketId, function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      ticketJSON = JSON.parse(response.body);
      const isActive = ticketJSON.ticket.active;
      //console.log('isActive' + isActive);

      expect(isActive).to.equal(false);
    });
    await refreshAllTicket();
    updateTicketWithLines(ticketId, function(error, response, body) {
      expect(response.statusCode).to.equal(400);
    });
  });
});


describe('Check ticket Status', function() {
  delay(100);
  it('Check Active ticket Status', async function() {
    const ticketId = await getNewTicketId();

    await refreshAllTicket();
    // This method will set ticket to inactive
    setTicketStatus(ticketId, function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      ticketJSON = JSON.parse(response.body);
      const isActive = ticketJSON.ticket.active;
      // console.log("isActive" + isActive);
      const outcomeArrLength = ticketJSON.ticket.outcomeArr.length;
      //console.log('Outcome Array' + ticketJSON.ticket.outcomeArr.length);
      expect(isActive).to.equal(false);
      // defaulr value used while creating Ticket
      expect(outcomeArrLength).to.equal(config.test_post_line_count);
    });
  });


  it('Check status of Inactive ticket', async function() {
    delay(100);
    const ticketId = await getNewTicketId();

    await refreshAllTicket();
    // This method will set ticket to inactive
    setTicketStatus(ticketId, function(error, response, body) {
      expect(response.statusCode).to.equal(200);
    });

    await refreshAllTicket();
    setTicketStatus(ticketId, function(error, response, body) {
      expect(response.statusCode).to.equal(400);
    });
  });
});
/*
async function createTicket(callback) {
  delay(500);
  const url = config.test_url;
  request.post({
    headers: {
      'Content-Type': 'application/json'},
    url: url,
    body: '{ "lineQuantity": ' + config.test_post_line_count +' }',
  },
  callback,
  );
  delay(500);
}
*/
/**
 * Check ticket & set status to inactive
 * @param {*} id ticketId
 * @param {*} callback
 */
function setTicketStatus(id, callback) {
  // delay(1500);
  const url = config.test_url + '\/status\/' +id;
  // console.log('Status URL ' +url);
  request.patch({
    headers: {
      'Content-Type': 'application/json'},
    url: url,
    body: '',
  },
  callback,
  );
}
/**
 * Add default lineQuantity to ticket
 * @param {*} id ticketId
 * @param {*} callback
 */
function updateTicketWithLines(id, callback) {
  delay(500);
  const url = config.test_url + '\/update\/' +id;
  //console.log('URL ' +url);
  request.patch({
    headers: {
      'Content-Type': 'application/json'},
    url: url,
    body: '{ "lineQuantity": ' + config.test_post_line_count +' }',
  },
  callback,
  );
}
// https://stackoverflow.com/questions/25537808/make-mocha-wait-before-running-next-test
/**
 * Delay while firing request
 * @param {*} interval ms delay
 * @return {*} delay
 */
function delay(interval) {
  return it('should delay', (done) => {
    setTimeout(() => done(), interval);
  // The extra 100ms should guarantee the test
  // will not fail due to exceeded timeout
  }).timeout(interval + 100);
}
// https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js

// return ticketId;
// Setting calls out of sync -- need to use callback
/**
 * Create new ticket using Promise
 * @param {*} options
 * @return {*} returns body
 */
function getNewTicketBody(options) {
  //console.log('Get Body');
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      expect(response.statusCode).to.equal(201);
      if (error) reject(error);

      resolve(body);
    });
  });
}
/**
 * Get all
 * @param {*} options
 * @return {*} body
 */
function getAllTicket(options) {
  //console.log('Get Body');
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      if (error) reject(error);

      resolve(body);
    });
  });
}
/*
async function setTicket(options) {
  console.log('Set ticket status');
  return await new Promise((resolve, reject) => {
    // this.timeout(20000);
    request(options, (error, response, body) => {
      // let bodyJSON = JSON.parse(body);
      expect(bodyJSON.ticket.active).to.equal(false);
      // expect(response.statusCode).to.equal(200);
      // expect(body);
      // if (error) reject(error);
      resolve(body);
      // done();
    });
  });
}*/


/**
 * Get new ticket id
 * @return {*} new ticketId
 */
async function getNewTicketId() {
  let ticketId=0;
  let body;
  try {
    const url = config.test_url+'/create';
    const requestOpts = {
      encoding: 'utf8',
      uri: url,
      method: 'POST',
      json: true,
      body: {
        'lineQuantity': config.test_post_line_count, // available in config file

      },
    };
    body = await getNewTicketBody(requestOpts);
    //console.log('getNewTicketId SHOULD WORK:');
    // console.log(body);
  } catch (error) {
    console.error('ERROR:');
    console.error(error);
  }
  ticketId = await body.ticket._id;
  //console.log('ticketId ' + ticketId);

  return ticketId;
}

// Set new ticket
/*
async function setNewTicketStatus(ticketId) {
  let body;
  let isActive;
  try {
    const url = config.test_url+'\/' + ticketId;
    console.log('setNewTicketStatus URL: ', url);
    const requestOpts = {
      uri: url,
      method: 'PATCH',
      body: '{ "lineQuantity": 2, }',
    };
    body = await setTicket(requestOpts);
    console.log('SET:');

    // console.log(body);
  } catch (error) {
    console.error('ERROR:');
    console.error(error);
  }
  const bodyJSON = JSON.parse(body);
  // isActive = await body.ticket.active;
  console.log('isActive ' + bodyJSON.ticket.active);

  return isActive;
}*/


// Get new ticket
/**
 * Refresh all ticket
 */
async function refreshAllTicket() {
  const url = config.test_url+'/all';

  let body;
  try {
    const requestOpts = {
      encoding: 'utf8',
      uri: url,
      method: 'GET',

    };
    body = await getAllTicket(requestOpts);
    //console.log('getAllTicket SHOULD WORK:');
    if (body) {
      console.log('REfreshed');
    }
    // console.log(body);
  } catch (error) {
    console.error('ERROR:');
    console.error(error);
  }
}
