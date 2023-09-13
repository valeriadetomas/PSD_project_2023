import { Client, logger, Variables} from 'camunda-external-task-client-js';
import open from 'open';
import request from 'request';

//const { Client, logger } = require('camunda-external-task-client-js');
//const open = require('open');

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger, asyncResponseTimeout: 10000 };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'send_req_quot_plumber'
client.subscribe('send_req_quot_plumber', async function({ task, taskService }) {

  const receiver = task.variables.get("p");
  const description = task.variables.get("plumber_descr")
  const budget = task.variables.get("plumber_budget");

  console.log('Sending request for quotation to ' + receiver);

  // Define the request body
  const requestBody = {
    id: 1,
    requester: 'HRC',
    receiver: receiver,
    description: description,
    budget: budget, 
  };

  // Configure the POST request options
  const requestOptions = {
    url: 'http://localhost:9090/quotation_request',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  const processVariables = new Variables();
  const localVariables = new Variables();

  // Send the POST request
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Request for quotation sent successfully');
      
      try {
        const quot_resp = JSON.parse(JSON.parse(body));
        if (quot_resp != null) {
          processVariables.set(quot_resp.plumber + "_quotation", quot_resp.quotationPrice);
          processVariables.set("id_quotation_" + quot_resp.plumber, quot_resp.id)
          // Complete the Camunda task
          taskService.complete(task, processVariables, localVariables);
        }
        
      } catch (error) {
        console.error('Error parsing response:', error);
      }

    } else {
      console.error('Error sending request for quotation:', error);
      console.error('Response:', body);
    }
  });
});


// susbscribe to the topic: 'analyze_offers_plumb'
client.subscribe('analyze_offers_plumb', async function({ task, taskService }) {

  //const list_p = task.variables.get("list_plumbers");
  const list_p = ['p1', 'p2', 'p3'];
  let list_quot = [];
  let list_p_available = [];

  list_p.forEach(p => {
    let quot = task.variables.get(p + "_quotation")

    if (quot != undefined){
      list_quot.push(quot);
      list_p_available.push(p);
      console.log("plumer: " +  p + 'Quotation: ' + quot);
    }
  });

  const processVariables = new Variables();
  const localVariables = new Variables();

  let minValue = list_quot[0] + 10;
  let winner_name = '';
  
  for (let i = 0; i < list_quot.length; i++) {
    if (list_quot[i] < minValue) {
      minValue = list_quot[i];
    } 
  }

  for (let i = 0; i < list_quot.length; i++) {
    if (list_quot[i] <= minValue){
      winner_name = list_p_available[i];
      console.log('winner plumber name: ', winner_name);
      processVariables.set("winner_plumber_name", winner_name);
    }
  }
  
  taskService.complete(task, processVariables, localVariables);

});

//subscribe to the topic to send results to the plumbers
client.subscribe('send_res_plumbers', async function({ task, taskService }) {
  
  const res_p = task.variables.get("res_p");
  const win = task.variables.get("winner_plumber_name");
  const id_quot = parseInt(task.variables.get("id_quotation_" + win));

  let outcome = '';
  if (res_p == win) outcome = "winner";
  else outcome = "loser";

  // Define the request body
  const requestBody = {
    name_plumber: res_p,
    id: id_quot,
    outcome: outcome,
  };

  // Configure the POST request options
  const requestOptions = {
    url: 'http://localhost:9090/result',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  // Send the POST request
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const mess = JSON.parse(body);
      console.log(mess.message);
      // Complete the Camunda task
      taskService.complete(task);
    } else {
      console.error('Error sending result:', error);
      console.error('Response:', body);
    }
  });
});


