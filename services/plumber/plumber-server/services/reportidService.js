export function getReportById(req, res) {
    const possible_results = [
        'in progress',
        'completed'
    ];
    const randomNumber = Math.floor(Math.random()*possible_results.length);
    
    const result = possible_results[randomNumber];

    // Create a report
    const report = {
        id_request: 1,
        status: result,
    };

    // Send the report object as the response
    res.status(200).json(report);
}

