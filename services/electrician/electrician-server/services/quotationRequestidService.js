export function getQuotation(req, res) {

    const quotation = {
        id: Math.floor(Math.random() * 10),
        electrician: "awesome electrician",
        quotationPrice: Math.floor(Math.random() * 100),
    };

    // Send the quotation object as the response
    res.status(200).json(quotation);

}



