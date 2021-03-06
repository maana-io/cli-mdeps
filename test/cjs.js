/* eslint-env mocha */
"use strict";

const mdeps = require("../lib/api");
require("should");

describe("CommonJS", () => {
	const dir = __dirname + "/cjs";

	it("finds recursive dependencies", (done) => {
		mdeps(dir + "/normal/a.js")
			.then((res) => {
				res.obj().should.eql({
					"a.js": ["sub/b.js"],
					"d.js": [],
					"sub/b.js": ["sub/c.js"],
					"sub/c.js": ["d.js"],
				});
				done();
			})
			.catch(done);
	});

	it("handles path outside directory", (done) => {
		mdeps(dir + "/normal/sub/c.js")
			.then((res) => {
				res.obj().should.eql({
					"../d.js": [],
					"c.js": ["../d.js"],
				});
				done();
			})
			.catch(done);
	});

	it("finds circular dependencies", (done) => {
		mdeps(dir + "/circular/a.js")
			.then((res) => {
				res.circular().should.eql([["a.js", "d.js"]]);
				done();
			})
			.catch(done);
	});

	it("handle extensions when finding circular dependencies", (done) => {
		mdeps(dir + "/circular/foo.js")
			.then((res) => {
				res.circular().should.eql([]);
				done();
			})
			.catch(done);
	});

	it("excludes core modules by default", (done) => {
		mdeps(dir + "/core.js")
			.then((res) => {
				res.obj().should.eql({
					"core.js": [],
				});
				done();
			})
			.catch(done);
	});

	it("excludes NPM modules by default", (done) => {
		mdeps(dir + "/npm.js")
			.then((res) => {
				res.obj().should.eql({
					"normal/d.js": [],
					"npm.js": ["normal/d.js"],
				});
				done();
			})
			.catch(done);
	});

	it("can include shallow NPM modules", (done) => {
		mdeps(dir + "/npm.js", {
			includeNpm: true,
		})
			.then((res) => {
				res.obj().should.eql({
					"normal/d.js": [],
					"npm.js": ["node_modules/a.js", "normal/d.js"],
				});
				done();
			})
			.catch(done);
	});
});
