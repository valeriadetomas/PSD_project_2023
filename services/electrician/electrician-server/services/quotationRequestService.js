import { Quotation } from "./Quotation";
import { addQuotation, newQuotationToken } from "./quotationRequestidService";

export function requestQuotation(req, res) {

    // create a new quotation object and assign a token
    addQuotation(new Quotation(newQuotationToken))

    // add to the response message 201 the token of the quotation

    res.send({
        message: 'Request taken in charge'
    });

}

