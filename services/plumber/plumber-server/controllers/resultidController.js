import * as service from '../services/resultidService.js';

export function getResultById(req, res) {
    service.getResultById(req, res);
}

