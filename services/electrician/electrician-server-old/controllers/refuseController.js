import * as service from '../services/refuseService.js';

export function sendConfirmation(req, res) {
    service.sendConfirmation(req, res);
}

