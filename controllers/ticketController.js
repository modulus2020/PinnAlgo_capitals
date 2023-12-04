const Ticket = require('../models/ticketModel');

const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllTickets = factory.getAll(Ticket);
exports.getSingleTicket = factory.getOne(Ticket);
exports.createTicket = factory.createOne(Ticket);
exports.updateTicket = factory.updateOne(Ticket);
exports.deleteTicket = factory.deleteOne(Ticket);

exports.ticketSearch = catchAsync(async (req, res, next) => {
  const { description } = req.params;
  const filter = {
    description: new RegExp(description, 'i'),
    ...req.query,
  };

  let { page, limit } = req.query;
  page = page ? page * 1 : 1;
  limit = limit ? limit * 1 : 10;
  const skip = (page - 1) * limit;

  const forms = await Ticket.find(filter).skip(skip).limit(limit);
  const queryObj = { ...req.query, page: page * 1, limit: limit * 1 };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];

  excludedFields.forEach((el) => delete queryObj[el]);

  // 1B)Advanced Filtering
  const count = await Ticket.count(filter);

  const total = Math.ceil(count / limit);

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: forms.length,
    total_pages: total,
    next_page: page * 1 < total ? page * 1 + 1 : null,
    prev: page * 1 > 1 ? page * 1 - 1 : null,
    doc: forms,
  });
});
