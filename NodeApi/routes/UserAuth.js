const express = require('express')
const { SignUpValidation } = require('../middleware/userValidation')
const router = express.Router()

//get from controllers
const { signUp, signin, signOut } = require('../controllers/UserAuth')
const { userById } = require('../controllers/user')

router.post('/SignUp', SignUpValidation, signUp)
router.post('/signin', signin)
router.get('/signOut', signOut)

//any route containing /:userId ,it will execute userById()
router.param('userId', userById)

module.exports = router
