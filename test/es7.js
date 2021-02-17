/* eslint-env mocha */
"use strict";

const mdeps = require("../lib/api");
require("should");

describe("ES7", () => {
	const dir = __dirname + "/es7";

	it("extracts dependencies", (done) => {
		mdeps(dir + "/async.js")
			.then((res) => {
				res.obj().should.eql({
					"other.js": [],
					"async.js": ["other.js"],
				});
				done();
			})
			.catch(done);
	});
});
