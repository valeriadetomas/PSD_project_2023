export function addResult(req, res) {

    const { name_plumber } = req.body;

    if (!name_plumber) {
        res.status(400).json({ error: 'name_plumber is missing in the request body' });
        return;
    }

    const { id } = req.body;

    if (!id) {
        res.status(400).json({ error: 'id is missing in the request body' });
        return;
    }

    const { outcome } = req.body;

    if (!outcome) {
        res.status(400).json({ error: 'outcome is missing in the request body' });
        return;
    }


    res.send({
        message: 'Result of quotation: ' + id + ' sent successfully to ' + name_plumber + ' with outcome ' + outcome
    });
}

export function getResult(req, res) {
    res.send({
        message: 'This is the mockup controller for getResult'
    });
}

