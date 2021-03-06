/* eslint-env mocha */
"use strict";

const mdeps = require("../lib/api");
require("should");

describe("Flow", () => {
	const dir = __dirname + "/flow";

	it("extracts ES module ependencies", (done) => {
		mdeps(dir + "/es/calc.js")
			.then((res) => {
				res.obj().should.eql({
					"math.js": [],
					"calc.js": ["math.js"],
				});
				done();
			})
			.catch(done);
	});

	it("extracts CommonsJS module dependencies", (done) => {
		mdeps(dir + "/cjs/calc.js")
			.then((res) => {
				res.obj().should.eql({
					"geometry.js": [],
					"calc.js": ["geometry.js"],
				});
				done();
			})
			.catch(done);
	});

	it("extracts CommonsJS module dependencies with mixed import syntax", (done) => {
		mdeps(dir + "/cjs/calc.js", {
			detectiveOptions: { es6: { mixedImports: true } },
		})
			.then((res) => {
				res.obj().should.eql({
					"geometry.js": [],
					"math.js": [],
					"calc.js": ["geometry.js", "math.js"],
				});
				done();
			})
			.catch(done);
	});
});
