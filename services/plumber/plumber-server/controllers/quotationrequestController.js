import * as service from '../services/quotationrequestService.js';

export function requestQuotation(req, res) {
    service.requestQuotation(req, res);
}

