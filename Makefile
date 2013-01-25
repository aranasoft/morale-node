test:
	@./node_modules/.bin/mocha \
		--reporter list

watch:
	@./node_modules/.bin/mocha \
		--reporter min \
		--growl \
		--watch

lint:
	@jslint --indent 2 --sloppy --color --var \
		./lib/morale.js

hint:
	@jshint --config jshint-config.json \
		./lib/morale.js
	@jshint --config jshint-config.json \
		./test/*.js

.PHONY: test watch lint hint