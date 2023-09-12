export function requestReport(req, res) {

    const comment = {
        comment:"Report request accepted"
    };

    // Send the quotation object as the response
    res.status(200).json(comment);
}

