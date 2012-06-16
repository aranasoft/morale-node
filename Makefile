test:
	@./node_modules/.bin/mocha \
		--reporter list

watch:
	@./node_modules/.bin/mocha \
		--reporter min \
		--growl \
		--watch

.PHONY: test watch