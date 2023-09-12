import * as service from '../services/reportidService.js';

export function getReportById(req, res) {
    service.getReportById(req, res);
}

