const express = require('express')
const router = express.Router()

const { userById, getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/user')
const { requiredSignin } = require('../controllers/UserAuth')

router.get('/getAllUsers', getAllUsers)
router.get('/user/:userId', requiredSignin, getUser)
router.put('/user/:userId', requiredSignin, updateUser)
router.delete('/user/:userId', requiredSignin, deleteUser)

//any route containing /:userId ,it will execute userById()
router.param('userId', userById)

module.exports = router
