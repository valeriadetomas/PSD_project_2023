export function sendConfirmation(req, res) {

    const report_id = {
        id: 1,
        message: "Thanks"
    };

    // Send the quotation object as the response
    res.status(200).json(report_id);
    
}

