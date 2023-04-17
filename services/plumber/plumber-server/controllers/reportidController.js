import * as service from '../services/reportidService.js';

export function getResultById(req, res) {
    service.getResultById(req, res);
}

export function updateReport(req, res) {
    service.updateReport(req, res);
}

