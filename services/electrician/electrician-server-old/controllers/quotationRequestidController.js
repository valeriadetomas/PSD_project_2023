import * as service from '../services/quotationRequestidService.js';

export function getQuotation(req, res) {
    service.getQuotation(req, res);
}

