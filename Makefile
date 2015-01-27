.PHONY: test install
install:
	npm install -d

test:
	./node_modules/.bin/mocha --reporter list
