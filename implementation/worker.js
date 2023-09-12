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
        const prova = JSON.parse(body);
        const prova2 = JSON.parse(prova);
        if (prova2 != null) {
          processVariables.set(prova2.plumber + "_quotation", prova2.quotationPrice);
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

  const list_p = task.variables.get("list_plumbers");
  let list_quot = [];

  list_p.forEach((element) => {
    console.log(element)
    });


  list_p.forEach(p => {
    let quot = task.variables.get(p + "_quotation")

    list_quot.push(quot);

    console.log(p + ' ' + quot);
  });

  const processVariables = new Variables();
  const localVariables = new Variables();

  let minValue = 0;
  let results_plumbers = [];
  

  for (let i = 0; i < list_quot.length; i++) {
    results_plumbers.push([[list_p[i]], 'loser']);
    if (list_quot[i] < minValue) {
      minValue = list_quot[i];
      results_plumbers[i][1] = 'winner';
    }
  }

  processVariables.set("results_plumbers", results_plumbers);
  taskService.complete(task, processVariables, localVariables);

});

client.subscribe('send_res_plumbers', async function({ task, taskService }) {
  
  const res_p = task.variables.get("res_p");
  console.log('Sending result to ' + res_p);
 
  // Define the request body
  const requestBody = {
    name_plumber: res_p[1],
    id: 1,
    outcome: res_p[2],
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
      console.log('Result sent successfully');

      if (res_p[2] == 'winner'){
        localVariables.set("accepted", true)
      }
      else localVariables.set("accepted", false)

      // Complete the Camunda task
      taskService.complete(task, processVariables, localVariables);
    } else {
      console.error('Error sending request for quotation:', error);
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
      console.log('Quotation retrieval successful');

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
      console.error('Error sending request for quotation:', error);
      console.error('Response:', body);
    }
  });
});

// select the cheaper electrician as winner, all the rest are losers
client.subscribe('select_desired_worker', async function({ task, taskService }) {
  let list = ["e1", "e2", "e3"]
  let min = Infinity;
  let losers = []
  let winner
  let index

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

  console.log("winner", winner)
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

  console.log('Sending confirmation to ' + winner);

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
      console.log('Confirmation sent successfully');  

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
      console.error('Error sending request for quotation:', error);
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
        console.error('Error sending request for quotation:', error);
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
      console.log('Report request sent successfully');

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
      console.error('Error sending request for quotation:', error);
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
      console.log('Report retrieval successful');

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
  taskService.complete(task, processVariables, localVariables);

});