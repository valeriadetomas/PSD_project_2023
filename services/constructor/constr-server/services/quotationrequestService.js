export function requestQuotation(req, res) {
    // Assuming the request body is a QuotationRequest object
    const { receiver } = req.body;

    if (!receiver) {
        // Handle the case where description is missing in the request body
        res.status(400).json({ error: 'Receiver is missing in the request body' });
        return;
    }

    // Create a quotation object with the description as the constructor's name
    const quotation = 

        {
            id: Math.floor(Math.random() * 10),
            constructor: receiver,
            quotationPrice: Math.floor(Math.random() * 100),
        };

    // Send the quotation object as the response
    res.status(200).json(quotation);
}