/**
 * Line model test cases
*/

process.env.NODE_ENV = 'test';
const config = require('../config/config');
const Line = require('../models/line');
const expect = require('chai').expect;

describe('Create a Line model', function() {
  it('Create Object', function() {
    const line = Line.createLine();
    expect(line).to.not.be.null;
  });
  it('Check Object Schema', function() {
    const line = Line.createLine();
    expect(line.allValues.length).to.not.be.null;
    expect(line.allValues.length).to.equal(config.allowed_values);
  });

  it('Verify Object ValueCount', function() {
    const line = Line.createLine();
    expect(line.allValues.length).to.not.be.null;
    expect(line.valueCount).to.equal(config.allowed_values);
  });
  it('Verify Object Values must be 0, 1 or 2', function() {
    const line = Line.createLine();
    expect(line.allValues.length).to.not.be.null;
    // values can be either 0,1 or 2
    expect(line.allValues[0].value).to.be.gte(0); // atleast 0
    // less than 3
    expect(line.allValues[0].value).to.be.lt(config.allowed_values);
  });
});

describe('Verify Outcome', function() {
  it('Verify Same number 000 Outcome:10', function() {
    const line = Line.createLine();
    let outcomeSum = 5;
    // Outcome logic
    line.allValues[0].value = 0;
    line.allValues[1].value = 0;
    line.allValues[2].value = 0;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(5);
  });
  it('Verify Same number 111 Outcome:5', function() {
    const line = Line.createLine();
    let outcomeSum = 5;
    // Outcome logic
    line.allValues[0].value = 1;
    line.allValues[1].value = 1;
    line.allValues[2].value = 1;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(5);
  });
  it('Verify Same number 222 Outcome:5', function() {
    const line = Line.createLine();
    let outcomeSum = 5;
    // Outcome logic
    line.allValues[0].value = 2;
    line.allValues[1].value = 2;
    line.allValues[2].value = 2;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(5);
  });
  it('Verify Sum ==2 011 Outcome:10', function() {
    const line = Line.createLine();
    let outcomeSum = 10;
    // Outcome logic
    line.allValues[0].value = 0;
    line.allValues[1].value = 1;
    line.allValues[2].value = 1;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(10);
  });
  it('Verify Sum ==2 101 Outcome:10', function() {
    const line = Line.createLine();
    let outcomeSum = 10;
    // Outcome logic
    line.allValues[0].value = 1;
    line.allValues[1].value = 0;
    line.allValues[2].value = 1;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(10);
  });
  it('Verify Sum ==2 020 Outcome:10', function() {
    const line = Line.createLine();
    let outcomeSum = 10;
    // Outcome logic
    line.allValues[0].value = 0;
    line.allValues[1].value = 2;
    line.allValues[2].value = 0;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(10);
  });
  it('Verify Sum ==2 002 Outcome:10', function() {
    const line = Line.createLine();
    let outcomeSum = 10;
    // Outcome logic
    line.allValues[0].value = 0;
    line.allValues[1].value = 0;
    line.allValues[2].value = 2;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(10);
  });
  it('Verify Sum ==2 200 Outcome:10', function() {
    const line = Line.createLine();
    let outcomeSum = 10;
    // Outcome logic
    line.allValues[0].value = 2;
    line.allValues[1].value = 0;
    line.allValues[2].value = 0;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(10);
  });
  it('Verify 012 Outcome:1', function() {
    const line = Line.createLine();
    let outcomeSum = 1;
    // Outcome logic
    line.allValues[0].value = 0;
    line.allValues[1].value = 1;
    line.allValues[2].value = 2;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(1);
  });
  it('Verify 022 Outcome:1', function() {
    const line = Line.createLine();
    let outcomeSum = 1;
    // Outcome logic
    line.allValues[0].value = 0;
    line.allValues[1].value = 2;
    line.allValues[2].value = 2;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(1);
  });
  it('Verify 202 Outcome:0', function() {
    const line = Line.createLine();
    let outcomeSum = 0;
    // Outcome logic
    line.allValues[0].value = 2;
    line.allValues[1].value = 0;
    line.allValues[2].value = 2;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(0);
  });
  it('Verify 112 Outcome:0', function() {
    const line = Line.createLine();
    let outcomeSum = 0;
    // Outcome logic
    line.allValues[0].value = 1;
    line.allValues[1].value = 1;
    line.allValues[2].value = 2;
    line.save();
    line.updateLineOutcome(line);
    console.log('outcomeSum ' + outcomeSum + ' line outcome ' +line.outcome);
    expect(line.outcome).to.equal(0);
  });
});
