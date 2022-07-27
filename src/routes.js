const routes = require('express').Router();
const { User } = require('./app/models');

User.create({
  name: 'Erick ',
  email: 'erick@email.com',
  password_hash: '123123',
});

module.exports = routes;