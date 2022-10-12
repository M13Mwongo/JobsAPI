const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema(
	{
		company: {
			type: String,
			required: [true, 'Please provide your company name'],
			maxLength: 50
		},
		position: {
			type: String,
			required: [true, 'Please provide the position'],
			maxLength: 50
		},
		status: {
			type: String,
			enum: ['Interview', 'Declined', 'Pending']
		},
		//shows who created the job
		createdBy: {
			//ties the job to the mongoose object
			type: mongoose.Types.ObjectId,
			//references which schema we are relating this one to
			ref: 'User',
			required: [true, 'Please provide a user who created the job']
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Job', JobSchema)
