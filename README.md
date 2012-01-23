# Asynchronous Morale client API for node.js

[morale-node](http://github.com/aranasoft/morale-node) is an asynchronous API wrapper for [Morale](http://www.teammorale.com).

## Installation

Morale-node is available through npm.

    npm install morale

## Usage

### Configuring the API 

Your API key can be obtained from your profile in [Morale](http://www.teammorale.com).

    var morale = require('morale-node');
    var m = new morale("subdomain", "api_key");

The ``new`` keyword is not required, in case you forget it.

    var m = morale("subdomain", "api_key");

### Callbacks

All callbacks within [morale-node](http://github.com/aranasoft/morale-node) accept two arguments: ``result`` and ``error``.

    function moraleCallback(res, err) {
	  console.log(res);
    }

The ``error`` object is always an object containing two properties: ``statusCode`` and ``message``.

    {
	  statusCode: 404, //HTTP Error Code from the Morale request.
	  message: "Ticket not found", //Error Code provided by Morale.
    }

**Notes:**

* If a Morale request was successful (HTTP200 or HTTP201), no error object will be provided.
* If no error message was provided by Morale, the default message for that HTTP status code will be used.

### Project API 

#### Project Objects

*For addProject and UpdateProject:*  
These methods accept a Project JSON object with the following properties:  

``id``: Identity for the project to update. Used only in ``updateProject``.  
``name``: Name to give the project. Required for ``addProject`` and ``updateProject``.

    {
      id: 5,
      name: "Build morale-node module",
    }

#### Project Methods

**getProjects** returns all projects associated with your Morale subdomain.  
Output: ``projectDataArray`` - an array of project objects. Each array item will contain
an object with a single ``project`` property, containing the project JSON.

    m.getProjects(function (projectDataArray, err) {
	  console.log(projectDataArray);
    });

**getProjects** returns information for the specified project.  
Input: ``projectId`` - the project to retrieve from Morale.  
Output: ``projectData`` - a single project JSON object.

    m.getProject(projectId, function (projectData, err) {
      console.log(projectData);
    });

**addProject** creates a new project within Morale.  
Input: ``projectJson`` - project data to add to Morale.  
Output: ``projectData`` - a single project JSON object; the new project.

    var projectJson = {name: "My New Project"};
    m.addProject(projectJson, function (projectData, err) {
      console.log(projectData);
    });

**updateProject** modifies a project within Morale. Currently, only the project's name can be updated.  
Input: ``projectJson`` - project data to update with Morale.  
Output: ``projectData`` - a single project JSON object; the updated project.

    var projectJson = {id: 5, name: "Updated Project Name"};
    m.updateProject(projectJson, function (projectData, err) {
      console.log(projectData);
    });

**deleteProject** will delete a project from Morale, including all tickets within the project.  
Input: ``projectId`` - the project to delete from Morale.  
Output: ``projectData`` - a single project JSON object; the project, prior to its deletion.

    m.deleteProject(projectId, function (projectData, err) {
      console.log(projectData);
    });


### Ticket API 

#### Ticket Objects

*For addTicket and updateTicket:*  
These methods accept a Ticket JSON object with the following properties:  

``identifier``: The Morale UI Identifier for the ticket to update. Used only in ``updateTicket``.  
``title``: Title to give the project. Required for ``addTicket``.  
``type``: Ticket type; can be 'Task' or 'Bug'.  
``description``: The ticket's subtext / description.  
``due_date``: The date that the ticket is due for completion. Must be a string formatted as a
specific date ('2/28/2012', 'June 5') or a relative date ('today', 'tomorrow', 'monday', 'next month').  
``assigned_to``: Person that the ticket is assigned to. Must be a string matching the first name,
last name, or email address of a user associated with your project.  
``priority``: Numerical value of the priority of the ticket.


    {
      identifier: 5,
      title: "Paint Fence",
      description: "Put two coats of white paint on the fence",
      assign_to: "Tom",
      due_date: "tomorrow",
      priority: 2,
    }


#### Ticket Methods

***Note:*** Ticket API calls are driven by the Ticket's *identifier*. This is not to be confused
with the Ticket's *id*, which is also present in the Ticket JSON Object.
The *identifier* is the same number visible within the Morale web site.

**getTickets** returns all tickets associated with a specific project within your Morale subdomain.  
Input: ``projectId`` - the project to retrieve tickets for from Morale.  
Output: ``ticketDataArray`` - an array of ticket JSON objects. Each array item will contain an object with a
single *task* or *bug* property, depending on the ticket type, containing the ticket JSON.

    m.getTickets(projectId, function (ticketDataArray, err) {
      console.log(ticketDataArray);
    });

**getTicket** returns information on a specific ticket.  
Input: ``projectId`` - the project that contains the ticket.  
Input: ``ticketIdentifier`` - the ticket to retrieve from Morale.  
Output: ``ticketData`` - a single ticket JSON object; the retrieved ticket.

    m.getTicket(projectId, ticketIdentifier, function (ticketData, err) {
      console.log(ticketData);
    });

**archiveTicket** will archive any ticket with your Morale subdomain.  
Input: ``projectId`` - the project that contains the ticket.  
Input: ``ticketIdentifier`` - the ticket to archive within Morale.  
Output: ``ticketData`` - a single ticket JSON object; the archived ticket.

    m.archiveTicket(projectId, ticketIdentifier, function (ticketData, err) {
      console.log(ticketData);
    });

**deleteTicket** will delete any ticket with your Morale subdomain.  
Input: ``projectId`` - the project that contains the ticket.  
Input: ``ticketIdentifier`` - the ticket to delete from Morale.  
Output: ``ticketData`` - a single ticket JSON object; the archived ticket.

    m.deleteTicket(projectId, ticketIdentifier, function (ticketData, err) {
      console.log(ticketData);
    });

**addTicket** creates a new ticket within Morale.  
Input: ``ticket`` - ticket JSON object containing new ticket information.  
Output: ``ticketData`` - a single ticket JSON object; the new ticket.

    m.addTicket(ticket, function (ticketData, err) {
      console.log(ticketData);
    });

**updateTicket** modifies an existing ticket within Morale.  
Input: ``ticket`` - ticket JSON object containing updated ticket information.  
Output: ``ticketData`` - a single ticket JSON object; the updated ticket.

    m.addTicket(ticket, function (ticketData, err) {
      console.log(ticketData);
    });

## Contributors

- [Jay Harris](http://github.com/JayHarris) (primary author)



## License

Released under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
