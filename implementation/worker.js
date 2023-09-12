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
/*
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
      console.log('Request for quotation sent successfully');
      
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
        console.log('END OF WORK');
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
