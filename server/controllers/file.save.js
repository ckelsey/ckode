const config = require("../config/config")
const fs = require("fs")
const path = require("path")
const mkdirp = require("mkdirp")
const getDirName = path.dirname
const utils = require("../utils")

module.exports = function (res, headers, body, query, files) {
	var url = config.cwd

	if (body.path) {
		url = path.join(url, body.path)
	}
	
	console.log(url, body.content)
	
	mkdirp(getDirName(url), function (err) {
		if (err) return cb(err);
		
		fs.writeFile(url, body.content, function (err) {
			if (err) {
				return utils.resolve(res, { status: 500, result: err })
			}

			return utils.resolve(res, { status: 200, result: {} })
		})
	})
}