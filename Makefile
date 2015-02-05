all: install test
.PHONY: all install test clean
install:
	-npm install -d;
	-chmod +x ./bin/tinygame;

test:
	-./node_modules/.bin/mocha --reporter list

clean:
	-for package in `ls node_modules`;\
	do\
		npm uninstall $$package;\
	done;
	-rm -rf node_modules;
