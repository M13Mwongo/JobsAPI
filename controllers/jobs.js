require('dotenv').config()
const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

//creates a new job
const createJob = async (req, res) => {
	req.body.createdBy = req.user.userId
	const job = await Job.create(req.body)

	res.status(StatusCodes.CREATED).json({ job })
}
//fetches all the jobs posted
const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
	res.status(StatusCodes.OK).json({ count: jobs.length, jobs })
}

//gets an individual job
const getJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId }
	} = req

	const job = await Job.findOne({ _id: jobId, createdBy: userId })

	if (!job) {
		throw new NotFoundError('ERROR! That job does not exist')
	}
	res.status(StatusCodes.ACCEPTED).json({ job })
}

//updates the job details
const updateJob = async (req, res) => {
	const {
		user: { userId },
		body: { company, position },
		params: { id: jobId }
	} = req

	if (company === ' ' || position === ' ') {
		throw new BadRequestError('Company/ Position is empty')
	}

	const job = await Job.findByIdAndUpdate(
		{ _id: jobId, createdBy: userId },
		req.body,
		{ new: true, runValidators: true }
	)

	if (!job) {
		throw new NotFoundError(`No job with the id ${jobId}`)
	}
	res.status(StatusCodes.ACCEPTED).json({ job })
}

//deletes the job from the record
const deleteJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId }
	} = req

	const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId })

	if (!job) {
		throw new NotFoundError(`No job with the id ${jobId}`)
	}
	res.status(StatusCodes.ACCEPTED).send('Successful')
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }
