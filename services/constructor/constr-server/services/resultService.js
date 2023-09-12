export function resultQuotation(req, res) {

    const {constructor} = req.body;
    res.send({
        message: 'Successfully sent to:' + constructor
    });
}

