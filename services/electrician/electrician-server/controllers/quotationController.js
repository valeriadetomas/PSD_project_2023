import * as service from '../services/quotationService.js';

export function postQuotation(req, res) {
    service.postQuotation(req, res);
}

