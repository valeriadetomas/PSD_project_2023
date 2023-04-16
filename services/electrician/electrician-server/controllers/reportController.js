import * as service from '../services/reportService.js';

export function postJob(req, res) {
    service.postJob(req, res);
}

