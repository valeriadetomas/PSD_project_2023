import { Quotation } from "./Quotation";

var quotations = []

var token = 0;

export function addQuotation(q){
    quotations.push(q)
}

export function newQuotationToken(){
    token = token + 1;
    return token;
}

export function getQuotation(req, res) {
    // find the quotation by the id in the request
    res.send({
        message: 'This is the mockup controller for getQuotation'
    });
}



