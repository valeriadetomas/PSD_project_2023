export function getJob(req, res) {

    const report = {
        id: 1,
        status: "completed",
        complete: true
    };

    // Send the quotation object as the response
    res.status(200).json(report);
}

