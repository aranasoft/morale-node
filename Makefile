test:
	@./node_modules/.bin/mocha \
		--reporter list

watch:
	@./node_modules/.bin/mocha \
		--reporter min \
		--growl \
		--watch

lint:
	@jshint --config jshint-config.json \
		./lib/morale.js
	@jshint --config jshint-config.json \
		./test/*.js

.PHONY: test watch lint