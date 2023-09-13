# Process and Service Design Project

## House Renovation Company
This project consists of designing and implementing the main process of a House Renovation Company (HRC) that relies on several services:

* Plumbers
* Electricians
* Constructors

A client, also called householder, asks the company for a renovation, and the HRC contacts the services according to what the householder needs to be done. Once it has chosen the best ones, the work can start.

### Members
* Alessandra de Stefano, 10606454
* Valeria Detomas, 10615309
* Mauro Famà, 10631287

## Communication Scheme
In order to show different approaches to communication between the HRC and the external companies, we implemented a different schema for each service. We focused on creating a mix of synchronous and asynchronous patterns, showing how the REST APIs of the external services are used in different ways, depending on the implemented communication scheme.

### Quotation Request
Multiple instances of subprocesses are activated to manage the different external companies when asking for a quotation. 

#### Plumbers
The HRC requests a quotation from all plumbers, each different request has a synchronous behavior, waiting for a response before going to the next step of the process with the same external company. However, the communication of the winner is managed asynchronously, and the message is sent only to the winner.
#### Constructors
The entire subprocess is managed synchronously, the two steps of communication wait for a response before proceeding. Again, a message will sent only to the winning company, receiving as a response the estimated end of works.
#### Electricians
The communication is managed asynchronously: after sending the request for quotation, the HRC will retrieve the quotation from the external service by getting it from its API, without receiving a response to go on with the process. After analyzing the retrieved quotations, both the selected company and the discarded ones will receive a result message from the HRC.

### Work Reporting
Multiple instances are no longer required because we are now dealing only with the winning company.

#### Plumbers
The external service generates a report that is retrieved asynchronously from the HRC, if the work is still not finished, this procedure is repeated until the end of the work.
#### Constructors
The final report is available after the job is finished, and can be retrieved from the HRC to confirm the end of work.
#### Electricians
The HRC requests the external service to emit a report of the current status, it is retrieved when ready to confirm that the work is done.

### Choreographed process
![Choreography Diagram](https://github.com/valeriadetomas/PSD_project_2023/blob/main/processes/Choreography%20.png)

### Collaboration Diagram
![Collaboration Diagram](https://github.com/valeriadetomas/PSD_project_2023/blob/main/processes/collaboration%20diagram.png)

## Implementation
The **synchronous** message exchange is implemented with a *POST* to perform the sending of the message, the response of the *POST* request is the inbound message. \
The **asynchronous** message exchange happens firstly with a *POST*, in which the response body contains the ID of the message exchange, and then a *GET* request on the ID is performed to retrieve the response message. \
We used the **parallel multi-instance** subprocess to handle different companies of the same external service during the request for quotation phase. \
Several **service tasks** are used to manage the flow of information, especially to make choices based on the evaluation of the best offer. **User tasks** are also used in the first phase of the process in order to have a custom setup of the execution.

### Executable process
![Executable Model](https://github.com/valeriadetomas/PSD_project_2023/blob/main/processes/executable.png)

#### Petri Net
It has been verified that the process is sound using WoPed. There are no deadlocks, livelocks or any other issues that could affect the soundness property.
![Petri Net](https://github.com/valeriadetomas/PSD_project_2023/blob/main/processes/petri_net.jpg)