//get report by the id of the related request
client.subscribe('receive_report_plumber', async function({ task, taskService }) {

  const win = task.variables.get("winner_plumber_name");
  const reportID = parseInt(task.variables.get("id_quotation_" + win), 10);

  // Configure the GET request options
  const requestOptions = {
    url: `http://localhost:9090/report/${reportID}`, 
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    },
  };

  const processVariables = new Variables();
  const localVariables = new Variables();

  console.log('Waiting for report n: ' + reportID + ' from plumber: ' + win);

  // Send the POST request
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Report plumber received successfully');
      
      try {
        const report_resp = JSON.parse(JSON.parse(body));
        if (report_resp != null) {
          console.log("Report_plumber: ", report_resp.status);
          processVariables.set("plumber_report", report_resp.status);
          // Complete the Camunda task
          taskService.complete(task, processVariables, localVariables);
        }
        
      } catch (error) {
        console.error('Error parsing response:', error);
      }

    } else {
      console.error('Error sending request for report:', error);
      console.error('Response:', body);
    }
  });
});

// send a quotation request to the electrician with the name of the company as identifier for the retrieving
client.subscribe('send_req_quot_elec', async function({ task, taskService }) {

  const receiver = task.variables.get("e");
  const description = task.variables.get("elec_descr")
  const budget = task.variables.get("elec_budget");

  console.log('Sending request for quotation to ' + receiver);

  // Define the request body
  const requestBody = {
    requester: 'HRC',
    description: description,
    budget: budget, 
  };

  // Configure the POST request options
  const requestOptions = {
    url: 'http://localhost:9091/quotationRequest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  // Send the POST request
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Request for quotation sent successfully');
      const processVariables = new Variables();
      const localVariables = new Variables();
      // Complete the Camunda task
      taskService.complete(task, processVariables, localVariables);  
    
    } else {
      console.error('Error sending request for quotation:', error);
      console.error('Response:', body);
    }
  });
});

// get the quotation from the electrician
client.subscribe('get_elec_quotation', async function({ task, taskService }) {

  const e = task.variables.get("e");
  console.log('Getting quotation from electrician', e);

  // Configure the GET request options
  const requestOptions = {
    url: 'http://localhost:9091/quotationRequest/HRC',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const processVariables = new Variables();
  const localVariables = new Variables();

  // Send the GET request
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Quotation retrieval from electrcian successful');

    try {
        const external_body = JSON.parse(body);
        const inner_body = JSON.parse(external_body);
        if (inner_body != null) {
          processVariables.set(e + "_quotation", inner_body.quotationPrice);
          processVariables.set(e + "_name", inner_body.electrician);
          // Complete the Camunda task
          taskService.complete(task, processVariables, localVariables);
        }
    } catch (error) {
        console.error('Error parsing response:', error);
    }
    
    } else {
      console.error('Error getting request for quotation:', error);
      console.error('Response:', body);
    }
  });
});

// select the cheaper electrician as winner, all the rest are losers
client.subscribe('select_desired_worker', async function({ task, taskService }) {
  let list = ["e1", "e2", "e3"]
  let min = Infinity;
  let losers = [];
  let winner;
  let index;

  const processVariables = new Variables();
  const localVariables = new Variables();

  list.forEach((e) => {
    losers.push(e)
  });

  losers.forEach((e) => {
    let quotation = task.variables.get(e + "_quotation")
    if (quotation < min){
      min = quotation;
      winner = e;
      index = losers.indexOf(e)
    }
  });

  console.log("winner electrican name: ", winner)
  processVariables.set("winner_e", winner)
 
  losers.splice(index, 1)
  let count = 0
  losers.forEach((l) => {
    processVariables.set("l" + count, l)
    count++
  })
  processVariables.set("losers_count", count)

  taskService.complete(task, processVariables, localVariables);

});

