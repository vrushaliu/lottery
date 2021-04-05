/** Ticket model */
// export config file
const config = require('../config/config');
const mongoose = require('mongoose');
const Line = require('./line');

const ticketSchema = mongoose.Schema({
  active: Boolean,
  allLines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: config.MODEL_LINE,
  }],
  lineCount: {
    type: Number,
    default: 0,
    required: true,
  }}, {id: false});

/** Generate ticket based on requested no of lines
 * @param {lineQuantity} requested lines to be added to ticket
 * @return {ticket} return generated ticket
 */

ticketSchema.statics.generateTicket = function generateTicket(lineQuantity) {
  if (lineQuantity > 0) {
    const ticket = new this({
      active: true,
      allLines: [],
      lineCount: lineQuantity,
    });

    for (i=0; i<lineQuantity; i++) {
      // console.log('line loop');
      const line = Line.createLine();
      ticket.allLines.push(line);
    }

    ticket.save();
    console.log('Saved ticket');
    // ticket.addLines(lineQuantity);
    return ticket;
  } else {
    return null;
  }
};


// Add lines to the ticket
ticketSchema.methods.updateLines = function updateLines(lineQuantity) {
  console.log('Entered update line');
  if (lineQuantity > 0) {
    if (this.active) {
      for (i=0; i<lineQuantity; i++) {
        const line = Line.createLine();
        this.allLines.push(line);
      }

      // new array length
      this.lineCount = this.allLines.length;

      this.save();
    }
  }
};


// Use like


// Add sorted outcome array to JSON
/*
ticketSchema.methods.toJSON = function(outcomeArray) {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }
*/
module.exports = mongoose.model(config.MODEL_TICKET, ticketSchema);
