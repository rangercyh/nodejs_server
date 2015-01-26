var should = require('should');
var utils = require('../util/utils');

describe('utils test', function() {

    it('encrypt', function() {
    	var str = "caiyiheng";
    	var secret = "123456";
    	var encode = utils.encrypt(str, secret);

    	var decode = utils.decrypt(encode, secret);
    	encode.should.eql(decode);
    });

    it('decrypt', function() {

    });

    it('md5', function() {

    });

    it('encodeBuffer', function() {

    });

});
