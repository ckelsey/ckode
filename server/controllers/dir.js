const config = require("../config/config")
const fs = require("fs")
const path = require("path")
const utils = require("../utils")
const dirTree = require('directory-tree')

module.exports = function (res, headers, body, query, files) {
	var url = config.cwd

	if (query.path) {
		url = path.join(url, query.path)
	}
	
	return utils.resolve(res, {status:200, result: dirTree(url)})
}