import * as service from '../services/quotationService.js';

export function addQuotation(req, res) {
    service.addQuotation(req, res);
}

