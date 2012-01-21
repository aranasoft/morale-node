# Asynchronous Morale client API for node.js

[morale-node](http://github.com/aranasoft/morale-node) is an asynchronous API wrapper for [Morale](http://www.teammorale.com).

## Installation

Morale-node is not yet available through NPM. It will be; and when it is, we will update the documentation.

For now, download it to *~/node_modules/morale_node* within your project.

## Usage

### Configuring the API 

Your API key can be obtained from your profile in [Morale](http://www.teammorale.com).

    var morale = require('morale-node');
    var m = new morale("subdomain", "api_key");

The *new* keyword is not required, in case you forget it.

    var m = morale("subdomain", "api_key");

### Project API 

**getProjects** will return all projects associated with your Morale subdomain.
Output: *projectDataArray* - an array of project objects. Each array item will contain an object with a single *project* property, containing the project JSON.

    m.getProjects(function (projectDataArray, err) {
	  console.log(projectDataArray);
    });

**getProjects** accepts a single *projectId* and will return information for that specific project.
Input: *projectId* - project to retrieve from Morale.
Output: *projectData* - a single project JSON object.

    m.getProject(projectId, function (projectData, err) {
      console.log(projectData);
    });

**addProjects** creates a new project within Morale.
Input: *projectJson* - Project data to add to Morale.
- 'name' property is the new name to give the new project. Required.
- Any other properties are ignored.
Output: *projectData* - a single project JSON object: the new project.

    var projectJson = {name: "My New Project"};
    m.addProject(projectJson, function (projectData, err) {
      console.log(projectData);
    });

**updateProject** will modify a project within Morale. Currently, only the project's name can be updated.
Input: *projectJson* - Project data to update with Morale.
- 'name' property is the new name to give the project. Required.
- 'id' property is the Project to update. Required.
- Any other properties are ignored.
Output: *projectData* - a single project JSON object: the updated project.

    var projectJson = {id: 5, name: "Updated Project Name"};
    m.updateProject(projectJson, function (projectData, err) {
      console.log(projectData);
    });

**deleteProject** will delete a project from Morale, including all tickets within the project.
Input: *projectId* - project  to delete from Morale.
Output: *projectData* - a single project JSON object. The project, prior to its deletion.

    m.deleteProject(projectId, function (projectData, err) {
      console.log(projectData);
    });


### Ticket API 

> **Note:** Ticket API calls are driven by the Ticket's *identifier*. This is not to be confused with the Ticket's *id*, which is also present in the Ticket JSON Object.
> The *identifier* is the same number visible within the Morale web site.

**getTickets** will return all tickets associated with a specific project within your Morale subdomain.
Input: *projectId* - project to retrieve tickets for from Morale.
Output: *ticketDataArray* - an array of ticket objects. Each array item will contain an object with a single *task* or *bug* property, depending on the ticket type, containing the ticket JSON.

    m.getTickets(projectId, function (ticketDataArray, err) {
      console.log(ticketDataArray);
    });

**getTicket** returns information on a specific ticket.
Input: *projectId* - project that contains the ticket.
Input: *ticketIdentifier* - ticket to retrieve from Morale.
Output: *projectData* - a single ticket JSON object.

    m.getTicket(projectId, ticketIdentifier, function (ticketData, err) {
      console.log(ticketData);
    });

**archiveTicket** will archive any ticket with your Morale subdomain.
Input: *projectId* - project that contains the ticket.
Input: *ticketIdentifier* - ticket to archive within Morale.
Output: *ticketData* - a single ticket JSON object; the archived ticket.

    m.archiveTicket(projectId, ticketIdentifier, function (ticketData, err) {
      console.log(ticketData);
    });

**deleteTicket** will delete any ticket with your Morale subdomain.
Input: *projectId* - project that contains the ticket.
Input: *ticketIdentifier* - ticket to delete from Morale.
Output: *ticketData* - a single ticket JSON object; the archived ticket.

    m.deleteTicket(projectId, ticketIdentifier, function (ticketData, err) {
      console.log(ticketData);
    });

## Contributors

- [Jay Harris](http://github.com/JayHarris) (primary author)

Released under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
