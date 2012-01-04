Asynchronous Morale client API for node.js
===========================================

[morale-node](http://github.com/jayharris/morale-node) is an asynchronous API wrapper for [Morale](http://www.teammorale.com).

# Installation

# Usage

## Configuring the API 

Your API key can be obtained from your profile in [Morale](http://www.teammorale.com).

        var morale = require('morale-node');

        var m = new morale({
          subdomain: 'api-test',
          api_key: 'XfADs6yw0qshq2Svaf'
        });


## Project API 

        morale.getProjects(function (projectData) {
	      console.log(projectData);
        })

## Ticket API 

# Contributors

- [Jay Harris](http://github.com/JayHarris) (primary author)

Released under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
