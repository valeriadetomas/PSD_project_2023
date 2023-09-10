export function requestQuotation(req, res) {
    // Assuming the request body is a QuotationRequest object
    const { receiver } = req.body;

    if (!receiver) {
        // Handle the case where description is missing in the request body
        res.status(400).json({ error: 'Receiver is missing in the request body' });
        return;
    }

    // Create a quotation object with the description as the plumber's name
    const quotation = {
        id: 1,
        plumber: receiver,
        quotationPrice: 500,
    };

    // Send the quotation object as the response
    res.status(200).json(quotation);
}