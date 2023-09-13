export function postReport(req, res) {
    res.send({
        message: 'This is the mockup controller for postReport'
    });
}

export function getReport(req, res) {
    const report = {
        id: Math.floor(Math.random() * 10),
        status: "completed",
        complete: true
    };

     res.status(200).json(report); 
}

export function putReport(req, res) {
    res.send({
        message: 'This is the mockup controller for putReport'
    });
}

