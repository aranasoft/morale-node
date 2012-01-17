Asynchronous Morale client API for node.js
===========================================

[morale-node](http://github.com/aranasoft/morale-node) is an asynchronous API wrapper for [Morale](http://www.teammorale.com).

# Installation

# Usage

## Configuring the API 

Your API key can be obtained from your profile in [Morale](http://www.teammorale.com).

        var morale = require('morale-node');
        var m = new morale("subdomain", "api_key");


## Project API 

        m.getProjects(function (projectData, err) {
	      console.log(projectData);
        });


        m.getProject(projectId, function (projectData, err) {
	      console.log(projectData);
        });


        m.addProject({name: "My New Project"}, function (projectData, err) {
	      console.log(projectData);
        });


        m.updateProject({id: projectId, name: "Updated Project Name"}, function (projectData, err) {
	      console.log(projectData);
        });


        m.deleteProject(projectId, function (projectData, err) {
	      console.log(projectData);
        });


## Ticket API 

        m.getTickets(projectId, function (ticketData, err) {
          console.log(ticketData);
        });


        m.getTicket(projectId, ticketId, function (ticketData, err) {
          console.log(ticketData);
        });


# Contributors

- [Jay Harris](http://github.com/JayHarris) (primary author)

Released under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
