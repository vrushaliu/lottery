
/** API connecting ticket schema */
require('../models/ticket');
const config = require('../config/config');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;


mongoose.Promise = global.Promise;
mongoose.connect(config.url, {useNewUrlParser: true});

// create ticket model
const Ticket = mongoose.model(config.MODEL_TICKET);
exports.api = {};


/**
 * Post request
 * @param {*} req user request
 * @param {*} res response
 * @param {*} next next error
 * @return {*} new ticket
 */
exports.api.createTicket = async function(req, res, next) {
  // Validate request because in model we required the title
  console.log('line quantity ', req.body.lineQuantity);
  console.log('Create Ticket');
  if (!req.body.lineQuantity) {
    return res.status(400).send({
      message: config.ERROR_INVALID_LINE_QUANTITY,
    });
  } else {
    isValidData = verifyData(req);

    if (isValidData) {
      // Create a ticket

      console.log('Calling generate ticket');
      const ticket = Ticket.generateTicket(req.body.lineQuantity);

      const ticketDoc = ticket.toObject();

      delete ticketDoc.allLines; // deleting allLine array


      if (!ticket) {
        return next({message: config.ERROR_CREATION});
      }

      // res.status(201).json({ticket: ticket, message: "Success"});

      res.status(201).json({ticket: ticketDoc});
    } else {
      res.status(400).json({message: config.ERROR_INVALID_LINE_QUANTITY});
    }
  }
};

/**
 * Get all and return all ticketss.
 * @param {*} req user request
 * @param {*} res response
 */
exports.api.getAll = (req, res) => {
  console.log('Get All Ticket');
  Ticket.find(null, {__v: 0, allLines: 0})
      .exec(function(error, tickets) {
        res.status(200).json({tickets: tickets});
      });
};


/**
 * Get ticket based on Id
 * @param {*} req user request
 * @param {*} res response to request
 * @param {*} next next error
 */
exports.api.getTicketById = (req, res, next) => {
  console.log('Get Ticket By Id');
  if (isIdValid(req.params.id)) {
    Ticket.findOne({_id: req.params.id}, {__v: 0})
        .exec(function(error, ticket) {
          if (error) {
            return next(error);
          }
          if (!ticket) {
            return next('Please be sure ticket id exists.');
          }
          if (ticket.active) {
            const ticketDoc = ticket.toObject();

            delete ticketDoc.allLines; // deleting allLine array

            res.status(200).json({ticket: ticketDoc});
          } else {
            res.status(400).json({message: config.ERROR_INACTIVE_TICKET});
          }
        });
  } else {
    res.status(400).json({message: 'Invalid ticket id.'});
  }
};
/**
 * Verify outcome, provide the whole object
 * Going to use it for demo purpose, it is not part of solution
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.api.verifyTicketOutcomeById = (req, res, next) => {
  console.log('Verify Ticket By Id');
  if (isIdValid(req.params.id)) {
    Ticket.findOne({_id: req.params.id}, {__v: 0})
        .populate({
          path: 'allLines',
          model: 'Line',
          populate: {
            path: 'allValues',
            model: 'Value',
          }}).exec(function(error, ticket) {
          if (error) {
            return next(error);
          }
          if (!ticket) {
            return next('Please be sure ticket id exists.');
          }
          // if (ticket.active)

          const ticketDoc = ticket.toObject();

          // delete ticketDoc.allLines; // deleting allLine array

          res.status(200).json({ticket: ticketDoc});
          // else

          //  res.status(400).json({message: config.ERROR_INACTIVE_TICKET});
        });
  } else {
    res.status(400).json({message: 'Invalid ticket id.'});
  }
};

/**
 * Add lines to ticket
 * @param {*} req user request
 * @param {*} res response
 * @param {*} next  next error
 * @return {*} updated ticket
 */
exports.api.updateTicketLineById = async function(req, res, next) {
  console.log('Update 1');
  if (!req.body.lineQuantity) {
    return res.status(400).send({
      message: config.ERROR_INVALID_LINE_QUANTITY,
    });
  }
  if (isIdValid(req.params.id)) {
    isValidData = verifyData(req);
    if (isValidData) {
      Ticket.findOne({_id: req.params.id}, {__v: 0})
          .exec(function(error, ticket) {
            if (error) {
              return next(error);
            }
            if (!ticket) {
              return next('Please be sure ticket id exists.');
            }
            if (ticket.active) {
              const lineQuantity = req.body.lineQuantity;

              // ticket saved in ticket.updateLine()
              // ticket.updateLines(ticket, lineQuantity); //add lines
              ticket.updateLines(lineQuantity); // add lines
              const ticketDoc = ticket.toObject();

              delete ticketDoc.allLines; // deleting allLine array

              res.status(200).json({ticket: ticketDoc});
            } else {
              res.status(400).json({message: config.ERROR_INACTIVE_TICKET});
            }
          });
    }
  } else {
    res.status(400).json({message: 'Invalid ticket id.'});
  }
};

/**
 * Check status of ticket
 * @param {*} req user request
 * @param {*} res response
 * @param {*} next next error
 */
exports.api.updateStatusOfTicketById = async function(req, res, next) {
  console.log('Status method: '+ req.params.id);

  if (isIdValid(req.params.id)) {
    const ticketId = req.params.id;
    Ticket.findOne({_id: ticketId}, {__v: 0})
        .populate({path: 'allLines', select: 'outcome'})
        .exec(function(error, ticket) {
          console.log('Ticket ' + typeof(ticket));
          if (error) {
            return next(error);
          }
          console.log('Status method before 500');
          if (!ticket) {
            return next('Please be sure ticket id exists.');
          }

          if (ticket.active) {
            console.log('Status method');
            const outcomeArr = getOutcomeArray(ticket);

            // save ticket
            ticket.active = false;
            ticket.save();

            const ticketDoc = ticket.toObject();
            delete ticketDoc.allLines; // deleting allLine array
            // sorted into outcome before returning status of the ticket
            ticketDoc.outcomeArr = outcomeArr;
            res.status(200).json({ticket: ticketDoc});
          } else {
            res.status(400).json({message: config.ERROR_INACTIVE_TICKET});
          }
        });
  } else {
    res.status(400).json({message: 'Invalid ticket id.'});
  }
};

/**
 * Verify the line quantity in the request
 * @param {*} req request
 * @return {*} true if valid
 */
function verifyData(req) {
  if (!req.body.lineQuantity) return false;
  if (req.body.lineQuantity) {
    typeOfInput = typeof req.body.lineQuantity; // type of lineQuantity
    // console.log('typeOfInput: ', typeOfInput);
    lineQuantity = req.body.lineQuantity;
    if (typeOfInput === 'number' && lineQuantity > 0) {
      return true;
    }
    return false;
  }
}

/**
 * Get outcome Array
 * @param {*} ticket object
 * @return {*} outcome array
 */
function getOutcomeArray(ticket) {
  let outcomeArr = [];
  outcomeArr = ticket.allLines.map(function(line) {
    const arr = [];
    // console.log("Value 0: "+ line.allValue[0].value + "Value 1: "
    // + line.allValue[1].value + "Value 2: "+ line.allValue[2].value);
    outcome = line.outcome;
    arr.push(outcome);

    return arr;
  });

  return outcomeArr;
}

/**
 * Check valid id
 * @param {*} id to be verified
 * @return {*} true if valid otherwise false
 */
function isIdValid(id) {
  /* if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    return false; */
  // above logic in short
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}
