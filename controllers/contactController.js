const Contact = require('../models/contactModel');

const factory = require('./handlerFactory');

exports.getAllContacts = factory.getAll(Contact);

exports.getSingleContact = factory.getOne(Contact);

exports.createContact = factory.createOne(Contact);

exports.updateContact = factory.updateOne(Contact);

exports.deleteContact = factory.deleteOne(Contact);
