const service = require('../services/resultService.js');

module.exports.resultQuotation = function resultQuotation(req, res) {
    service.resultQuotation(req, res);
}

