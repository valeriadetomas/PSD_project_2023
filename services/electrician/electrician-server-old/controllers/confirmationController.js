import * as service from '../services/confirmationService.js';

export function sendConfirmation(req, res) {
    service.sendConfirmation(req, res);
}

