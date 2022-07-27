const routes = require('express').Router();
const auth = require('./app/middleware/auth');
const controller = require('./app/controllers/SessionController');

routes.post('/sessions', controller.store);
routes.get('/dashboard', auth, (req, res) => {
  res.status(200).send();
});

module.exports = routes;