// inform the winner electrician
client.subscribe('inform_winner', async function({ task, taskService }) {

  const winner = task.variables.get("winner_e");

  console.log('Sending confirmation to electrician: ' + winner);

  // Define the request body
  const requestBody = {
    comment: "Congrats"
  };

  // Configure the POST request options
  const requestOptions = {
    url: 'http://localhost:9091/confirmation',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  // Send the POST request
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Confirmation to electrician sent successfully');  

      const processVariables = new Variables();
      const localVariables = new Variables();

      try {
        const external_body = JSON.parse(body);
        const inner_body = JSON.parse(external_body);
        if (inner_body != null) {
          processVariables.set("electrician_report_id", inner_body.id);
          console.log("electrician report id", inner_body.id)
          // Complete the Camunda task
          taskService.complete(task, processVariables, localVariables);
        }
      } catch (error) {
          console.error('Error parsing response:', error);
      } 
    
    } else {
      console.error('Error sending confirmation to electrician:', error);
      console.error('Response:', body);
    }
  });
});

client.subscribe('inform_losers', async function({ task, taskService }) {

  const losers_count = task.variables.get("losers_count");
  let losers = []
  for (let i = 0; i < losers_count; i++){
    losers.push("l"+count)
  }

  // Define the request body
  const requestBody = {
    comment: "Sorry"
  };

  // Configure the POST request options
  const requestOptions = {
    url: 'http://localhost:9091/refuse',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  losers.forEach((e) => {
    // Send the POST request
    request(requestOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log('Refusal sent successfully', response)
        taskService.complete(task, processVariables, localVariables);
      } else {
        console.error('Error informing loser:', error);
        console.error('Response:', body);
      }
    });
  });
});

client.subscribe('request_report_e', async function({ task, taskService }) {

  const report_id = task.variables.get("electrician_report_id");
  console.log('Requesting report from electrician');

  // Define the request body
  const requestBody = {
    id: report_id 
  };

  // Configure the POST request options
  const requestOptions = {
    url: 'http://localhost:9091/reportRequest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  const processVariables = new Variables();
  const localVariables = new Variables();

  // Send the POST request
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Report request to electrician sent successfully');

    try {
        const external_body = JSON.parse(body);
        const inner_body = JSON.parse(external_body);
        if (inner_body != null) {
          taskService.complete(task, processVariables, localVariables);
        }
    } catch (error) {
        console.error('Error parsing response:', error);
    }
    
    } else {
      console.error('Error sending request for report:', error);
      console.error('Response:', body);
    }
  });
});

// get the report from the electrician
client.subscribe('receive_report_e', async function({ task, taskService }) {

  const report_id = parseInt(task.variables.get("electrician_report_id"));
  console.log('Getting report from electrician, id:' ,report_id);

  // Configure the GET request options
  const requestOptions = {
    url: 'http://localhost:9091/report/'+report_id,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const processVariables = new Variables();
  const localVariables = new Variables();

  // Send the GET request
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Report retrieval from electrician successful');

    try {
        const external_body = JSON.parse(body);
        const inner_body = JSON.parse(external_body);
        if (inner_body != null) {
          processVariables.set("electrician_status", inner_body.status);
          processVariables.set("electrician_complete", inner_body.complete);
          // Complete the Camunda task
          taskService.complete(task, processVariables, localVariables);
        }
    } catch (error) {
        console.error('Error parsing response:', error);
    }
    
    } else if (response.statusCode === 202){
      console.log("Report not yet available, retry later");
    }
  });
});

client.subscribe('analyze_report_e', async function({ task, taskService }) {

  const complete = task.variables.get("electrician_complete");

  const processVariables = new Variables();
  const localVariables = new Variables();

  processVariables.set("electrician_completed", complete);

  console.log("ELECTRICIAN WORK COMPLETED");
  taskService.complete(task, processVariables, localVariables);

});


client.subscribe('renovation_completed', async function({ task, taskService }) {

  const processVariables = new Variables();
  const localVariables = new Variables();

  const complete = 'true';

  processVariables.set("renovation_complete", complete);

  console.log("RENOVATION COMPLETED");
  taskService.complete(task, processVariables, localVariables);

});


