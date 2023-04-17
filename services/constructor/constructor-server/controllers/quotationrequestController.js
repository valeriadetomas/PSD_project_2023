const service = require('../services/quotationrequestService.js');

module.exports.requestQuotation = function requestQuotation(req, res) {
    service.requestQuotation(req, res);
}

