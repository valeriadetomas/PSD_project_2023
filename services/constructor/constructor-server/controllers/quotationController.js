const service = require('../services/quotationService.js');

module.exports.requestQuotation = function requestQuotation(req, res) {
    service.requestQuotation(req, res);
}

