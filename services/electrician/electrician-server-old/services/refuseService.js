export function sendConfirmation(req, res) {
    const report_id = {
        id: 1,
        message: "Hope to work for you next time"
    };

    // Send the quotation object as the response
    res.status(200).json(report_id);
}

