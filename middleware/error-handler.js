/**
 * We don't need to check if err is an instance of CustomAPIError as the
 * variable customError is bound to the err (if it exists). Thus, all
 * errors will be returned, whether or not they are an instance of
 * CustomAPIError. this is good for duplicate checking validation or
 * any other errors that would be found on the server.
 */

//const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong. Please try again Later.'
	}

	// if (err instanceof CustomAPIError) {
	// 	return res.status(err.statusCode).json({ msg: err.message })
	// }

	if (err.name === 'ValidationError') {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(';')
		customError.statusCode = 400
	}

	if (err.code && err.code === 11000) {
		customError.msg = `Duplicate value entered. User with ${Object.keys(
			err.keyValue
		)} already exists.`
		customError.statusCode = 400
	}

	if (err.name === 'CastError') {
		customError.statusCode = 404
		customError.msg = `No item found with id : ${err.value}`
	}

	//return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
	return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
