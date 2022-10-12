const express = require('express')
const router = express.Router()
const {
	register,
	login,
	logout,
	getAllUsers,
	deleteAllUsers
} = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.route('/users').get(getAllUsers).delete(deleteAllUsers)

module.exports = router
