/**
 * Ticket model test cases
*/

process.env.NODE_ENV = 'test';

const Ticket = require('../models/ticket');
const expect = require('chai').expect;

describe('Create a Ticket object', function() {
  it('New ticket Length - 1', function() {
    const ticket = Ticket.generateTicket(1);
    expect(ticket).to.not.equal(null);
    expect(ticket.allLines.length).to.equal(1);
  });
  it('New ticket Length - 5', function() {
    const ticket = Ticket.generateTicket(5);
    expect(ticket).to.not.equal(null);
    expect(ticket.allLines.length).to.equal(5);
  });
  it('New ticket Length - Try 0 - Returns null', function() {
    const ticket = Ticket.generateTicket(0);
    expect(ticket).to.equal(null);
  });
});

describe('Add new lines to ticket', function() {
  it('Add 0 lines to ticket', function() {
    const ticket = Ticket.generateTicket(1); // minimum 1 is required
    // Won't affect line count because lines are not added
    ticket.updateLines(0);
    expect(ticket.allLines.length).to.be.equal(1);
  });

  it('Add 5 lines to ticket', function() {
    const ticket = Ticket.generateTicket(1); // minimum 1 is required
    ticket.updateLines(5);
    expect(ticket.allLines.length).to.be.equal(6);
  });

  it('Add 3 lines to ticket', function() {
    const ticket = Ticket.generateTicket(2); // minimum 1 is required
    ticket.updateLines(3);
    expect(ticket.allLines.length).to.be.equal(5);
  });

  it('Add 10 lines to ticket', function() {
    const ticket = Ticket.generateTicket(3); // minimum 1 is required
    ticket.updateLines(10);
    expect(ticket.allLines.length).to.be.equal(13);
  });

  it('Add 10 lines to ticket', function() {
    const ticket = Ticket.generateTicket(20); // minimum 1 is required
    ticket.updateLines(10);
    expect(ticket.allLines.length).to.be.equal(30);
  });
});
