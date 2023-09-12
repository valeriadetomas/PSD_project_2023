export function getJob(req, res) {

    const report = {
        id: 1,
        status: "completed",
        complete: true
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    sleep(20000).then(() => { res.status(200).json(report); });
    
}

