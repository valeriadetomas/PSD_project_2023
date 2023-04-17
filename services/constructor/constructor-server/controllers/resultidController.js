const service = require('../services/resultidService.js');

module.exports.getResultById = function getResultById(req, res) {
    service.getResultById(req, res);
}

