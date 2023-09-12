export function requestQuotation(req, res) {
    const { receiver } = req.body;

    if (!receiver) {
        res.status(400).json({ error: 'Receiver is missing in the request body' });
        return;
    }

    const id = Math.random() * 10;
    const quotation_price = Math.random() * (1500 - 300) + 300;

    // Create a quotation object 
    const quotation = {
        id: id,
        plumber: receiver,
        quotationPrice: quotation_price,
    };

    // Send the quotation object as the response
    res.status(200).json(quotation);
}

