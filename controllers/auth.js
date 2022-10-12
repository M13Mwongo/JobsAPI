require('dotenv').config()
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
	const user = await User.create({ ...req.body })
	const token = user.createJWT()
	res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		throw new BadRequestError('Please provide both email & password.')
	}
	const user = await User.findOne({ email })

	if (!user) {
		throw new UnauthenticatedError('User does not exist')
	}

	const checkPassword = await user.comparePassword(password)

	if (!checkPassword) {
		throw new UnauthenticatedError('Incorrect Password')
	}

	const token = user.createJWT()
	res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

const logout = async (req, res) => {
	res.status(StatusCodes.ACCEPTED).json({ msg: 'Successfully logged out' })
}

const getAllUsers = async (req, res) => {
	const users = await User.find()
	res.status(StatusCodes.OK).json({ nhHits: users.length, users: users })
}

const deleteAllUsers = async (req, res) => {
	await User.deleteMany()
	res.status(StatusCodes.OK).json({ msg: 'Deleted All Users' })
}

module.exports = { register, login, logout, getAllUsers, deleteAllUsers }
