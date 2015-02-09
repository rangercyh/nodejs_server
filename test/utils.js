var should = require('should');
var utils = require('../module/utils');

describe('utils test', function() {

    it('encrypt', function() {
    	var str = "caiyiheng";
    	var secret = "123456";
    	var encode = utils.encrypt(str, secret);

    	var decode = utils.decrypt(encode, secret);
    	str.should.eql(decode);
    });

    it('decrypt', function() {

    });

    it('md5', function() {
    	var str = "caiyiheng";
    	var str2 = "caiyiheng1";
    	var str3 = "caiyiheng";
    	var md5 = utils.md5(str);
    	var md52 = utils.md5(str2);
    	var md53 = utils.md5(str3);

    	str.should.not.eql(md5);
    	md5.should.not.eql(md52);
    	md5.should.eql(md53);
    });

    it('encodeBuffer', function() {

    });

});
