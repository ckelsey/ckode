const config = require("../config/config")
const fs = require("fs")
const path = require("path")
const utils = require("../utils")

module.exports = function (res, headers, body, query, files) {
	var url = config.cwd

	if (query.path) {
		url = path.join(url, query.path)
	}

	fs.stat(url, function (err, stat) {
		if (err) {
			return utils.resolve(res, { status: 500, result: err })
		}

		fs.readFile(url, "utf8", function (err, result) {
			if (err) {
				return utils.resolve(res, { status: 500, result: err })
			}

			return utils.resolve(res, { status: 200, result })
		})
	})
}