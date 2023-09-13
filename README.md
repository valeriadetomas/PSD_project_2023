# Process and Service Design Project

## House Renovation Company
This project consists of designing and implementing the main process of a House Renovation Company (HRC) that relies on several services:

• Plumbers

• Electricians

• Constructors

A client, also called householder, asks the company for a renovation, and the HRC contacts the services according to what the householder needs to be done. Once it has chosen the best ones, the work can start.

### Members
* Alessandra de Stefano, 10606454
* Valeria Detomas, 10615309
* Mauro Famà, 10631287

## Communication Scheme
In order to show different approaches of communication between the HRC and the external companies, we implemented a different schema for each service. We focused on creating a mix of synchronous and asynchronous patterns, showing how the REST APIs of the external services are used in different ways, depending on the implemented communication scheme.

### Quotation Request
Multiple instances of subprocesses are activated to manage the different external companies when asking for a quotation. 

#### Plumbers
The HRC requests a quotation from all plumbers, each different request has a synchronous behavior, waiting for a response before going to the next step of the process with the same external company. However, the communication of the winner is managed asynchronously, and the message is sent only to the winner.

#### Constructors
The entire subprocess is managed synchronously, the two steps of communication wait for a response before proceeding. Again, a message will sent only to the winning company, receiving as a response the estimated end of works.

#### Electricians
The communication is managed asynchronously: after sending the request for quotation, the HRC will retrieve the quotation from the external service by getting it from its API, without receiving a response to go on with the process. After analyzing the retrieved quotations, both the selected company and the discarded ones will receive a result message from the HRC.

### Work Reporting
...
#### Plumbers
...
#### Constructors
...
#### Electricians
...

##### Choreographed process
![Choreography Diagram](https://github.com/valeriadetomas/PSD_project_2023/blob/main/processes/Choreography%20.png)

##### Collaboration Diagram
![Collaboration Diagram](https://github.com/valeriadetomas/PSD_project_2023/blob/main/processes/collaboration%20diagram.png)

## Implementation
...

#### Executable process
![Executable Model](https://github.com/valeriadetomas/PSD_project_2023/blob/main/processes/executable.png)

#### Petri Net
It has been verified that the process is sound using WoPed. There are no deadlocks, livelocks or any other issues that could affect the soundness property.
![Petri Net](https://github.com/valeriadetomas/PSD_project_2023/blob/main/processes/petri_net.jpg)
