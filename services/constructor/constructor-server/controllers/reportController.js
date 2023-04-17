const service = require('../services/reportService.js');

module.exports.postReport = function postReport(req, res) {
    service.postReport(req, res);
}

module.exports.getReport = function getReport(req, res) {
    service.getReport(req, res);
}

module.exports.putReport = function putReport(req, res) {
    service.putReport(req, res);
}

