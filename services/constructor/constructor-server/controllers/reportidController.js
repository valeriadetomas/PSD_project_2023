const service = require('../services/reportidService.js');

module.exports.getReportById = function getReportById(req, res) {
    service.getReportById(req, res);
}

