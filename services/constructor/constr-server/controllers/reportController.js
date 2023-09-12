import * as service from '../services/reportService.js';

export function postReport(req, res) {
    service.postReport(req, res);
}

export function getReport(req, res) {
    service.getReport(req, res);
}

export function putReport(req, res) {
    service.putReport(req, res);
}

