const config = require("../config/config")
const fs = require("fs")
const path = require("path")
const utils = require("../utils")

var rmdir = function (dir) {
	var stats = fs.statSync(dir)

	if (!stats.isDirectory()) {
		return fs.unlinkSync(dir)
	}

	var list = fs.readdirSync(dir);

	for (var i = 0; i < list.length; i++) {
		var filename = path.join(dir, list[i]);
		var stat = fs.statSync(filename);

		if (filename == "." || filename == "..") {
			// pass these files
		} else if (stat.isDirectory()) {
			// rmdir recursively
			rmdir(filename);
		} else {
			// rm fiilename
			fs.unlinkSync(filename);
		}
	}
	fs.rmdirSync(dir);
};

module.exports = function (res, headers, body, query, files) {
	var url = config.cwd

	if (body.path) {
		url = path.join(url, body.path)
	}

	fs.stat(url, function (err, stat) {
		if (err) {
			return utils.resolve(res, { status: 500, result: err })
		}

		if (body.ext) {
			fs.unlink(url, function (err, stat) {
				if (err) {
					return utils.resolve(res, { status: 500, result: err })
				}

				return utils.resolve(res, { status: 200, result: {} })
			})
		} else {
			rmdir(url)

			return utils.resolve(res, { status: 200, result: {} })
		}
	})
}