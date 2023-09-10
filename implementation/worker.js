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
      
      let responseBody;

      try {
        responseBody = JSON.parse(body);
        if (responseBody != null) {
          console.log('Response id:', responseBody.id);
          console.log('Response Plumber:', responseBody.plumber);
          console.log('Response quot:', responseBody.quotationPrice);
          processVariables.set(responseBody.plumber + "_quotation", responseBody.quotationPrice);
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
  const list_quot = [];


  list_p.forEach(p => {
    const quot = task.variables.get(p + "_quotation")

    list_quot.push(quot);

    console.log(p + quot);
  });

  const processVariables = new Variables();
  const localVariables = new Variables();

  const minValue = 0;
  const winner = '';
  const results_plumbers = [];
  

  for (let i = 1; i < list_quot.length; i++) {
    results_plumbers.push([[list_p[i]], 'loser']);
    if (list_quot[i] < minValue) {
      minValue = list_quot[i];
      results_plumbers[i][2] = 'winner';
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
