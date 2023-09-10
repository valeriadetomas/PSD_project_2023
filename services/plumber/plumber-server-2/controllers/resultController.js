import * as service from '../services/resultService.js';

export function addResult(req, res) {
    service.addResult(req, res);
}

export function getResult(req, res) {
    service.getResult(req, res);
}

