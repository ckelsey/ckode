const config = require("../config/config")
const fs = require("fs")
const path = require("path")
const utils = require("../utils")

module.exports = function (res, headers, body, query, files) {
	var url = config.cwd
	var newPath = url

	if (body.path) {
		url = path.join(url, body.oldPath)
		newPath = path.join(newPath, body.path)
	}

	fs.stat(url, function (err, stat) {
		if (err) {
			if (err.code === "ENOENT") {
				if (body.ext) {
					fs.writeFile(newPath, "", function (err) {
						if (err) {
							return utils.resolve(res, { status: 500, result: err })
						}

						return utils.resolve(res, { status: 200, result: {} })
					})
				} else {
					fs.mkdir(newPath, function (err) {
						if (err) {
							return utils.resolve(res, { status: 500, result: err })
						}

						return utils.resolve(res, { status: 200, result: {} })
					})
				}
			} else {
				return utils.resolve(res, { status: 500, result: err })
			}
		} else {
			fs.rename(url, newPath, function (err) {
				if (err) {
					return utils.resolve(res, { status: 500, result: err })
				}

				return utils.resolve(res, { status: 200, result: {} })
			})
		}
	})
}