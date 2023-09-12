export function getQuotation(req, res) {

    const quotation = {
        id: 1,
        plumber: "plumber_name",
        quotationPrice: Math.floor(Math.random() * 100),
    };

    // Send the quotation object as the response
    res.status(200).json(quotation);

}



