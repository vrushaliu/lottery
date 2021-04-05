/** LIne Model */
// export config file
const config = require('../config/config');
const mongoose = require('mongoose');
const Value = require('./value');

const lineSchema = mongoose.Schema({
  valueCount: Number,
  outcome: Number, // outcome of line sum of values
  allValues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: config.MODEL_VALUE,
  }],
}, {id: false});

// Create line
lineSchema.statics.createLine = function createLine() {
  const allowedValues = config.allowed_values;
  const line = new this({valueCount: allowedValues, outcome: 0, allValues: []});
  let outcomeSum = 0;

  for (let i=0; i<allowedValues; i++) {
    const ramdomNumber = getRandomNumber(allowedValues);
    // storing values as object
    const value = new Value({position: i, value: ramdomNumber});
    value.save();
    line.allValues.push(value);
  }

  // Outcome logic
  const value1 = parseInt(line.allValues[0].value);
  const value2 = parseInt(line.allValues[1].value);
  const value3 = parseInt(line.allValues[2].value);
  if ((value1+ value2 + value3) === 2) {
    outcomeSum = 10;
  } else {
    if ((value1 != value2) &&
    (value1 != value3)) {
      outcomeSum = 1;
    } else {
      if ((value1 === value2) &&(value1 === value3)) {
        outcomeSum = 5;
      } else {
        outcomeSum = 0;
      }
    }
  }
  // line.allValues = valueObjs;
  // console.log("Value 0: "+ line.allValues[0].value + "\n Value 1: "+
  // line.allValues[1].value
  // + "\n Value 2: "+ line.allValues[2].value + "\n Outcome " + outcomeSum);
  line.outcome = outcomeSum;
  line.save();
  return line;
};

/**
 * Update values, it is there for test pupose only
 * @param {*} line
 */
lineSchema.methods.updateLineOutcome = function updateLineOutcome(line) {
  // Outcome logic
  const value1 = parseInt(line.allValues[0].value);
  const value2 = parseInt(line.allValues[1].value);
  const value3 = parseInt(line.allValues[2].value);
  if ((value1+ value2 + value3) === 2) {
    outcomeSum = 10;
  } else {
    if ((value1 != value2) &&
      (value1 != value3)) {
      outcomeSum = 1;
    } else {
      if ((value1 === value2) &&(value1 === value3)) {
        outcomeSum = 5;
      } else {
        outcomeSum = 0;
      }
    }
  }
  line.outcome = outcomeSum;
  line.save();
};
/**
 * Returns random number
 * @param {*} max
 * @return {*} random no 0,1 or 2
 */
function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = mongoose.model(config.MODEL_LINE, lineSchema);
