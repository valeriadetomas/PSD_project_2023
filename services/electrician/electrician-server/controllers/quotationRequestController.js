import * as service from '../services/quotationRequestService.js';

export function requestQuotation(req, res) {
    service.requestQuotation(req, res);
}

