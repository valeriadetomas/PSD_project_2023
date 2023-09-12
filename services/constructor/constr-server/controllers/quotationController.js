import * as service from '../services/quotationService.js';

export function requestQuotation(req, res) {
    service.requestQuotation(req, res);
}