client.subscribe('confirm_start', async function({ task, taskService }) {

  const win = task.variables.get("winner_plumber_name");
  const reportID = parseInt(task.variables.get("id_quotation_" + win), 10);

  // Define the request body
  const requestBody = {
    id_request: reportID,
    status: 'not started', 
  };

  // Configure the POST request options
  const requestOptions = {
    url: 'http://localhost:9090/report',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  const processVariables = new Variables();
  const localVariables = new Variables();

  // Send the POST request
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Created report for plumber successfully');

      console.log("RENOVATION CAN START NOW");
      taskService.complete(task, processVariables, localVariables);
    
    } else {
      console.error('Error sending request for quotation:', error);
      console.error('Response:', body);
    }
  });

  

});

/*
    CONSTRUCTORS
*/

// susbscribe to the topic: 'send_req_quot_const'
client.subscribe('send_req_quot_const', async function({ task, taskService }) {

  const receiver = task.variables.get("c");
  const description = task.variables.get("constr_descr");
  const budget = task.variables.get("constr_budget");

  console.log('Sending request for quotation to ' + receiver);

  // Define the request body
  const requestBody = {
    id: 3,
    requester: 'HRC',
    receiver: receiver,
    description: description,
    budget: budget, 
  };

  // Configure the POST request options
  const requestOptions = {
    url: 'http://localhost:9092/quotation_request',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  const processVariables = new Variables();
  const localVariables = new Variables();

  // Send the POST request
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Request for quotation sent successfully to the constructor');
      
      try {
        const parsed_body = JSON.parse(body);
        const parsed_parsed_body = JSON.parse(parsed_body);
        console.log(parsed_parsed_body);
        if (parsed_parsed_body != null) {
          processVariables.set(parsed_parsed_body.constructor + "_quotation", parsed_parsed_body.quotationPrice);
          // Complete the Camunda task
          taskService.complete(task, processVariables, localVariables);
        }
        
      } catch (error) {
        console.error('Error parsing response:', error);
      }

    } else {
      console.error('Error sending request for quotation:', error);
      console.error('Response:', body);
    }
  });
});

// susbscribe to the topic: 'analyze_off_const'
client.subscribe('analyze_off_const', async function({ task, taskService }) {

  const list_constructors = ['c1','c2','c3'];
  
  const processVariables = new Variables();
  const localVariables = new Variables();

  // Generate a random index between 0 and 2
  let randomIndex = Math.floor(Math.random() * list_constructors.length);

  // Get the element at the random index as the winner
  let winner_const = list_constructors[randomIndex];

  console.log("The winner is chosen randomly, congratulations ", winner_const);
  processVariables.set("winner_const", winner_const);
  
  // Define the request body
  const requestBody = {
    id: 1,
    constructor: winner_const,
  };

  // Configure the POST request options
  const requestOptions = {
    url: 'http://localhost:9092/result',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };
  
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      
      console.log('The result has been sent successfully to the winner: ' + winner_const);
      try {
          taskService.complete(task, processVariables, localVariables);
        
      } catch (error) {
        console.error('Error completing the task', error);
      }

    } 
  });
});
// susbscribe to the topic: 'rec_eow_c'
client.subscribe('rec_eow_c', async function({ task, taskService }) {

  // Configure the GET request options
  const requestOptions = {
    url: 'http://localhost:9092/report/',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const processVariables = new Variables();
  const localVariables = new Variables();
  
  // Send the GET request
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('The job report has been received!');

    try {
        
        const parsed_body = JSON.parse(body);
        const parsed_parsed_body = JSON.parse(parsed_body);
        console.log(parsed_parsed_body);
        console.log('END OF WORK CONSTRUCTOR');
        if (parsed_parsed_body != null) {
          processVariables.set("constructor_status", parsed_parsed_body.status);
          processVariables.set("constructor_complete", parsed_parsed_body.complete);
          // Complete the Camunda task
          taskService.complete(task, processVariables, localVariables);
        }
    } catch (error) {
        console.error('Error parsing response:', error);
    }
    
    } else if (response.statusCode === 202){
      console.log("Report not yet available, retry later");
    }
  });
});
